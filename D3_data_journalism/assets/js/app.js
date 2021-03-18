// Define SVG dimensions and margins
var svgWidth = 1080,
    svgHeight = 608;

var margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100
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

// Initial Axes
var activeAxisX = "poverty",
    activeAxisY = "healthcare";

// Function - calculates new x-axis range based on label selected
function xScale(data, activeAxisX) {
    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[activeAxisX])*.9,d3.max(data, d => d[activeAxisX])*1.1])
        .range([0, width]);
    return xLinearScale;
};
// Function - calculates new y-axis range based on label selected
function yScale(data, activeAxisY) {
    let yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[activeAxisY])*1.1])
        .range([height, 0]);
    return yLinearScale;
};
// Function - updates the bottom axis
function renderAxisX(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
};
// Function - updates the left axis
function renderAxisY(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

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
    var xLinearScale = xScale(data, activeAxisX),
        yLinearScale = yScale(data, activeAxisY);

    // Create Axes
    var xAxis = d3.axisBottom(xLinearScale),
        yAxis = d3.axisLeft(yLinearScale);

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
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("opacity", ".75")
        .classed("circle", true);

    // Add state labels
    var stateLabels = chartGroup.selectAll(null)
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("alignment-baseline", "central")
        .classed("state_label", true)
        .text(d => d.abbr);

    // Create x-axis labels group and labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .classed("inactive", true)
        .text("Household Income (Median)");

    // Create y-axis labels group and labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(0, ${height / 2})`)

    var ObesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -80)
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obesity (%)");

    var SmokesLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -60)
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");
    
    var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -40)
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    // Create tooltips
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,60])
        .html(d => `State: ${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    
    stateLabels.call(toolTip);
    stateLabels
        .on("mouseover", d => toolTip.show(d))
        .on("mouseout", d => toolTip.hide(d));


}).catch(function(error) {
    console.log(error);
});