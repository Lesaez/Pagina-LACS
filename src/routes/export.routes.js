const express = require("express");
const controller = require("../controllers/export.controller");

const router = express.Router();

router.get("/excel", controller.exportExcel);

module.exports = router;