"use strict";
const request = require('request');
const _ = require('underscore')
let options = {
    method: 'GET',
    headers: {
        Authorization: "Basic OTJlNWFiNWUtOWM4Zi0xMWU2LTgxMDUtMDA1MDU2OWMxMTlhOjVIZ1RhR1FIMm9PZVQ5Y3hmWHU2Ymd0dA==",
        AccessControlAllowCredentials: 'true',
        contentType: 'application/json',
        Accept: 'application/vnd.moxi-platform+json;version:1',
        json: 'true'
    },
}
var mysql = require('mysql');
var async = require("async");
var con = mysql.createPool({
    connectionLimit: 100,
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "moxiWorks"
});

module.exports = function (err) {
    if (err) throw err;
    let self = {};
    let moxiWorksAgentId;
    self.getdata = (req, res) => {
        var log = {};

        var totalpagesInUrl = 1;
        function sqlStatementsInitial() {
            con.getConnection(function (err) {
                if (err) throw err;
                //create table
                var sql = "CREATE TABLE IF NOT EXISTS agent (moxi_works_agent_id varchar(200) PRIMARY KEY,client_agent_id varchar(200),mls_agent_id varchar(200),license varchar(200),mls_name varchar(200),mls_abbreviation varchar(200),moxi_works_office_id varchar(200),office_id varchar(200),client_office_id varchar(200),company_id varchar(200),client_company_id varchar(200),office_address_street varchar(200),office_address_street2 varchar(200),office_address_city varchar(200),office_address_state varchar(200),office_address_zip varchar(200),name varchar(200),first_name varchar(200),last_name varchar(200),nickname varchar(200),mobile_phone_number varchar(200),alt_phone_number varchar(200),fax_phone_number varchar(200),main_phone_number varchar(200),office_phone_number varchar(200),primary_email_address varchar(200),getBodyFromUrary_email_addressary_email_address varchar(200),lead_routing_email_address varchar(200),title varchar(200),uuid varchar(200),has_product_access varchar(200),has_engage_access varchar(200),access_level varchar(200),website_base_url varchar(200),twitter varchar(200),google_plus varchar(200),facebook varchar(200),instagram varchar(200),blogger varchar(200),youtube varchar(200),linked_in varchar(200),pinterest varchar(200),home_page varchar(200),profile_image_url varchar(200),profile_thumb_url varchar(200),region varchar(200),created_timestamp varchar(200),deactivated_timestamp varchar(200),agent_id_from_url varchar(255))";

                con.query(sql, function (err, result) {
                    if (err) throw err;
                    // console.log("Table created");
                });
              
                //delete all records
                con.query("DELETE from agent where agent_id_from_url=?", moxiWorksAgentId, function (err, result) {
                    if (err) throw err;
                    console.log("Table id records deleted",moxiWorksAgentId);
                });

            })
        }
        sqlStatementsInitial();
        // make this as a function with necessary params and return a callaback
        function getDataForUrl(currentPage, callback) {
            // console.log("first");
            // console.log(currentPage);
            // console.log(totalpagesInUrl);
            if (currentPage < totalpagesInUrl) {
                currentPage++;
                req.body["page_number"] = currentPage;
                let url1 = 'https://api.moxiworks.com/api/agents/?';
                moxiWorksAgentId = req.body.moxi_works_agent_id;
                let data = JSON.stringify(req.body);

                for (let i = 0; i < data.length; i++) {
                    data = data.replace(',', '&');
                    data = data.replace(':', '=');
                    data = data.replace('{', '');
                    data = data.replace('}', '');
                    data = data.replace('"', '');
                }
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

        // make this as a function with necessary params and return a callaback
        function getBodyFromUrl(callback) {
            // console.log("gettinng options",options);  
            request(options, function (err, response, body) {
                //  console.log("request");
                if (err) throw err;
                let parsed_data = JSON.parse(body);
                const total_pages = parsed_data.total_pages;
                // console.log('parsed_data.total_pages:',parsed_data.total_pages);
                totalpagesInUrl = total_pages;
                log = parsed_data["agents"];

                //  return log;
                callback();
            });
        }



        // sqlStatementsInitial(function(){
        //     console.log("extra function")
        // });

        function sqlStatements(callback) {
            //  console.log("third");
            con.getConnection(function (err) {
                if (err) throw err;
                // ? modify to async.each =? in finallcallba use cb();
                async.each(log, (i, cb) => {
                    let values = [];
                    values.push([i.moxi_works_agent_id, i.client_agent_id, i.mls_agent_id, i.license, i.mls_name, i.mls_abbreviation, i.moxi_works_office_id, i.office_id, i.client_office_id, i.company_id, i.client_company_id, i.office_address_street, i.office_address_street2, i.office_address_city, i.office_address_state, i.office_address_zip, i.name, i.first_name, i.last_name, i.nickname, i.mobile_phone_number, i.alt_phone_number, i.fax_phone_number, i.main_phone_number, i.office_phone_number, i.primary_email_address, i.secondary_email_address, i.lead_routing_email_address, i.title, i.uuid, i.has_product_access, i.has_engage_access, i.access_level, i.website_base_url, i.twitter, i.google_plus, i.facebook, i.instagram, i.blogger, i.youtube, i.linked_in, i.pinterest, i.home_page, i.profile_image_url, i.profile_thumb_url, i.region, i.created_timestamp, i.deactivated_timestamp, moxiWorksAgentId]);

                    // insert query  
                    con.query("REPLACE INTO agent VALUES ?", [values], function (err, result) {
                        // console.log("insetion completed with err:",err);
                        if (err) throw err;
                        // console.log("inside insert")
                        // return result;                                   
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
            var arr = [];
            con.getConnection(function (err) {
                if (err) throw err;
                let start = parseInt(req.query.start);
                let end = parseInt(req.query.end);
                // console.log("start and end values",start,end)
                con.query("SELECT * FROM agent where agent_id_from_url=?", moxiWorksAgentId, function (err, result, fields) {
                    if (err) throw err;
                    // console.log("inside select mysql")
                    for (let i = start; i < end; i++) {
                        arr.push(result[i]);
                        if (i == result.length) {
                            break;
                        }

                    }
                    res.send({ res: arr, length: result.length })
                    callback();
                });
            })
        }
        getrecords(function (err, data) {
            //    console.log("finished")
        })
    }
    self.getAllRecords = (req, res) => {
        con.getConnection(function (err) {
            if (err) throw err;
            // console.log("start and end values",start,end)
            con.query("SELECT * FROM agent where agent_id_from_url=?", moxiWorksAgentId, function (err, result, fields) {
                if (err) throw err;
                res.send(result)

            });
        })

    }

    return self;
}();
