function init() {
  
  var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var subjectIds = data.names;
      subjectIds.forEach((id) => {
        selector
        .append("option")
        .text(id)
        .property("value", id);
      });
    
    const firstSubject = subjectIds[0];
    updateCharts(firstSubject);
    updateMetadata(firstSubject);
    });
  }
function updateMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = filterArray[0];
    var metaPanel = d3.select("#sample-metadata");
    metaPanel.html("");
    Object.entries(result).forEach(([key, value]) => {
        metaPanel.append('h6').text(`${key.toUpperCase()}: ${value}`)
    })
    //Gauge w. needle
    var level = result.wfreq;

    // Trig to calc meter point
    var degrees = 180 - level,
       radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    
   
    var mainPath = 'M -0.025 -0.0 L 0.025 0.0 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);
    
    var data = [{ type: 'scatter',
      x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'freq',
      text: level,
      hoverinfo: 'text+name'},
      { values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',	  
      marker: {colors:['rgba(49, 144, 110, .5)', 'rgba(52, 165, 111, .5)', 'rgba(14, 127, 0, .5)', 'rgba(26, 162, 96, .5)', 
                   'rgba(110, 154, 22, .5)', 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                   'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',  'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];
    
    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 550,
      width: 550,
      xaxis: {zeroline:false, showticklabels:false,
           showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
           showgrid: false, range: [-1, 1]}
    };
    Plotly.newPlot("gauge", data, layout);
  });
}

function updateCharts(sample) {    
  d3.json("samples.json").then((data) => {
  var samples = data.samples;
  var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
  var result = filterArray[0];
  var sample_values = result.sample_values;
  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels;   
 
  // Bar Chart
  var trace1 = {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
  };
  var data = [trace1];
  var layout = {
      title: "Top Ten OTUs for Individual " +sample,
      margin: {l: 100, r: 100, t: 100, b: 100}
  };
  Plotly.newPlot("bar", data, layout);
    
  // Bubble Chart
  var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
      size: sample_values,
      color: otu_ids,
      colorscale:"YlGnBu"
      }
  };
  var data = [trace1];
  var layout = {
      title: "Bacteria Cultures per Sample",
      showlegend: false,
      hovermode: 'closest',
      xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
      margin: {t:30}
  };
  Plotly.newPlot("bubble", data, layout);
  });
}
  
function optionChanged(newSample) {
  updateCharts(newSample);
  updateMetadata(newSample);
}
  
init();