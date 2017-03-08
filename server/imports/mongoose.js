const mongoose = require('mongoose');
const colour = require('colour');

const fourreSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	planeType: { // "type" is a reserved word
		type: String
	},
	std: {
		type: String
	},
	etd: {
		type: String
	},
	sta: {
		type: String
	},
	ata: {
		type: String
	},
	slot: {
		type: String
	},
	inbound: {
		type: String
	},
	time: {
		type: Object
	},
	flight: {
		type: String
	},
	destination: {
		type: String
	},
	position: {
		type: String
	},
	gate: {
		type: String
	},
	crew: {
		type: [String]
	},
	zones: {
		type: Object
	},
	luggageCount: {
		type: Number
	},
	luggageAvgWeight: {
		type: Number
	},
	luggageTotalWeight: {
		type: Number
	}

})

const Fourre = mongoose.model('fourre', fourreSchema);



const flightInfoSchema = new mongoose.Schema({
	"flight"		: String,
	"prefix"        : String,
	"destination"	: String,
	"position"		: String,
	"gate"			: String,
	"std"			: Date,
	"etd"			: Date,
	"atc"			: [Date],
	"sta"			: Date,
	"ata"			: Date,
	"inbound"		: new mongoose.Schema({
		"flight"		: String,
		"destination"	: String
	})
})

const FlightInfo = mongoose.model('flightinfo', flightInfoSchema); // No capital letters




mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/ACO', err => {
	if (err) {
		console.log("### Error connecting to MongoDB! ###".error), err
	} else {
		console.log("### Successfully connected to MongoDB! ###".rainbow)
	}
})

module.exports = {
	Fourre,
	FlightInfo
}