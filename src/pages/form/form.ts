import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, MenuController, NavParams } from 'ionic-angular';

import { Routes } from '../../app/app.routes';
import { IFourre } from '../../models/fourre';

import { FourreService } from '../../providers/fourre.service';

declare var localStorage: any;

@Component({
  selector: 'page-form',
  templateUrl: 'form.html'
})
export class FormPage {

  public currentTime: string;
  private mode: string = "create";
  private fourre: IFourre;
  private timeoutSave: any = null;
  public currentTimeData= new Object;
  public lastError: String;

  type: any = localStorage.getItem("planeType")
  process: string = "Flight";

  constructor(public navCtrl: NavController,
    private http: Http, 
    public menu: MenuController,
    private params: NavParams,
    private fourreService: FourreService
  ) {
    menu.enable(true);
    this.fourre = this.params.data;

    if (this.fourre.time) {
      this.currentTimeData = this.fourre.time;
    }

    if (this.params.data.id) this.mode = "edit";
  }

  onFlightChanged() {
    // Debouncing
    this.lastError = '';
    clearTimeout(this.timeoutSave);
    this.timeoutSave = setTimeout( ()=>{
      this.fourreService.flightInfos(this.fourre.flight)
      .then((flight) => {
        if(!flight || !flight.json()[0]) {
          this.lastError = 'Flight not found !';
          return;
        }
        this.computeFlightInfo(flight.json()[0]);
        this.save();
      })
      .catch(err => {
        this.lastError = err;
        console.log('FLightInfo %s error : ', this.fourre.flight, err)
      })
    }, 1000)
  }

  save() {
      console.log("Saving... Fourre is now = ", this.fourre)
      this.fourreService.save(this.fourre);
  }


  getHeure(event) {
    console.log('getheure->', event)
    let minutes: number;

    if (new Date().getMinutes() < 10) {
      minutes = new Date().getMinutes();
    }
    else {
      minutes = new Date().getMinutes();
    }

    console.log(event.target.id)

    this.currentTimeData[event.target.id] = new Date().getHours() + ':' + (minutes < 10 ? "0" + minutes : minutes);

    this.fourre.time = this.currentTimeData;
    this.save();
    //event.target.innerHTML = new Date().getHours()+':'+ (minutes<10 ? "0"+ minutes : minutes)
  }
  private computeFlightInfo(flightInfo) {
    let savedId = this.fourre._id;
    this.fourre = flightInfo;
    this.fourre.inbound = flightInfo.prefix + ' ' + flightInfo.inbound.flight + ' ' + flightInfo.inbound.destination;
    this.fourre._id = savedId;
  }
}
