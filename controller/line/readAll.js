const lineModel = require("../../models/lines")

async function readAll(req,res){
    try {

        const lines=await lineModel.find({userId:req.userId})

        return res.json({
            error:false,
            data:lines
        })
        
    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports=readAll