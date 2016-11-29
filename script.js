/*Variables that program will sort through
    Title: title of variable
    ID: ID on the FRED Website
    Description: Tooltip description*/
var SF_Home_Price_Index= {
    title: 'SF Home Price Index', 
    id: 'SFXRSA',
    description: "The HPI is a broad measure of the movement of single-family house prices. The HPI is a weighted, repeat-sales index, meaning that it measures average price changes in repeat sales or refinancings on the same properties.",
    measure: 'Index'
};

var SF_Tech_Pulse = {
    title: 'SF Tech Pulse',
    id: 'SFTPGRM157SFRBSF',
    description: "The Tech Pulse Index is an index of coincident indicators of activity in the U.S. information technology sector. The indicators used are investment in IT goods, consumption of personal computers and software, employment in the IT sector, as well as industrial production of and shipments by the technology sector.",
    measure: 'Index'
};

var UR_SF = {
    title: 'Unemployment Rate',
    id: 'SANF806UR',
    description: "The unemployment rate is a measure of the prevalence of unemployment and it is calculated as a percentage by dividing the number of unemployed individuals by all individuals currently in the labor force.",
    measure: 'Percent'
};

//Three parameters of interest
var Seattle_Home_Price_Index= {
    title: 'Seattle Home Price Index',
    id: 'SEXRSA',
    description: "The HPI is a broad measure of the movement of single-family house prices. The HPI is a weighted, repeat-sales index, meaning that it measures average price changes in repeat sales or refinancings on the same properties.",
    measure: 'Index'

};

var Seattle_ECI = {
    title: 'Seattle Economic Conditions Index',
    id: 'STWAGRIDX',
    description: "The economic activity index measures average economic growth in the metropolitan area. It is computed using a dynamic factor model that includes 12 variables measuring various aspects of economic activity in the MSA.",
    measure: "Percent"
};

//Draws default graph
drawGraph('primaryHPISF.csv',
        SF_Home_Price_Index, UR_SF,SF_Tech_Pulse);

//Functions to draw situations with different primary graphs
function primarySFXRSA(){
    d3.select("svg").remove();
    console.log("Primary is SF HPI")
    drawGraph('primaryHPISF.csv',
            SF_Home_Price_Index, UR_SF,SF_Tech_Pulse)
}

function primarySFTPGRM157SFRBSF(){
    d3.select("svg").remove();
    console.log("Primary is SF Tech Pulse")
    drawGraph('primaryTechPulse.csv',
        SF_Tech_Pulse,
        SF_Home_Price_Index,Seattle_Home_Price_Index)
}

function primarySANF806UR(){
    d3.select("svg").remove();
    console.log("Primary is SF Unemployment")
    drawGraph('primaryURSF.csv',
         UR_SF,SF_Tech_Pulse, SF_Home_Price_Index)
}

function primarySEXRSA(){
    d3.select("svg").remove();
    console.log("Primary is Seattle HPI")
    drawGraph('primaryHPISeattle.csv',
         Seattle_Home_Price_Index,
         Seattle_ECI, SF_Tech_Pulse)
}

function primarySTWAGRIDX(){
    d3.select("svg").remove();
    console.log("Primary is Seattle ECI")
    drawGraph('primaryECISeattle.csv',
         Seattle_ECI,
         Seattle_Home_Price_Index, SF_Tech_Pulse)
}

//Actually draws the graph
function drawGraph(inputData,var1,var2,var3) {
    // Set the dimensions of the canvas / graph
    var margin = {top: 0, right: 400, bottom: 30, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%Y-%m-%d").parse,
        formatDate = d3.time.format("%d-%b-%y"),
        bisectDate = d3.bisector(function(d) { return d.date; }).left;

    //Determines the height and spacing of the graphs
    primaryHeight = 250;
    secondaryHeight = 90;
    graphSpacing = 75;
    leftGraphSpacing = 50;
    //Variables that help future code be cleaner, accomplishes the same as above
    primaryHeight1_1 = graphSpacing;
    primaryHeight1_2 = primaryHeight1_1+primaryHeight;

    secondaryHeight1_1 = primaryHeight1_2+graphSpacing;
    secondaryHeight1_2 = secondaryHeight1_1+secondaryHeight

    secondaryHeight2_1 = secondaryHeight1_2+graphSpacing;
    secondaryHeight2_2 =  secondaryHeight2_1+secondaryHeight;

    // Set the ranges
    var x = d3.time.scale().range([leftGraphSpacing, width+leftGraphSpacing]);
    var y = d3.scale.linear().range([primaryHeight1_2, primaryHeight1_1]); //Range for primary graph
    var y_two = d3.scale.linear().range([secondaryHeight1_2, secondaryHeight1_1]); //Range for secondary graph 1
    var y_three = d3.scale.linear().range([secondaryHeight2_2, secondaryHeight2_1]); //Range for secondary graph 2

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

    var focus = svg.append("g") 
        .style("display", "none");

    var bardata = [180];
    var yScale = d3.scale.linear()
            .domain([0, d3.max(bardata)])
            .range([0, primaryHeight])

    var yScale_secondary = d3.scale.linear()
            .domain([0, d3.max(bardata)])
            .range([0, secondaryHeight])

    //Not entirely sure what the height term does
    //Width is width of the graphs
    var height = 400,
        width = 600,
        barWidth = 50,
        barOffset = 5;

    //Calls the actual graphing function
    grapher(inputData);




    function grapher(inputData){

        //Graphing Primary Graph 1
        d3.csv(inputData, function(error, data) {
            data.forEach(function(d) {
                //Not entirely sure what this does, copied from origianl graph - Saurabh
                d.date = parseDate(d.date);
                d.data1= +d.data1;
                d.data2 = +d.data2;
                d.data3 = +d.data3;
            });


        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(10); //yAxis for primary graph

        // Scale the range of the data
        // Sets the axes as well
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([d3.min(data, function(d) { return d.data1; }), 
            d3.max(data, function(d) { return d.data1; })]);

          

        // Add all the data .
        var path =lineSvg.append("path")
            .data(data)
            .attr("class", "line")
            .attr("d", valueline_1(data));   
        //Function to add path animation
        pathAnimation(path)

  

        // Add the correlated data
        var path_corr = lineSvg.append("path")
            .data(data)
            .attr("class", "line")
            .attr("d", valueline_corr_1(data))
            .style('stroke','#FF9000');

        //Function to add path animation
        pathCorrAnimation(path_corr)




        /*I got the following from the online Bl.ocks I pulled this
        off of*/

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + primaryHeight1_2+ ")")
            .call(xAxis)
                        .selectAll("text")
                .style("font-size","11px");;

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+leftGraphSpacing+"," + 0+ ")")
            .call(yAxis)
            .selectAll("text")
                .style("font-size","11px");;

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
            .attr("x1", 0)
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
                .style("opacity", 0.5)
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
            .attr("height", primaryHeight)
            .attr("transform",
                      "translate(" + 0 + "," +
                                     graphSpacing + ")")
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        //Function that does mouse move action
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
                           .attr("y2",  secondaryHeight2_2);
//y1 = y(d.data1)if you only want dashed line to go up to line instead of through
            focus.select(".y")
                .attr("transform",
                      "translate(" + 0+ "," +
                                     y(d.data1) + ")")
                           .attr("x2", x(d.date));

        }
//x2=550 if you only want dashed line to go through line instead of to

        //Used to call method for graphing corr bars on primary graph
/*            primaryBars(data,1,1);
            primaryBars(data,2,1);*/
          
        //SECONDARY GRAPH 1 STARTS HERE
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

        // Add correlated data .
        path_corr = lineSvg.append("path")
            .data(data)
            .attr("class", "line")
            .attr("d", valueline_corr_2(data))
            .style('stroke','#FF9000');
     
        //Animation for correlated paths
        pathAnimation(path);
        pathCorrAnimation(path_corr)



        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + secondaryHeight1_2 + ")")
            .call(xAxis)
                        .selectAll("text")
                .style("font-size","11px");;

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+leftGraphSpacing+"," + 0+ ")")
            .call(yAxis2)
                        .selectAll("text")
                .style("font-size","11px");;

            //For Loop to Add Transparent Bars
            var startBar;
            var endBar;
            var i=1;
        data.forEach(function(d) {
            /*Logic to check if looking for 1 (start flag)
            or looking for 0 (end flag)*/
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
                            .style("opacity",0)           
                            .transition()
                                .ease('linear')
                                .duration(1000)
                                .style("opacity",1)
/*                            .transition()
                                .ease('linear')
                                .duration(500)
                                .delay(1000)
*/                       .style('fill', '#ECB977')
                        .attr('width', x(endBar)-x(startBar) )
                        .attr('height', function(d) {
                            return yScale_secondary(d);
                        })
                        .attr('x', function(d,i) {
                            return x(startBar);
                        })
                        .attr('y', function(d) {
                            return secondaryHeight1_1;
                        })
                         .style("opacity", 0.5); 

                    var id={
                            id: '#SecondaryGraph1_'+i,
                            text: var2.title + ' & ' + var1.title + ', '+formatDate(startBar)+' through '+formatDate(endBar)
                        };
                        $(id.id).on('click', function () {
                                var text = $('#lookup');
                                text.val("" + id.text);
                            });
                }
                i=i+1
            }
        });



    //SECONDARY GRAPH 2 STARTS HERE




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


     
        //Making correlated data sets
        var path_corr = lineSvg.append("path")
            .data(data)
            .attr("class", "line")
            .attr("d", valueline_corr_3(data))
            .style('stroke','#FF9000');

        //Call animation function
        pathAnimation(path);
        pathCorrAnimation(path_corr);


        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + secondaryHeight2_2 + ")")
            .call(xAxis)
            .selectAll("text")
                .style("font-size","11px");

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+leftGraphSpacing+"," + 0+ ")")
            .call(yAxis3)
            .selectAll("text")
                .style("font-size","11px");


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
                            .style("opacity",0)           
                            .transition()
                                .ease('linear')
                                .duration(1000)
                                .style("opacity",1)
                            .style('fill', '#ECB977')
                            .attr('width', x(endBar)-x(startBar) )
                            .attr('height', function(d) {
                                return yScale_secondary(d);
                            })
                            .attr('x', function(d,i) {
                                return x(startBar);
                            })
                            .attr('y', function(d) {
                                return secondaryHeight2_1;
                            })
                             .style("opacity", 0.5);   
                    var id={
                            id: '#SecondaryGraph2_'+i,
                            text: var3.title + ' & ' + var1.title + ', '+formatDate(startBar)+' through '+formatDate(endBar)
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

    }


    //Calls the draw title function
    drawTitle(var1,primaryHeight1_1);
    drawTitle(var2,secondaryHeight1_1);
    drawTitle(var3,secondaryHeight2_1);
    drawYAxisLabel(var3.measure,(primaryHeight1_1+primaryHeight1_2)/2);
    drawYAxisLabel(var2.measure,(secondaryHeight1_1+secondaryHeight1_2)/2);
    drawYAxisLabel(var3.measure,(secondaryHeight2_1+secondaryHeight2_2)/2);
    drawLegend();

    svg.append("text")
        .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (leftGraphSpacing+width)/2 +","+(secondaryHeight2_2+graphSpacing/1.5)+")")  // text is drawn off the screen top left, move down and out and rotate
        .attr("class","yAxisTitle")
        .text("Time");

            svg.append("line")
            .attr("transform", "translate("+ (width+42.5+Xshift) +","+(Yshift+12.5)+")")  // text is drawn off the screen top left, move down and out and rotate
            .attr("class","yAxisTitle")
        .text("Time");



    //Function that draws legends and associated elements
    function drawLegend(){
        Xshift=-15;
        Yshift=10
        svg.append("rect")
            .attr("transform", "translate("+ (width+42.5+Xshift) +","+(Yshift-2.5)+")")  // text is drawn off the screen top left, move down and out and rotate
            .attr("class","legendBox")
            .attr("width", 20)
            .attr("height", 30);

        svg.append("text")
            .attr("text-anchor", "center")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("class","legendText")
            .attr("transform", "translate("+ (width+70+Xshift) +","+(Yshift+12.5)+")")  // text is drawn off the screen top left, move down and out and rotate
            .text("Correlated Areas");

        svg.append("text")
            .attr("text-anchor", "center")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("class","legendSubText")
            .attr("transform", "translate("+ (width+70+Xshift) +","+(Yshift+22.5)+")")  // text is drawn off the screen top left, move down and out and rotate
            .text("R-Squared > 0.95 (min. 10 observations)");
        
        svg.append("rect")
            .attr("transform", "translate("+ (width+35+Xshift) +","+(Yshift-7.5)+")")  // text is drawn off the screen top left, move down and out and rotate
            .attr("class","legendOutline")
            .attr("width", 190)
            .attr("height", 40);

      svg.append("line")
            .attr("transform", "translate("+ -20 +","+(primaryHeight1_2+25)+")")  // text is drawn off the screen top left, move down and out and rotate
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", width+leftGraphSpacing/2)
                .attr("y2", 0)               
                .style("stroke-dasharray", "10,5")       
                .attr("stroke-width", 1)
                .attr("stroke",'#FF9000');
  

        svg.append("line")
                   .attr("transform", "translate("+ (width+42.5+Xshift) +","+(Yshift+12.5)+")")  // text is drawn off the screen top left, move down and out and rotate
                       .attr("x1", 0)
                       .attr("y1", 0)
                       .attr("x2", 20)
                       .attr("y2", 0)                       
                       .attr("stroke-width", 2)
                       .attr("stroke",'#FF9000 ');
    }

    //Draws titles, subtitle buttons and associated elements
    function drawTitle(measure,height){

        var div = d3.select("body").append("div")   
            .attr("class", "tooltip")               
            .style("opacity", 0);
        
        height = height -30;
                svg.append("text")
                    .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ 0+","+height+")")  // text is drawn off the screen top left, move down and out and rotate
                    .attr("class","graphtitle")
                    .text(measure.title)
                                        .on("mouseover", function(d) {       
                        div.transition()        
                        .duration(200)      
                        .style("opacity", .9);      
                        div.html(measure.description)  
                        .style("left", (width+leftGraphSpacing+25) + "px")     
                        .style("top", (height+graphSpacing-10)+ "px");    
                    })                  
                    .on("mouseout", function(d) {       
                        div.transition()        
                        .style("opacity", 0);   
                    })
                    .style("opacity",0)           
                    .transition()
                                .ease('linear')
                                .duration(1000)
                                .style("opacity",1);


            //Rectangle outline for "Source" button
            svg.append("rect")
                .attr("transform", "translate("+ 2 +","+(height+6)+")")  // text is drawn off the screen top left, move down and out and rotate
                .attr("class","buttonTitle")
                .attr("width", 34)
                .attr("height", 12)                
                .append("text")
                .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ 5 +","+(height+15)+")")  // text is drawn off the screen top left, move down and out and rotate
                .attr("class","graphsubtitle")
                .text("source");
                            //Source button with link interactivity
            svg.append("text")
                .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
                .attr("transform", "translate("+ 5 +","+(height+15)+")")  // text is drawn off the screen top left, move down and out and rotate
                .attr("class","graphsubtitle")
                .append("a")
                .attr("xlink:href", "https://fred.stlouisfed.org/series/"+measure.id)
                .attr("xlink:show", "new")
                .text("source");

        //Flag to check ensure that isn't the first element
        if(height!=(primaryHeight1_1-30)){
            //Rectangle outline for "Make Primary" button
            svg.append("rect")
                .attr("transform", "translate("+ 40 +","+(height+6)+")")  // text is drawn off the screen top left, move down and out and rotate
                .attr("class","buttonTitle")
                .attr("width", 70)
                .attr("height", 12);

            //Make primary button interactivity 
            svg.append("text")
                        .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
                        .attr("transform", "translate("+ 45 +","+(height+15)+")")  // text is drawn off the screen top left, move down and out and rotate
                        .attr("class","graphsubtitle")
                        .append("a")
                        .attr("onclick", "primary"+measure.id+"()")
                        .text('make primary');
        }

    }

    //Function that maps the Corr Bars on the Primary Graph
    function primaryBars(data,flag_index,i){
                data.forEach(function(d) {
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

    //Functions that animate path    
    function pathAnimation(path){
        var totalLength = path.node().getTotalLength();

        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
                .duration(1000)
                .ease("linear")
                .attr("stroke-dashoffset", 0);
        }


    function drawYAxisLabel(axisText,height){
                svg.append("text")
                    .attr("text-anchor", "left")  // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr("transform", "translate("+ -20 +","+height+")")  // text is drawn off the screen top left, move down and out and rotate
                    .attr("class","yAxisTitle")
                    .text(axisText);
    }

    function pathCorrAnimation(path_corr){
        var totalLength = path_corr.node().getTotalLength();

        path_corr
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
                        .transition()
                        .ease('linear')
                        .duration(1500)
                        .delay(1000)
            .attr("stroke-dashoffset", 0);
        }   

}

