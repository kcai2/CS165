//margins
var margin = {
        top: 20,
        right: 100,
        bottom: 30,
        left: 50
    },
    width = 950 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//full year formatting 
var parseDate = d3.time.format("%Y").parse;

//x scale 
var x = d3.time.scale()
    .range([0, width]);
//y scale
var y = d3.scale.linear()
    .range([height, 0]);

//define color scale
var color = d3.scale.category10();

//draw grid lines x direction
var gridXAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10);

//draw grid lines y direction
var gridYAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

// line properties
var line = d3.svg.line()
    .interpolate("basis")
    .x(function (d) {
        return x(d.Date);
    })
    .y(function (d) {
        return y(d.energy);
    });


//svg margin set
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//read in data from the comma seperated values files + all d3 
d3.csv("EPC_2000_2010_new.csv", function(error, data) {
    if (error)
            throw error;

    color.domain(d3.keys(data[0]).filter(function (key) {
        return key !== "Date";
    }));

    data.forEach(function (d) {
        d.Date = parseDate(d.Date);
    });

    var cities = color.domain().map(function (name) {
        return {
            name: name,
            values: data.map(function (d) {
                return {
                    Date: d.Date,
                    energy: +d[name]
                };
            })
        };
    });

    x.domain(d3.extent(data, function (d) {
        return d.Date;
    }));

    y.domain([
        d3.min(cities, function (c) {
            return d3.min(c.values, function (v) {
                return v.energy;
            });
        }),
        d3.max(cities, function (c) {
            return d3.max(c.values, function (v) {
                return v.energy;
            });
        })
    ]);

    //draw x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(gridXAxis);
    
    //x-axis label
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Years");
    
    //draw y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(gridYAxis);
    
    //y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Energy Consumption per Capita (Million BTUs per person)");
    
    //takes country and line data from file
    var country = svg.selectAll(".country")
        .data(cities)
        .enter().append("g")
        .attr("class", "country");

    //draw country lines
    country.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            return color(d.name);
        });
    
    //country name
    country.append("text")
        .datum(function (d) {
            return {
                name: d.name,
                value: d.values[d.values.length - 1]
            };
        })
        .attr("transform", function (d) {
            return "translate(" + x(d.value.Date) + "," + y(d.value.energy) + ")";
        })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        });

//Initially set the lines to not show with opacity set to 0	
d3.selectAll(".line").style("opacity", "0");

var path = svg.selectAll(".country").append("path")
    .attr("class", "line")
    .attr("d", function (d) {
        return line(d.values);
    })
      .style("stroke", function(d) { 
          return color(d.name); 
      });

    
    
// design using the entire length of the line to time how long the animation is
var totalLength = [path[0][0].getTotalLength(), path[0][1].getTotalLength(), path[0][2].getTotalLength(), path[0][3].getTotalLength(), path[0][4].getTotalLength(), path[0][5].getTotalLength()];

console.log(totalLength);
//transition enables animation
//ease for smoother animation
//duration 5000 = slow animation time
d3.select(path[0][0])
    .attr("stroke-dasharray", totalLength[0] + " " + totalLength[0])
    .attr("stroke-dashoffset", totalLength[0])
    .transition()
    .duration(5000)
    .ease("linear")
    .attr("stroke-dashoffset", 0); 

d3.select(path[0][1])
    .attr("stroke-dasharray", totalLength[1] + " " + totalLength[1])
    .attr("stroke-dashoffset", totalLength[1])
    .transition()
    .duration(5000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

d3.select(path[0][2])
    .attr("stroke-dasharray", totalLength[2] + " " + totalLength[2])
    .attr("stroke-dashoffset", totalLength[2])
    .transition()
    .duration(5000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

d3.select(path[0][3])
    .attr("stroke-dasharray", totalLength[3] + " " + totalLength[3])
    .attr("stroke-dashoffset", totalLength[3])
    .transition()
    .duration(5000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

d3.select(path[0][4])
    .attr("stroke-dasharray", totalLength[4] + " " + totalLength[4])
    .attr("stroke-dashoffset", totalLength[4])
    .transition()
    .duration(5000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);

d3.select(path[0][5])
    .attr("stroke-dasharray", totalLength[5] + " " + totalLength[5])
    .attr("stroke-dashoffset", totalLength[5])
    .transition()
    .duration(5000)
    .ease("linear")
    .attr("stroke-dashoffset", 0);
    
});