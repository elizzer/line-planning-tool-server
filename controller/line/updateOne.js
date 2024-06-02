const lineModel= require("../../models/lines")
const factoryModel = require("../../models/factory")


async function updateOne(req,res){
    try {
        const {name,metadata,factoryid}= req.body
        let updates={}
        const factory =await factoryModel.findOne({_id:factoryid,userID:req.userId})
        console.log(factoryid,req.userId)
        if(!factory){
           return res.status(401).json({
                error:true,
                message:"User not authorized"
            })
        }
        if(name){
            const _duplicate=await lineModel.findOne({factoryID:factoryid,name:name,_id:{$ne:req.params.id}})
            console.log(_duplicate)
            if(_duplicate){
                throw new Error("Line name duplication")
            }
            updates.name=name
        }
     
        updates.metadata=metadata
        updates.factoryid=factoryid
        


        const updatedLine=await lineModel.findOneAndUpdate({_id:req.params.id,factoryID:factoryid},updates,{new:true})

        return res.json({
            error:false,
            data:updatedLine
        })
    } catch (error) {

        return res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports=updateOne