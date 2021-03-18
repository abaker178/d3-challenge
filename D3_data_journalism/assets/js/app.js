// Define SVG dimensions and margins
var svgWidth = 1080,
    svgHeight = 608;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 80
};

var width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

// Create SVG area
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Add a chart group and shift it according to the margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read in CSV
d3.csv("./assets/data/data.csv").then((data, err) => {
    if (err) throw err;
    
    // Parse Data
    data.forEach(d => {
        d.id = +d.id;
        d.poverty = +d.poverty;
        d.povertyMoe = +d.povertyMoe;
        d.age = +d.age;
        d.ageMoe = +d.ageMoe;
        d.income = +d.income;
        d.incomeMoe = +d.incomeMoe;
        d.healthcare = +d.healthcare;
        d.healthcareLow = +d.healthcareLow;
        d.healthcareHigh = +d.healthcareHigh;
        d.obesity = +d.obesity;
        d.obesityLow = +d.obesityLow;
        d.obesityHigh = +d.obesityHigh;
        d.smokes = +d.smokes;
        d.smokesLow = +d.smokesLow;
        d.smokesHigh = +d.smokesHigh;
    });

    // Create Axes scales
    var xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.poverty)-1,d3.max(data, d => d.poverty)+1])
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)+2])
        .range([height, 0]);

    // Create Axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Append Axes
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);
    
    chartGroup.append("g")
        .call(yAxis);

    // Append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .classed("circle", true);

    // Add state labels
    var stateLabels = chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("alignment-baseline", "central")
        .classed("state_label", true)
        .text(d => d.abbr);

    // Create x-axis labels group
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    // Create y-axis labels group
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(0, ${height / 2})`)

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0)
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    
    // Create tooltips
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,60])
        .html(d => `State: ${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    
    circlesGroup.call(toolTip);
    circlesGroup
        .on("mouseover", d => toolTip.show(d))
        .on("mouseout", d => toolTip.hide(d));
    stateLabels.call(toolTip);
    stateLabels
        .on("mouseover", d => toolTip.show(d))
        .on("mouseout", d => toolTip.hide(d));


}).catch(function(error) {
    console.log(error);
});