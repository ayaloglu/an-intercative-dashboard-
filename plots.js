console.log("This is plots.js")





function DrawBarchart(sampleId) {

  console.log(`DrawBarchart(${sampleId})`);

  d3.json("samples.json").then(data => {


    let samples = data.samples;
    let resultArray = samples.filter (o => o.id === sampleId);
    let result = resultArray[0];



    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_value = result.sample_values;
    let yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();

    let barData = { 

        x: sample_value.slice(0, 10).reverse(),
        y: yticks,
        type: "bar",
        text: otu_labels.slice(0,10).reverse(),
        orientation: "h"


    };
    let barArray = [barData]

    let barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {t:30, l:150}
    }
    Plotly.newPlot("bar", barArray, barLayout);
  });
 }

 function DrawBubblechart(sampleId) {

    console.log(`DrawBubblechart(${sampleId})`);

    d3.json("samples.json").then(data => {

        let samples = data.samples;
        let resultArray = samples.filter (o => o.id === sampleId);
        let result = resultArray[0];




var trace1 = {
    x: result.otu_ids ,
    y: result.sample_values,
    text: result.otu_labels,
    mode: 'markers',
    marker: {
      color: result.otu_ids,
      colorscale:'Portland',
      size: result.sample_values
    },
  
  };
  
  var data = [trace1];
  
  var layout = {
    title: 'Bacteria Cultures per Sample',
    showlegend: false
    
    
  };
  
  Plotly.newPlot('bubble', data, layout);


   });
}


   function ShowMetadata(sampleId) {

    console.log(`ShowMetadata(${sampleId})`);

    let metadiv = d3.select("#sample-metadata");

    d3.json("samples.json").then(data => {
        // console.log(data);


    let metadata = data.metadata;
    let resultArray = metadata.filter (o => o.id == sampleId);
    let result = resultArray[0];

    console.log(result);


        metadiv.html("")
        Object.entries(result).forEach(([key,value]) => {
            metadiv.append("p").text(`${key}: ${value}`);
        });
    }); 
   }

   function plotGauge(sampleId){
       
    let gauge = d3.select("#gauge");

    d3.json("samples.json").then(data => {


    let metadata = data.metadata;
    let resultArray = metadata.filter (o => o.id == sampleId);
    let result = resultArray[0];

    console.log(result.wfreq);
   
   let dat = [
	{
		domain: { x: [0, 1], y: [0, 1] },
		value: result.wfreq,
		title: { text: "Scrubs per Week" },
		type: "indicator",
		mode: "gauge",
        gauge: {
            axis: { range: [0, 9] },
        threshold: {
                line: { color: "purple", width: 5 },
                thickness: 0.75,
                value: result.wfreq
              },
        bgcolor: "yellow"
              
	}}
];

let layout = {  margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', dat, layout);
});
   }
function optionChanged(id) {

    console.log(`optionChanged (${id})`);

    DrawBarchart(id);
    DrawBubblechart(id);
    ShowMetadata(id);
    plotGauge(id);
}



// initialize the dashboard
function InitDashboard ()
{
    console.log("Initializing Dashboard");

    let selector = d3.select("#selDataset");

    d3.json("samples.json").then(data => {

        console.log(data);

        //define sample names
        let sampleNames = data.names;

        sampleNames.forEach(sampleId => {
            selector.append ("option").text(sampleId).property("value", sampleId);
        });

        let sampleId = sampleNames[0];

        DrawBarchart(sampleId);
        DrawBubblechart(sampleId);
        ShowMetadata(sampleId);
        plotGauge(sampleId);

    });


};

InitDashboard();