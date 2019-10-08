"use strict";
const express = require('express'),
    router = express.Router(),
   controller=require('../appcontroller/mongocontroller');

   router.post('/data',(req,res)=>{
       controller.getdata(req,res);
   })
   router.get('/records',(req,res)=>{
       controller.getrecords(req,res);
   })
   router.get('/allrecords',(req,res)=>{
       controller.getAllRecords(req,res);
   })
module.exports=router;