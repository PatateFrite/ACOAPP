import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, MenuController, NavParams } from 'ionic-angular';

import { Routes } from '../../app/app.routes';
import { IFourre } from '../../models/fourre';

import { FourreService } from '../../providers/fourre.service';

declare var localStorage: any;
declare var moment: any;

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

    // initialize cptx to 0
    if(typeof this.fourre.lfcCpt1 == 'undefined'){
      this.fourre.lfcCpt1 = 0;
    }
    if(typeof this.fourre.lfcCpt3 == 'undefined'){
      this.fourre.lfcCpt3 = 0;
    }
    if(typeof this.fourre.lfcCpt4 == 'undefined'){
      this.fourre.lfcCpt4 = 0;
    }
    if(typeof this.fourre.lfcCpt5 == 'undefined'){
      this.fourre.lfcCpt5 = 0;
    }
    if(typeof this.fourre.lfcCpt1Poids == 'undefined'){
      this.fourre.lfcCpt1Poids = 0;
    }
    if(typeof this.fourre.lfcCpt3Poids == 'undefined'){
      this.fourre.lfcCpt3Poids = 0;
    }
    if(typeof this.fourre.lfcCpt4Poids == 'undefined'){
      this.fourre.lfcCpt4Poids = 0;
    }
    if(typeof this.fourre.lfcCpt5Poids == 'undefined'){
      this.fourre.lfcCpt5Poids = 0;
    }
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
    //    if(this.lfcVerifyValues()) {
          console.log("save()")
          this.lfcVerifyValues();
          console.log("Saving... Fourre is now = ", this.fourre)
          this.fourreService.save(this.fourre);
    //    }
  }


  getHeure(event) {
    console.log('getheure->', event)
    
    /*
    let minutes: number;

    if (new Date().getMinutes() < 10) {
      minutes = new Date().getMinutes();
    }
    else {
      minutes = new Date().getMinutes();
    }
    */
    console.log(event.target.id)
    this.currentTimeData[event.target.id] = moment().format('HH:mm'); // new Date().getHours() + ':' + (minutes < 10 ? "0" + minutes : minutes);
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

  /////
  // LFC //
  /////
  onLfcChanged() {
    if(this.fourre.lfcCpt1) {
      this.fourre.lfcCpt1Poids = this.fourre.lfcCpt1 * this.fourre.luggageAvgWeight;
      this.fourre.lfcCpt1Poids = Math.ceil(this.fourre.lfcCpt1Poids);
    }
    if(this.fourre.lfcCpt3) {
      this.fourre.lfcCpt3Poids = this.fourre.lfcCpt3 * this.fourre.luggageAvgWeight;
      this.fourre.lfcCpt3Poids = Math.ceil(this.fourre.lfcCpt3Poids);
    }
    if(this.fourre.lfcCpt4) {
      this.fourre.lfcCpt4Poids = this.fourre.lfcCpt4 * this.fourre.luggageAvgWeight;
      this.fourre.lfcCpt4Poids = Math.ceil(this.fourre.lfcCpt4Poids);
    }
    if(this.fourre.lfcCpt5) {
      this.fourre.lfcCpt5Poids = this.fourre.lfcCpt5 * this.fourre.luggageAvgWeight;
      this.fourre.lfcCpt5Poids = Math.ceil(this.fourre.lfcCpt5Poids);
    }
    this.save();
  }

  private lfcVerifyValues(): boolean {
    this.lastError = '';
    let TotalWeight = this.fourre.lfcCpt1Poids + this.fourre.lfcCpt3Poids + this.fourre.lfcCpt4Poids + this.fourre.lfcCpt5Poids;

    // Total Weight verification
    if( TotalWeight != this.fourre.luggageTotalWeight ) 
    {
      this.lastError = 'Le poid total bagages ne correspond pas au poids total des soutes (CPT), erreur de ' + (this.fourre.luggageTotalWeight - TotalWeight);
      return false;
    }

    // Compatiments empty verification
    if( this.fourre.lfcCpt1Poids <= 0 || this.fourre.lfcCpt3Poids <= 0 ||this.fourre.lfcCpt4Poids <= 0 ||this.fourre.lfcCpt5Poids <= 0  )
    {
      this.lastError = 'Des compartiments à bagages sont vides !'
      return false;
    }
    // sum compartiments must be equal to total bagages
    if( this.fourre.lfcCpt1 + this.fourre.lfcCpt3 + this.fourre.lfcCpt4 + this.fourre.lfcCpt5 != this.fourre.luggageCount){
      this.lastError = 'Total Bagages en soute ne correspond pas au Total des bagages du vol !'
      return false;
    }
    return true;
  }
  
}
