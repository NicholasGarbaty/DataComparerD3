
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 400, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse,
    formatDate = d3.time.format("%d-%b"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([300, 0]); //Range for primary graph
var y_two = d3.scale.linear().range([425, 325]); //Range for secondary graph 1
var y_three = d3.scale.linear().range([550, 450]); //Range for secondary graph 2
//Need to eventually change the ranges so it's not hardcoded


// Define the axes
var xAxis = d3.svg.axis().scale(x) //shared xAxis for entire graph
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5); //yAxis for primary graph

var yAxis2 = d3.svg.axis().scale(y_two)
    .orient("left").ticks(5); //yAxis for secondary graph 1

var yAxis3 = d3.svg.axis().scale(y_three)
    .orient("left").ticks(5); //yAxis for secondary graph 2

// Define the line/*

//Main line for primary graph (steelblue)
var valueline_1 = d3.svg.line()
    .x(function(d) { 
        return x(d.date); })
    .y(function(d) {return y(d.data1); })

//Highlighting correlated areas for primary graph (firebrick)
var valueline_corr_1 = d3.svg.line()
    .x(function(d) { 
            return x(d.date); })
    .y(function(d) {
            return y(d.data1); })
    .defined(function(d) { 
        if(d.flag1>0 | d.flag2>0){
            return d; }})

//Main line for secondary graph 1 (steelblue)
var valueline_2 = d3.svg.line()
    .x(function(d) {return x(d.date); })
    .y(function(d) {
        return y_two(d.data2); })

//Highlighting correlated areas for secondary graph 1 (firebrick)
var valueline_corr_2 = d3.svg.line()
    .x(function(d) { 
            return x(d.date); })
    .y(function(d) {
            return y_two(d.data2); })
    .defined(function(d) { 
        if(d.flag1==1){
            return d; }})

//Main line for secondary graph 2 (steelblue)
var valueline_3 = d3.svg.line()
    .x(function(d) {return x(d.date); })
    .y(function(d) {
        return y_three(d.data3); })

//Highlighting correlated areas for secondary graph 2 (firebrick)
var valueline_corr_3 = d3.svg.line()
    .x(function(d) { 
            return x(d.date); })
    .y(function(d) {
            return y_three(d.data3); })
    .defined(function(d) { 
        if(d.flag2==1){
            return d; }})


// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")")  
    .attr("fill", "gray");

var lineSvg = svg.append("g"); 

var focus = svg.append("g") 
    .style("display", "none");

var bardata = [180];
var yScale = d3.scale.linear()
        .domain([0, d3.max(bardata)])
        .range([0, 300])

var yScale_secondary = d3.scale.linear()
        .domain([0, d3.max(bardata)])
        .range([0, 100])

var height = 400,
    width = 600,
    barWidth = 50,
    barOffset = 5;

//Graphing Primary Graph 1
d3.csv("fred_sf.csv", function(error, data) {
    data.forEach(function(d) {
        //Not entirely sure what this does, copied from origianl graph - Saurabh
        d.date = parseDate(d.date);
        d.data1= +d.data1;
    });

    // Scale the range of the data
    // Sets the axes as well
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([d3.min(data, function(d) { return d.data1; }), 
        d3.max(data, function(d) { return d.data1; })]);

    x(parseDate('1-Aug-16'))
  

    // Add all the data .
    lineSvg.append("path")
        .data(data)
        .attr("class", "line")
        .attr("d", valueline_1(data))


    // Add the correlated data
    lineSvg.append("path")
        .data(data)
        .attr("class", "line")
        .attr("d", valueline_corr_1(data))
        .style('stroke','firebrick');

    /*Everything from here to the end of function I'm not sure how it works
    I got it all from the online tutorial */

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 300 + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

   // append the x line
    focus.append("line")
        .attr("class", "x")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);

    // append the y line
    focus.append("line")
        .attr("class", "y")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);

    // append the circle at the intersection
    focus.append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "firebrick")
        .attr("r", 4);

    // place the value at the intersection
    focus.append("text")
        .attr("class", "y1")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    // place the date at the intersection
    focus.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 0.8)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");
    
    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", 300)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        focus.select("circle.y")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.data1) + ")");

        focus.select("text.y1")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.data1) + ")")
            .text(d.data1);

        focus.select("text.y2")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.data1) + ")")
            .text(d.data1);

        focus.select("text.y3")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.data1) + ")")
            .text(formatDate(d.date));

        focus.select("text.y4")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.data1) + ")")
            .text(formatDate(d.date));

        focus.select(".x")
            .attr("transform",
                  "translate(" + x(d.date) + "," +
                                 y(d.data1) + ")")
                       .attr("y2",  height - y(d.data1));

        focus.select(".y")
            .attr("transform",
                  "translate(" + width * -1 + "," +
                                 y(d.data1) + ")")
                       .attr("x2", width + width);
    }

});



//Graphing Secondary Graph 1
d3.csv("fred_sf.csv", function(error, data) {
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.data2 = +d.data2;
    });

    // Scale the range of the data
    // Sets the axes as well
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y_two.domain([d3.min(data, function(d) { return d.data2; }), 
        d3.max(data, function(d) { return d.data2; })]);

    // Add all the data .
    lineSvg.append("path")
        .data(data)
        .attr("class", "line")
        .attr("d", valueline_2(data))
 
    // Add correlated data .
    lineSvg.append("path")
        .data(data)
        .attr("class", "line")
        .attr("d", valueline_corr_2(data))
        .style('stroke','firebrick');


    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 425 + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0," + 0+ ")")
        .call(yAxis2);

    //For Loop to Add Transparent Bars
    var startBar;
    var endBar;
    var i=1;
    data.forEach(function(d) {
        if(d.flag1==(i % 2)){
            if((i % 2)==1){
                startBar=d.date;

            }
            else{
                endBar=d.date;
                    lineSvg.append('g')
            .attr('width', width)
            .attr('height', height)
            .attr('id','SecondaryGraph1_'+i)
            .selectAll('rect').data(bardata)
            .enter().append('rect')
                .style('fill', 'firebrick')
                .attr('width', x(endBar)-x(startBar) )
                .attr('height', function(d) {
                    return yScale_secondary(d);
                })
                .attr('x', function(d,i) {
                    return x(startBar);
                })
                .attr('y', function(d) {
                    return 325;
                })
                 .style("opacity", 0.1875);   
            }
            i=i+1
        }
    });
});



//Graphing Secondary Graph 2
d3.csv("fred_sf.csv", function(error, data) {
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.data3 = +d.data3;
    });

    // Scale the range of the data
    // Sets the axes as well
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y_three.domain([d3.min(data, function(d) { return d.data3; }), 
        d3.max(data, function(d) { return d.data3; })]);

    //Making main graph
    lineSvg.append("path")
        .data(data)
        .attr("class", "line")
        .attr("d", valueline_3(data))
 
    //Making correlated data sets
    lineSvg.append("path")
        .data(data)
        .attr("class", "line")
        .attr("d", valueline_corr_3(data))
        .style('stroke','firebrick');

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 550 + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0," + 0+ ")")
        .call(yAxis3);


    //For Loop to Add Transparent Bars
    var startBar;
    var endBar;
    var i=1;
    data.forEach(function(d) {
        if(d.flag2==(i % 2)){
            if((i % 2)==1){
                startBar=d.date;

            }
            else{
                endBar=d.date;
                    lineSvg.append('g')
            .attr('width', width)
            .attr('height', height)
            .attr('id','SecondaryGraph2_'+i)
            .selectAll('rect').data(bardata)
            .enter().append('rect')
                .style('fill', 'firebrick')
                
                .attr('width', x(endBar)-x(startBar) )
                .attr('height', function(d) {
                    return yScale_secondary(d);
                })
                .attr('x', function(d,i) {
                    return x(startBar);
                })
                .attr('y', function(d) {
                    return 450;
                })
                 .style("opacity", 0.1875);   
            }
            i=i+1
        }
    });


});



//Axes Information
svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 625 +","+150+")")  // text is drawn off the screen top left, move down and out and rotate
            .text("SF Home Price Index");


svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 625 +","+375+")")  // text is drawn off the screen top left, move down and out and rotate
            .text("UR");

svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 625 +","+500+")")  // text is drawn off the screen top left, move down and out and rotate
            .text("SF Tech Pulse");

svg.style('background', '#C9D7D6')
svg.style('fill', '#536870')


$(function () {
    $('#SecondaryGraph1_2').on('click', function () {
        var text = $('#lookup');
        text.val(text.val() + ' after clicking');    
    });
});
$(function () {
    $('#SecondaryGraph1_4').on('click', function () {
        var text = $('#lookup');
        text.val(text.val() + ' after clicking');    
    });
});
$(function () {
    $('#SecondaryGraph1_6').on('click', function () {
        var text = $('#lookup');
        text.val(text.val() + ' after clicking');    
    });
});
$(function () {
    $('#SecondaryGraph1_8').on('click', function () {
        var text = $('#lookup');
        text.val(text.val() + ' after clicking');    
    });
});
$(function () {
    $('#SecondaryGraph2_2').on('click', function () {
        var text = $('#lookup');
        text.val(text.val() + ' after clicking');    
    });
});
$(function () {
    $('#SecondaryGraph2_4').on('click', function () {
        var text = $('#lookup');
        text.val(text.val() + ' after clicking');    
    });
});
$(function () {
    $('#SecondaryGraph2_6').on('click', function () {
        var text = $('#lookup');
        text.val(text.val() + ' after clicking');    
    });
});
$(function () {
    $('#SecondaryGraph2_8').on('click', function () {
        var text = $('#lookup');
        text.val(text.val() + ' after clicking');    
    });
});

