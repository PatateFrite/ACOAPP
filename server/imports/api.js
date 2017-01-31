const mongoose = require('./mongoose');
const Fourre = mongoose.Fourre;

module.exports = {

    fourre :{

        create : (req,res) => {
            console.log("Fourre.create");
            (new Fourre).save( (err,fourre) => {
                if(err) res.status(500).json({error:err})
                res.status(200).json(fourre);
            });
        },

        get : (req,res) => {
            console.log("Fourre.get");
            let id = req.params.id;

            if(id=="today"){
                return Fourre.find({},{sort:"-created"}, (err,fourres) => {
                    if(err) res.status(500).json({error:err})
                    res.status(200).json(fourres);
                });
            }

            res.status(200).end();
        },

        update : (req,res) => {
            console.log("Fourre.update");
            res.status(200).end();
        },

        delete : (req,res) => {
            console.log("Fourre.delete");
            res.status(200).end();
        },
    }


}