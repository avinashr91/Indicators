// bring in d3 if its not globaly available (e.g. browser side usage)
var d3 = d3 || require('d3');
var jsdom = require('jsdom');
var htmlStub = '<html><head></head><body><div id="dataviz-container"></div><script src="js/d3.v3.min.js"></script></body></html>';
var element =  '#my-visualisation';
jsdom.env({ features : { QuerySelector : true }, html : htmlStub
	, done : function(errors, window) {
	var el = window.document.querySelector('#my-visualisation')
	, body = window.document.querySelector('body')
	
var data = [3, 5, 8, 4, 7];

// create the outer svg
var svg = d3.select(el)  
            .append('svg')
              .attr('height', 100)
              .attr('width', 500);

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

// Export it
if (typeof module !== 'undefined' && module.exports) {  
    module.exports = svg;
}
}
});	
