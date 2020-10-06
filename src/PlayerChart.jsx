import {Line} from 'react-chartjs-2';
import React, {useState} from 'react';

function PlayerChart({chartData, title, playerName}) {
    
    //const labels = playerData.
    
    function kFormatter(num) {
        if ((Math.abs(num) > 999) && (Math.abs(num) < 1000000)) {
            return Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k'
        } else if (Math.abs(num) > 999999) {
            return Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'm'
        } else {
            return Math.sign(num)*Math.abs(num)
        }
         
      }

    const state = {
        labels: chartData.labels,
        datasets: [
            {
            label: playerName,
            fill: false,
            lineTension: 0.5,
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 1,
            data: chartData.data
            }
        ]
    }

    return (
        <div>
        <Line
            data={state}
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
                            var title = tooltipItem[0].xLabel;
                            //var title = data.labels[tooltipItem.datasetIndex];
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
                        labelString: title.capitalize()
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                return kFormatter(value);
                            }
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                        display: true,
                        labelString: 'Gameweek'
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                return kFormatter(value);
                            }
                        }
                    }]
                },
                legend:{
                    display:true,
                    position:'right'
                }
            }}
        />
        </div>
    );
}

export default PlayerChart; 
  
    
  
