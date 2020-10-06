import {Line} from 'react-chartjs-2';
import React from 'react';


function TeamChart({chartData, title, team}) {
    const data = {
        labels: chartData.labels,
        datasets: chartData.datasets
    }

    function kFormatter(num) {
        if ((Math.abs(num) > 999) && (Math.abs(num) < 1000000)) {
            return Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k'
        } else if (Math.abs(num) > 999999) {
            return Math.sign(num)*((Math.abs(num)/1000000).toFixed(1)) + 'm'
        } else {
            return Math.sign(num)*Math.abs(num)
        }  
    }

    return (
        <div className="container-fluid">
            <h2>{title}</h2>
            <Line
                data={data}
                width={1000}
                height={500}
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
                            console.log(tooltipItem[0]);
                            return(`GW ${tooltipItem[0].xLabel}`);
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
                },
                maintainAspectRatio: true
                }}
            />
        </div>
    );
}

export default TeamChart;

