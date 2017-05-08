// global variables so they can be used everywhere
var width = 300,
    height = 300,
    barHeight = 100,
    numBars = 5;
var keys = ["CO2", "Humid", "Press", "Mov", "Temp"];

// creating a svg (graphic object) in the div with id=chart
var svg = d3.select('#chart').append("svg")
    .attr("id", "chart_svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");


function setupGraph() {

    // ray of the circles
    var barScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0, barHeight]);

    // axes scale
    var x = d3.scaleLinear()
      .domain([0, 10])
      .range([0, -barHeight]);

    // axes
    var xAxis = d3.axisLeft(x)
      .ticks(10);

    // drawing a circle for each tick of the axis (so 10)
    var circles = svg.selectAll("circle")
          .data(x.ticks(10))
        .enter().append("circle")
          .attr("r", function(d) {return barScale(d);})
          .style("fill", "none")            // css part
          .style("stroke", "black")
          .style("stroke-dasharray", "1,1")
          .style("stroke-width",".5px");

    // drawing the axis line for each parameter (defined by variable "keys" above)
    var lines = svg.selectAll("line")
           .data(keys)
        .enter().append("line")
          .attr("y2", -barHeight - 20)
          .style("stroke", "black")             // css part
          .style("stroke-width",".5px")
          .attr("transform", function(d, i) { return "rotate(" + (i * 360 / numBars) + ")"; });

    // adding the axes to g of svg (content of the svg object)
    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    // distance from the center to which the label will be written
    var labelRadius = barHeight * 1.15;

    var labels = svg.append("g")
        .classed("labels", true);

    labels.append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

    // "drawing" the labels for each parameter
    labels.selectAll("text")
        .data(keys)
      .enter().append("text")
        .style("text-anchor", "middle")         // css part
        .style("font-weight","bold")
        .style("font-size", "10px")
        .style("fill", function(d, i) {return "#3e3e3e";})
        .append("textPath")                     // this represents where/how the label will be written
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d, i) {return i * 100 / numBars + '%';})
        .text(function(d) {return d.toUpperCase(); });

    for (var i = 0; i < sensor.fullData.length; ++i) {
        // local variables (they are initialized inside a for-loop)
        // by default we put values corresponding to when there are no movements (could have done the opposite)
        var color = "black";
        var strokeWidth = ".5px";
        var opacity = 0.5;

        var radialLineGenerator = d3.radialLine();
        // some maths to decide on which ray to draw the data, and to bring the data between [0, 10]
        // radialLine takes as parameters (angle, distance)
        var points = [
            [(5 * 2 * Math.PI) / numBars, sensor.fullData[i].c/45 * barHeight/10],
            [(1 * 2 * Math.PI) / numBars, sensor.fullData[i].h/10 * barHeight/10],
            [(2 * 2 * Math.PI) / numBars, sensor.fullData[i].p/10000 * barHeight/10],
            [(3 * 2 * Math.PI) / numBars, sensor.fullData[i].pp/150 * barHeight/10],
            [(4 * 2 * Math.PI) / numBars, sensor.fullData[i].t/3 * barHeight/10],
            [(5 * 2 * Math.PI) / numBars, sensor.fullData[i].c/45 * barHeight/10]];

        // if there are movements, we change the variables' values
        if(sensor.fullData[i].pp > 0) {
            color = "red";
            strokeWidth = "1px";
            opacity = 1;
        }

        var radialLine = radialLineGenerator(points);
        // drawing the lines
        svg.select('g')
            .append('path')
            .attr("id", "radial")           // giving the id "radial" to the drawing. Since it is in a for-loop, all the data will have that same id
            .style("stroke", color)
            .style("stroke-width", strokeWidth)
            .style("opacity", opacity)
            .attr('d', radialLine);
    }

    // var x = d3.scale.ordinal()
    // .rangeRoundBands([0, width], .1);

    // var y = d3.scale.linear()
    //     .range([height, 0]);

    // var xAxis = d3.svg.axis()
    // .scale(x)
    // .orient("bottom");

    // var yAxis = d3.svg.axis()
    //     .scale(y)
    //     .orient("left");

    // x.domain(sensor.fullData.map(function(d) { return d.timestamp; }));
    // y.domain([0, 1500]);

    // svg.append("g")
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(" + 0 + "," + height + ")")
    //   .call(xAxis)
      

    // svg.append("g")
    //   .attr("class", "y axis")
    //   .call(yAxis)
    // .append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 1)
    //   .attr("dy", ".5em")
    //   .style("text-anchor", "end")
    //   .text("Frequency");

    // svg.selectAll(".bar")
    //   .data(sensor.fullData)
    // .enter().append("rect")
    //   .attr("class", "bar")
    //   .attr("x", function(d) { return x(d.timestamp); })
    //   .attr("width", x.rangeBand())
    //   .attr("y", function(d) { return y(d.pp); })
    //   .attr("height", function(d) { return height - y(d.pp); })

}

function resetGraph() {
    // we select all the objects with id "radial" and give them an opacity of 0 (could have also just removed them i think ?...)
    svg.selectAll('#radial')
        .style("opacity", 0);
}