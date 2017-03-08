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


  save() {
    // Debouncing
    clearTimeout(this.timeoutSave);
    this.timeoutSave = setTimeout( ()=>{
      console.log("Saving... Fourre is now = ", this.fourre)
      this.fourreService.save(this.fourre);
    }, 1000)

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

}
