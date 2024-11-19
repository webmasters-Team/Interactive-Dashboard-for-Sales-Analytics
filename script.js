var pivot = new WebDataRocks({
    container: "#wdr-component",
    toolbar: true,
    height: 550,
    width: 1000,
    customizeCell: customizeCellFunction,
    report: {
      dataSource: {
        data: getJSONData()
      },
      slice: {
        rows: [
          {
            uniqueName: "Location"
          }
        ],
        columns: [
          {
            uniqueName: "Measures"
          },
          {
            uniqueName: "Product Group"
          },
          {
            uniqueName: "Product"
          }
        ],
        measures: [
          {
            uniqueName: "Price",
            aggregation: "sum"
          }
        ]
      },
      formats: [
        {
          name: "currency",
          thousandsSeparator: " ",
          decimalSeparator: ".",
          currencySymbol: "$",
          currencySymbolAlign: "left",
          nullValue: "",
          textAlign: "right",
          isPercent: false
        }
      ],
      options: {
        grid: {
          showHeaders: false
        }
      }
    },
    reportcomplete: function () {
      pivot.off("reportcomplete");
      pivotTableReportComplete = true;
      createLineChart();
      createPieChart();
      createBarChart();
    }
  });
  var pivotTableReportComplete = false;
  var googleChartsLoaded = false;
  
  google.charts.load("current", { packages: ["corechart", "bar"] });
  
  google.charts.setOnLoadCallback(onGoogleChartsLoaded);
  
  function onGoogleChartsLoaded() {
    googleChartsLoaded = true;
    if (pivotTableReportComplete) {
      createLineChart();
      createPieChart();
      createBarChart();
    }
  }
  
  function createLineChart() {
    if (googleChartsLoaded) {
      pivot.googlecharts.getData(
        {
          type: "line",
          slice: {
            rows: [
              {
                uniqueName: "Location"
              }
            ],
            columns: [
              {
                uniqueName: "Measures"
              },
              
              
            ],
            measures: [
              {
                uniqueName: "Price",
                aggregation: "max"
              },
            ]
          }
        },
        drawLineChart,
        drawLineChart
      );
    }
  }
  
  function drawLineChart(_data) {
    var data = google.visualization.arrayToDataTable(_data.data);
    var formatter = new google.visualization.NumberFormat({
      fractionDigits: 2,
      prefix: "$"
    });
    formatter.format(data, 1);
    var options = {
      colors: ["#2A9D8F", "#E9C46A", "#E76F51"],
      bars: "horizontal"
    };
    var chart = new google.visualization.LineChart(
      document.getElementById("line-chart-container")
    );
    chart.draw(data, options);
  }
  
  function createPieChart() {
    if (googleChartsLoaded) {
      pivot.googlecharts.getData(
        {
          type: "pie",
          slice: {
            rows: [
              {
                uniqueName: "Channel"
              }
            ],
            columns: [
              {
                uniqueName: "Measures"
              }
            ],
            measures: [
              {
                uniqueName: "Sales",
                formula: 'sum("Price") * sum("Quantity")',
                individual: true,
                caption: "Total Sales"
              }
            ]
          }
        },
        drawPieChart,
        drawPieChart
      );
    }
  }
  
  function drawPieChart(_data) {
    var data = google.visualization.arrayToDataTable(_data.data);
    var formatter = new google.visualization.NumberFormat({
      fractionDigits: 2,
      prefix: "$"
    });
    formatter.format(data, 1);
    var options = {
      legend: {
        position: "bottom"
      },
      pieHole: 0.35,
      chartArea: { height: "85%" },
      pieSliceBorderColor: "none",
      colors: ["#A5D8DD", "#EA6A47", "#0091D5"]
    };
    var chart = new google.visualization.PieChart(
      document.getElementById("pie-chart-container")
    );
    chart.draw(data, options);
  }
  
  function createBarChart() {
    if (googleChartsLoaded) {
      pivot.googlecharts.getData(
        {
          type: "bar",
          slice: {
            rows: [
              {
                uniqueName: "Customer Gender"
              }
            ],
            columns: [
              {
                uniqueName: "Measures"
              }
            ],
            measures: [
              {
                uniqueName: "Customer Gender",
                formula: 'count("Customer Gender")',
                caption: "Total Number"
              }
            ]
          }
        },
        drawBarChart,
        drawBarChart
      );
    }
  }
  
  function drawBarChart(_data) {
    var data = google.visualization.arrayToDataTable(_data.data);
    var formatter = new google.visualization.NumberFormat({
      fractionDigits: 2,
      prefix: "$"
    });
    formatter.format(data, 1);
    var options = {
      colors: ["#2A9D8F"],
      bars: "horizontal"
    };
    var chart = new google.charts.Bar(
      document.getElementById("bar-chart-container")
    );
    chart.draw(data, options);
  }
  
  /* Insert icons to the cells */
  /*Icons made by Smashicons from www.flaticon.com */
  function customizeCellFunction(cell, data) {
    if (
      data.type == "value" &&
      !data.isDrillThrough &&
      data.isGrandTotalColumn &&
      !data.isTotalRow
    ) {
      if (data.value < 15000) {
        cell.text =
          "<img src='https://static.webdatarocks.com/uploads/2019/02/21213347/icons8-decline-64-1.png' class='centered'>";
      } else if (data.value >= 15000) {
        cell.text =
          "<img src='https://static.webdatarocks.com/uploads/2019/02/21213348/icons8-account-64.png' class='centered'>";
      }
    }
  }
  
  function getJSONData() {
    return [
      {
        Price: {
          type: "number"
        },
        Quantity: {
          type: "number"
        },
        "Customer Gender": {
          type: "string"
        },
        "Customer Age Group": {
          type: "string"
        },
        "Product Group": {
          type: "string"
        },
        Product: {
          type: "string"
        },
        "Date Order": {
          type: "date"
        },
        Country: {
          type: "level",
          hierarchy: "Location"
        },
        City: {
          type: "level",
          hierarchy: "Location",
          parent: "Country"
        },
        Channel: {
          type: "string"
        }
      },
      {
        "Product Group": "Servers",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Servers",
        Country: "Australia",
        City: "Sydney",
        Price: 174,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-05-28T10:43:10+00:00",
        "Customer Gender": "Female",
        Duration: 829
      },
      {
        "Product Group": "Servers",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Servers",
        Country: "Australia",
        City: "Sydney",
        Price: 857,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-12-19T10:43:10+00:00",
        "Customer Gender": "Female",
        Duration: 424
      },
      {
        "Product Group": "Servers",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Servers",
        Country: "Australia",
        City: "Sydney",
        Price: 740,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-02-08T10:43:10+00:00",
        "Customer Gender": "Female",
        "Customer Age Group": "15 to 17 years",
  
        Duration: 782
      },
      {
        "Product Group": "Servers",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Servers",
        Country: "Australia",
        City: "Sydney",
        Price: 988,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-02-15T10:43:10+00:00",
        "Customer Gender": "Female",
        "Customer Age Group": "15 to 17 years",
  
        Duration: 475
      },
      {
        "Product Group": "Servers",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Servers",
        Country: "Australia",
        City: "Brisbane",
        Price: 1255,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-04-18T10:43:10+00:00",
        "Customer Gender": "Female",
        "Customer Age Group": "15 to 17 years",
        Duration: 997
      },
      {
        "Product Group": "Servers",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Servers",
        Country: "Australia",
        City: "Sydney",
        Price: 3500,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-05-19T10:43:10+00:00",
        "Customer Gender": "Female",
        "Customer Age Group": "30 to 35 years",
        Duration: 644
      },
      {
        "Product Group": "Servers",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Servers",
        Country: "Australia",
        City: "Sydney",
        Price: 1330,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-05-28T10:43:10+00:00",
        "Customer Gender": "Female",
        "Customer Age Group": "30 to 35 years",
        Duration: 243
      },
      {
        "Product Group": "Servers",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Servers",
        Country: "Australia",
        City: "Sydney",
        Price: 970,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-06-10T10:43:10+00:00",
        "Customer Gender": "Female",
        "Customer Age Group": "30 to 35 years",
        Duration: 576
      },
      {
        "Product Group": "Servers",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Servers",
        Country: "Australia",
        City: "Melbourne",
        Price: 877,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-06-20T10:43:10+00:00",
        "Customer Gender": "Female",
        "Customer Age Group": "30 to 35 years",
        Duration: 411
      },
      {
        "Product Group": "PC Clients",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Thin Clients",
        Country: "Australia",
        Price: 940,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-11-23T10:43:10+00:00",
        "Customer Gender": "Female",
        "Customer Age Group": "30 to 35 years",
        Duration: 422
      },
      {
        "Product Group": "PC Clients",
        Size: "262 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 557,
        Quantity: 225,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-01-03T10:43:10+00:00",
        "Customer Gender": "Female",
        "Customer Age Group": "30 to 35 years",
        Duration: 754
      },
      {
        "Product Group": "PC Clients",
        Size: "147 oz",
        Color: "white",
        Channel: "Call Center",
        Product: "Thin Clients",
        Country: "France",
        City: "Paris",
        Price: 242,
        Quantity: 855,
        Date: "2018-08-23T05:58:56+00:00",
        DateTime: "2016-03-06T23:45:26+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        "Customer Gender": "Male",
        "Customer Age Group": "30 to 35 years",
        Duration: 554
      },
      {
        "Product Group": "PC Clients",
        Size: "264 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 6829,
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        Quantity: 19,
        Duration: 757,
        "Customer Age Group": "30 to 35 years",
        "Customer Gender": "Male"
      },
      {
        "Product Group": "PC Clients",
        Size: "264 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 4221,
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-05-28T00:15:47+00:00",
        Quantity: 19,
        Duration: 787,
        "Customer Age Group": "30 to 35 years",
        "Customer Gender": "Male"
      },
      {
        "Product Group": "PC Clients",
        Size: "264 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 3041,
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-06-10T00:15:47+00:00",
        Quantity: 19,
        Duration: 711,
        "Customer Age Group": "30 to 35 years",
        "Customer Gender": "Male"
      },
      {
        "Product Group": "PC Clients",
        Size: "264 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 789,
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-06-20T00:15:47+00:00",
        Quantity: 19,
        Duration: 633,
        "Customer Age Group": "30 to 35 years",
        "Customer Gender": "Male"
      },
      {
        "Product Group": "PC Clients",
        Size: "264 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 789,
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-06-20T00:15:47+00:00",
        Quantity: 19,
        Duration: 577,
        "Customer Age Group": "30 to 35 years",
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "264 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 789,
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-06-20T00:15:47+00:00",
        Quantity: 19,
        Duration: 841,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "264 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 997,
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-11-24T00:15:47+00:00",
        Quantity: 19,
        Duration: 100,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "76 oz",
        Color: "red",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Canada",
        City: "Toronto",
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        Price: 1664,
        Quantity: 19,
        Duration: 2200,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "217 oz",
        Color: "red",
        Channel: "Call Center",
        Product: "Thin Clients",
        Country: "France",
        City: "Paris",
        Date: "2014-04-23T03:57:37+00:00",
        DateTime: "2014-04-11T04:40:49+00:00",
        "Date Order": "2018-05-19T03:09:59+00:00",
        Price: 2995,
        Quantity: 98,
        Duration: 310,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "251 oz",
        Color: "green",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Germany",
        City: "Hamburg",
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-11-23T15:34:42+00:00",
        Price: 1487,
        Quantity: 96,
        Duration: 150,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "PC Clients",
        Size: "292 oz",
        Color: "green",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "United Kingdom",
        City: "London",
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-11-23T15:34:42+00:00",
        Price: 9245,
        Quantity: 51,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 865,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-11-23T15:34:42+00:00",
        Quantity: 4513,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 777,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-02-08T15:34:42+00:00",
        Quantity: 4513,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 1025,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-04-18T15:34:42+00:00",
        Quantity: 4513,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 865,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-11-23T15:34:42+00:00",
        Quantity: 4513,
        "Customer Age Group": "21 years",
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 865,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-12-19T15:34:42+00:00",
        Quantity: 4513,
        "Customer Age Group": "21 years",
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 988,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-12-19T15:34:42+00:00",
        Quantity: 4513,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 865,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-12-19T15:34:42+00:00",
        Quantity: 4513,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 865,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-12-19T15:34:42+00:00",
        Quantity: 4513,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "Thin Clients",
        Country: "Australia",
        City: "Melbourne",
        Price: 250,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-06-10T15:34:42+00:00",
        Quantity: 4513,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Tablets",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "eReaders",
        Country: "Australia",
        City: "Melbourne",
        Price: 988,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-06-20T15:34:42+00:00",
        Quantity: 4513,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Tablets",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "eReaders",
        Country: "Australia",
        City: "Brisbane",
        Price: 440,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-11-24T15:34:42+00:00",
        Quantity: 4513,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Tablets",
        Size: "218 oz",
        Color: "yellow",
        Channel: "Online Store",
        Product: "eReaders",
        Country: "Australia",
        Price: 887,
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-01-03T15:34:42+00:00",
        Quantity: 4513,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Tablets",
        Size: "216 oz",
        Color: "blue",
        Channel: "Call Center",
        Product: "eReaders",
        Country: "Canada",
        City: "Toronto",
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        Price: 511,
        Quantity: 4615,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Tablets",
        Size: "284 oz",
        Color: "blue",
        Channel: "Online Store",
        Product: "eReaders",
        Country: "France",
        City: "Paris",
        Price: 981,
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-05-28T10:43:10+00:00",
        Quantity: 1854,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Tablets",
        Size: "325 oz",
        Color: "blue",
        Channel: "Online Store",
        Product: "eReaders",
        Country: "Germany",
        City: "Munich",
        Price: 3654,
        Date: "2014-04-23T03:57:37+00:00",
        DateTime: "2014-04-11T04:40:49+00:00",
        "Date Order": "2018-05-19T03:09:59+00:00",
        Quantity: 1187,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Tablets",
        Size: "144 oz",
        Color: "green",
        Channel: "Retail Store",
        Product: "eReaders",
        Country: "Canada",
        City: "Toronto",
        Date: "2016-03-28T06:21:13+00:00",
        DateTime: "2018-09-29T02:08:58+00:00",
        "Date Order": "2018-06-10T01:56:45+00:00",
        Price: 827,
        Quantity: 4772,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Tablets",
        Size: "144 oz",
        Color: "green",
        Channel: "Retail Store",
        Product: "eReaders",
        Country: "Canada",
        City: "Toronto",
        Date: "2016-03-28T06:21:13+00:00",
        DateTime: "2018-09-29T02:08:58+00:00",
        "Date Order": "2018-06-10T01:56:45+00:00",
        Price: 722,
        Quantity: 4772,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Tablets",
        Size: "283 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "eReaders",
        Country: "France",
        City: "Lyon",
        Date: "2018-12-14T17:21:46+00:00",
        DateTime: "2018-04-13T09:08:14+00:00",
        "Date Order": "2018-01-03T18:31:56+00:00",
        Price: 967,
        Quantity: 1646,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Tablets",
        Size: "283 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "eReaders",
        Country: "France",
        Date: "2018-12-14T17:21:46+00:00",
        DateTime: "2018-04-13T09:08:14+00:00",
        "Date Order": "2018-02-08T18:31:56+00:00",
        Price: 967,
        Quantity: 1646,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Smart Phones",
        Size: "283 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Smart Phones",
        Country: "France",
        City: "Marseille",
        Date: "2018-12-14T17:21:46+00:00",
        DateTime: "2018-04-13T09:08:14+00:00",
        "Date Order": "2018-02-08T18:31:56+00:00",
        Price: 967,
        Quantity: 1646,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Smart Phones",
        Size: "283 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Smart Phones",
        Country: "France",
        City: "Marseille",
        Date: "2018-12-14T17:21:46+00:00",
        DateTime: "2018-04-13T09:08:14+00:00",
        "Date Order": "2018-04-18T18:31:56+00:00",
        Price: 967,
        Quantity: 1646,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Smart Phones",
        Size: "299 oz",
        Color: "blue",
        Channel: "Online Store",
        Product: "Smart Phones",
        Country: "Germany",
        City: "Berlin",
        Date: "2018-10-05T05:30:49+00:00",
        DateTime: "2014-07-09T05:01:29+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        Price: 569,
        Quantity: 6568,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Components",
        Size: "88 oz",
        Color: "blue",
        Channel: "Retail Store",
        Product: "Smart Phones",
        Country: "United Kingdom",
        City: "London",
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-11-23T15:34:42+00:00",
        Price: 156,
        Quantity: 7585,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Smart Phones",
        Size: "161 oz",
        Color: "red",
        Channel: "Retail Store",
        Product: "Smart Phones",
        Country: "United States",
        City: "San Francisco",
        Date: "2014-04-23T03:57:37+00:00",
        DateTime: "2014-04-11T04:40:49+00:00",
        "Date Order": "2018-05-19T03:09:59+00:00",
        Price: 845,
        Quantity: 4208,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "PC Clients",
        Size: "242 oz",
        Color: "blue",
        Channel: "Online Store",
        Product: "Workstations",
        Country: "Australia",
        City: "Brisbane",
        Price: 838,
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        Quantity: 6460,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "25 oz",
        Color: "red",
        Channel: "Call Center",
        Product: "Workstations",
        Country: "Canada",
        City: "Toronto",
        Date: "2017-09-11T12:46:19+00:00",
        DateTime: "2015-03-17T13:55:31+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 51,
        Quantity: 410,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "317 oz",
        Color: "blue",
        Channel: "Online Store",
        Product: "Workstations",
        Country: "France",
        City: "Marseille",
        Price: 650,
        Date: "2017-11-30T10:28:38+00:00",
        DateTime: "2014-08-07T21:19:31+00:00",
        "Date Order": "2018-06-20T19:20:11+00:00",
        Quantity: 2307,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Tablets",
        Size: "295 oz",
        Color: "red",
        Channel: "Call Center",
        Product: "eReaders",
        Country: "Germany",
        City: "Berlin",
        Date: "2017-03-02T17:19:02+00:00",
        DateTime: "2017-07-14T20:45:55+00:00",
        "Date Order": "2018-06-10T07:41:13+00:00",
        Price: 885,
        Quantity: 6843,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Tablets",
        Size: "69 oz",
        Color: "blue",
        Channel: "Online Store",
        Product: "eReaders",
        Country: "United Kingdom",
        City: "London",
        Date: "2015-06-12T16:57:56+00:00",
        DateTime: "2018-11-12T05:01:41+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 239,
        Quantity: 7541,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Tablets",
        Size: "320 oz",
        Color: "blue",
        Channel: "Online Store",
        Product: "eReaders",
        Country: "United States",
        City: "San Francisco",
        Price: 145,
        Date: "2014-05-23T14:34:50+00:00",
        DateTime: "2015-03-07T17:57:31+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        Quantity: 7978,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Laptops",
        Size: "124 oz",
        Color: "green",
        Channel: "Retail Store",
        Product: "Notebooks",
        Country: "Australia",
        City: "Brisbane",
        Date: "2017-04-16T01:58:42+00:00",
        DateTime: "2014-07-31T09:10:03+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 534,
        Quantity: 8651,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Laptops",
        Size: "48 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Notebooks",
        Country: "Canada",
        City: "Toronto",
        Date: "2017-07-05T02:57:39+00:00",
        DateTime: "2015-12-05T20:28:25+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 716,
        Quantity: 7552,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Laptops",
        Size: "206 oz",
        Color: "green",
        Channel: "Retail Store",
        Product: "Notebooks",
        Country: "Australia",
        City: "Brisbane",
        Date: "2019-01-08T22:02:31+00:00",
        DateTime: "2018-12-10T14:33:25+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        Price: 693,
        Quantity: 8414,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Laptops",
        Size: "78 oz",
        Color: "white",
        Channel: "Online Store",
        Product: "Notebooks",
        Country: "Canada",
        City: "Toronto",
        Date: "2018-08-23T05:58:56+00:00",
        DateTime: "2016-03-06T23:45:26+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        Price: 753,
        Quantity: 6339,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Laptops",
        Size: "350 oz",
        Color: "white",
        Channel: "Call Center",
        Product: "Notebooks",
        Country: "France",
        City: "Lyon",
        Date: "2015-09-06T20:23:13+00:00",
        DateTime: "2018-07-30T17:30:32+00:00",
        "Date Order": "2018-05-28T10:43:10+00:00",
        Price: 356,
        Quantity: 1761,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Laptops",
        Size: "52 oz",
        Color: "blue",
        Channel: "Online Store",
        Product: "Notebooks",
        Country: "Germany",
        City: "Berlin",
        Date: "2017-11-22T19:44:56+00:00",
        DateTime: "2017-06-29T05:36:10+00:00",
        "Date Order": "2018-11-24T10:12:16+00:00",
        Price: 124,
        Quantity: 4673,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Tablets",
        Size: "27 oz",
        Color: "blue",
        Channel: "Retail Store",
        Product: "Tablets",
        Country: "United States",
        City: "San Francisco",
        Price: 493,
        Date: "2017-11-22T19:44:56+00:00",
        DateTime: "2017-06-29T05:36:10+00:00",
        "Date Order": "2018-11-24T10:12:16+00:00",
        Quantity: 6918,
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Laptops",
        Size: "75 oz",
        Color: "white",
        Channel: "Online Store",
        Product: "Notebooks",
        Country: "Canada",
        City: "Montreal",
        Price: 332,
        Quantity: 5130,
        Date: "2017-11-22T19:44:56+00:00",
        DateTime: "2017-06-29T05:36:10+00:00",
        "Date Order": "2018-11-24T10:12:16+00:00",
        "Customer Gender": "Female"
      },
      {
        "Product Group": "Tablets",
        Size: "155 oz",
        Color: "red",
        Channel: "Online Store",
        Product: "Tablets",
        Country: "Germany",
        City: "Berlin",
        Date: "2017-11-22T19:44:56+00:00",
        DateTime: "2017-06-29T05:36:10+00:00",
        "Date Order": "2018-11-24T10:12:16+00:00",
        Price: 152,
        Quantity: 9581,
        "Customer Gender": "Female"
      },
      {
        "Product Group": "PC Clients",
        Size: "29 oz",
        Color: "blue",
        Channel: "Retail Store",
        Product: "Desktops",
        Country: "United Kingdom",
        City: "Glasgow",
        Price: 666,
        Quantity: 2549,
        Date: "2014-05-23T14:34:50+00:00",
        DateTime: "2015-03-07T17:57:31+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        "Customer Gender": "Male"
      },
      {
        "Product Group": "Laptops",
        Size: "321 oz",
        Color: "green",
        Channel: "Call Center",
        Product: "Notebooks",
        Country: "France",
        City: "Marseille",
        Date: "2014-05-23T14:34:50+00:00",
        DateTime: "2015-03-07T17:57:31+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        Price: 1654,
        Quantity: 108,
        "Customer Gender": "Female",
        "Customer Age Group": "15 to 17 years"
      },
      {
        "Product Group": "Networks",
        Size: "142 oz",
        Color: "yellow",
        Channel: "Call Center",
        Product: "Storage",
        Country: "Germany",
        City: "Berlin",
        Date: "2017-07-05T02:57:39+00:00",
        DateTime: "2015-12-05T20:28:25+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 1190,
        Quantity: 219,
        "Customer Gender": "Female",
        "Customer Age Group": "15 to 17 years"
      },
      {
        "Product Group": "Networks",
        Size: "344 oz",
        Color: "red",
        Channel: "Online Store",
        Product: "Storage",
        Country: "United Kingdom",
        City: "Glasgow",
        Date: "2017-03-02T17:19:02+00:00",
        DateTime: "2017-07-14T20:45:55+00:00",
        "Date Order": "2018-06-10T07:41:13+00:00",
        Price: 1222,
        "Customer Gender": "Female",
        Quantity: 419,
        "Customer Age Group": "18 and 19 years"
      },
      {
        "Product Group": "Networks",
        Size: "29 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Storage",
        Date: "2016-10-22T13:57:02+00:00",
        DateTime: "2015-12-02T04:15:17+00:00",
        "Date Order": "2018-06-10T07:41:13+00:00",
        Country: "United States",
        City: "San Francisco",
        Price: 7941,
        Quantity: 60,
        "Customer Gender": "Female",
        "Customer Age Group": "18 and 19 years"
      },
      {
        "Product Group": "Smart Phones",
        Size: "283 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Smart Phones",
        Country: "Australia",
        City: "Brisbane",
        Date: "2017-02-07T12:40:29+00:00",
        DateTime: "2017-11-05T09:31:21+00:00",
        "Date Order": "2018-02-15T00:15:47+00:00",
        Price: 6152,
        Quantity: 64,
        "Customer Gender": "Female",
        "Customer Age Group": "18 and 19 years"
      },
      {
        "Product Group": "Smart Phones",
        Size: "283 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Smart Phones",
        Country: "Australia",
        City: "Brisbane",
        Date: "2017-02-07T12:40:29+00:00",
        DateTime: "2017-11-05T09:31:21+00:00",
        "Date Order": "2018-11-25T00:15:47+00:00",
        Price: 3200,
        Quantity: 64,
        "Customer Gender": "Female",
        "Customer Age Group": "20 years"
      },
      {
        "Product Group": "Smart Phones",
        Size: "283 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Smart Phones",
        Country: "Australia",
        City: "Brisbane",
        Date: "2017-02-07T12:40:29+00:00",
        DateTime: "2017-11-05T09:31:21+00:00",
        "Date Order": "2018-11-25T00:15:47+00:00",
        Price: 4500,
        Quantity: 64,
        "Customer Gender": "Female",
        "Customer Age Group": "20 years"
      },
      {
        "Product Group": "Components",
        Size: "283 oz",
        Color: "white",
        Channel: "Retail Store",
        Product: "Servers",
        Country: "Australia",
        City: "Brisbane",
        Date: "2017-02-07T12:40:29+00:00",
        DateTime: "2017-11-05T09:31:21+00:00",
        "Date Order": "2018-11-25T00:15:47+00:00",
        Price: 2200,
        Quantity: 64,
        "Customer Gender": "Female",
        "Customer Age Group": "21 years"
      },
      {
        "Product Group": "Servers",
        Size: "81 oz",
        Color: "red",
        Channel: "Online Store",
        Product: "Servers",
        Country: "Canada",
        City: "Montreal",
        Date: "2017-07-09T13:39:23+00:00",
        DateTime: "2016-05-09T02:14:36+00:00",
        "Date Order": "2018-04-18T04:43:30+00:00",
        Price: 7623,
        Quantity: 44,
        "Customer Gender": "Male",
        "Customer Age Group": "21 years"
      },
      {
        "Product Group": "Servers",
        Size: "219 oz",
        Color: "red",
        Channel: "Call Center",
        Product: "Servers",
        Country: "France",
        City: "Lyon",
        Date: "2015-06-26T04:12:42+00:00",
        DateTime: "2018-03-28T06:25:54+00:00",
        "Date Order": "2018-02-08T11:16:58+00:00",
        Price: 3971,
        Quantity: 17,
        "Customer Gender": "Male",
        "Customer Age Group": "22 to 24 years"
      },
      {
        "Product Group": "Servers",
        Size: "238 oz",
        Color: "green",
        Channel: "Call Center",
        Product: "Servers",
        Country: "Germany",
        City: "Hamburg",
        Date: "2017-09-11T12:46:19+00:00",
        DateTime: "2015-03-17T13:55:31+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 3591,
        Quantity: 11,
        "Customer Gender": "Male",
        "Customer Age Group": "22 to 24 years"
      },
      {
        "Product Group": "Servers",
        Size: "286 oz",
        Color: "green",
        Channel: "Online Store",
        Product: "Servers",
        Country: "United Kingdom",
        City: "London",
        Date: "2016-03-28T06:21:13+00:00",
        DateTime: "2018-09-29T02:08:58+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 2564,
        Quantity: 61,
        "Customer Gender": "Male",
        "Customer Age Group": "25 to 29 years"
      },
      {
        "Product Group": "Servers",
        Size: "333 oz",
        Color: "green",
        Channel: "Online Store",
        Product: "Servers",
        Country: "United States",
        City: "Los Angeles",
        Date: "2018-12-14T17:21:46+00:00",
        DateTime: "2018-04-13T09:08:14+00:00",
        "Date Order": "2018-01-03T18:31:56+00:00",
        Price: 5165,
        Quantity: 13,
        "Customer Gender": "Male",
        "Customer Age Group": "25 to 29 years"
      },
      {
        "Product Group": "PC Clients",
        Size: "242 oz",
        Color: "green",
        Channel: "Retail Store",
        Product: "Desktops",
        Country: "Australia",
        Date: "2016-12-11T05:03:28+00:00",
        DateTime: "2015-04-17T02:56:57+00:00",
        "Date Order": "2018-11-23T15:34:42+00:00",
        Price: 2344,
        Quantity: 56,
        "Customer Gender": "Male",
        "Customer Age Group": "30 to 34 years"
      },
      {
        "Product Group": "PC Clients",
        Size: "67 oz",
        Color: "red",
        Channel: "Online Store",
        Product: "Desktops",
        Country: "Canada",
        City: "Montreal",
        Date: "2014-04-23T03:57:37+00:00",
        DateTime: "2014-04-11T04:40:49+00:00",
        "Date Order": "2018-05-19T03:09:59+00:00",
        Price: 3864,
        Quantity: 24,
        "Customer Gender": "Male",
        "Customer Age Group": "15 to 17 years"
      },
      {
        "Product Group": "PC Clients",
        Size: "40 oz",
        Color: "yellow",
        Channel: "Call Center",
        Product: "Desktops",
        Country: "France",
        City: "Marseille",
        Date: "2018-05-05T06:47:38+00:00",
        DateTime: "2014-01-16T16:18:13+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 9845,
        Quantity: 23,
        "Customer Gender": "Male",
        "Customer Age Group": "15 to 17 years"
      },
      {
        "Product Group": "PC Clients",
        Size: "201 oz",
        Color: "red",
        Channel: "Call Center",
        Product: "Desktops",
        Country: "Germany",
        City: "Hamburg",
        Date: "2018-09-11T22:10:05+00:00",
        DateTime: "2014-01-19T21:08:55+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 4822,
        Quantity: 27,
        "Customer Gender": "Male",
        "Customer Age Group": "15 to 17 years"
      },
      {
        "Product Group": "PC Clients",
        Size: "201 oz",
        Color: "red",
        Channel: "Call Center",
        Product: "Desktops",
        Country: "Germany",
        Date: "2018-09-11T22:10:05+00:00",
        DateTime: "2014-01-19T21:08:55+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 2330,
        Quantity: 27,
        "Customer Gender": "Male",
        "Customer Age Group": "15 to 17 years"
      },
      {
        "Product Group": "PC Clients",
        Size: "201 oz",
        Color: "red",
        Channel: "Online Store",
        Product: "Desktops",
        Country: "Germany",
        City: "Hamburg",
        Date: "2018-09-11T22:10:05+00:00",
        DateTime: "2014-01-19T21:08:55+00:00",
        "Date Order": "2018-11-24T21:43:16+00:00",
        Price: 3660,
        Quantity: 27,
        "Customer Gender": "Male",
        "Customer Age Group": "15 to 17 years"
      },
      {
        "Product Group": "PC Clients",
        Size: "201 oz",
        Color: "red",
        Channel: "Online Store",
        Product: "Desktops",
        Country: "Germany",
        Date: "2018-09-11T22:10:05+00:00",
        DateTime: "2014-01-19T21:08:55+00:00",
        "Date Order": "2018-11-24T23:43:16+00:00",
        Price: 2330,
        Quantity: 27,
        "Customer Gender": "Female",
        "Customer Age Group": "15 to 17 years"
      },
      {
        "Product Group": "PC Clients",
        Size: "201 oz",
        Color: "red",
        Channel: "Online Store",
        Product: "Workstations",
        Country: "Germany",
        City: "Hamburg",
        Date: "2018-09-11T22:10:05+00:00",
        DateTime: "2014-01-19T21:08:55+00:00",
        "Date Order": "2018-12-18T23:43:16+00:00",
        Price: 2330,
        Quantity: 27,
        "Customer Gender": "Female",
        "Customer Age Group": "15 to 17 years"
      }
    ];
  }
  