    //Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    var cValue = function(d) {return d.country;},
        color = d3.scale.category20();

    //Define x scale  
    var xScale = d3.scale.linear()
        .domain([0,16]) //Need to redefine this after loading the data
        .range([0, width]);
    //define y scale
    var yScale = d3.scale.linear()
        .domain([0,450]) //Need to redfine this after loading the data
        .range([height, 0]);
                               
    //setup x
    //data value for x
    var xValue = function(d) {return d.gdp;},
        //display data
        xMap = function(d) {return xScale(xValue(d));},
        xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickPadding(2);
    //setup y
    //data values for y
    var yValue = function(d) {return d.epc;},
        //display data
        yMap = function(d) {return yScale(yValue(d));},
        yAxis = d3.svg.axis().scale(yScale).orient("left").tickPadding(2);   
    
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom
    var zoom = d3.behavior.zoom()
        .x(xScale)
        .y(yScale)
        .scaleExtent([1, 32])
        .on("zoom", zoomed);
    
    //redraws all the circles when you zoom in
    function zoomed() {
        svg.selectAll(".dot")
            .attr("cx", function(d) {return xScale(d.gdp);})
            .attr("cy", function(d) {return yScale(d.epc);});
        svg.selectAll(".text")
            .attr("x", function(d) {return xScale(d.gdp);})
            .attr("y", function(d) {return yScale(d.epc);});
        //redraws the x and y axis
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
    }
    
    //Define SVG
    var svg = d3.select("body")
    
        .append("svg")
    .call(zoom)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        

    //Define Tooltip here
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        //opacity 0 - clear
        .style("opacity", 0);
    
    //Get Data
    // Define domain for xScale and yScale
    d3.csv("scatterdata.csv", function(error, data) {
    data.forEach(function(d){
        d.country = d.country;
        d.gdp = +d.gdp;
        d.epc = +d.epc;
        d.population = +d.population;
        d.total = +d.total;     
    });
    
    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    //Draw Scatterplot
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d)  {return Math.sqrt(d.total)/.2;})
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.epc);})
        .style("fill", function(d) {return color(cValue(d));})
    
    //Add .on("mouseover", .....
    //Add Tooltip.html with transition and style
    //Then Add .on("mouseout", ....
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html(d["country"] + "<br/>" + "Population: " + d["population"] + "              Million" + "<br/>" + "GDP: " + "$" + d["gdp"] + " Trillion" +            "<br/>" + "EPC: " + d["epc"] + " Million BTUs" + "<br/>"
                        + "Total: " + d["total"] + "Trillion BTUs" + "<br/>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    //Draw Country Names
        svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "middle")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.epc);})
        .style("fill", "black")
        .text(function (d) {return d.country; });

    //x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("GDP (in Trillion US Dollars) in 2010");
  
    //Y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .text("Energy Consumption per Capita (in Million BTUs per person)");
    
    // draw legend colored rectangles
    svg.append("rect")
        .attr("x", width-250)
        .attr("y", height-190)
        .attr("width", 220)
        .attr("height", 180)
        .attr("fill", "lightgrey")
        .style("stroke-size", "1px");

    svg.append("circle")
        .attr("r", 5)
        .attr("cx", width-100)
        .attr("cy", height-175)
        .style("fill", "white");
    
    svg.append("circle")
        .attr("r", 15.8)
        .attr("cx", width-100)
        .attr("cy", height-150)
        .style("fill", "white");

    svg.append("circle")
        .attr("r", 50)
        .attr("cx", width-100)
        .attr("cy", height-80)
        .style("fill", "white");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-172)
        .style("text-anchor", "end")
        .text(" 1 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-147)
        .style("text-anchor", "end")
        .text(" 10 Trillion BTUs");

    svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-77)
        .style("text-anchor", "end")
        .text(" 100 Trillion BTUs");
    
     svg.append("text")
        .attr("class", "label")
        .attr("x", width -150)
        .attr("y", height-15)
        .style("text-anchor", "middle")
        .style("fill", "Green") 
        .attr("font-size", "16px")
        .text("Total Energy Consumption");     
});
