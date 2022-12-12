import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {AlertController, ViewDidLeave} from "@ionic/angular";
import {take} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewDidLeave {

  credentials = {
    email: '',
    password: '',
  }

  constructor(private authenticationService: AuthenticationService,
              private alertController: AlertController,
              private router: Router) { }

  ngOnInit() {
  }

  onLogin() {
    this.authenticationService.login(this.credentials).pipe(
      take(1)
    ).subscribe({
      next: session => this.router.navigate(['itinerary']),
      error: err => this.alertController.create({
        header: 'Error',
        message: err.message,
        buttons: ['OK'],
      }).then(alert => alert.present())
    });
  }

  ionViewDidLeave(): void {
  }

}
