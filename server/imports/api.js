const mongoose = require('./mongoose');
const Fourre = mongoose.Fourre;

module.exports = {

    fourre :{

        create : (req,res) => {
            console.log("Fourre.create");
            (new Fourre).save( (err,createdFourre) => {
                if(err) res.status(500).json({error:err})
                res.status(200).json(createdFourre);
            });
        },

        get : (req,res) => {
            console.log("Fourre.get");
            let id = req.params.id;

            if(id=="today"){
                return Fourre.find({_id : { $gt : ObjectId(Math.floor(new Date(new Date().getFullYear()+'/'+(new Date().getMonth()+1)+'/'+new Date().getDate())/1000).toString(16)+"0000000000000000") }})
                    .sort("-created")
                    .exec( (err,fourres) => {
                        if(err) res.status(500).json({error:err})
                        res.status(200).json(fourres);
                    });
            }

            Fourre.findById( id , (err,fourre) => {
                if(err) res.status(500).json({error:err})
                res.status(200).json(fourre);
            });

        },

        update : (req,res) => {
            console.log("Fourre.update");
            Fourre.findByIdAndUpdate( req.params.id , req.body, {new:true})
                .exec( (err,updatedFourre) => {
                    if(err) res.status(500).json({error:err})
                    res.status(200).json(updatedFourre);
                });
        },

        delete : (req,res) => {
            console.log("Fourre.delete");
            Fourre.findByIdAndRemove( req.params.id)
                .exec( (err,deletedFourre) => {
                    if(err) res.status(500).json({error:err})
                    res.status(200).json(deletedFourre);
                });
            res.status(200).end();
        }
    }


}