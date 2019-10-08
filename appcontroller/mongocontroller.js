"use strict";
const request = require('request'),
    _ = require('underscore'),
    async = require("async"),
    mysql = require('mysql'),
    config = require('../config/config.json'),
    connection = config.credentials,
    con = mysql.createPool(connection),
    options = config.option,
     MongoClient = require('mongodb').MongoClient,
     url = "mongodb://localhost:27017/";
     var dbo = db.db("mydb");
    
   
module.exports = function (err) {
    if (err) throw err;
    let self = {};
    let moxiWorksAgentId;
    self.getdata = (req, res) => {
        var log = {};

        var totalpagesInUrl = 1;
        function sqlStatementsInitial() {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
               
                dbo.createCollection("agents", function(err, res) {
                  if (err) throw err;
                  console.log("Collection created!");
                  db.close();
                });
              });
        }
        sqlStatementsInitial();
        
        function getDataForUrl(currentPage, callback) {
            // console.log("first");
            if (currentPage < totalpagesInUrl) {
                currentPage++;
                req.body["page_number"] = currentPage;
                let url1 = 'https://api.moxiworks.com/api/agents/?';
                moxiWorksAgentId = req.body.moxi_works_agent_id;
                let data = JSON.stringify(req.body);
                data = data.replace(/:/g, "=");
                data = data.replace(/,/g, "&");
                data = data.replace(/,|{|}|"/g, "");
                var url = "url";
                let value = url1 + data;
                options.url = value;
                getBodyFromUrl(function (err, data) {
                    //  console.log("second callback");
                    sqlStatements(function (err, data) {
                        // console.log("third callback");
                        getDataForUrl(currentPage, callback);
                    });
                })
            } else {
                callback();
            }
        }

        function getBodyFromUrl(callback) {
            request(options, function (err, response, body) {
                //  console.log("request");
                if (err) throw err;
                let parsed_data = JSON.parse(body);
                const total_pages = parsed_data.total_pages;
                // console.log('parsed_data.total_pages:',parsed_data.total_pages);
                totalpagesInUrl = total_pages;
                log = parsed_data["agents"];
                callback();
            });
        }

        function sqlStatements(callback) {
            //  console.log("third");
         
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                let values = {};
                values.push([i.moxi_works_agent_id, 
                    i.client_agent_id, i.mls_agent_id,
                     i.license, i.mls_name,
                      i.mls_abbreviation,
                      i.moxi_works_office_id,
                       i.office_id, 
                       i.client_office_id,
                       i.company_id,
                        i.client_company_id,
                         i.office_address_street,
                          i.office_address_street2,
                           i.office_address_city,
                           i.office_address_state,
                            i.office_address_zip,
                            i.name, i.first_name,
                             i.last_name,
                             i.nickname,
                              i.mobile_phone_number,
                              i.alt_phone_number,
                               i.fax_phone_number,
                               i.main_phone_number,
                               i.office_phone_number,
                                i.primary_email_address,
                                i.secondary_email_address,
                                 i.lead_routing_email_address,
                                  i.title,
                                   i.uuid, 
                                   i.has_product_access,
                                   i.has_engage_access,
                                    i.access_level, 
                                    i.website_base_url,
                                    i.twitter, 
                                    i.google_plus,
                                    i.facebook,
                                     i.instagram,
                                     i.blogger,
                                      i.youtube,
                                       i.linked_in,
                                       i.pinterest,
                                        i.home_page,
                                         i.profile_image_url,
                                         i.profile_thumb_url,
                                         i.region,
                                          i.created_timestamp,
                                           i.deactivated_timestamp,
                                           moxiWorksAgentId]);
                var myobj = { name: "Company Inc", address: "Highway 37" };
                async.each(log, (i, cb) => {
                    dbo.collection("customers").insertMany(myobj, function(err, res) {
                        if (err) throw err;
                        console.log("Number of documents inserted: " + res.insertedCount);
                        db.close();
                      });
                });
               
              });
               
                callback()
            
        }
        getDataForUrl(0, function () {
            console.log(" 1completed");
            res.send({ message: "data sent" })
        });
    }
    self.getrecords = (req, res) => {
        //select query
        function getrecords(callback) {
            var arr = [];
           
                let start = parseInt(req.query.start);
                let end = parseInt(req.query.end);
                console.log(start,end)
              
                    res.send({ res: arr, length: result.length })
                    callback();
                
        
        }
        getrecords(function (err, data) {
               console.log("finished")
        })
    }
    self.getAllRecords = (req, res) => {
      
    }
    return self;
}();
