import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { ProfilPage } from '../profil/profil';
import { Routes } from '../../app/app.routes';

import { ProfilPage } from '../profil/profil'

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  profilPage;
  
  constructor(public navCtrl: NavController) {

    this.profilPage = ProfilPage;
  }

  //ionViewDidLoad() {
  //  console.log('Hello LoginPage Page');
  //}

  login(){
    this.navCtrl.push(Routes.getPage(Routes.PROFIL));
  }

}
