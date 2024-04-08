

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
    "https://docs.google.com/spreadsheets/d/1SnCv607rx_PSx88E58VXWtcOi_VB0ALD69nAAjPBb-A/gviz/tq?sheet=transposed&headers=1",
    "https://docs.google.com/spreadsheets/d/1SnCv607rx_PSx88E58VXWtcOi_VB0ALD69nAAjPBb-A/gviz/tq?sheet=Recession_Data&headers=1",
  ];

  URLs.forEach(URL => {
    console.log(URL);
    initChart(URL);
    console.log("left initchart from feedURLs()"); 

  });
} // END feedURLs

function initChart(URL) {  
  console.log("entering initChart");
    // lock and load the URL
    var query = new google.visualization.Query(URL);
    // select everything in the spreadsheat
    query.setQuery('select *');
    // actually do the thing
    query.send(function(response) {
     
    handleQueryResponse(response);

    }); // once the data is retrieved but not before... start processing it.

  } //END initChart

  function handleQueryResponse(response) {
    console.log("entering handleQueryResponse");
    //setup data extraction from object containing spreadsheet data 
    var data = response.getDataTable();
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
   
    displayDatasets();
    console.log("leaving handleQueryResponse");
  } //END handleQueryResponse

// this must be called within handleQueryResponse or used as a callback function 
//or this function will outrun handleQueryResponse and display undefined
function displayDatasets (){
  console.log("writing to paragragh");
  output = document.getElementById("paragragh_one");

  // this results in undefined
  // output.innerText = "Datasets: " + datasets.forEach((dataset) => {JSON.stringify(dataset);});

  // this results in only the last one being displayed. you need some sort of += operation
  datasets.forEach((dataset) => {output.innerText += "\nDataset: \n" + JSON.stringify(dataset);});

  // this will display each series individually
  // datasets.forEach((dataset) => {console.log("CLG_Datasets: ", dataset);});
  
  // this will display datasets to the page
  // output.innerText = "Datasets: " + JSON.stringify(datasets);

}

