import React, {useEffect, useState} from 'react';
import { Dropdown } from 'react-bootstrap';
import PlayerChart from './PlayerChart';
import { MetroSpinner } from 'react-spinners-kit';
import { accumOptions } from '../utils/ChartUtils';
import { readable } from '../utils/StringUtils';

const PlayerDetail = ({player, playerData}) => {
    
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);

    const returnData = (option) => {
        console.log(`top of return data ${typeof playerData}`)
        let labels = [];
        let data = [];
        let accumData = [];
        const history = playerData.history;
        for (const [key, value] of Object.entries(history)) {
            labels.push(Number(key) + 1);
            data.push(value[option]);
        }

        if (accumOptions().includes(option)) {
            data.reduce(function(a,b,i) { 
                return accumData[i] = a+b; 
            },0);
        }

        console.log(labels);
        return {'labels': labels, 'data' : accumOptions().includes(option) ? accumData : data};
    }

    const labelOptions = [
        "total_points", "minutes", "goals_scored", 
    "assists", "yellow_cards", "red_cards", "bonus", 
    "bps", "influence", "creativity", "threat", 
    "ict_index",  "value", "selected", "transfers_in",
    "transfers_out"]

    const [chartOption, setChartOption] = useState('Options');
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
            < MetroSpinner />
            <h2 className="mt-2">Loading</h2>
        </div>
    ) : (
        <div>
            {player.web_name}
            <div>
                <Dropdown className="dropdown-pad">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {readable(chartOption)}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {(labelOptions.sort()).map((option) => 
                            <Dropdown.Item 
                            key={option}
                            href="#" 
                            onClick={() => {setChartOption(option)}}>
                                {readable(option)}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
                
                
                
                {chartOption != 'Options' && (
                <PlayerChart 
                chartData={returnData(chartOption)} 
                title={chartOption} 
                playerName={player.web_name}/>
                )}
            </div>
        </div>
        
    );
}

export default PlayerDetail;
