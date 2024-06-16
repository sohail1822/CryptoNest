import React from "react";
import "./chart.css";
import Chart from "react-apexcharts";
const AChart = () => {
  return (
    <div>
      <Chart
        type="donut"
        width={400}
        height={400}
        series={[26.7, 22.6, 15.18, 5.95,3.83,25.7]}
        
        options={{
            
    colors:['#8a3ffc', '#f4b97e', '#16c784',"#23ddf4", '#ced6e5', '#ff765e'],
  

          labels: ["BTC", "ETH", "SHIB", "DODGE","XRP","Others"],
          title: { text: "Token Allocation" },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                
                },
                size:"50%",
                position:"bottom",
              },
              
            },
            
          },
          legend: {
  show: true,
  showForSingleSeries: true,
  showForNullSeries: true,
  showForZeroSeries: true,
  position: 'bottom',
  horizontalAlign: 'left',
  floating: false,
  fontSize: '14px',
  fontFamily: 'Helvetica, Arial',
  fontWeight: 400,
  formatter: undefined,
  inverseOrder: false,
  width: undefined,
  height: undefined,
  tooltipHoverFormatter: undefined,
  customLegendItems: [],
  offsetX: 0,
  offsetY: 0,
  labels: {
    colors: undefined, useSeriesColors: false
  }
  ,
  markers: {
    width: 12, height: 12, strokeWidth: 0, strokeColor: '#fff', fillColors: undefined, radius: 2, customHTML: undefined, onClick: undefined, offsetX: 0, offsetY: 0
  }
  ,
  itemMargin: {
    horizontal: 100, vertical: 0
  }
  ,
  onItemClick: {
    toggleDataSeries: true
  }
  ,
  onItemHover: {
    highlightDataSeries: true
  }
  ,
}
,
          dataLabels:{
            enabled:false,
          }
        }}
      />
    </div>
  );
};

export default AChart;
