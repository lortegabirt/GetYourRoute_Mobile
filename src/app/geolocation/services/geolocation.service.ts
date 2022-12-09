import {Injectable} from '@angular/core';
import {Geolocation} from "@capacitor/geolocation";
import {from, map, Observable} from "rxjs";
import {GeolocationType} from "../model/geolocation.model";

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() {
    let currentPosition = Geolocation.getCurrentPosition();
    currentPosition.then(position => console.log(position));
  }

  public getCurrentPosition(): Observable<GeolocationType> {
    return from(Geolocation.getCurrentPosition()).pipe(
      map(position => (
        {
          location: {
            type: "Point",
            coordinates: [position.coords.latitude, position.coords.longitude]
          },
          timestamp: new Date(),
        } as GeolocationType))
    )
  }
}
