import {Injectable} from '@angular/core';
import {Geolocation} from "@capacitor/geolocation";
import {from, map, Observable} from "rxjs";
import {GeolocationType} from "../model/geolocation.model";
import {BackgroundGeolocationPlugin, Location} from "@capacitor-community/background-geolocation";
import {registerPlugin} from "@capacitor/core";
import {GeolocationHttpService} from "./geolocation-http.service";

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  watchers = [];

  constructor(private geolocationHttpService: GeolocationHttpService) {
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

  public startWatching(itineraryId: string) {
    BackgroundGeolocation.addWatcher({
        backgroundMessage: 'Tracking location',
        distanceFilter: 0,
        requestPermissions: true
      },
      (position, error) => {
        this.sendGeolocation(position, itineraryId);
        console.error(error);
        throw error;
      })
      .then(watcherId => this.watchers.push(watcherId))
      .then(_ => console.log('watcher added'));
  }

  public stopWatching() {
    this.watchers.forEach(id => BackgroundGeolocation.removeWatcher({id}));
  }

  private sendGeolocation(position: Location, itineraryId: string) {
    console.log('position', position.longitude);
    this.geolocationHttpService.save({
      itineraryId,
      timestamp: new Date(position.time),
      location: {
        type: "Point",
        coordinates: [position.latitude, position.longitude]
      }
    }).subscribe();
  }
}
