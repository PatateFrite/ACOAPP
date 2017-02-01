const ObjectId = require('mongoose').Types.ObjectId;
const mongoose = require('./mongoose');
const Fourre = mongoose.Fourre;

module.exports = {

    fourre :{

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
                    console.log("foundFourre = ", foundFourre)
                    foundFourre = Object.assign(foundFourre, req.body);
                    foundFourre.save((err) => {
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
            res.status(200).end();
        }
    }


}