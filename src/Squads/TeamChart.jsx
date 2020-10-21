import {Line} from 'react-chartjs-2';
import React from 'react';


const TeamChart = ({chartData, title, team}) => {
    const data = {
        labels: chartData.labels,
        datasets: chartData.datasets
    }

    const kFormatter = (num) => {
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
                            //console.log(tooltipItem[0]);
                            return(`GW ${tooltipItem[0].xLabel}`);
                        },
                        afterTitle: function(tooltipItem, data) {
                            //console.log(data.datasets[tooltipItem[0].datasetIndex]);
                            //console.log(tooltipItem);
                            let labels = [];
                            tooltipItem.map((item) => {
                                //console.log(item.datasetIndex);
                                labels.push(data.datasets[item.datasetIndex].label)
                            });
                            return labels;
                        },
                        label: function(tooltipItem, data) {
                            console.log(data.datasets[tooltipItem.datasetIndex].label);
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
                        },
                        gridLines: {
                            color:'rgba(255,255,255,.9)',
                            lineWidth: 0.3
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
                maintainAspectRatio: true
                }}
            />
        </div>
    );
}

export default TeamChart;

