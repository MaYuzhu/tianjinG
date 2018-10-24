var express = require('express');


var app = express();
app.use(express.static('public'));


app.listen(3001,function () {
    console.log('天津港启动~');
})