"use strict";
const request = require('request'),
    _ = require('underscore'),
    async = require("async"),
    config = require('../config/config.json'),
    options = config.option,
    MongoClient = require('mongodb').MongoClient,
    url = "mongodb://localhost:27017/";
    const json2csv = require('json2csv').parse;
    const Json2csvParser = require('json2csv').Parser;
    const { Parser } = require('json2csv');
const fields =["MOXI-WORKS AGENT ID", "CLIENT AGENT ID", "MLS AGENT ID", "LICENSE", "MLS NAME", "MLS ABBREVIATION", "MOXI-WORKS OFFICE ID", "OFFICE ID", "CLIENT OFFICE ID", "COMPANY ID", "CLIENT COMPANY ID", "OFFICE ADDRESS STREET", "OFFICE ADDRESS STREET 2", "OFFICE ADDRESS CITY", "OFFICE ADDRESS STATE", "OFFICE ADDRESS ZIP", "NAME", "FIRST NAME", "LAST NAME", "NICKNAME", "MOBILE PHONE NUMBER", "ALT PHONE NUMBER", "FAX PHONE NUMBER", "MAIN PHONE NUMBER", "OFFICE PHONE NUMBER", "PRIMARY EMAIL ID", "SECONDARY EMAIL ADDRESS", "LEAD ROUTING EMAIL ADDRESS", "TITLE", "UUID", "HAS-PRODUCT-ACCESS", "HAS-ENGAGE-ACCESS", "ACCESS LEVEL", "WEBSITE BASE URL", "TWITTER", "GOOGLE PLUS", "FACEBOOK", "INSTAGRAM", "BLOGGER", "YOUTUBE", "LINKED_IN", "PINTEREST", "HOME_PAGE", "PROFILE IMAGE URL", "PROFILE THUMB URL", "REGION", "CREATED_TIMESTAMP", "DEACTIVATED_TIMESTAMP","AGENT ID FROM URL"];


module.exports = function (err) {
    if (err) throw err;
    let self = {};
    let moxiWorksAgentId;
    self.getdata = (req, res) => {
        var log = {};

        var totalpagesInUrl = 1;
        function sqlStatementsInitial() {

            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("mydb");

                dbo.createCollection("agents", function (err, res) {
                    if (err) throw err;
                    // console.log("Collection created!");
                    db.close();
                });
                var myquery = { moxi_works_id_from_url: moxiWorksAgentId };

                dbo.collection("agents").deleteMany(myquery, function (err, obj) {
                    if (err) throw err;
                    // console.log(obj.result.n + " document(s) deleted");
                    db.close();
                });
            });
        }
        sqlStatementsInitial();

        function getDataForUrl(currentPage, callback) {
            // console.log("first");
            if (currentPage <= totalpagesInUrl) {
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
                // console.log("response sent")
            }
        }

        function getBodyFromUrl(callback) {
            request(options, function (err, response, body) {
                //  console.log("request");
                if (err) throw err;
                let parsed_data = JSON.parse(body);
                // const total_pages = parsed_data.total_pages;
                totalpagesInUrl = parsed_data.total_pages;
                log = parsed_data["agents"];
                callback();
            });
        }

        function sqlStatements(callback) {
            //  console.log("third");

            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("mydb");
                let values;
                async.each(log, (i, cb) => {
                    // console.log(log)
                    values = [{
                        moxi_works_agent_id: i.moxi_works_agent_id,
                        client_agent_id: i.client_agent_id,
                        mls_agent_id: i.mls_agent_id,
                        license: i.license,
                        mls_name: i.mls_name,
                        mls_abbreviation: i.mls_abbreviation,
                        moxi_works_office_id: i.moxi_works_office_id,
                        office_id: i.office_id,
                        client_office_id: i.client_office_id,
                        company_id: i.company_id,
                        client_company_id: i.client_company_id,
                        office_address_street: i.office_address_street,
                        office_address_street2: i.office_address_street2,
                        office_address_city: i.office_address_city,
                        office_address_state: i.office_address_state,
                        office_address_zip: i.office_address_zip,
                        name: i.name,
                        first_name: i.first_name,
                        last_name: i.last_name,
                        nickname: i.nickname,
                        mobile_phone_number: i.mobile_phone_number,
                        alt_phone_number: i.alt_phone_number,
                        fax_phone_number: i.fax_phone_number,
                        main_phone_number: i.main_phone_number,
                        office_phone_number: i.office_phone_number,
                        primary_email_address: i.primary_email_address,
                        secondary_email_address: i.secondary_email_address,
                        lead_routing_email_address: i.lead_routing_email_address,
                        title: i.title,
                        uuid: i.uuid,
                        has_product_access: i.has_product_access,
                        has_engage_access: i.has_engage_access,
                        access_level: i.access_level,
                        website_base_url: i.website_base_url,
                        twitter: i.twitter,
                        google_plus: i.google_plus,
                        facebook: i.facebook,
                        instagram: i.instagram,
                        blogger: i.blogger,
                        youtube: i.youtube,
                        linked_in: i.linked_in,
                        pinterest: i.pinterest,
                        home_page: i.home_page,
                        profile_image_url: i.profile_image_url,
                        profile_thumb_url: i.profile_thumb_url,
                        region: i.region,
                        created_timestamp: i.created_timestamp,
                        deactivated_timestamp: i.deactivated_timestamp,
                        moxi_works_id_from_url: moxiWorksAgentId
                    }];
                    dbo.collection("agents").insertMany(values, function (err, res) {
                        if (err) throw err;
                        // console.log("Number of documents inserted: " + res.insertedCount);
                        db.close();
                        cb();
                    });
                }, callback());
            });
        }
        getDataForUrl(0, function () {
            // console.log(" 1completed");
            res.send({ message: "data sent" })
        });
    }
    self.getrecords = (req, res) => {
        //select query
        function getrecords(callback) {
            let start = parseInt(req.query.start);
            let end = parseInt(req.query.end);
            // console.log(start, end)
            var arr = [];
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("mydb");
                var myquery = { moxi_works_id_from_url: moxiWorksAgentId };
                dbo.collection("agents").find(myquery).toArray(function (err, result) {
                    if (err) throw err;
                    for (let i = start; i < end; i++) {
                        arr.push(result[i]);
                        if (i === result.length) {
                            break;
                        }
                    }
                    res.send({ res: arr, length: result.length })
                    db.close();
                    callback();
                });
            });
        }
        getrecords(function (err, data) {
            // console.log("finished")
        })
    }
    self.getAllRecords = (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");

            dbo.collection("agents").find({}).toArray(function (err, result) {
                if (err) throw err;
                res.send(result)
              
            //     const json2csvParser = new Json2csvParser({ result,delimiter:'\t' });
            //     const csvData = json2csvParser.parse(result);
            //     res.setHeader('Content-disposition', 'attachment; filename=customers.csv');
            // res.set('Content-Type', 'text/csv');
            // res.status(200).send(csvData);


//                 const csvString = json2csv(csv);
//                 res.setHeader('Content-disposition', 'attachment; filename=shifts-report.csv');
//                 res.set('Content-Type', 'text/csv');
//                 res.status(200).send(csvString);
//                 // console.log(csvString)
//                 // res.send(csv)
                db.close();
            });

        });
    }
    return self;
}();
