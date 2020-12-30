// Ffunction that will create metadata for given sample
function buildMetadata(sample) {

    // Specify the location of the metadata 
    sampleMetadataElement = d3.select("#sample-metadata");
    sampleMetadataElement.html("");
    var tbody = sampleMetadataElement.append("tbody");

    // Parse and filter the data to get the sample's metadata and update it
    Object.entries(sample).forEach(([key, value]) => {
        var row = tbody.append("tr");
        row.text(key +": " + value);
      });      
}

// Function that will create charts for given sample
function buildCharts(data, index) {

    console.log(data);

    // Find the sample given the index
    sample = data.samples[index];

    // Create bar chart in correct location
    plotBar(sample);

    // Create bubble chart in correct location
    plotBubble(sample);

    // Create gauge chart in correct location
    plotGauge(data.metadata[index]['wfreq']);
}

// Define a function to plot a bar chart
function plotBar(sampleData) {
    
    // Find the top 10 OTU IDs
    top10OTUIDs = sampleData.otu_ids.slice(0,10).reverse();
    
    var x = [];
    var y = [];

    var trace1 = {
        x: sampleData.sample_values.slice(0,10).reverse(),
        y: top10OTUIDs.map(item => "OTU " + item),
        text: sampleData.otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {
          color: sampleData.otu_ids,
          colorscale: 'Jet'
        }
      };
    
      // data
      var data = [trace1];
      
      // layout
      var layout = {
        title: "Top 10 OTUs"
      };
      
      // Render the plot to the div tag with id "bar"
      Plotly.newPlot("bar", data, layout);
}

// function to plot a Bubble chart
function plotBubble(sampleData) {
    
    var x = [];
    var y = [];
    
    var trace1 = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: 'markers',
        marker: {
          color: sampleData.otu_ids,
          size: sampleData.sample_values,
          colorscale: 'Blackbody'
        },
        
      };
      
      // data
      var data = [trace1];
      
      // layout
      var layout = {
        xaxis: {
            title: 'OTU ID'
        },
        showlegend: false
      };
      
      // Render the plot to the div tag with id "bubble"
      Plotly.newPlot('bubble', data, layout);
}

// function to plot a gauge chart
function plotGauge(wFreq) {
    console.log(wFreq);

    // data
    var data = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: wFreq,
          title: { text: "Scrubs per Week", font: { size: 20 } },
          gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 1], color: "#E1F5FE" },
              { range: [1, 2], color: "#81D4FA" },
              { range: [2, 3], color: "#4FC3F7" },
              { range: [3, 4], color: "#29B6F6" },
              { range: [4, 5], color: "#03A9F4" },
              { range: [5, 6], color: "#039BE5" },
              { range: [6, 7], color: "#0288D1" },
              { range: [7, 8], color: "#0277BD" },
              { range: [8, 9], color: "#01579B" }
            ]
          }
        }
      ];
      
      // layout
      var layout = {
        title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
      };
      
      // Render the plot to the div tag with id "gauge"
      Plotly.newPlot('gauge', data, layout);
}

// Define function that will run on page load
function init() {

    // Read json data
    d3.json("samples.json").then((weAPIdata) => {

        console.log(weAPIdata);

        // Parse and filter data to get sample names
        sampleIds = weAPIdata.names;
        console.log(sampleIds);

        dropdownElement = d3.select("#selDataset")
        
        // Add dropdown option for each sample
        dropdownElement.html("");
        sampleIds.forEach(item => {
            dropdownElement.append("option").text(item).attr("value",item);
        });
        // select first item on dropdown list
        sampleIds.selectedIndex = 0;

        // Use first sample to build metadata and initial plots
        console.log(weAPIdata.metadata[0]);
        buildMetadata(weAPIdata.metadata[0]);
        buildCharts(weAPIdata, 0);
      });
}

// Funtion to run when a new Sample is selected
function optionChanged(sampleID){

    console.log(sampleID);

    d3.json("samples.json").then((weAPIdata) => {

      // Find the index of the selected sample
      sampleIndex = weAPIdata.names.indexOf(sampleID);
 
      // Update metadata with newly selected sample
      buildMetadata(weAPIdata.metadata[sampleIndex]);
      
      // Update charts with newly selected sample
      buildCharts(weAPIdata, sampleIndex);
    });
}

// Initialize dashboard on page load
init();

