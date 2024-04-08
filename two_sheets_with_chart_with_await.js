

// Load the Visualization API and the corechart package.
google.charts.load('current', {
      'packages': ['corechart', 'bar']
  });
  
// a globally declared container for the datasets
var datasets = [];

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(feedURLs);

// loops through a list of URL's to spreadsheets
function feedURLs(){
  
  URLs = [

    "https://docs.google.com/spreadsheets/d/1SnCv607rx_PSx88E58VXWtcOi_VB0ALD69nAAjPBb-A/gviz/tq?sheet=Recession_Data&headers=1",
    "https://docs.google.com/spreadsheets/d/1SnCv607rx_PSx88E58VXWtcOi_VB0ALD69nAAjPBb-A/gviz/tq?sheet=transposed&headers=1",

  ];

  for (URL of URLs) {
    
    console.log(URL);
    runInit = initChart(URL); // this is the one that needs to be waited on.
    console.log("runInit Value: ", runInit);
    console.log("left initchart from feedURLs()"); 

  };
} // END feedURLs

function initChart(URL) {  
  console.log("entering initChart");

    // lock and load the URL
     var  query =  new google.visualization.Query(URL);
    
    // select everything in the spreadsheat
    query.setQuery('select *');
   // actually do the thing
    console.log("Calling query.send"); 
    query.send(async function(response) {
      console.log("calling handleQueryResponse"); 
      await handleQueryResponse(response)  
      console.log("response: ", response);
    }); // END query.send

} //END initChart

async function handleQueryResponse(response) {
    
    console.log("entering handleQueryResponse");
    //setup data extraction from object containing spreadsheet data 
    var data = await response.getDataTable();
    var columns = data.getNumberOfColumns();
    var rows = data.getNumberOfRows();
    

    // create color list for each different series
    const colors = ['rgb(54, 162, 235)', 'rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 206, 86)', 'rgb(153, 102, 255)'];
    
    //make a deep copy of data
    dataj = JSON.parse(data.toJSON());
    
    // pull out data for each series label skipping the A1 cell it appears
    const labels = [];
    for (c = 1; c < dataj.cols.length; c++) {
      if (dataj.cols[c].label != "") {
        labels.push(dataj.cols[c].label);
      }

    }
    
    // pull out the numeric data from each series by cycling through each row then cell
    // const datasets = [];
    for (i = 0; i < dataj.rows.length; i++) { // iterate through each row
      const series_data = [];
      for (j = 1; j < dataj.rows[i].c.length; j++) { // iterate through column in the row skipping the first cell 
        if (dataj.rows[i].c[j] != null) {
          if (dataj.rows[i].c[j].v != null) {
            series_data.push(dataj.rows[i].c[j].v);
          } else {
            series_data.push(0); // put a zero if it doesn't pass the null tests
          }
        }

      }
      // append formating data for the given series
      var dataset = {
        label: dataj.rows[i].c[0].v,
        backgroundColor: colors[i],
        borderColor: colors[i],
        data: series_data
      }
      // add completed series to the collection of series
      datasets.push(dataset);
      

    } //END for loops
   
    displayDatasets(labels, datasets);
    console.log("leaving handleQueryResponse");
  } //END handleQueryResponse

// this must be called within handleQueryResponse or used as a callback function 
//or this function will outrun handleQueryResponse and display undefined
function displayDatasets (labels, datasets){
  
    const chartdata = {
        labels: labels,
        datasets: datasets
      };
  
      // tooltip - do you need this function anymore?
      const titleTooltip = (tooltipItems) => {
        // console.log("tooltipItems")
        // console.log(tooltipItems)
        //return 'Testing'; // this is used if you want one label and is pretty worthless in this context
      }
  
      // setup the chart view options 
      var canvas = document.getElementById("myChart");
      var setup = {
        type: 'line',
        data: chartdata,
        options: {
          scales:{
            Recession: {
              position: "right"
            },
            
          },
          maintainAspectRatio: false,  // *** Important : this is required or a strange vanishing zoom out effect occurs with the graph.
          plugins: {
            tooltip: {
              yAlign:'bottom',
              displayColors: false,
              callbacks: {
                title: titleTooltip
              }
            },
            zoom: {
              pan: {
                enabled: true
              }, 
              zoom:{
                wheel: {
                enabled: true,
                },
                pinch: {
                enabled: true
                },
              scaleMode: 'xy',
              mode: 'xy',
              }
            },
            title: {
              display: true,
              text: dataj.cols[0].label
            }
          },
          responsive: true,
        }
      }
      //change one of the data series to a bar chart
       setup.data.datasets[8].type = 'bar';
      // setup.data.datasets[8].yAxisID = "Recession"
      // setup.data.datasets[8].categoryPercentage = 1.0
      // setup.data.datasets[8].barPercentage = 1.0
      // setup.data.datasets[8].backgroundColor = `grey`
      // setup.data.datasets[8].borderColorc = `grey`

      // THIS THROUGHS A GIANT TYPE ERROR AND STOPS EXECUTION, 
      //THE TOP ONES ALSO THROW ERRORS BUT THE CHART STILL WORKS
    //   setup.options.scales.Recession.position = "right"
      
      
      // send all packaged data for chart to render
      chart = new Chart(canvas, setup);

    
      console.dir(setup)
      // AND YET IT WORKS HERE AND SHOWS THE VALUE
      // console.dir(setup.options.scales.Recession.position)
      //MAYBE YOU TRY TO EXPLICITY DEFINE THE PROPERTY IN THE OBJECT
      //MAYBE YOU USE AWAITS
} //END displayDatasets

