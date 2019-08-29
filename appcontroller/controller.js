"use strict";
const request = require('request');
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

module.exports=function (err){
    if(err) throw err;
    let self={};
    self.getdata =(req, res) => {
        let url1 = 'https://api.moxiworks.com/api/agents/?';
        data = JSON.stringify(req.body);
        for (i = 0; i < data.length; i++) {
            data = data.replace(',', '&');
            data = data.replace(':', '=');
            data = data.replace('{', '');
            data = data.replace('}', '');
            data = data.replace('"', '');
        }
         url = "url";
        let value = url1 + data;
        options.url = value;
        //    console.log(typeof(data))  
        request(options, function (err, response, body) {
            res.send(body);
        }).catch(error => {
            console.log(error);
          });
    }
   return self;     
}();
