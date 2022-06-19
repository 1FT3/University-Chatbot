var express      = require('express');
var router       = express.Router();
var fs           = require('fs');
var XmlStream = require('no-gyp-xml-stream') 


var stream=fs.createReadStream('XML/Uni1_EK_PK_Uni1V_20210307.xml');
    
var xml = XmlStream(stream);
xml.preserve('Vehicletypecode', true);
xml.collect('subitem');
xml.on("element: Vehicletypecode", function(item){
    console.log(item);
})
