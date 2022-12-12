import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Itinerary} from "../model/Itinerary.model";

@Injectable({
  providedIn: 'root'
})
export class ItineraryHttpService {

  private readonly baseUrl = environment.backend.baseUrl;
  private readonly path = environment.backend.endpoints.itineraries;

  constructor(private http: HttpClient) { }

  public createItinerary(itinerary: Itinerary): Observable<Itinerary> {
    return this.http.post<Itinerary>(`${this.baseUrl}${this.path}`, itinerary);
  }

  public endItinerary(itineraryId: string): Observable<Itinerary> {
    return this.http.put<Itinerary>(`${this.baseUrl}${this.path}stopitinerary/${itineraryId}`, {});
  }
}
