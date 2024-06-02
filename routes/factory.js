const router = require("express").Router()

const {createFactoryController,getAllFactoryController,getFactoryByIdController ,updateFactoryByIdController,deleteFactoryByIdController}= require("../controller/factory/factory")

router.post("/",createFactoryController)
router.get("/",getAllFactoryController)
router.get("/:factoryId",getFactoryByIdController)
router.patch("/:factoryId",updateFactoryByIdController)
router.delete("/:factoryId",deleteFactoryByIdController)

module.exports=router