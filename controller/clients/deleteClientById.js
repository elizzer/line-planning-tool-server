const clientModel = require("../../models/clients")
const categoryModel = require("../../models/category");


async function deleteClientById(req,res){
    try {
        
        const _deletedClient=await clientModel.findOneAndDelete({_id:req.params.clientID,userID:req.userId})

        if(!_deletedClient){
            throw new Error("Client attempt to delete no exitst")
        }

        // const _deleteClientCategory= await categoryModel.deleteMany({clientID:_deletedClient._id})

        return res.json({
            error:false,
            data:_deletedClient,
            message:"Client Deletion success"
        })

    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports=deleteClientById