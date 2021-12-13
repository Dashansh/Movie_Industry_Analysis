var width = document.getElementById('vis')
    .clientWidth;
var height = document.getElementById('vis')
    .clientHeight;

var margin = {
    top: 10,
    bottom: 70,
    left: 70,
    right: 20
}

var svg = d3.select('#vis')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var data = {};

var x_scale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y_scale = d3.scaleLinear()
    .range([height, 0]);

var colour_scale = d3.scaleQuantile()
    .range(["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')');

svg.append('g')
    .attr('class', 'y axis');

var filename_rating = {'1950': "https://gist.githubusercontent.com/Dashansh/602044fb4a6623b0e36253e67402e27b/raw/dca4870f7c18f5a623869ef7fa6534cffbe3f74e/genre_1950.csv", '1960': "https://gist.githubusercontent.com/Dashansh/602044fb4a6623b0e36253e67402e27b/raw/dca4870f7c18f5a623869ef7fa6534cffbe3f74e/genre_1960.csv", '1970': "https://gist.githubusercontent.com/Dashansh/602044fb4a6623b0e36253e67402e27b/raw/dca4870f7c18f5a623869ef7fa6534cffbe3f74e/genre_1970.csv", '1980': "https://gist.githubusercontent.com/Dashansh/602044fb4a6623b0e36253e67402e27b/raw/dca4870f7c18f5a623869ef7fa6534cffbe3f74e/genre_1980.csv", '1990': "https://gist.githubusercontent.com/Dashansh/602044fb4a6623b0e36253e67402e27b/raw/dca4870f7c18f5a623869ef7fa6534cffbe3f74e/genre_1990.csv", '2000': "https://gist.githubusercontent.com/Dashansh/602044fb4a6623b0e36253e67402e27b/raw/dca4870f7c18f5a623869ef7fa6534cffbe3f74e/genre_2000.csv", '2010': "https://gist.githubusercontent.com/Dashansh/602044fb4a6623b0e36253e67402e27b/raw/dca4870f7c18f5a623869ef7fa6534cffbe3f74e/genre_2010.csv", '2020': "https://gist.githubusercontent.com/Dashansh/602044fb4a6623b0e36253e67402e27b/raw/dca4870f7c18f5a623869ef7fa6534cffbe3f74e/genre_2020.csv"}

var filename_runtime = {'1950': "https://raw.githubusercontent.com/Dashansh/Movie_Industry_Analysis/main/resources/d3data_runtime/genre_runtime_1950.csv", '1960': "https://raw.githubusercontent.com/Dashansh/Movie_Industry_Analysis/main/resources/d3data_runtime/genre_runtime_1960.csv", '1970': "https://raw.githubusercontent.com/Dashansh/Movie_Industry_Analysis/main/resources/d3data_runtime/genre_runtime_1970.csv", '1980': "https://raw.githubusercontent.com/Dashansh/Movie_Industry_Analysis/main/resources/d3data_runtime/genre_runtime_1980.csv", '1990': "https://raw.githubusercontent.com/Dashansh/Movie_Industry_Analysis/main/resources/d3data_runtime/genre_runtime_1990.csv", '2000': "https://raw.githubusercontent.com/Dashansh/Movie_Industry_Analysis/main/resources/d3data_runtime/genre_runtime_2000.csv", '2010': "https://raw.githubusercontent.com/Dashansh/Movie_Industry_Analysis/main/resources/d3data_runtime/genre_runtime_2010.csv", '2020': "https://raw.githubusercontent.com/Dashansh/Movie_Industry_Analysis/main/resources/d3data_runtime/genre_runtime_2020.csv"}


function draw(year) {
    
    d3.csv(filename_runtime[year]).then(function(csv_data){
      //var csv_data = data[year];

      var t = d3.transition()
          .duration(2000);
  
      var genres = csv_data.map(function(d) {
          return d.genres;
      });
      x_scale.domain(genres);
  
      var max_value = d3.max(csv_data, function(d) {
          return +d.avgruntime;
      });
  
      y_scale.domain([0, max_value]);
      colour_scale.domain([0, max_value]);
  
      var bars = svg.selectAll('.bar')
          .data(csv_data)
  
      bars
          .exit()
          .remove();
  
      var new_bars = bars
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', function(d) {
              return x_scale(d.genres);
          })
          .attr('width', x_scale.bandwidth())
          .attr('y', height)
          .attr('height', 0)
  
      new_bars.merge(bars)
          .transition(t)
          .attr('y', function(d) {
              return y_scale(+d.avgruntime);
          })
          .attr('height', function(d) {
              return height - y_scale(+d.avgruntime)
          })
          .attr('fill', function(d) {
              return colour_scale(+d.avgruntime);
          })
  
      svg.select('.x.axis')
          .call(x_axis);
  
      svg.select('.y.axis')
          .transition(t)
          .call(y_axis);
    })
}




/*
for (let i = 0; i < 6; i++) {
    
 // var filename = "https://gist.githubusercontent.com/Dashansh/bdf65c32297b1057efaf0b00775b24be/raw/e762704be00c23ee920861a9192aab1a188aaba9/" + "monthly_data_"+ year + ".csv";
  
  d3.csv(filename[i]).then(function(d) {
    //console.log(d)
    //d.forEach(r => console.log(r))
    data[(i+2009).toString()] = d
    //console.log(data[(i+2009).toString()])
  });

  //console.log(data[(i+2009).toString()])
}
console.log(data['2009'])
*/

draw('1950')


var slider = d3.select('#year');
slider.on('change', function() {
    draw(this.value);
});