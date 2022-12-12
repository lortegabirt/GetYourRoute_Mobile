import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {ItineraryHttpService} from "./services/itinerary.http.service";
import {filter, map, take, tap} from "rxjs";
import {Router} from "@angular/router";
import {IonModal} from "@ionic/angular";
import {OverlayEventDetail} from '@ionic/core/components'

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.page.html',
  styleUrls: ['./itinerary.page.scss'],
})
export class ItineraryPage implements OnInit {

  itineraryName = '';
  userId = '';
  @ViewChild(IonModal) modal: IonModal;

  constructor(private itineraryHttpService: ItineraryHttpService,
              private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnInit() {
    this.authenticationService.session.pipe(
      take(1),
      tap(session => !session && this.router.navigate([''])),
      filter(session => !!session),
      map(session => session.subjectId)
    ).subscribe(userId => this.userId = userId);
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.itineraryName.length) {
      this.modal.dismiss(this.itineraryName, 'confirm');
    }
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.itineraryHttpService.createItinerary({
        beginDate: new Date(),
        description: '',
        name: this.itineraryName,
        user: {
          id: this.userId
        },
        idUser: this.userId
      }).subscribe(itinerary => this.router.navigate(['geolocation', itinerary.id]))
    }
  }
}
