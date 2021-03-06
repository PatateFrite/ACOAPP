import { Component, NgZone } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, MenuController, NavParams, ToastController } from 'ionic-angular';

import { Routes } from '../../app/app.routes';
import { IFourre } from '../../models/fourre';

import { FourreService } from '../../providers/fourre.service';

declare var localStorage: any;
declare var moment: any;
declare var socket: any;

@Component({
	selector: 'page-form',
	templateUrl: 'form.html'
})
export class FormPage {

	public currentTime: string;
	private mode: string = "create";
	private fourre: IFourre;
	private timeoutSave: any = null;
	public currentTimeData = new Object;
	public lastError: String;
	private flightChecked: boolean = false;
	private lfcChecked: boolean = false;
	private lmcChecked: boolean = false;
	private irChecked: boolean = false;

	type: any = localStorage.getItem("planeType")
	process: string = "Flight";

	constructor(public navCtrl: NavController,
		private http: Http,
		public menu: MenuController,
		private params: NavParams,
		private fourreService: FourreService,
		public toastCtrl: ToastController,
		private zone: NgZone
	) {
		menu.enable(true);
		this.fourre = this.params.data;

		if (this.fourre.time) {
			this.currentTimeData = this.fourre.time;
		}

		if (this.params.data.id) this.mode = "edit";

		// initialize cptx to 0
    this.fourre.lfcCpt1 = this.fourre.lfcCpt1 || 0;
    this.fourre.lfcCpt3 = this.fourre.lfcCpt3 || 0;
    this.fourre.lfcCpt4 = this.fourre.lfcCpt4 || 0;
    this.fourre.lfcCpt5 = this.fourre.lfcCpt5 || 0;
 
    this.fourre.lfcCpt1Poids = this.fourre.lfcCpt1Poids || 0;
    this.fourre.lfcCpt3Poids = this.fourre.lfcCpt3Poids || 0;
    this.fourre.lfcCpt4Poids = this.fourre.lfcCpt4Poids || 0;
    this.fourre.lfcCpt5Poids = this.fourre.lfcCpt5Poids || 0;

	this.checkFlight();
	this.checkLFC();

	socket
		.off('flight info changed')
		.on('flight info changed', this.flightInfoChanged.bind(this));
	}

	checkFlight() {
		if(this.fourre.flight && this.fourre.destination) {
			this.flightChecked = true;
		}
	}
	checkLFC() {
		if(this.lfcVerifyValues()) {
			this.lfcChecked = true;
		}
	}
	
	onFlightChanged() {
		// Debouncing
		this.lastError = '';
		clearTimeout(this.timeoutSave);
		this.timeoutSave = setTimeout(() => {
			this.fourreService.flightInfos(this.fourre.flight)
				.then((flight) => {
					if (!flight || !flight.json()[0]) {
						this.lastError = 'Flight not found !';
						return;
					}
					this.computeFlightInfo(flight.json()[0]);
					this.save();
					this.checkFlight();
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
		this.fourre = Object.assign(this.fourre, flightInfo);
		this.fourre.inbound = flightInfo.prefix + ' ' + flightInfo.inbound.flight + ' ' + flightInfo.inbound.destination;
		this.fourre._id = savedId;
	}

	/////
	// LFC //
	/////
	onLfcChanged() {
		if (this.fourre.lfcCpt1) {
			this.fourre.lfcCpt1Poids = this.fourre.lfcCpt1 * this.fourre.luggageAvgWeight;
			this.fourre.lfcCpt1Poids = Math.ceil(this.fourre.lfcCpt1Poids);
		}
		if (this.fourre.lfcCpt3) {
			this.fourre.lfcCpt3Poids = this.fourre.lfcCpt3 * this.fourre.luggageAvgWeight;
			this.fourre.lfcCpt3Poids = Math.ceil(this.fourre.lfcCpt3Poids);
		}
		if (this.fourre.lfcCpt4) {
			this.fourre.lfcCpt4Poids = this.fourre.lfcCpt4 * this.fourre.luggageAvgWeight;
			this.fourre.lfcCpt4Poids = Math.ceil(this.fourre.lfcCpt4Poids);
		}
		if (this.fourre.lfcCpt5) {
			this.fourre.lfcCpt5Poids = this.fourre.lfcCpt5 * this.fourre.luggageAvgWeight;
			this.fourre.lfcCpt5Poids = Math.ceil(this.fourre.lfcCpt5Poids);
		}
		this.save();
		this.checkLFC();
	}

	private lfcVerifyValues(): boolean {
		this.lastError = '';
		let TotalWeight = this.fourre.lfcCpt1Poids + this.fourre.lfcCpt3Poids + this.fourre.lfcCpt4Poids + this.fourre.lfcCpt5Poids;

		// Total Weight verification
		if (TotalWeight != this.fourre.luggageTotalWeight) {
			this.lastError = 'Le poid total bagages ne correspond pas au poids total des soutes (CPT), erreur de ' + (this.fourre.luggageTotalWeight - TotalWeight);
			return false;
		}

		// Compatiments empty verification
		if (this.fourre.lfcCpt1Poids <= 0 || this.fourre.lfcCpt3Poids <= 0 || this.fourre.lfcCpt4Poids <= 0 || this.fourre.lfcCpt5Poids <= 0) {
			this.lastError = 'Des compartiments à bagages sont vides !'
			return false;
		}
		// sum compartiments must be equal to total bagages
		if (+this.fourre.lfcCpt1 + +this.fourre.lfcCpt3 + +this.fourre.lfcCpt4 + +this.fourre.lfcCpt5 != this.fourre.luggageCount) {
			this.lastError = 'Total Bagages en soute ne correspond pas au Total des bagages du vol !'
			return false;
		}
		return true;
	}

	flightInfoChanged(newInfo) {

		if (newInfo.doc.flight !== this.fourre.flight) return;

		let before = this.fourre[newInfo.what];
		let after = newInfo.doc[newInfo.what];

		if (["std", "etd", "sta", "ata"].indexOf(newInfo.what) !== -1) {
			before = moment(before).format('HH:mm');
			after = moment(after).format('HH:mm');
		}


		// this.notifService.info(`${newInfo.what.toUpperCase()} has changed`, `Before = ${before} - Now = ${after}`, {
		// 	timeOut: 8000,
		// 	showProgressBar: true,
		// 	preventDuplicates: true
		// });
		// this.zone.run(() => { })
		let toast = this.toastCtrl.create({
			message: `${newInfo.what.toUpperCase()} has changed  - Was = ${before} - Now = ${after}`,
			duration: 8000,
			position: 'top',
			cssClass: 'toastLFC',
			showCloseButton: true,
			closeButtonText: 'Fermer'
		});
		toast.present();

		this.computeFlightInfo(newInfo.doc);
	}

}
