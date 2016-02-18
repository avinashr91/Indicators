var L = require('leaflet-headless');
var data = [];
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
//test comment

connection.connect();
connection.query('Select latLng from geoLocation where valId= 1', function(err, rows, fields) {
  if (!err)
  {
 	dataTable = JSON.stringify(rows[0].latLng);
	dataTable = dataTable.replace(/['"]+/g, '');
	data = dataTable.split(',').map(Number);
	console.log(data);

	console.log(data[0]);

var map = L.map(document.createElement('div')).setView([data[0]	, data[1]], 13);

			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
					'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
					'Imagery © <a href="http://mapbox.com">Mapbox</a>',
				id: 'mapbox.streets'
				
			}).addTo(map);
//map.setSize(800,400);

L.marker([data[0], data[1]]).addTo(map)
			.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();



map.saveImage('test.png', function (filename) {
    console.log('Saved map image to ' + filename);
});
  }
});

connection.end(); 

