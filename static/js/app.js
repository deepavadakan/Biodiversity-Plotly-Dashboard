

// Define a function that will create metadata for given sample
function buildMetadata(sample) {

    // Specify the location of the metadata 
    sampleMetadataElement = d3.select("#sample-metadata");
    var tbody = sampleMetadataElement.append("tbody");

    // Parse and filter the data to get the sample's metadata and update it
    Object.entries(sample).forEach(([key, value]) => {
        var row = tbody.append("tr");
        row.text(key +": " + value);
      });      

}

// Function that will create charts for given sample
function buildCharts(data, sampleID) {

    console.log(data);

    sample = data.samples[sampleID];

    // Create bar chart in correct location
    plotBar(sample);

    // Create bubble chart in correct location
    plotBubble(sample);

    // Create gauge chart in correct location
    plotGauge(data.metadata[sampleID]['wfreq']);
}

// Define a function to plot a bar chart
function plotBar(sampleData) {
    
    top10OTUIDs = sampleData.otu_ids.slice(0,10).reverse();
    
    var x = [];
    var y = [];

    var trace1 = {
        x: sampleData.sample_values.slice(0,10).reverse(),
        y: top10OTUIDs.map(item => "OTU " + item),
        text: sampleData.otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      };
    
      // data
      var data = [trace1];
      
      // Apply the group bar mode to the layout
      var layout = {
        title: "Top 10 OTUs",
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        }
      };
      
      // Render the plot to the div tag with id "bar"
      Plotly.newPlot("bar", data, layout);
}

// function to plot a Bubble chart
function plotBubble(sampleData) {
    
    var trace1 = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: 'markers',
        marker: {
          color: sampleData.otu_ids,
          size: sampleData.sample_values
        }
      };
      
      var data = [trace1];
      
      var layout = {
        xaxis: {
            title: 'OTU ID'
        },
        showlegend: false
      };
      
      Plotly.newPlot('bubble', data, layout);
}



// Define function that will run on page load
function init() {

    // Read json data
    d3.json("../../samples.json").then((weAPIdata) => {

        console.log(weAPIdata);

        // Parse and filter data to get sample names
        sampleIds = weAPIdata.names;
        console.log(sampleIds);
        console.log(sampleIds[0]);

        dropdownElement = d3.select("#selDataset")
        
        // Add dropdown option for each sample
        dropdownElement.html("");
        dropdownElement.append("option").text(sampleIds[0]).attr("value",sampleIds[0]);
        sampleIds.forEach(item => {
            dropdownElement.append("option").text(item).attr("value",item);
        });

        // Use first sample to build metadata and initial plots
        console.log(weAPIdata.metadata[0]);
        buildMetadata(weAPIdata.metadata[0]);
        buildCharts(weAPIdata, 0);

      });
}

function optionChanged(newSample){

    // Update metadata with newly selected sample

    // Update charts with newly selected sample

}

// Initialize dashboard on page load
init();

