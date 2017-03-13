import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { IFourre } from '../models/fourre';

declare const serverUrl; // defined in index.html

@Injectable()
export class FourreService {

  fourres : Array<IFourre> = [];
  saveTimeout : any = null;

  constructor(public http: Http) {

  }

  createFourre(planeType,callback){  // planeType = 319 or 320
      this.http
        .post(serverUrl + "/fourre", { planeType : planeType })
        .toPromise()
        .then( res => {
            console.log("Created fourre :", res.json())
            callback(res.json());
            this.fourres.push(res.json());
        })
        .catch( err => {
          console.error("Could not create fourre", err.json())
        })
  }

  save(fourre){
    clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout( () =>{
      this.http
            .put(serverUrl + "/fourre", fourre)
            .toPromise()
            .then((res) => console.log("Saved!", res))
            .catch( err => console.error("Error saving", err))
    }, 500);
  }

  refreshList(){
      this.http
        .get(serverUrl + "/fourre/today")
        .toPromise()
        .then( (res) => {
            this.fourres = res.json().map( fourre =>{
              fourre.show = true;
              return fourre;
            });
            console.log("this.fourres = ",this.fourres)
        })
        .catch( err => {
            console.error("Could not retrieve day's fourres", err)
          })
  }

  deleteFourre(event, idItem){
    console.log(event, idItem)
    event.stopPropagation()
    this.http
      .delete(serverUrl + "/fourre/" + idItem )
      .toPromise()
      .then( res => {
          this.refreshList()
      })
      .catch( err => {
          console.error("Could not delete fourre", err)
        })

  }

  flightInfos(searchFlight: String) {
    let flightNbr = parseInt(searchFlight.replace(/[^0-9\.]/g, ''), 10);
    return this.http
        .get(serverUrl + "/flightinfo/" + flightNbr)
        .toPromise()
  }

  hideFourre(fourreId){ // Hides a fourre from the list. The fourre will be deleted a few seconds later, unless the "undo" button is pressed
      this.fourres = this.fourres.map( fourre => {
        fourre['show'] = fourre._id !== fourreId;
        return fourre;
      })
  }

   unhideFourre(fourreId){ // Hides a fourre from the list. The fourre will be deleted a few seconds later, unless the "undo" button is pressed
      this.fourres = this.fourres.map( fourre => {
        if(fourre._id === fourreId) fourre['show'] = true;
        return fourre;
      })
  }
}
