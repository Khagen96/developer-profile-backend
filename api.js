const express = require('express');
const router = express.Router();
const developers = require('./developers');


router.use('/developers',developers);
router.get('/',(req,res)=>{
    res.send("hello inside /api");
});

module.exports = router;