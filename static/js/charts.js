const data_file = "static/data/samples.json";

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json(data_file).then((data) => {
	var sampleNames = data.names;

	sampleNames.forEach((sample) => {
	    selector
		.append("option")
		.text(sample)
		.property("value", sample);
	});

	// Use the first sample from the list to build the initial plots
	var firstSample = sampleNames[0];
	buildCharts(firstSample);
	buildMetadata(firstSample);
	buildTable(firstSample);
    });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    buildTable(newSample);
    
}

// Demographics Panel 
function buildMetadata(sample) {
    d3.json(data_file).then((data) => {
	var metadata = data.metadata;
	// Filter the data for the object with the desired sample number
	var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
	var result = resultArray[0];
	// Use d3 to select the panel with id of `#sample-metadata`
	var PANEL = d3.select("#sample-metadata");

	// Use `.html("") to clear any existing metadata
	PANEL.html("");

	// Use `Object.entries` to add each key and value pair to the panel
	// Hint: Inside the loop, you will need to use d3 to append new
	// tags for each key-value in the metadata.
	Object.entries(result).forEach(([key, value]) => {
	    PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
	});

    });
}

// 1. Create the buildCharts function.
function buildCharts(sample_id) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json(data_file).then((data) => {
	// 3. Create a variable that holds the samples array.
	let samples = data.samples;

	// 4. Create a variable that filters the samples for the object with the desired sample number.
	let samplesArray = samples.filter(sampleObj => sampleObj.id == sample_id);

	//  5. Create a variable that holds the first sample in the array.
	let sample = samplesArray[0];

	// 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
	let otu_ids = sample.otu_ids;
	console.log(otu_ids);
	let otu_labels = sample.otu_labels;
	console.log(otu_labels);
	let sample_values = sample.sample_values;
	console.log(sample_values);

	// 7. Create the yticks for the bar chart.
	// Hint: Get the the top 10 otu_ids and map them in descending order  
	//  so the otu_ids with the most bacteria are last.
	console.log("sorted");

	console.log(otu_ids.slice(0,10).map(id => "OTU " + id).reverse());

	

	var top_labels = otu_labels.slice(0,10).reverse();
	var top_values = sample_values.slice(0,10).reverse()
	var top_ids = otu_ids.slice(0,10).reverse();
	var yticks = top_ids.map(id => "OTU " + id);

	// 8. Create the trace for the bar chart.
	var trace = {
	    x: top_values,
	    y: yticks,
	    text: top_labels,
	    type: "bar",
	    orientation: 'h'
	};
	var barData = [
	    trace
	];
	// 9. Create the layout for the bar chart. 
	var barLayout = {
	    title: {
		text: "Top 10 Bacteria Cultures Found",
		font: {
		    color: "#f7f7f7"
		}
	    },
	    xaxis: {
		tickcolor: "#f7f7f7",
		tickfont: {
		    color: "#f7f7f7"
		}
	    },
	    yaxis: {
		tickcolor: "#f7f7f7",
		tickfont: {
		    color: "#f7f7f7"
		}
	    },
	    paper_bgcolor: "rgba(0,0,0,0)"
	};
	// 10. Use Plotly to plot the data with the layout.
	Plotly.newPlot("bar", barData, barLayout);

	// 1. Create the trace for the bubble chart.
	var bubbleData = [{
	    x: otu_ids,
	    y: sample_values,
	    type: 'scatter',
	    mode: 'markers',
	    text: otu_labels,
	    marker: {
		color: otu_ids,
		size: sample_values.map(x => x*0.8),
		colorscale: 'Earth'
	    }
	} 
	];

	// 2. Create the layout for the bubble chart.
	var bubbleLayout = {
	    title: {
		text: "Bacteria Cultures Per Sample",
		font: {
		    color: "#f7f7f7"
		}
	    },
	    xaxis: {
		title: {
		    text: 'OTU ID',
		    font: {
			color: "#f7f7f7"
		    }
		},
		tickcolor: "#f7f7f7",
		tickfont: {
		    color: "#f7f7f7"
		}
	    },
	    yaxis: {
		tickcolor: "#f7f7f7",
		tickfont: {
		    color: "#f7f7f7"
		}
	    },
	    paper_bgcolor: "rgba(0,0,0,0)"
	};

	// 3. Use Plotly to plot the data with the layout.
	Plotly.newPlot('bubble', bubbleData, bubbleLayout);

	// 3. Create a variable that holds the washing frequency.
	var metadata = data.metadata;
	// Filter the data for the object with the desired sample number
	var resultArray = metadata.filter(sampleObj => sampleObj.id == sample_id);
	var result = resultArray[0];
	var washing_freq = parseFloat(result.wfreq);
	
	// 4. Create the trace for the gauge chart.
	var gaugeData = [{
	    value: washing_freq,
	    type: "indicator",
	    mode: "gauge+number",
	    
	    title: { text: "Belly Button Washing Frequency<br><span style='font-size:0.8em;color:#f7f7f7'>Scrubs per Week</span>", tickwidth: 1, tickcolor: "#f7f7f7", font: { color: "#f7f7f7"}  },
	    gauge: {
		axis: { range: [0, 10], dtick: 2, tickcolor: "#f7f7f7", tickfont: {
		    color: "#f7f7f7"
		}},
		bar: { color: "black" },
		steps: [
		    { range: [0, 2], color: "red" },
		    { range: [2, 4], color: "orange" },
		    { range: [4, 6], color: "yellow" },
		    { range: [6, 8], color: "lightgreen" },
		    { range: [8, 10], color: "green" }
		]
	    }
	}];
	
	// 5. Create the layout for the gauge chart.
	var gaugeLayout = { 
	    paper_bgcolor: "rgba(0,0,0,0)",
	    font: {
		color: "#f7f7f7"
	    }
	}

	// 6. Use Plotly to plot the gauge data and layout.
	Plotly.newPlot('gauge', gaugeData, gaugeLayout);
	
    });
}


// build a table from the sample data
function buildTable(sample_id) {
    //clear the table
    var tbody = d3.select("tbody");

    tbody.html("");
    d3.json(data_file).then((data) => {

	let samples = data.samples;

	// 4. Create a variable that filters the samples for the object with the desired sample number.
	let samplesArray = samples.filter(sampleObj => sampleObj.id == sample_id);

	//  5. Create a variable that holds the first sample in the array.
	let sample = samplesArray[0];

	// 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
	let otu_ids = sample.otu_ids;
	let otu_labels = sample.otu_labels;
	let sample_values = sample.sample_values;

	otu_ids.forEach((v, i) => {
	    let row = tbody.append("tr");
	    let idCell = row.append("td");
	    idCell.text(v);
	    let labelCell = row.append("td");
	    labelCell.text(otu_labels[i]);
	    let valueCell = row.append("td");
	    valueCell.text(sample_values[i]);
	});
    });
}
