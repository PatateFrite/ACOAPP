const mongoose = require('mongoose');
const colour = require('colour');

const fourreSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
	planeType: String, // "type" is a reserved word,
	std					: String, // Should be Date
	etd					: String, // Should be Date
	sta					: String, // Should be Date
	ata					: String, // Should be Date
	slot				: String, // Should be [Date]
	inbound				: String, // Should be Object{ flight, destination }
	time				: String,
	flight				: String,
	destination			: String,
	position			: String,
	gate				: String,
	crew				: [String],
	zones				: Object,
	luggageCount		: Number,
	luggageAvgWeight	: Number,
	luggageTotalWeight	: Number,
	lfcCpt1				: Number,
	lfcCpt3				: Number,
	lfcCpt4				: Number,
	lfcCpt5				: Number,
	lfcCpt1Poids		: Number,
	lfcCpt3Poids		: Number,
	lfcCpt4Poids		: Number,
	lfcCpt5Poids		: Number,
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
	"atc"			: [Date], // = Slot
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