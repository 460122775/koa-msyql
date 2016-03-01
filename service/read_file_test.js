var fs = require('fs');
var iconv = require('iconv-lite')
var file = 'C:/Users/TOSHIBA/Desktop/users.txt';
//readFile(file);
function readFile(file){
    fs.readFile(file,function(err,data){
        if(err){
            console.log(err);
        }else{
            var str = iconv.decode(data,'gbk');
            var strArray = str.replace('\r\n','').split(';');
            var strOne = JSON.parse(strArray[0]);
            console.log(strOne);
            console.log(strOne['id']);
        }
    })
}


function readLines(input, func) {
    var remaining = '';
    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            func(line);
            index = remaining.indexOf('\n');
        }

    });

    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
        }
    });
}

var container = [];
function func(data) {
    container.push(data);
}

var input = fs.createReadStream(file);
//readLines(input, func);