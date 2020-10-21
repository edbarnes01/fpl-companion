import React from 'react';
import {Line} from 'react-chartjs-2';
import { kFormatter, readable } from '../utils/StringUtils'



const PlayerCompareChart = ({chartData, title}) => {
    const state = {
        labels: [0,1,2,3],
        datasets: chartData
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
                        text: readable(title),
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
                            labelString: readable(title),
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
    
};

export default PlayerCompareChart;

/*
<div>
    {JSON.stringify(chartData, null, 2)}
</div>


*/