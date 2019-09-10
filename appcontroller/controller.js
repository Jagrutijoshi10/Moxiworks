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

var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "moxiWorks"
});

module.exports = function (err) {
    if (err) throw err;
    let self = {};
    let page_count = 0;
    self.getdata = (req, res) => {
        let url1 = 'https://api.moxiworks.com/api/agents/?';
        let data = JSON.stringify(req.body);
        for (let i = 0; i < data.length; i++) {
            data = data.replace(',', '&');
            data = data.replace(':', '=');
            data = data.replace('{', '');
            data = data.replace('}', '');
            data = data.replace('"', '');
        }
        let url = "url";
        let value = url1 + data;
        options.url = value;
        //    console.log(data)
        request(options, function (err, response, body) {
            // console.log(body);
            con.connect(function (err) {
                if (err) throw err;
                console.log("Connected!");

                //create table
                // var sql = "CREATE TABLE agent (moxi_works_agent_id varchar(200),client_agent_id varchar(200),mls_agent_id varchar(200),license varchar(200),mls_name varchar(200),mls_abbreviation varchar(200),moxi_works_office_id varchar(200),office_id varchar(200),client_office_id varchar(200),company_id varchar(200),client_company_id varchar(200),office_address_street varchar(200),office_address_street2 varchar(200),office_address_city varchar(200),office_address_state varchar(200),office_address_zip varchar(200),name varchar(200),first_name varchar(200),last_name varchar(200),nickname varchar(200),mobile_phone_number varchar(200),alt_phone_number varchar(200),fax_phone_number varchar(200),main_phone_number varchar(200),office_phone_number varchar(200),primary_email_address varchar(200),secondary_email_address varchar(200),lead_routing_email_address varchar(200),title varchar(200),uuid varchar(200),has_product_access varchar(200),has_engage_access varchar(200),access_level varchar(200),website_base_url varchar(200),twitter varchar(200),google_plus varchar(200),facebook varchar(200),instagram varchar(200),blogger varchar(200),youtube varchar(200),linked_in varchar(200),pinterest varchar(200),home_page varchar(200),profile_image_url varchar(200),profile_thumb_url varchar(200),region varchar(200),created_timestamp varchar(200),deactivated_timestamp varchar(200))";

                // con.query(sql, function (err, result) {
                //     if (err) throw err;
                //     console.log("Table created");
                // });
               
                let parsed_data = JSON.parse(body);
                let total_pages = parsed_data["total_pages"];
                let log = parsed_data["agents"];
                
                _.each(log, (i) => {
                    // console.log(typeof(i.teams))
                    var values = [];

                    values.push([i.moxi_works_agent_id, i.client_office_id, i.name, i.primary_email_address]);
                   

                   
                        var keys = Object.keys(i)
                        var values=Object.values(i)
                        // console.log(typeof(keys.teams));
                     
                        if(Array.isArray(i.teams)){
                              console.log("dfghj")
                        }


                    //insert query
                    // var sql = "INSERT IGNORE INTO agent(agentid,officeid,name,email) VALUES ?,"
                    // con.query("INSERT IGNORE INTO agent(agentid,officeid,name,email) VALUES ?", [values], function (err, result) {
                    //     if (err) throw err;
                    //     console.log("Table inserted");
                    // });

                    //select query
                    // con.query("SELECT * FROM agent", function (err, result, fields) {
                    //     if (err) throw err;
                    //     // console.log(result);
                    //     res.send({res:result,pages:total_pages});
                    //     // res(null,result);
                    // });
                });

            })
        })
    }
    return self;
}();

