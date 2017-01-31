import { Component} from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, MenuController, NavParams} from 'ionic-angular';

import { Routes } from '../../app/app.routes';
import { IFourre } from '../../models/fourre';


declare var localStorage: any;

@Component({
  selector: 'page-form',
  templateUrl: 'form.html'
})
export class FormPage {
  public currentTime: string;
  private mode: string = "create";
  private fourre: IFourre;

  type:any = localStorage.getItem("planeType")
  process: string = "Flight";

  constructor(public navCtrl: NavController,
              private http: Http, menu: MenuController,
              private params: NavParams
  ) {
      menu.enable(true);
      console.log("NavParams.data", this.params.data); //  == {} en mode creation, == {fourre} en mode edition
      this.fourre = this.params.data;

      if(this.fourre.time){
        this.CurrentTimeData = this.fourre.time;
      } else {
        this.CurrentTimeData = {};
      }


      if(this.params.data.id) this.mode="edit";
  }


/*
  ionViewDidLoad() {
    console.log('Hello FormPage Page');//ATTENTION IL FAUT IMPORTER MODULER REQUETE HTTP
  }*/

  save(){
      //console.log("posting /fourres", this.fourre)

      let headers = new Headers();
      headers.append('Content-Type', "application/json" );

// TODO: Patleod: is mode create still necessary ??
      if(this.mode == "create"){

          this.http
            .post("http://localhost:3000/fourre/"+ this.fourre.id, this.fourre)
            .subscribe( (res) => console.log(res))

        } else {

          this.http
            .put("http://localhost:3000/fourres/" + this.fourre.id , this.fourre, {
              headers : headers
            })
            .subscribe( (res) => console.log(res))

        }

        this.navCtrl.pop(Routes.getPage(Routes.PROFIL));
    }





  CurrentTimeData:any= {};
  getHeure(event) {
    console.log('getheure->', event)
    let minutes: number;

    if(new Date().getMinutes() < 10){
      minutes = new Date().getMinutes();
    }
    else{
      minutes =new Date().getMinutes();
    }

    console.log(event.target.id)

    this.CurrentTimeData[event.target.id] = new Date().getHours()+':'+ (minutes<10 ? "0"+ minutes : minutes);

    this.fourre.time=this.CurrentTimeData;
    //event.target.innerHTML = new Date().getHours()+':'+ (minutes<10 ? "0"+ minutes : minutes)
  }

}
