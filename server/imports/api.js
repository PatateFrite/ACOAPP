const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('./mongoose');
const Fourre = mongoose.Fourre;
const FlightInfo = mongoose.FlightInfo;
const moment = require('moment');
const colour = require('colour');
const io = require('./server').io;
const series = require('async-series');

module.exports = {

    flightInfo : (req,res) => {
        FlightInfo
            .find({flight:req.params.id})
            .lean()
            .exec( (err,doc)=>{
                if(err) return res.status(500).send(err);
                flightInfo = doc;
                res.status(200).json(flightInfo);
            })
    },

    fourre : {

        create : (req,res) => {
            let fourre = new Fourre;
            fourre.planeType = req.body.planeType;

            fourre.save( (err,createdFourre) => {
                if(err) res.status(500).json({error:err})
                res.status(200).json(createdFourre);
            });
        },

        get : (req,res) => {
            let id = req.params.id;

            if(id=="today"){
                return Fourre.find({_id : { $gt : ObjectId(Math.floor(new Date(new Date().getFullYear()+'/'+(new Date().getMonth()+1)+'/'+new Date().getDate())/1000).toString(16)+"0000000000000000") }})
                    .sort("-created")
                    .exec( (err,fourres) => {
                        if(err) return res.status(500).json({error:err})
                        res.status(200).json(fourres);
                    });
            }

            Fourre.findById( id , (err,fourre) => {
                if(err) return res.status(500).json({error:err})
                res.status(200).json(fourre);
            });

        },

        update : (req,res) => {
            Fourre.findById(req.body._id)
                .exec( (err,foundFourre) => {
                    if(err) return res.status(500).json({error:err});
                    console.log("\nAPI update - foundFourre = ", foundFourre)
                    if(!foundFourre || !foundFourre._id) {
                        console.log(`Did not find any fourre to update with _id=${req.body._id}`.red);
                        return res.status(404).json({error:`Did not find any fourre to update with _id=${req.body._id}`});
                    }
                     Object.assign(foundFourre, req.body);
                    foundFourre.save((err) => {
                        if(err) return res.status(500).json({error:err})
                        res.status(200).end();
                    })
                });
        },

        delete : (req,res) => {
            Fourre.findByIdAndRemove( req.params.id)
                .exec( (err,deletedFourre) => {
                    if(err) return res.status(500).json({error:err})
                    res.status(200).json(deletedFourre);
                });
        }
    }
}


const flightInfoChanger = () => {
    // Function that simulates flight info changes every now and then, so the API doesn't return always the same thing

    // Position, gate, etd, slot, ata

    /*
    flightInfoSchema = new Mongoose.Schema({
        "flight"		: String,
        "prefix"        : String,
        "destination"	: String,
        "position"		: String,  <-- CHANGE
        "gate"			: String,  <-- CHANGE
        "std"			: Date,
        "etd"			: Date,  <-- CHANGE
        "atc"			: [Date],   <-- =slot CHANGE
        "sta"			: Date,
        "ata"			: Date,  <-- CHANGE
        "inbound"		: new Mongoose.Schema({
            "flight"		: String,
            "destination"	: String
        })
    })
    */

    console.log("\nChanging all flights infos...");
    const canChange = ["position","gate","etd","ata"];
    const gates = ["A","B","C","D","E","F","G"];

    FlightInfo
        .find()
        .exec( (err,docs) => {
            if(err) return // console.log("Error finding FlightInfo".red,err);
            console.log(`Found ${docs.length} flights in base`)
            series( docs.map( doc => {
                return callback => {
                    const toChange = canChange[Math.floor(Math.random()*canChange.length)]; // "positon", "gate", etc.
                    console.log(`\nChanging attribute [${toChange}] on flight ${doc.flight}`)
                    switch(toChange){
                        case "position":
                            // console.log("Position before = ", doc.position)
                            doc.position = Math.floor(Math.random()*80+1);
                            // console.log("Position after = ", doc.position)
                            break;
                        case "gate" :
                            // console.log("Gate before = ", doc.gate)
                            doc.gate = gates[Math.floor(Math.random()*gates.length)] + Math.floor(Math.random()*30+1);
                            // console.log("Gate after = ", doc.gate)
                            break;
                        case "etd" :
                        case "ata" :
                            if(!doc[toChange]) {
                                console.log("Value is null. Not updating");
                                return callback(null);
                            }
                            // console.log(`${toChange} before = `, doc[toChange])
                            doc[toChange] = moment(doc[toChange]).add(5, 'minutes');
                            // console.log(`${toChange} after = `, doc[toChange])
                            break;
                    }

                    doc.save( err => {
                        if(err) {
                            console.log(`flight ${doc.flight} - Error saving flight info`.red, err);
                            callback(err)
                        }
                        console.log(`flight ${doc.flight} - Emitting data`);
                        io.sockets.emit('flight info changed', doc);
                        callback(null)
                    });
                }
            })
            , (err, result) => {
                if(err) console.log("Series callback error = ".red, err);
                console.log("All flights modified successfully.".green)
            }) // end series

        })

}

setInterval( flightInfoChanger, 15000 );
setTimeout( flightInfoChanger, 3000 );