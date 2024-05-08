const lineModel= require("../../models/lines")

async function updateOne(req,res){
    try {
        const {name,metadata}= req.body
        let updates={}

        if(name){
            const _duplicate=await lineModel.findOne({userId:req.userId,name:name})
            console.log(_duplicate)
            if(_duplicate){
                throw new Error("Line name duplication")
            }
            updates.name=name
        }
        if(metadata){
            updates.metadata=metadata
        }


        const updatedLine=await lineModel.findOneAndUpdate({_id:req.params.id,userId:req.userId},updates,{new:true})

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