//Three parameters of interest
var SF_Home_Price_Index= {
    title: 'SF Home Price Index',
    id: 'SFXRSA'
};

var SF_Tech_Pulse = {
    title: 'SF Tech Pulse',
    id: 'SFTPGRM157SFRBSF'
};

var UR = {
    title: 'Unemployment Rate',
    id: 'SANF806UR'
};

//Draws default graph
drawGraph('primaryHPI.csv',
        SF_Home_Price_Index, UR,SF_Tech_Pulse);

//Functions to draw situations with different primary graphs
function primarySFXRSA(){
    d3.select("svg").remove();
    console.log("Primary is HPI")
    drawGraph('primaryHPI.csv',
            SF_Home_Price_Index, UR,SF_Tech_Pulse)
}

function primarySFTPGRM157SFRBSF(){
    d3.select("svg").remove();
    console.log("Primary is SF Tech Pulse")
    drawGraph('primaryTechPulse.csv',
        SF_Tech_Pulse, UR, SF_Home_Price_Index)
}

function primarySANF806UR(){
    d3.select("svg").remove();
    console.log("Primary is SF Unemployment")
    drawGraph('primaryUR.csv',
         UR,SF_Tech_Pulse, SF_Home_Price_Index)
}

//Actually draws the graph
function drawGraph(inputData,var1,var2,var3) {
    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 400, bottom: 30, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%d-%b-%y").parse,
        formatDate = d3.time.format("%d-%b-%y"),
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
        .append("div")
            .attr("id", "wrapper")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")")  
        .attr("fill", "gray");

    var lineSvg = svg.append("g"); 

    var focus = lineSvg.append("g") 
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

    grapher(inputData);




    function grapher(inputData){

        //Graphing Primary Graph 1
        d3.csv(inputData, function(error, data) {
            data.forEach(function(d) {
                //Not entirely sure what this does, copied from origianl graph - Saurabh
                d.date = parseDate(d.date);
                d.data1= +d.data1;
            });


            var yAxis = d3.svg.axis().scale(y)
                .orient("left").ticks(5); //yAxis for primary graph

            // Scale the range of the data
            // Sets the axes as well
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y.domain([d3.min(data, function(d) { return d.data1; }), 
                d3.max(data, function(d) { return d.data1; })]);

            x(parseDate('1-Aug-16'))
          

            // Add all the data .
            var path =lineSvg.append("path")
                .data(data)
                .attr("class", "line")
                .attr("d", valueline_1(data));   

            var totalLength = path.node().getTotalLength();

            path
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
                .duration(1000)
                .ease("linear")
                .attr("stroke-dashoffset", 0);

            // Add the correlated data
            var path_corr = lineSvg.append("path")
                .data(data)
                .attr("class", "line")
                .attr("d", valueline_corr_1(data))
                .style('stroke','#FF9000');

            var totalLength = path_corr.node().getTotalLength();

            path_corr
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
                            .transition()
                            .ease('linear')
                            .duration(1500)
                            .delay(1000)
                .attr("stroke-dashoffset", 0);
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
            for(i = 1; i<4; i++){
                focus.append("circle")
                    .attr("class", "y"+i)
                    .style("fill", "none")
                    .style("stroke", "firebrick")
                    .attr("r", 4);
            }
            // place the value at the intersection
            for(i = 1; i<4; i++){
                focus.append("text")
                    .attr("class", "yWhite"+i)
                    .style("stroke", "white")
                    .style("stroke-width", "3.5px")
                    .style("opacity", 0.8)
                    .attr("dx", 8)
                    .attr("dy", "-.3em");
            }
            for(i = 1; i<4; i++){
                focus.append("text")
                    .attr("class", "yBlack"+i)
                    .attr("dx", 8)
                    .attr("dy", "-.3em");
            }
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

                focus.select("circle.y1")
                    .attr("transform",
                          "translate(" + x(d.date) + "," +
                                         y(d.data1) + ")");

                focus.select("circle.y2")
                    .attr("transform",
                          "translate(" + x(d.date) + "," +
                                         y_two(d.data2) + ")");

                focus.select("circle.y3")
                    .attr("transform",
                          "translate(" + x(d.date) + "," +
                                         y_three(d.data3) + ")");


                focus.select("text.yWhite1")
                    .attr("transform",
                          "translate(" + x(d.date) + "," +
                                         y(d.data1) + ")")
                   .text(Math.round(d.data1*100)/100);

                focus.select("text.yWhite2")
                    .attr("transform",
                          "translate(" + x(d.date) + "," +
                                         y_two(d.data2) + ")")
                   .text(Math.round(d.data2*100)/100);

                focus.select("text.yWhite3")
                    .attr("transform",
                          "translate(" + x(d.date) + "," +
                                         y_three(d.data3) + ")")
                   .text(Math.round(d.data3*100)/100);


                focus.select("text.yBlack1")
                    .attr("transform",
                          "translate(" + x(d.date) + "," +
                                         y(d.data1) + ")")
                   .text(Math.round(d.data1*100)/100);

                focus.select("text.yBlack2")
                    .attr("transform",
                          "translate(" + x(d.date) + "," +
                                         y_two(d.data2) + ")")
                   .text(Math.round(d.data2*100)/100);

                focus.select("text.yBlack3")
                    .attr("transform",
                          "translate(" + x(d.date) + "," +
                                         y_three(d.data3) + ")")
                    .text(Math.round(d.data3*100)/100);

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

                focus.select("text.y3")
                    .text(formatDate(d.date));

                focus.select("text.y4")
                    .text(formatDate(d.date));

                focus.select(".x")
                    .attr("transform",
                          "translate(" + x(d.date) + "," +
                                         0 + ")")
                                .attr("y1",y(d.data1))
                               .attr("y2",  550);

                focus.select(".y")
                    .attr("transform",
                          "translate(" + width * -1 + "," +
                                         y(d.data1) + ")")
                               .attr("x2", width + 550);

            }
            primaryBars(data,1,1);
            primaryBars(data,2,1);
          
        });



        //Graphing Secondary Graph 1
        d3.csv(inputData, function(error, data) {
            data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.data2 = +d.data2;
            });

            var yAxis2 = d3.svg.axis().scale(y_two)
                .orient("left").ticks(5); //yAxis for secondary graph 1


            // Scale the range of the data
            // Sets the axes as well
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y_two.domain([d3.min(data, function(d) { return d.data2; }), 
                d3.max(data, function(d) { return d.data2; })]);

            // Add all the data .
            var path = lineSvg.append("path")
                .data(data)
                .attr("class", "line")
                .attr("d", valueline_2(data))
         
           var totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
                .duration(1000)
                .ease("linear")
                .attr("stroke-dashoffset", 0);

            // Add correlated data .
            path_corr = lineSvg.append("path")
                .data(data)
                .attr("class", "line")
                .attr("d", valueline_corr_2(data))
                .style('stroke','#FF9000');


            var totalLength = path_corr.node().getTotalLength();

            path_corr
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
                            .transition()
                            .ease('linear')
                            .duration(500)
                            .delay(1000)
                .attr("stroke-dashoffset", 0);


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
                    .attr('class', 'corrbars')
                    .attr('id','SecondaryGraph1_'+i)
                    .selectAll('rect').data(bardata)
                    .enter().append('rect')
                            .transition()
                                    .ease('linear')
                                    .duration(500)
                                    .delay(1000)
                        .style('fill', '#ECB977')
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
                         .style("opacity", 0.5); 

                        var id={
                            id: '#SecondaryGraph1_'+i,
                            text: var2.title + ' & ' + var1.title + ', '+formatDate(startBar)+' through,'+formatDate(endBar)
                            };
                            $(id.id).on('click', function () {
                                var text = $('#lookup');
                                text.val("" + id.text);
        });
                    }
                    i=i+1
                }
            });
        });



        //Graphing Secondary Graph 2
        d3.csv(inputData, function(error, data) {
            data.forEach(function(d) {
                d.date = parseDate(d.date);
                d.data3 = +d.data3;
            });



            var yAxis3 = d3.svg.axis().scale(y_three)
                .orient("left").ticks(5); //yAxis for secondary graph 2


            // Scale the range of the data
            // Sets the axes as well
            x.domain(d3.extent(data, function(d) { return d.date; }));
            y_three.domain([d3.min(data, function(d) { return d.data3; }), 
                d3.max(data, function(d) { return d.data3; })]);

            //Making main graph
            var path = lineSvg.append("path")
                .data(data)
                .attr("class", "line")
                .attr("d", valueline_3(data));

            var totalLength = path.node().getTotalLength();

            path.attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
                .duration(1000)
                .ease("linear")
                .attr("stroke-dashoffset", 0);
         
            //Making correlated data sets
            var path_corr = lineSvg.append("path")
                .data(data)
                .attr("class", "line")
                .attr("d", valueline_corr_3(data))
                .style('stroke','#FF9000');

            var totalLength = path_corr.node().getTotalLength();

            path_corr
              .attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
                            .transition()
                            .ease('linear')
                            .duration(500)
                            .delay(1000)
                .attr("stroke-dashoffset", 0);



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
                            .attr('class', 'corrbars')
                            .attr('id','SecondaryGraph2_'+i)
                            .selectAll('rect').data(bardata)
                        .enter()
                        .append('rect')
                            .transition()
                            .ease('linear')
                            .duration(500)
                            .delay(1000)
                            .style('fill', '#ECB977')
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
                             .style("opacity", 0.5);   

                            var id='#SecondaryGraph2_'+i;
                            $(function () {
                            $(id).on('click', function () {
                                var text = $('#lookup');
                                text.val("" + var3.title + ' & ' + var1.title + ', '+formatDate(startBar)+' through,'+formatDate(endBar));
                                });
                        });  
                    }
                    i=i+1
                }
            });


        });

    }


    //Calls the draw title function
    drawTitle(var1,0);
    drawTitle(var2,325);
    drawTitle(var3,450);

/*    //Draw the title
    svg.append("text")
        .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ 0+","+-30+")")  // text is drawn off the screen top left, move down and out and rotate
        .attr("class","overalltitle")
        .text("Comparallel");

    //Probably a better wy to do this, but moves the SVG canvas down
    svg.style('background', '#C9D7D6')
    svg.style('fill', '#536870')
    svg.attr("transform", 
                  "translate(" + 40 + "," + 75+ ")");*/

    //Draws the title information (Graph title, make priamary button, source)
    function drawTitle(measure,height){
        svg.append("text")
                    .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ 575 +","+height+")")  // text is drawn off the screen top left, move down and out and rotate
                    .attr("class","graphtitle")
                    .text(measure.title);

        svg.append("text")
                    .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ 575 +","+(height+15)+")")  // text is drawn off the screen top left, move down and out and rotate
                    .attr("class","graphsubtitle")
                    .append("a")
                    .attr("onclick", "primary"+measure.id+"()")
                    .text('make primary');

        svg.append("text")
            .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ 670 +","+(height+15)+")")  // text is drawn off the screen top left, move down and out and rotate
            .attr("class","graphsubtitle")
            .append("a")
            .attr("xlink:href", "https://fred.stlouisfed.org/series/"+measure.id)
            .attr("xlink:show", "new")
            .text("source");

        svg.append("circle")
            .attr("cx", 662.5)
            .attr("cy", height+12.5)
            .attr("r", 2)
            .attr('fill','#CA7E00')
    }

    //Function that maps the Corr Bars on the Primary Graph
    function primaryBars(data,flag_index,i){
                data.forEach(function(d) {
                    console.log(flag_index);
                    if(flag_index==1){
                        flag=d.flag1;
                    }
                    else{
                        flag=d.flag2;
                    }
                    if(flag==(i % 2)){
                        if((i % 2)==1){
                            startBar=d.date;

                        }
                        else{
                            endBar=d.date;
                            lineSvg.append('g')

                                .attr('width', width)
                                .attr('height', height)
                                .attr('class', 'corrbarsPrimary')
                                .selectAll('rect').data(bardata)
                            .enter()
                            .append('rect')
                                .transition()
                                .ease('linear')
                                .duration(500)
                                .delay(1000)
                                .attr('width', x(endBar)-x(startBar) )
                                .attr('height', function(d) {
                                    return yScale(d);
                                })
                                .attr('x', function(d,i) {
                                    return x(startBar);
                                })
                                .attr('y', function(d) {
                                    return 0;
                                });                        }
                        i=i+1
                    }
                });
            }

}

