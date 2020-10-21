import { Line } from 'react-chartjs-2';
import React from 'react';
import { kFormatter } from '../utils/StringUtils'
import { dynamicColor } from '../utils/ChartUtils'
import '../App.css';

const PlayerChart = ({chartData, title, playerName}) => {
    let color = dynamicColor();
    
    const state = {
        labels: chartData.labels,
        datasets: [
            {
            label: playerName,
            fill: false,
            lineTension: 0.2,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            data: chartData.data
            }
        ]
    }

    return (
        <div className="container-fluid">
        <Line
            className="line"
            data={state}
            width={800}
            height={400}
            options={{
                title:{
                    display:false,
                    text:title.capitalize(),
                    fontSize:20
                },
                tooltips: {
                    callbacks: {
                        enabled: true,
                        title: function(tooltipItem, data) {
                            let title = tooltipItem[0].xLabel;
                            //let title = data.labels[tooltipItem.datasetIndex];
                            return (`GW${title}`);
                        },
                        label: function(tooltipItem, data) {
                            return kFormatter(tooltipItem.yLabel);
                        }
                    }
                },
                scales:{
                    yAxes: [{
                        scaleLabel: {
                        display: true,
                        labelString: title.capitalize(),
                        fontColor: 'rgba(255,255,255,.9)'
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                return kFormatter(value);
                            }
                        },
                        gridLines: {
                            color:'rgba(255,255,255,.9)',
                            lineWidth: 0.3
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                        display: true,
                        fontColor: 'rgba(255,255,255,.9)',
                        labelString: 'Gameweek'
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                return kFormatter(value);
                            }
                        },
                        gridLines: {
                            color:'rgba(255,255,255,.9)',
                            lineWidth: 0.3
                        }
                    }]
                    
                },
                legend:{
                    display:true,
                    position:'right'
                },
        }}
        />
        </div>
    );
}

export default PlayerChart; 
  
    
  
