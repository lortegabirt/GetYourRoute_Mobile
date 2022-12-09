import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/User.model";

@Injectable({
  providedIn: 'root'
})
export class UserHttpService {

  private readonly baseUrl = environment.backend.baseUrl;
  private readonly path = environment.backend.endpoints.users;

  constructor(private http: HttpClient) { }

  public getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}${this.path}${id}`);
  }

  public getByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}${this.path}email/${email}`);
  }

  public updateUser(id: string, model: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}${this.path}${id}`, model);
  }
}
