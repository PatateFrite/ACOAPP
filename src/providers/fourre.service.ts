import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { IFourre } from '../models/fourre';

declare const serverUrl; // defined in index.html

@Injectable()
export class FourreService {
<<<<<<< HEAD

  serverUrl: String = 'http://www.jeremythille.net:3000';
  //serverUrl: String = window.location.origin.replace(/:[0-9]{4}$/,':3000'); // <-- Hitting the local server on port 3000
=======
>>>>>>> 3d7303220657b2276686b8ed1d258c07070e0c72
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
      .then( res => {
          this.fourres = res.json();
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
      .delete(serverUrl + "/fourre" + idItem )
      .subscribe( (res) => {
        this.refreshList()
      })

  }
}
