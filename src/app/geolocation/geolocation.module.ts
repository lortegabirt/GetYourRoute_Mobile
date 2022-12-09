import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {GeolocationPageRoutingModule} from './geolocation-routing.module';

import {GeolocationPage} from './geolocation.page';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeolocationPageRoutingModule,
    SharedModule
  ],
  declarations: [GeolocationPage]
})
export class GeolocationPageModule {
}
