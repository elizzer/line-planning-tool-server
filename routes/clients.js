const router = require("express").Router()

const createClientController = require("../controller/clients/createClient")
const getClientByIdController = require("../controller/clients/getClientById")
const getAllClientController = require("../controller/clients/getAllClient")
const updateClientByIdController = require("../controller/clients/updateClientById")
const deleteClientByIdController = require("../controller/clients/deleteClientById")

// const {deleteClientCategoryById,updateClientCategoryById} = require("../controller/category/category")

router.post("/",createClientController)
router.get("/:clientID",getClientByIdController)
router.get("/",getAllClientController)
router.patch("/:clientID",updateClientByIdController)
router.delete("/:clientID",deleteClientByIdController)

// router.delete("/:clientID/:categoryID",deleteClientCategoryById)
// router.patch("/:clientID/:categoryID",updateClientCategoryById)

module.exports=router