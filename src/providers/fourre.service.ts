import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { IFourre } from '../models/fourre';

declare const serverUrl; // defined in index.html

@Injectable()
export class FourreService {

  fourres : Array<IFourre> = [];

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
    this.http
          .put(serverUrl + "/fourre", fourre)
          .toPromise()
          .then((res) => console.log("Saved!", res))
          .catch((err) => console.error("Error saving", err))
    }

  refreshList(){
      this.http
        .get(serverUrl + "/fourre/today")
        .toPromise()
        .then( (res) => {
            this.fourres = res.json();
            console.log("this.fourres = ",this.fourres)
        })
        .catch( (err) => {
            console.error("Could not retrieve day's fourres", err)
          })
  }

  deleteFourre(event, idItem){
    console.log(event, idItem)
    event.stopPropagation()
    this.http
      .delete(serverUrl + "/fourre/" + idItem )
      .subscribe( (res) => {
        setTimeout(() => {
          this.refreshList()
        }, 1500)
      })

  }
}
