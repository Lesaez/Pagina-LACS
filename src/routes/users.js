const express = require("express");
const router = express.Router();

const { getUsers, updateRole } = require("../controllers/userController");

router.get("/users", getUsers);

router.put("/users/:id/role", updateRole);

module.exports = router;