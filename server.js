var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
var fs = require('fs');
var d3 = require('d3');
var jsdom = require('jsdom');
var moment = require('moment');
var Rsvg = require('librsvg').Rsvg;
var data = [3, 5, 8, 4, 7];
var outputLoc = '';
var timeStamp = '';
//console.log(outputLoc);
var dataTable;
//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test',
  database : 'isuextensions'
});

connection.connect();
connection.query('Select latLng from geoLocation where valId= 1', function(err, rows, fields) {
  if (!err)
  {
 	dataTable = JSON.stringify(rows[0].latLng);
	dataTable = dataTable.replace(/['"]+/g, '');
	data = dataTable.split(',').map(Number);
	console.log(data);
  }
});

connection.end();

app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.bodyParser());

app.post('/myaction', function(req, res) {

  //res.send('You sent the name "' + req.body.name + '".');

module.exports = function( pieData, outputLocation ){
	//console.log("dataTable" + dataTable);
	//data = dataTable.split(",");
	console.log(data);
	var d = new Date();
	timeStamp = d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds();
	if(!pieData) pieData = [12,31];
	if(!outputLocation) outputLocation = "/home/avinash/SVG/test_"+timeStamp+".svg";
	var downloadFile = 'testDownload.pdf'
	jsdom.env({
	    html:'',
	    features:{ QuerySelector:true }, //you need query selector for D3 to work
	    done:function(errors, window){
	    	window.d3 = d3.select(window.document); //get d3 into the dom
		//do yr normal d3 stuff
	    	var svg = window.d3.select('body')
	    		.append('div').attr('class','container') //make a container div to ease the saving process
	    		.append('svg')
	    			.attr({
			      		xmlns:'http://www.w3.org/2000/svg',
			      		width:500,
			      		height:100
			      	});
	    	/* svg.selectAll('.arc')
	    		.data( d3.layout.pie()(pieData) )
	    			.enter()
	    		.append('path')
	    			.attr({
	    				'class':'arc',
	    				'd':arc,
	    				'fill':function(d,i){
	    					return colours[i];
	    				},
	    				'stroke':'#fff'
	    			});
		*/
		// append circles for each data point sized relative to the value
		svg.selectAll('circle')  
		    .data(data)
		    .enter()
			.append('circle')
			.attr('cx', function (d, i) {
			    return (i + 1) * 100 - 50;
			})
			.attr('cy', svg.attr('height') / 2)
			.attr('r', function (d) {
			    return d * 5;
			});
			    	//write out the children of the container div
		    		fs.writeFileSync(outputLocation, window.d3.select('.container').html()) //using sync to keep the code simple
				outputLoc = outputLocation;
				//res.sendFile("/home/avinash/SVG/test_"+timeStamp+".svg");
				var svg = new Rsvg();
				// When finishing reading SVG, render and save as PNG image. 
				svg.on('finish', function() {
				  console.log('SVG width: ' + svg.width);
				  console.log('SVG height: ' + svg.height);
				  fs.writeFile(downloadFile, svg.render({
				    format: 'pdf',
				    width: 600,
				    height: 400
				  }).data);
				r});
				 
				// Stream SVG file into render instance. 
				fs.createReadStream("/home/avinash/SVG/test_"+timeStamp+".svg").pipe(svg);
				res.download(downloadFile);

				
			}
			});
			
	    	
}

if (require.main === module) {
    module.exports();
}
console.log(timeStamp);

var path = "/home/avinash/SVG";
fs.readdir(path, function(err, items) {
    for (var i=0; i<items.length; i++) {
        var file = path + '/' + items[i];
        console.log("Start: " + file);
 	fs.stat(file, generate_callback(file));
	}
});
function generate_callback(file) {
    return function(err, stats) {
           //console.log(file);
            //console.log(stats["mtime"]);
	    var a = moment();
	    var fileCreationTime = moment(stats["mtime"]);
	    //console.log(a.diff(fileCreationTime,"seconds"));
	    var secondDiff = a.diff(fileCreationTime,"seconds");
	    if(secondDiff >= 86400)
	    {
		console.log(file);
		fs.unlinkSync(file);
	    }
        }
};
});

app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});

