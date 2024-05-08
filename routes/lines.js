const express=require("express")

const router = express.Router()

const createController = require("../controller/line/create")
const readAllController= require("../controller/line/readAll")
const readByIdController = require("../controller/line/readById")
const updateOneController=require("../controller/line/updateOne")
const deleteOneController=require("../controller/line/deleteOne")

const isLoggedIn = require("../controller/middleware/isLoggedin")

router.post("/",isLoggedIn,createController)
router.get("/",isLoggedIn,readAllController)
router.get("/:id",isLoggedIn,readByIdController)
router.patch("/:id",isLoggedIn,updateOneController)
router.delete("/:id",isLoggedIn,deleteOneController)



module.exports=router