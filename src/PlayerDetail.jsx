import React, {useEffect, useState} from 'react';
import { Button } from 'react-bootstrap';
import PlayerChart from './PlayerChart'
import { RotateSpinner } from 'react-spinners-kit';

function PlayerDetail({player, playerData}) {
    
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    
    const returnData = (dataName) => {
        console.log(`top of return data ${typeof playerData}`)
        var labels = [];
        var data = [];
        const history = playerData.history;
        for (const [key, value] of Object.entries(history)) {
            labels.push(Number(key) + 1);
            data.push(value[dataName]);
        }
        console.log(labels);
        return {'labels': labels, 'data' : data};
    }
    
    const [chartOption, setChartOption] = useState('selected');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (loading) {
            if ((typeof playerData) === 'object') {
                if (playerData.history) {
                    returnData(chartOption);
                    setLoading(false);
                }
            }
        } 
    });

    return loading ? (
        
        <div className="d-flex flex-column align-items-center">
            < RotateSpinner />
            <h2 className="mt-2">Connecting</h2>
        </div>
    ) : (
        <div>
            {player.web_name}
            
            <PlayerChart 
            chartData={returnData(chartOption)} 
            title={chartOption} 
            playerName={player.web_name}/>
            
        </div>
        
    );
}

export default PlayerDetail;
