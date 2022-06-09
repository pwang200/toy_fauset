var express = require("express");
var router = express.Router();

let faucet = require("../controllers/faucet");

router.get("/", faucet.get_address);
router.post("/", faucet.submit_address);

module.exports = router;
