"use strict";
const express = require('express'),
    app = express(),
    cors = require('cors'),
    bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
let router=require('./approuter/router');
app.use('/api', router);

//server listening
app.listen(3000, () => {
    console.log("server is listening");
});

module.exports=app;