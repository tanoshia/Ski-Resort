const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");

router.use(bodyParser.json());

router.get("/", (req, res) => {
    // res.send()
});

router.post("/table", (req, res) => {});

module.exports = router;