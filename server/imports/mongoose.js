const Mongoose = require('mongoose');
const colour = require('colour');

const fourreSchema = new Mongoose.Schema({
    std : {
        type : Date
    },
    etd : {
        type : Date
    },
    sta : {
        type : Date
    },
    ata : {
        type : Date
    },
    slot : {
        type : Date
    },
    inbound : {
        type : Date
    },
    flight : {
        type : String
    },
    destination : {
        type : String
    },
    position : {
        type : String
    },
    gate : {
        type : String
    },
    crew : {
        type : [String]
    },
    zones : {
        type : Object
    },
    luggageCount : {
        type : Number
    },
    luggageAvgWeight : {
        type : Number
    },
    luggageTotalWeight : {
        type : Number
    }

})

const Fourre	= Mongoose.model('fourre', fourreSchema);

Mongoose.Promise = global.Promise

Mongoose.connect('mongodb://localhost/ACO', err => {
	if (err){
		console.log("### Error connecting to MongoDB! ###".error) , err
    }else{
		console.log("### Successfully connected to MongoDB! ###".rainbow)
    }
})

module.exports = {
    Fourre
}