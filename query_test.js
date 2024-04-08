 // Load the Visualization API and the corechart package.
 google.charts.load('current', {
    'packages': ['corechart', 'bar']
  });
  
  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(initChart);

  // grab data from google sheets
  function initChart() {
    // set location of source data
    URL = "https://docs.google.com/spreadsheets/d/1SnCv607rx_PSx88E58VXWtcOi_VB0ALD69nAAjPBb-A/gviz/tq?sheet=transposed&headers=1";

    // lock and load the URL
    var query = new google.visualization.Query(URL);
    // select everything in the spreadsheat
    query.setQuery('select *');
    // actually do the thing
    query.send(function(response) {
      handleQueryResponse(response); // once the data is retrieved but not before... start processing it.
    });
  }// END initChart

  function handleQueryResponse(response) {

// Stuff Goes Here
console.log("The entire response object");
console.dir(response)
console.log("The chart part response object");
console.dir(response.getDataTable());
divContents  = document.getElementById ("theDiv");
divContents.innerHTML = "Go to the console to get the output of the response object";


  } //END handleQueryResponse