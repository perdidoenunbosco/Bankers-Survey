
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {
    'packages': ['corechart', 'bar']
  });
  
  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(initChart);


  function initChart() {
    URL = "https://docs.google.com/spreadsheets/d/1SnCv607rx_PSx88E58VXWtcOi_VB0ALD69nAAjPBb-A/gviz/tq?sheet=Recession_Data&headers=1";

    var query = new google.visualization.Query(URL);
    query.setQuery('select *');
    query.send(function(response) {
      handleQueryResponse(response);
    });
  }

  function handleQueryResponse(response) {
    var data = response.getDataTable();
    var columns = data.getNumberOfColumns();
    var rows = data.getNumberOfRows();
    

    
   

    const colors = ['rgb(54, 162, 235)', 'rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 206, 86)', 'rgb(153, 102, 255)'];
    dataj = JSON.parse(data.toJSON());
    //console.log(dataj.cols[0].label);
    const labels = [];
    for (c = 1; c < dataj.cols.length; c++) {
      if (dataj.cols[c].label != "") {
        labels.push(dataj.cols[c].label);
      }

    }
    //console.log(labels);
    const datasets = [];
    for (i = 0; i < dataj.rows.length; i++) {
      const series_data = [];
      for (j = 1; j < dataj.rows[i].c.length; j++) {
        if (dataj.rows[i].c[j] != null) {
          if (dataj.rows[i].c[j].v != null) {
            series_data.push(dataj.rows[i].c[j].v);
          } else {
            series_data.push(0);
          }
        }

      }
      var dataset = {
        label: dataj.rows[i].c[0].v,
        backgroundColor: `grey`,
        borderColor: `grey`,

        categoryPercentage: 1.0,
        barPercentage: 1.0,

        data: series_data,

      }

      datasets.push(dataset);

    }
    // console.log(datasets);

    const chartdata = {
      labels: labels,
      datasets: datasets
    };

    // tooltip
    const titleTooltip = (tooltipItems) => {
      console.log("tooltipItems")
      console.log(tooltipItems)
      return 'Testing';
    }

    var canvas = document.getElementById("myChart");
    var setup = {
        type: 'bar',
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
    chart = new Chart(canvas, setup);
    
    // sets h2 to the given value
    document.querySelector("h2").innerText = chart.data.datasets[0].barPercentage;

  }