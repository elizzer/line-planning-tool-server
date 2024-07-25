const lineModel= require("../../models/lines")

async function deleteOne(req,res){
    try{
        const deletedLine=await lineModel.findOneAndDelete({_id:req.params.id})
        if(!deletedLine){
            throw new Error("Line not found")
        }
        return res.json({
            error:false,
            message:`Line ${deletedLine.name} deletion success`,
            data:deletedLine
        })
    }catch(error){
        return res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports=deleteOne