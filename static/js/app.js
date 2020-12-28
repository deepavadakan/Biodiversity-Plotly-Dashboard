

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

