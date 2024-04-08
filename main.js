
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
      handleQueryResponse(response);
    }); // once the data is retrieved but not before... start processing it.
  }

  function handleQueryResponse(response) {
    
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
    const datasets = [];
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

    }

// this is the most likely best place for the insertion of another call to parse another spreadsheet

    // package labels and series data collection for chart insertion
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
    setup.data.datasets[1].type = 'bar';

    // send all packaged data for chart to render
    chart = new Chart(canvas, setup);
    
    // sets h2 to the given value
    document.querySelector("h2").innerText = "blank";
    console.log(
      "%c setup",
      "color: yellow; font-size: 30px; background-color: blue;padding: 2px",);    

  }