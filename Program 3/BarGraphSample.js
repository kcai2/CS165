/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
// Add comments here in your own words to explain the margins below (.25 point)

// Sets the margins - gives the graph a less cluttered look
var margin = {top: 10, right: 40, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    

// Define SVG. "g" means group SVG elements together.
// Confused about SVG still, see Chapter 3. 
// Add comments here in your own words to explain this segment of code (.25 point)

// Moves the graph over to look more appealing, less cluttered
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// Add comments in your own words to explain the code below (.25 point)

// xScale and yScale are the scale values for each of the axes
// Ordinal because it uses strings instead of number values
var xScale = d3.scale.ordinal()
    // width of the bars + padding
    .rangeRoundBands([0, width], 0.1);

// Linear scale because it uses number values
var yScale = d3.scale.linear()
    // height of the bars used for scale
    .range([height,0]);

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign(1 point)

// xAxis using the scale we provided above
// orient - bottom = ticks show up on the bottom
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")

var yAxis = d3.svg.axis() 
    .scale(yScale)
    .orient("left")
    // added to reduce number of ticks on y axis
    .ticks(3)
    // $ value for intervals
    .tickFormat(function(d) { return "$" + d});

/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 



// data.csv contains the country name(key) and its GDP(value)
// 1 point for explaining the code for reading the data

// each new item read in is stored in d
d3.csv("GDP2016TrillionUSDollars.csv",function(error, data){
    data.forEach(function(d) {
        d.key = d.key;
        d.value = +d.value;
    });

    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    // .25 point for explaining the code below
    /** domain of the x and y values for graph. X being the names of the countreis and Y
        being the values of the numbers 
    **/
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
    // Add comments to explain the code below (no points but there may be a quiz in future)
    
    // selects the bar graphs and gives them attributes/personality
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr("y", height)
        .attr({
            "x": function(d) { return xScale(d.key); },
            "y": function(d) { return yScale(d.value); },
            "width": xScale.rangeBand(),
            "height": function(d) { return  height - yScale(d.value); },
            // create increasing to decreasing shade of blue as shown on the output (2 points)
            // data value multiplied by 50 = blue shade so its more obvious
            "fill": function(d) {
                return "rgb(0, 0, " + Math.round(d.value * 50) + ")";
            }
        });
    
    // Label the data values(d.value) (3 points)
    
    // selects all text for the bar graph number values and gives them attributes
    svg.selectAll("text") 
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.value;
        })
        .attr("text-anchor", "middle")
        // fixes locatoin of the white font numbers representing d values
        .attr({
            "x": function(d) {return xScale(d.key) + 20;},
            "y": function(d) {return yScale(d.value) + 15;},
            "width": xScale.rangeBand(),
            "height": function(d) {return height - yScale(d.value);}
        })
        // format + attributes for bar number values
        .attr("font-family", "times")
        .attr("font-size", "12px")
        .attr("fill", "white");
  
    
    // Draw xAxis and position the label at -60 degrees as shown on the output (1 point)
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        // draws xAxis
        .call(xAxis) 
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        //rotate the label
        .attr("transform", "rotate(-60)");
        
    
    // Draw yAxis and postion the label (2 points)
    svg.append("g")
        .attr("class","y axis")
        // draws yAxis
        .call(yAxis)
    
    //These lines of svg.append are for the Y-axis label
    svg.append("text")
        // Label positioning
        .attr("x", -170)
        .attr("y", -35)
        .style("text-anchor", "middle")
        // Label text
        .text("Trillions of US Dollars ($)")
        // Rotate 90 degrees to match y axis direction
        .attr("transform", "rotate(-90)");
});

        
    