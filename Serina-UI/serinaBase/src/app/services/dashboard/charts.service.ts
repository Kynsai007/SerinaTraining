import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare let google: any;

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  userId:number;
  vendorTabs = "Process";
  exceptionVendorTab = 'Total';

  constructor(private http : HttpClient) {}

  drawStackedChart(id,data1) {
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawStacked);

    function drawStacked() {
      let data = google.visualization.arrayToDataTable(data1);

      let options1 = {
        title: 'Processed vs Downloaded per Service Provider',
        titlePosition: 'none',
        titleTextStyle: {
          color: 'red',
          fontSize: 13 ,
          marginLeft:'10'
        },
        legend: { position: 'bottom', maxLines: 3 },
        bar: { groupWidth: '40%' },
        isStacked: true,
        annotations: {
          alwaysOutside: true,
          // textStyle: {
          //   color: '#0d0b3c',
          //   auraColor: 'none',
          //   gridlines: {
          //     color: 'transparent',
          //   },
          // },
        },
        colors: ['#F4D47C', '#7F86B5'],
        animation: {
          duration: 500,
          startup: true,
        },
        hAxis: {
          gridlines: {
            color: 'transparent',
            count: 0,
          },
          baselineColor: '#ffffff',
          slantedText: true,
          slantedTextAngle: 10,
          maxTextLines: 5,
          minTextSpacing: 5,
          textStyle: {
            color: '#0D0B3C',
            fontSize: 10, // 12, 18 whatever you want (don't specify px)
            bold: true, // true or false
            italic: false, // true of false
          },
        },
        vAxis: {
          title: '',
          gridlines: {
            color: '#f3f3f3',
          },
          baselineColor: '#d3d3d3',
          textStyle: {
            color: '#0D0B3C',
            fontSize: 10, // 12, 18 whatever you want (don't specify px)
            bold: true, // true or false
            italic: false, // true of false
          },
          // ticks: [0,10,20,30,40,50,60,70,80,100]
        },
      };

      let chart = new google.visualization.ColumnChart(
        document.getElementById(id)
      );
      chart.draw(data, options1);
    }
  }

  // drawColumnChart(id) {
  //   google.charts.load('current', { packages: ['corechart', 'bar'] });
  //   google.charts.setOnLoadCallback(drawBasic);

  //   function drawBasic() {
  //     // let data = new google.visualization.DataTable();
  //     // data.addColumn('string', 'Service Provider');
  //     // data.addColumn('number', 'Amount');

  //     // data.addRows([
  //     //   [{v: ['SEWA', 0, 0], f: 'SEWA'}, 1],
  //     //   [{v: ['SECO', 0, 0], f: 'SECO'}, 2],
  //     //   [{v: ['ENOC', 0, 0], f:'ENOC'}, 3],
  //     //   [{v: ['DEWA', 0, 0], f: 'DEWA'}, 4]
  //     // ]);

  //     let data = google.visualization.arrayToDataTable();

  //     let options = {
  //       title: 'Sp Amount Status',
  //       textStyle: {
  //         color: '#272727',
  //         fontSize: 13 
  //       },
  //       legend: { position: 'bottom', maxLines: 3 },
  //       bar: { groupWidth: '40%' },
  //       annotations: {
  //         // alwaysOutside: true,
  //         textStyle: {
  //           color: '#0d0b3c',
  //           auraColor: 'none',
  //           gridlines: {
  //             color: 'transparent',
  //           },
  //         },
  //       },
  //       colors: ['#A3B8C5'],
  //       animation: {
  //         duration: 500,
  //         startup: true,
  //       },
  //       hAxis: {
  //         gridlines: {
  //           color: 'transparent',
  //           count: 0,
  //         },
  //         baselineColor: '#ffffff',
  //         textStyle: {
  //           color: '#0D0B3C',
  //           fontSize: 10, // 12, 18 whatever you want (don't specify px)
  //           bold: true, // true or false
  //           italic: false, // true of false
  //         },
  //       },
  //       vAxis: {
  //         title: '',
  //         gridlines: {
  //           color: '#f3f3f3',
  //         },
  //         baselineColor: '#d3d3d3',
  //         textStyle: {
  //           color: '#0D0B3C',
  //           fontSize: 10, // 12, 18 whatever you want (don't specify px)
  //           bold: true, // true or false
  //           italic: false, // true of false
  //         },
  //         // ticks: [0,10,20,30,40,50,60,70,80,100]
  //       },
  //     };

  //     let chart = new google.visualization.ColumnChart(
  //       document.getElementById(id)
  //     );

  //     chart.draw(data, options);
  //   }
  // }

  drawColumnChartPending(id) {
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawBasic);

    function drawBasic() {
      let data = google.visualization.arrayToDataTable();

      let options = {
        title: 'Pending Invoices',
        textStyle: {
          color: '#272727',
          fontSize: 13 
        },
        legend: { position: 'bottom', maxLines: 3 },
        bar: { groupWidth: '40%' },
        annotations: {
          alwaysOutside: true,
          textStyle: {
            color: '#0d0b3c',
            auraColor: 'none',
            gridlines: {
              color: 'transparent',
            },
          },
        },
        colors: ['#DCCAA6'],
        animation: {
          duration: 500,
          startup: true,
        },
        hAxis: {
          gridlines: {
            color: 'transparent',
            count: 0,
          },
          baselineColor: 'green',
          slantedText: true,
          slantedTextAngle: 10,
          maxTextLines: 5,
          minTextSpacing: 5,
          textStyle: {
            color: '#0D0B3C',
            fontSize: 10, // 12, 18 whatever you want (don't specify px)
            bold: true, // true or false
            italic: false, // true of false
          },
        },
        vAxis: {
          title: '',
          gridlines: {
            color: '#f3f3f3',
          },
          baselineColor: '#d3d3d3',
          textStyle: {
            color: '#0D0B3C',
            fontSize: 10, // 12, 18 whatever you want (don't specify px)
            bold: true, // true or false
            italic: false, // true of false
          },
        },
      };

      let chart = new google.visualization.ColumnChart(
        document.getElementById(id)
      );

      chart.draw(data, options);
    }
  }

  drawPieChart(id,tittle,chartData) {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      let data = google.visualization.arrayToDataTable(chartData);

      let options = {
        title: tittle,
        titlePosition: 'none',
        textStyle: {
          color: '#272727',
          fontSize: 13 
        },
        pieHole: 0.4,
        chartArea: { left: 20, width: '80%', height: '75%' },
        slices: {
          0: { color: '#89D390' },
          1: { color: '#FB4953' },
          2: { color: '#5167B2' },
        },
      };

      let chart = new google.visualization.PieChart(
        document.getElementById(id)
      );
      chart.draw(data, options);
    }
  }

  // vendor
  drawColumnChart(id, color, tittle,chartData) {
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawBasic);

    function drawBasic() {
      
      let data = google.visualization.arrayToDataTable(chartData);

      let options = {
        title: tittle,
        // width: 500,
        // height: 250,
        titlePosition: 'none',
        textStyle: {
          color: '#272727',
          fontSize: 13 
        },
        legend: { position: 'bottom', maxLines: 3 },
        bar: { groupWidth: '25%' },
        annotations: {
          alwaysOutside: true,
        },
        colors: [color],
        animation: {
          duration: 500,
          startup: true,
        },
        hAxis: {
          gridlines: {
            color: 'transparent',
            count: 0,
          },
          baselineColor: '#ffffff',
          slantedText: true,
          slantedTextAngle: 10,
          maxTextLines: 5,
          minTextSpacing: 5,
          textStyle: {
            color: '#0D0B3C',
            fontSize: 10, // 12, 18 whatever you want (don't specify px)
            bold: true, // true or false
            italic: false, // true of false
          },
        },
        vAxis: {
          title: '',
          gridlines: {
            color: '#f3f3f3',
          },
          baselineColor: '#d3d3d3',
          textStyle: {
            color: '#0D0B3C',
            fontSize: 10, // 12, 18 whatever you want (don't specify px)
            bold: true, // true or false
            italic: false, // true of false
          },
          // ticks: [0,10,20,30,40,50,60,70,80,100]
        },
      };

      let chart = new google.visualization.ColumnChart(
        document.getElementById(id)
      );

      chart.draw(data, options);
    }
  }

  drawColumnChart_dual(id, color, tittle, chartData) {
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawBasic);

    // function getTickInterval(maxVal) {
    //   let power = Math.floor(Math.log10(maxVal));
    //   let interval = Math.pow(10, power - 1);
    //   return interval;
    // }
    function drawBasic() {

      // let yaxisVa = []
      // chartData.forEach((el, i) => {
      //   if (i != 0) {
      //     yaxisVa.push(el[1])
      //   }
      // });
      // let maxVal = Math.max.apply(null, yaxisVa);
      // let tickInterval = getTickInterval(maxVal);
      // let tickValues = [];
      // for (let i = 0; i <= 7; i++) {
      //   tickValues.push(Math.round(maxVal / 5 * i / tickInterval) * tickInterval);
      // }
      let data = google.visualization.arrayToDataTable(chartData);

      let options = {
        title: tittle,
        // width: 500,
        // height: 250,
        titlePosition: 'none',
        textStyle: {
          color: '#272727',
          fontSize: 13
        },
        legend: { position: 'bottom' },
        bar: { groupWidth: '25%' },
        annotations: {
          alwaysOutside: true,
          position: 'out'
        },
        colors: ['#f15e5e', '#4cbc9a'],
        animation: {
          duration: 500,
          startup: true,
        },
        hAxis: {
          gridlines: {
            color: 'transparent',
            count: 0,
          },
          baselineColor: '#ffffff',
          slantedText: true,
          slantedTextAngle: 10,
          maxTextLines: 5,
          minTextSpacing: 5,
          textStyle: {
            color: '#0D0B3C',
            fontSize: 10, // 12, 18 whatever you want (don't specify px)
            bold: true, // true or false
            italic: false, // true of false
          },
        },
        vAxis: {
          title: '',
          0: { title: 'amount' },
          1: { title: 'invoiceCount' },
          gridlines: {
            color: '#f3f3f3',
          },
          baselineColor: '#d3d3d3',
          textStyle: {
            color: '#0D0B3C',
            fontSize: 10, // 12, 18 whatever you want (don't specify px)
            bold: true, // true or false
            italic: false, // true of false
          },
          // ticks: tickValues,
          // interval: tickInterval
        },
        series: {
          0: { targetAxisIndex: 0 },
          1: { targetAxisIndex: 1 }
        },
      };

      let chart = new google.visualization.ColumnChart(
        document.getElementById(id)
      );

      chart.draw(data, options);
    }
  }

  drawBarChartVendor(id,chartData) {
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(drawBasic);

    function drawBasic() {
      let data = google.visualization.arrayToDataTable(chartData);

      let options = {
        title: 'Invoice Count by Vendor',
        titlePosition: 'none',
        textStyle: {
          color: '#272727',
          fontSize: 13 
        },
        legend: { position: 'bottom', maxLines: 3 },
        bar: { groupWidth: '50%' },
        annotations: {
          // textStyle: {
          //   color: '#0d0b3c',
          //   fontSize: 16,
          //   auraColor: 'none',
          //   gridlines: {
          //     color: 'transparent',
          //   },
          // },
        },
        colors: ['#9BD7D1'],
        animation: {
          duration: 500,
          startup: true,
        },
        vAxis: {
          gridlines: {
            color: 'transparent',
            count: 0,
          },

          textStyle: {
            color: '#0D0B3C',
            fontSize: 10, // 12, 18 whatever you want (don't specify px)
            bold: true, // true or false
            italic: false, // true of false
          },
        },
        hAxis: {
          title: '',
          gridlines: {
            color: '#f3f3f3',
          },
          baselineColor: '#d3d3d3',
          textStyle: {
            color: '#0D0B3C',
            fontSize: 10, // 12, 18 whatever you want (don't specify px)
            bold: true, // true or false
            italic: false, // true of false
          },
          // ticks: [0,10,20,30,40,50,60,70,80,100]
        },
      };

      var chart = new google.visualization.BarChart(
        document.getElementById(id)
      );

      chart.draw(data, options);
    }
  }
  
  drawStckedChart_X(id,chartdata){
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawStacked);

    function drawStacked() {
          let data = google.visualization.arrayToDataTable(chartdata);

          // let options = {
          //   title: 'Invoice Count by Vendor',
          //   chartArea: {width: '50%'},
          //   hAxis: {
          //     title: 'Total Population',
          //     minValue: 0,
          //   },
          //   vAxis: {
          //     title: 'City'
          //   }
          // };
          let options = {
            title: 'Invoice Count by Vendor',
            titlePosition: 'none',
            isStacked: true,
            textStyle: {
              color: '#272727',
              fontSize: 13 
            },
            legend: { position: 'bottom', maxLines: 3 },
            bar: { groupWidth: '50%' },
            annotations: {
              // textStyle: {
              //   color: '#0d0b3c',
              //   fontSize: 16,
              //   auraColor: 'none',
              //   gridlines: {
              //     color: 'transparent',
              //   },
              // },
            },
            colors: ['#9BD7D1','#FB4953'],
            animation: {
              duration: 500,
              startup: true,
            },
            vAxis: {
              gridlines: {
                color: 'transparent',
                count: 0,
              },
    
              textStyle: {
                color: '#0D0B3C',
                fontSize: 10, // 12, 18 whatever you want (don't specify px)
                bold: true, // true or false
                italic: false, // true of false
              },
            },
            hAxis: {
              title: '',
              gridlines: {
                color: '#f3f3f3',
              },
              baselineColor: '#d3d3d3',
              textStyle: {
                color: '#0D0B3C',
                fontSize: 10, // 12, 18 whatever you want (don't specify px)
                bold: true, // true or false
                italic: false, // true of false
              },
              // ticks: [0,10,20,30,40,50,60,70,80,100]
            },
          };
          let chart = new google.visualization.BarChart(document.getElementById(id));
          chart.draw(data, options);
        }
  }

  drawProgress(id,data) {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data1 = google.visualization.arrayToDataTable(data);

      var options = {
        title: '',
        // width: 400,
        height: 80,
        isStacked: true,
        colors: ['#5dc5cc', '#FFA500', '#008000'],
        bar: { horizontal: true,groupWidth: '100%' },
        legend: { position: 'bottom', maxLines: 3 },
      };

      var chart = new google.visualization.BarChart(document.getElementById(id));

      chart.draw(data1, options);
    }
    

  }


// vendor process reports API's
  getInvoiceCountByEntity(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/invcountbyentity/${this.userId}/3${filter}`);
  }
  getPagesCountByEntity(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/invpagecountbyentity/${this.userId}/3${filter}`);
  }
  getInvoiceCountByVendorData(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/invcountbyvendor/${this.userId}/3${filter}`);
  }
  getRejectInvoicesCount(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/rejectedinvcountbyvendor/${this.userId}/3${filter}`);
  }
  getInvoiceCountBySource(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/invcountbysource/${this.userId}/3${filter}`);
  }
  getPendingInvByAmount(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/pendinginvbyamount/${this.userId}/3${filter}`);
  }
  getAgeingReport(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/ageingreport/${this.userId}/3${filter}`);
  }
  getvendorBasedSummary(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/vendorbasedsummary/${this.userId}/3${filter}`);
  }

  /*vendor exception reports API's */
  getvendorExceptionSummary(query): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/exceptionsummary/${this.userId}/3${query}`);
  }
  getEmailExceptionSummary(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/emailexceptions${filter}`);
  }

  getOnbordedData(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/onboardedVendorsByMonth/${this.userId}  ${filter}`);
  }
  /*service based process reports*/
  getServiceBasedSummary(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/vendorbasedsummary/${this.userId}/3${filter}`);
  }
  getPendingInvByAmountSP(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/servpendingbyamount/${this.userId}/3${filter}`);
  }
  getProcessByAmountSP(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/servprocessedbyamount/${this.userId}/3${filter}`);
  }
  getProcessVsTotal_OverallSP(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/overallserv/${this.userId}/3${filter}`);
  }
  getProcessVsTotalSP(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/overallservbyprovider/${this.userId}/3${filter}`);
  }



  /*vendor portal API */
  getTotalInvoiceData(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/getinvoicesforvendor/${this.userId}${filter}`);
  }
  getUnderprocessInvoiceData(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/getunderProcessInvforvendor/${this.userId}${filter}`);
  }
  getInvoicedData(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/getInvoicedforVendor/${this.userId}${filter}`);
  }
  getCollectionData(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/getCollectionsforVendor/${this.userId}${filter}`);
  }
  getRejectedData(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/getRejectedforVendor/${this.userId}${filter}`);
  }

  readAgingReportVendor(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/getAgeingforVendor/${this.userId}${filter}`);
  }
  readMostOrderedReport(filter): Observable<any>{
    return this.http.get(`${environment.apiUrl}/${environment.apiVersion}/dashboard/getmostOrderedItems/${this.userId}${filter}`);
  }
}
