

// Load the Visualization API and the corechart package.
google.charts.load('current', {
      'packages': ['corechart', 'bar']
  });
  
// a globally declared container for the datasets
var datasets = [];
var labels =new Set();

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(processControl);



async function processControl(){ 
  
  // this must be async to actuall have any control of processes
  
  await feedURLs(); //async
    //await initChart(URL) - promised based
      //await Query.send FORCED promise based 
      // await handleQueryResponse - promised based
        //parseStuff - promised based - no async awaits internally

        console.log("What is datasets from Global space: ");
        console.log(datasets);


populateChartData()
// displayDatasets()
    
}// END processControl

// loops through a list of URL's to spreadsheets to be fed into parsing engines
async function feedURLs(){
  
  URLs = [
    // "https://docs.google.com/spreadsheets/d/1SnCv607rx_PSx88E58VXWtcOi_VB0ALD69nAAjPBb-A/gviz/tq?sheet=transposed&headers=1",
    "https://docs.google.com/spreadsheets/d/1SnCv607rx_PSx88E58VXWtcOi_VB0ALD69nAAjPBb-A/gviz/tq?sheet=Bankers_Survey_Averages&headers=1",
    "https://docs.google.com/spreadsheets/d/1SnCv607rx_PSx88E58VXWtcOi_VB0ALD69nAAjPBb-A/gviz/tq?sheet=SNP&headers=1",
    "https://docs.google.com/spreadsheets/d/1SnCv607rx_PSx88E58VXWtcOi_VB0ALD69nAAjPBb-A/gviz/tq?sheet=Recession_Data&headers=1",
  ];


    for (let i=0; i < URLs.length; i++) {
      
      console.log(URLs[i]);

      console.log("before initchart await");
      await initChart(URLs[i]); 
      console.log("after initchart await");

      console.log("left initchart and back in feedURLs() for loop"); 
    };
    
} // END feedURLs

function initChart(URL) {

  // the promise is here so that Async and Await will have any effect
  return new Promise ((resolve, reject) => {
    
      console.log("entering initChart");
      // lock and load the URL
      var query =  new google.visualization.Query(URL);
      // select everything in the spreadsheat
      query.setQuery('select *');
    

      // actually do the thing
      console.log("Calling query.send"); 
      console.log("query.Hw before send: ", query.Hw );

      query.send(function (response) {
          console.log("Inside query.send before handleQueryResponse");
            if (response){ 
              handleQueryResponse(response)
              resolve();
            }// END if
            
          
          console.log("Past handleQueryResponse thats inside query.send");

          }// END function(response)
      ) // END query.send
      
      console.log("leaving initChart with a promise made");
    } // END promise arrow function
  );//END promise
  
} //END initChart

async function handleQueryResponse(response) {
  console.log("entering handleQueryResponse:");

  // the promise is here so that Async and Await will have any effect
    return new Promise (async (resolve, reject) => {

    //setup data extraction from object containing spreadsheet data 

    // parse out the response fron querysend() and put it into a data object for the chart.
    await parseStuff(response);

    console.log("leaving handleQueryResponse");
  

  } // END promise arrow function
);//END promise

} //END handleQueryResponse

function parseStuff(response){    
   console.log("entering parse stuff");
  
   // the promise is here so that Async and Await will have any effect
  return new Promise ((resolve, reject) => {
  
    var data = response.getDataTable();
    var columns = data.getNumberOfColumns();
    var rows = data.getNumberOfRows();
    

    // create color list for each different series
    const colors = ['rgb(54, 162, 235)', 'rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 206, 86)', 'rgb(153, 102, 255)'];
    
    //make a deep copy of data
    dataj = JSON.parse(data.toJSON());
    
    // pull out data for each series label skipping the A1 cell it appears
    // labels = [];
    for (c = 1; c < dataj.cols.length; c++) {
      if (dataj.cols[c].label != "") {
        // labels.push(dataj.cols[c].label);
        labels.add(dataj.cols[c].label);
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
        type: "line",
        label: dataj.rows[i].c[0].v,
        backgroundColor: colors[i],
        borderColor: colors[i],
        data: series_data,

      }
      // add completed series to the collection of series
      datasets.push(dataset);
      

    } //END for loops
    console.log("leaving parseStuff");

    resolve(()=>{return true})
    reject(()=>{return console.log("Promise from handleQueryResponse Rejected");})
  } // END promise arrow function
);//END promise

}// END parseStuff

function populateChartData(){
  

  labels = Array.from(labels);

    const chartdata = {
        labels: labels,
        datasets: datasets
      };

      var canvas = document.getElementById("myChart");
      var setup = {
        type: 'line',
        data: chartdata,
        options: {
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              display: true
            },
            SNP:{
              type: 'linear',
              position: 'right',
              display: true
            },
            Recession: {
              type: 'linear',
              position: 'left',
              display: false
            }
          }, // END Scales
          maintainAspectRatio: false,  // *** Important : this is required or a strange vanishing zoom out effect occurs with the graph.
          plugins: {
            tooltip: {
              yAlign:'bottom',
              displayColors: false,
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

      console.dir(setup)

      setup.data.datasets[3].type = "bar";
      setup.data.datasets[3].yAxisID = "Recession"
      setup.data.datasets[3].categoryPercentage = 1.0
      setup.data.datasets[3].barPercentage = 1.0
      setup.data.datasets[3].backgroundColor = `grey`
      setup.data.datasets[3].borderColor = `grey`
      setup.data.datasets[3].order = 2


      setup.data.datasets[2].type = "line";
      setup.data.datasets[2].yAxisID = "SNP"
      setup.data.datasets[2].backgroundColor = `red`
      setup.data.datasets[2].borderColor = `red`
      setup.data.datasets[2].order = 0;

      setup.data.datasets[0].fill = {target: 'origin', above: 'rgba(255, 0, 0, 0.25)', below: 'rgba(0, 255, 0, 0.25)'};
      setup.data.datasets[0].order = 1;
      setup.data.datasets[0].yAxes = {gridLines: {zeroLineColor: '#000000'}}

      // send all packaged data for chart to render
      chart = new Chart(canvas, setup);


} //END populateChartData

