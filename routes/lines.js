const express=require("express")

const router = express.Router()

const createController = require("../controller/line/create")
const readAllController= require("../controller/line/readAll")
const readByIdController = require("../controller/line/readById")
const updateOneController=require("../controller/line/updateOne")
const deleteOneController=require("../controller/line/deleteOne")
const readByFactoryId = require("../controller/line/readByFactoryId")

const isLoggedIn = require("../controller/middleware/isLoggedin")

router.post("/",createController)
router.get("/",readAllController)
router.get("/:id",readByIdController)
// router.get("/factory/:id",isLoggedIn,readByFactoryId)
router.patch("/:id",updateOneController)
router.delete("/:id",deleteOneController)



module.exports=router