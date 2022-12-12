import {Injectable} from '@angular/core';
import {BehaviorSubject, concatMap, filter, map, Observable, tap} from "rxjs";
import {Jwt, Session} from "./model/Session.model";
import {AuthenticationHttpService} from "./authentication.http.service";
import {Router} from "@angular/router";
import jwtDecode from "jwt-decode";
import {User} from "../user/model/User.model";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly _session: BehaviorSubject<Session | null> =
    new BehaviorSubject<Session | null>(null);

  constructor(private authenticationHttp: AuthenticationHttpService,
              private storageService: StorageService,
              private router: Router) {
  }

  public login({email, password}: { email: string, password: string }): Observable<Session | null> {
    return this.authenticationHttp.login(email, password).pipe(
      tap(response => this.storageService.set('token', response.token)),
      map(response => ({...response, ...jwtDecode(response.token)}) as Jwt),
      map(jwt => new Session(jwt)),
      tap(session => this._session.next(session)),
      concatMap(_ => this._session.asObservable())
    );
  }

  public signup(user: User): Observable<void> {
    return this.authenticationHttp.signup(user);
  }

  public logout(): void {
    this._session.next(null);
    this.storageService.remove('token');
    this.router.navigate(['']);
  }

  public get session(): Observable<Session | null> {
    return this._session.asObservable();
  }

  public isAuthenticated(): Observable<boolean> {
    return this.session.pipe(
      map(session => session && !session.isExpired),
    );
  }

  public restoreSession() {
    this.storageService.get('token').subscribe(token => {
      const restoredSession = token && new Session({token, ...jwtDecode(token)});
      if (!!token && !restoredSession?.isExpired) {
        console.log('session restored');
        this._session.next(restoredSession);
        this.router.navigate(['itinerary']);
      } else {
        console.log('token expired');
        this.router.navigate(['']);
      }
    });
  }

}
