const clientModel = require("../../models/clients");

async function getAllClientController(req,res){
    try {

        const client=await clientModel.find({userID:req.userId})

        if(!client){
            throw new Error("Requested clients not found")
        }

        return res.json({
            error:false,
            data:client
        })
        
    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports=getAllClientController