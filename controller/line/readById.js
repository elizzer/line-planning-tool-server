const lineModel=require("../../models/lines")

async function readById(req,res){
    try {
        const id=req.params.id
        const line=await lineModel.find({userId:req.userId,_id:id})
        return res.json({
            error:false,
            data:line
        })
        console.log("[+]Requested line id ",id)
    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports=readById