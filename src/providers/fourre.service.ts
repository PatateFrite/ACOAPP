import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the ProvidersFourre provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FourreService {

  serverUrl: String = "http://localhost:3000";
  fourres : Array<any> = [];

  constructor(public http: Http) {
    console.log('Hello from FourreService');

  }


  createFourre(type,callback){  // type = 319 or 320
      console.log("Creating fourre :");

      this.http
        .post(this.serverUrl + "/fourre", null)
        .toPromise()
        .then( res => {
            console.log("Created fourre :", res.json())
            callback(res.json());
            this.fourres.push(res.json());
        })
        .catch( err => {
          console.error("Could not create fourre", err)
        })
  }


  refreshList(){
    this.http
      .get(this.serverUrl + "/fourre/today")
      .toPromise()
      .then( res => {
          this.fourres = res.json();
          console.log("this.fourres = ",this.fourres)
      })
      .catch( err => {
          console.error("Could retrieve day's fourres", err)
        })

  }

  deleteFourre(event, idItem){
    console.log(event, idItem)
    event.stopPropagation()
    this.http
      .delete(this.serverUrl + "/fourre" + idItem )
      .subscribe( (res) => {
        this.refreshList()
      })

  }
}
