import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {concatMap, defaultIfEmpty, filter, map, Observable, take, tap} from "rxjs";
import {AuthenticationService} from "../services/authentication.service";
import {Session} from "../services/model/Session.model";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authenticationService.session.pipe(
      take(1),
      filter(session => !!session),
      map(session => this.attachToken(session, req)),
      defaultIfEmpty(req),
      concatMap(req => next.handle(req))
    );
  }

  private attachToken(session: Session, request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({setHeaders: { Authorization: `Bearer ${session.token}`}});
  }

}
