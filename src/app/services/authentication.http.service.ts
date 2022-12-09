import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../user/model/User.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationHttpService {

  private baseUrl = `${environment.backend.baseUrl}`;

  constructor(private http: HttpClient) {
  }

  public login(email: string, password: string): Observable<{token: string}> {
    const path = `${environment.backend.endpoints.login}`;
    return this.http.post<{token: string}>(this.baseUrl + path, {email, password})
  }

  public signup(user: User): Observable<void> {
    const path = `${environment.backend.endpoints.signup}`;
    return this.http.post<void>(this.baseUrl + path, user)
  }
}
