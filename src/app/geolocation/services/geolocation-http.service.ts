import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {GeolocationType} from "../model/geolocation.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GeolocationHttpService {
  private readonly baseUrl = environment.backend.baseUrl;
  private readonly path = environment.backend.endpoints.geolocations;

  constructor(private http: HttpClient) { }

  public save(geolocation: GeolocationType): Observable<GeolocationType> {
    return this.http.post<GeolocationType>(`${this.baseUrl}${this.path}`, geolocation);
  }

}
