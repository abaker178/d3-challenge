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
d3.csv("./assets/data/data.csv").then(data => {
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
        .domain(d3.extent(data, d => d.poverty))
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
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

    

});