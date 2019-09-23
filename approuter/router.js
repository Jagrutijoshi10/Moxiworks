"use strict";
const express = require('express'),
    router = express.Router(),
   controller=require('../appcontroller/controller');

   router.post('/data',(req,res)=>{
       controller.getdata(req,res);
   })
   router.get('/records',(req,res)=>{
       controller.getrecords(req,res);
   })
module.exports=router;