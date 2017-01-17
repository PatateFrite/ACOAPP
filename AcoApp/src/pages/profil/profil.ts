import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Routes } from '../../app/app.routes';
import { Http} from '@angular/http';
//import {Auth} from '../../providers/auth';

import {Camera} from 'ionic-native';
import {LoginPage} from '../login/login';




/*
  Generated class for the Profil page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

declare var localStorage: any;

@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html',

})
export class ProfilPage {

  base64Image:any;
  reportImages:Array<string> = [];
  fourres : Array<Object> = [];
  fourre: Object = {
      type : localStorage.getItem("planeType")
  };
  type:any = localStorage.getItem("planeType");

  sections: string = "Today";

  constructor(public navCtrl: NavController, private http: Http) {
    console.log('Hello ProfilPage Page constructor');
  }


  ionViewWillEnter(){
      this.refreshList();
  }

  refreshList(){
    this.http
      .get("http://localhost:3000/fourres")
      .subscribe( res => {this.fourres = res.json();console.log(this.fourres)} )

  }

  /*form319(){
    this.navCtrl.push(Routes.getPage(Routes.FORM319));
  }

  form320(){
    this.navCtrl.push(Routes.getPage(Routes.FORM320));
  }*/

  form(type){  // type = 319 or 320
    localStorage.setItem("planeType", type)
    this.navCtrl.push(Routes.getPage(Routes["FORM"]));
  }

  monClick(event){
    console.log('monClick', event)
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

//TabCamera (){
    //tab = reports
//  }

logout(){
    console.log("Routes.LOGIN = ", Routes.LOGIN) // login
    this.navCtrl.setRoot(LoginPage); //pr revenir en arrière, sinon .pop avec le route.login
  }

  openFourre(fourre){
      this.navCtrl.push(Routes.getPage(Routes["FORM"]), fourre);
  }

  delete(event, idItem){
    console.log(event, idItem)
    event.stopPropagation()
    this.http
      .delete("http://localhost:3000/fourres/" + idItem )
    .subscribe( (res) => {
      this.refreshList()
    })

  }

}
