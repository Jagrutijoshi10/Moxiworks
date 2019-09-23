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
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "moxiWorks"
});

module.exports = function () {
    let self = {};
    self.getdata = (req, res) => {
        function createTable() {
            var sql = "CREATE TABLE agent (moxi_works_agent_id varchar(200) PRIMARY KEY,client_agent_id varchar(200),mls_agent_id varchar(200),license varchar(200),mls_name varchar(200),mls_abbreviation varchar(200),moxi_works_office_id varchar(200),office_id varchar(200),client_office_id varchar(200),company_id varchar(200),client_company_id varchar(200),office_address_street varchar(200),office_address_street2 varchar(200),office_address_city varchar(200),office_address_state varchar(200),office_address_zip varchar(200),name varchar(200),first_name varchar(200),last_name varchar(200),nickname varchar(200),mobile_phone_number varchar(200),alt_phone_number varchar(200),fax_phone_number varchar(200),main_phone_number varchar(200),office_phone_number varchar(200),primary_email_address varchar(200),secondary_email_address varchar(200),lead_routing_email_address varchar(200),title varchar(200),uuid varchar(200),has_product_access varchar(200),has_engage_access varchar(200),access_level varchar(200),website_base_url varchar(200),twitter varchar(200),google_plus varchar(200),facebook varchar(200),instagram varchar(200),blogger varchar(200),youtube varchar(200),linked_in varchar(200),pinterest varchar(200),home_page varchar(200),profile_image_url varchar(200),profile_thumb_url varchar(200),region varchar(200),created_timestamp varchar(200),deactivated_timestamp varchar(200))";
            con.getConnection(function () {
                con.query(sql, function () {
                    // console.log("table created")
                })
            })
        }
   
createTable();
    // let currentPage = 0;
    let totalPagesInMoxiWorks = 1;
    var log = {};
    function getDataFromUi(currentPage,callback) {
        // console.log(currentPage, totalPagesInMoxiWorks);
        // console.log("first")
      
            if(currentPage <totalPagesInMoxiWorks){
            currentPage++;
            req.body["page_number"] = currentPage;
            let data = req.body;
            let url = "https://api.moxiworks.com/api/agents/?";
            data = JSON.stringify(req.body);
            data = data.replace(/:/g, "=");
            data = data.replace(/,/g, "&");
            data = data.replace(/,|{|}|"/g, "");
            let completeUrl = url + data;
            // console.log(completeUrl)
            options.url = completeUrl;
            // console.log(options);
            getDataFromMoxiUrl(function () {
                // console.log("second call")
                insertionInMysql(function () {
                    // console.log("third call")
                    getDataFromUi(currentPage,callback);
                })
            })
        }else{
             callback();
        }
   
    }

    function getDataFromMoxiUrl(callback) {
        // console.log("second");
        request(options, (err, response, body) => {
            let pd = JSON.parse(body);
            totalPagesInMoxiWorks=pd.total_pages;
            pd.total_pages=2;
            // console.log(totalPagesInMoxiWorks)
            log = pd["agents"];
            callback();

        })
    }
    function insertionInMysql(callback) {
        // console.log("third")
        con.getConnection(function (req, res, err) {
            if (err) throw err;
            //    createTable();
            
            _.each(log, (i) => {
                let values = [];
                values.push([i.moxi_works_agent_id, i.client_agent_id, i.mls_agent_id, i.license, i.mls_name, i.mls_abbreviation, i.moxi_works_office_id, i.office_id, i.client_office_id, i.company_id, i.client_company_id, i.office_address_street, i.office_address_street2, i.office_address_city, i.office_address_state, i.office_address_zip, i.name, i.first_name, i.last_name, i.nickname, i.mobile_phone_number, i.alt_phone_number, i.fax_phone_number, i.main_phone_number, i.office_phone_number, i.primary_email_address, i.secondary_email_address, i.lead_routing_email_address, i.title, i.uuid, i.has_product_access, i.has_engage_access, i.access_level, i.website_base_url, i.twitter, i.google_plus, i.facebook, i.instagram, i.blogger, i.youtube, i.linked_in, i.pinterest, i.home_page, i.profile_image_url, i.profile_thumb_url, i.region, i.created_timestamp, i.deactivated_timestamp]);
                // insert query
                con.query("INSERT IGNORE INTO agent VALUES ?", [values], function (err, result) {
                    // console.log("insetion completed with err:", err);
                });
                con.query("INSERT IGNORE INTO agent_log VALUES ?", [values], function (err, result) {
                    // console.log("insetion completed with err:", err);
                });
               
            } ,callback())
           
        });
       

    }

    getDataFromUi(0,function () {
        // console.log("one time completed");
        res.send({message:"data sent"})

    });
  
}
self.getrecords = (req, res) => {
    //select query
    var arr = [];
    let start = parseInt(req.query.start);
    let end = parseInt(req.query.end);

    con.query("SELECT * FROM agent", function (err, result, fields) {
        if (err) throw err;

        for (let i = start; i < end; i++) {
            arr.push(result[i]);
            if (i == result.length) {
                break;
            }
        }
        res.send({ res: arr, length: result.length })
    });
}
    return self;
}();










