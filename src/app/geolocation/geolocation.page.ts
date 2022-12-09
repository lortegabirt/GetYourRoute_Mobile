import { Component, OnInit } from '@angular/core';
import {StopWatchService} from "../services/stop-watch.service";
import {ViewDidLeave} from "@ionic/angular";
import {map, Observable, of, skip, switchMap, take, tap, throttleTime} from "rxjs";
import {GeolocationHttpService} from "./services/geolocation-http.service";
import {GeolocationService} from "./services/geolocation.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
  providers: [StopWatchService]
})
export class GeolocationPage implements OnInit, ViewDidLeave {

  stopWatch$: Observable<{ value?: number, count?: boolean }> = of({value: 0, count: false});
  itineraryId = '';

  constructor(private stopWatchService: StopWatchService,
              private geolocationHttpService: GeolocationHttpService,
              private activatedRoute: ActivatedRoute,
              private geolocationService: GeolocationService) { }

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
      tap(geolocation => console.log(geolocation))
      // switchMap(geolocation => this.geolocationHttpService.save(geolocation))
    ).subscribe();
  }

  onStart() {
    this.stopWatchService.start();
  }

  onStop() {
    this.stopWatchService.stop();
  }

  onReset() {
    this.stopWatchService.reset();
  }

  ionViewDidLeave(): void {
  }

}
