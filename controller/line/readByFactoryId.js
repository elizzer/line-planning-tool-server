const lineModel=require("../../models/lines")
const factoryModel= require("../../models/factory")

async function readByFactoryId(req,res){
    try{
        const factoryId=req.params.id   
        const factory=await factoryModel.find({_id:factoryId,userID:req.userID})
        if(!factory){
            res.status(401).json({
                error:true,
                message:"User not authorized"
            })
        }

        const lines = await lineModel.find({factoryID:factoryId})
    }catch(e){
        return res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports=readByFactoryId