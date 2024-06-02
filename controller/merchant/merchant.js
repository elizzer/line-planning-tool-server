const merchantModel = require("../../models/merchant");

async function createMerchant(req, res) {
  try {
    const { name } = req.body;
    if (!name) {
        throw new Error("Merchant name not found")
    }
    
    let newMerchant = new merchantModel({
        name:name,
        userid:req.userId
    })

    const savedMerchant = await newMerchant.save()

    return res.json({
        error:false,
        data:savedMerchant,
        message:"New merchant created"
    })

  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}


async function getMerchantById(req,res){
    try {

        const merchantId=req.params.id

        const merchant = await merchantModel.findOne({_id:merchantId,userid:req.userId})
        console.log(merchant)
        if(!merchant){
            throw new Error("Merchant not found")
        }

        return res.json({
            error:false,
            data:merchant
        })

    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}

async function getAllMerchant(req,res){
    try {
        const merchants = await merchantModel.find({userid:req.userId})

        return res.json(
           { error:false,
            data:merchants}
        )
    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}

async function updateMerchant(req,res){
    try {
        const merchant = await merchantModel.findOne({_id:req.params.id,userid:req.userId})
        if(!merchant){
            throw new Error("Merchant not found")
        }
        const {name}=req.body

        const duplicate=await merchantModel.find({_id:{$ne:req.params.id},userid:req.userId,name:name})

        if(duplicate.length!==0){
            throw new Error ("Merchant name duplication")
        }

        merchant.name=name
        const updatedMerchant = await merchant.save()
        return res.json({
            error:false,
            data:updateMerchant,
            message:"Merchant updated success"
        })
    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}


async function deleteMerchant(req,res){
    try {
        const deletedMerchant = merchantModel.deleteOne({_id:req.params.id,userid:req.userId})
        if(!deleteMerchant){
            throw new Error("Merchant not found")
        }
        return res.json({
            error:false,
            message:"Deletion success",
            data:deletedMerchant
        })
    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}


module.exports={
    createMerchant,
    getAllMerchant,
    updateMerchant,
    deleteMerchant,
    getMerchantById
}