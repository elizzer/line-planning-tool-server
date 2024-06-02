const router = require('express').Router()

const merchantControllers= require("../controller/merchant/merchant")

router.post("/",merchantControllers.createMerchant)
router.get("/",merchantControllers.getAllMerchant)
router.get("/:id",merchantControllers.getMerchantById)
router.patch("/:id",merchantControllers.updateMerchant)
router.delete("/:id",merchantControllers.deleteMerchant)

module.exports=router