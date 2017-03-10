import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {Camera} from 'ionic-native';

import { Routes } from '../../app/app.routes';

import { Http} from '@angular/http';
import {LoginPage} from '../login/login';

import { FourreService } from '../../providers/fourre.service';
// import { IFourre } from '../../models/fourre';

import { NotificationsService } from 'angular2-notifications';

declare var localStorage: any;

@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html',

})
export class ProfilPage {

  // fourres: Array<IFourre> = new Array<IFourre>();  // @Patleod Inutile, on pioche directement dans le service

  base64Image:any;
  reportImages:Array<string> = [];

  sections: string = "Today";

  constructor(public navCtrl: NavController,
              private http: Http,
              private fourreService : FourreService
              // , private notifService: NotificationsService
              ) {

       // notifService.success("Test title", "test content");

  }


  ionViewWillEnter(){
      this.fourreService.refreshList();
  }

  takePicture(){
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 200,
      targetHeight: 200
    }
    ).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    // Handle error
    });
  }


  takeReportPicture(){
      Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 200,
        targetHeight: 200
      }
      ).then((imageData) => {
        this.reportImages.push('data:image/jpeg;base64,' + imageData);
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
          //this.base64Image = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
      // Handle error
      });
    }


  logout(){
    console.log("Routes.LOGIN = ", Routes.LOGIN)
    this.navCtrl.setRoot(LoginPage); //pr revenir en arrière, sinon .pop avec le route.login
  }

  // FOURRES MANAGEMENT

  createFourre(planeType){
    this.fourreService.createFourre(planeType, this.openFourre.bind(this));
  }

  deleteFourre(event, fourreId) {
    this.fourreService.deleteFourre(event, fourreId);
  }

  openFourre(fourre){
    this.navCtrl.push(Routes.getPage(Routes["FORM"]), fourre);
  }
}
