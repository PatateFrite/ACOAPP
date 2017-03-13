import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';
import { Camera } from 'ionic-native';

import { Routes } from '../../app/app.routes';

import { Http } from '@angular/http';
import { LoginPage } from '../login/login';

import { FourreService } from '../../providers/fourre.service';
import { IFourre } from '../../models/fourre';

// import { NotificationsService } from 'angular2-notifications';

declare var localStorage: any;

@Component({
	selector: 'page-profil',
	templateUrl: 'profil.html',

})
export class ProfilPage {

	private base64Image: any;
	private reportImages: Array<string> = [];

	private sections: string = "Today";
	private timeouts: Object = {};

	constructor(public navCtrl: NavController,
		private http: Http,
		private fourreService: FourreService,
		public toastCtrl: ToastController
	) {

		/*notifService.success("Test title", "test content", {
		  timeOut : 2000,
		  showProgressBar : true
		});*/

	}


	ionViewWillEnter() {
		this.fourreService.refreshList();
	}

	takePicture() {
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


	takeReportPicture() {
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


	logout() {
		console.log("Routes.LOGIN = ", Routes.LOGIN)
		this.navCtrl.setRoot(LoginPage); //pr revenir en arrière, sinon .pop avec le route.login
	}

	// FOURRES MANAGEMENT

	createFourre(planeType) {
		this.fourreService.createFourre(planeType, this.openFourre.bind(this));
	}

	deleteFourre(event, fourreId) {

		event.stopPropagation();

		console.log(event);

		let toast = this.toastCtrl.create({
			message: `Fourre deleted.`,
			duration: 6000,
			position: 'top',
			cssClass: 'toastLFC',
			showCloseButton: true,
			closeButtonText: 'Undo'
		});

		console.log(toast);

		toast.onWillDismiss( () => {
			clearTimeout(this.timeouts[fourreId]);
			this.fourreService.unhideFourre(fourreId);
		});
		toast.present();

		this.fourreService.hideFourre(fourreId);

		this.timeouts[fourreId] = setTimeout( () => {
			this.fourreService.deleteFourre(event, fourreId);
		}, 6000);
	}

	openFourre(fourre) {
		this.navCtrl.push(Routes.getPage(Routes["FORM"]), fourre);
	}
}
