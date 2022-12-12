import {Component, OnInit} from '@angular/core';
import {StopWatchService} from "../services/stop-watch.service";
import {AlertController, ViewDidLeave} from "@ionic/angular";
import {catchError, map, Observable, of, skip, Subject, switchMap, take, takeUntil, tap, throttleTime} from "rxjs";
import {GeolocationHttpService} from "./services/geolocation-http.service";
import {GeolocationService} from "./services/geolocation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ItineraryHttpService} from "../itinerary/services/itinerary.http.service";
import {GeolocationType} from "./model/geolocation.model";

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
  providers: [StopWatchService]
})
export class GeolocationPage implements OnInit, ViewDidLeave {

  stopWatch$: Observable<{ value?: number, count?: boolean }> = of({value: 0, count: false});
  itineraryId = '';
  itineraryEnded$ = new Subject();
  geolocationCache: GeolocationType[] = [];

  constructor(private stopWatchService: StopWatchService,
              private geolocationHttpService: GeolocationHttpService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private alertController: AlertController,
              private itineraryHttpService: ItineraryHttpService,
              private geolocationService: GeolocationService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      take(1),
      tap(({id}) => this.itineraryId = id)
    ).subscribe();
    this.stopWatch$ = this.stopWatchService.stopwatch$;
    this.stopWatch$.pipe(
      skip(1),
      throttleTime(10000),
      switchMap(_ => this.geolocationService.getCurrentPosition()),
      map(geolocation => ({...geolocation, itineraryId: this.itineraryId})),
      switchMap(geolocation => this.geolocationHttpService.save(geolocation).pipe(
        catchError(this.handleSaveError(geolocation)
       )
      )),
      takeUntil(this.itineraryEnded$)
    ).subscribe();
  }

  onStart() {
    this.stopWatchService.start();
  }

  onStop() {
    this.stopWatchService.stop();
  }

  async onEnd() {
    const alert = await this.alertController.create({
      header: 'End Itinerary',
      message: 'Are you sure you want to end this itinerary?',
      buttons: ['Cancel', {text: 'confirm', role: 'ok'}],
    });
    await alert.present();
    const {role} = await alert.onDidDismiss();
    if (role === 'ok') {
      this.itineraryHttpService.endItinerary(this.itineraryId).pipe(
        tap(_ => this.itineraryEnded$.next('')),
      ).subscribe(_ => this.router.navigate(['itinerary']));
    }
  }

  ionViewDidLeave(): void {
    console.log('Left view');
  }

  private handleSaveError(geolocation: GeolocationType) {
    return err => {
      console.error(err)
      this.geolocationCache.push(geolocation);
      return of(geolocation);
    };
  }

}
