import React, { useEffect, useState } from 'react';
import allSettled from 'promise.allsettled';
import http from 'axios';
import { Dropdown } from 'react-bootstrap';
import { chartDataColors, accumOptions } from '../utils/ChartUtils'
import TeamChart from './TeamChart';


const TeamAnalysisView = ({team, players}) => {

    const [chartOption, setChartOption] = useState('Options');
    useEffect(() => {
        updateChartData(makeDataSet(chartOption))
    },[chartOption]);

    const [chartData, updateChartData] = useState();
    useEffect(() => {
        setChartOption('Options');
        console.log('load me baby');
    }, [team]);

    const [loading, setLoading] = useState(true);
    
    const camelize = (str) => {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return word.toUpperCase();
        }).replace(/\s+/g, ' ');
    }

    const readable = (str) => {
        return camelize(str.replace(/_/g, ' '))
    }

    const labelOptions = [
        "total_points", "minutes", "goals_scored", 
    "assists", "yellow_cards", "red_cards", "bonus", 
    "bps", "influence", "creativity", "threat", 
    "ict_index",  "value", "selected", "transfers_in",
    "transfers_out"]

    const getPlayerData = async (listPlayerIds) => {
        let playerList = [];
        const playerData = await allSettled(listPlayerIds.map((playerId) => http.get(`https://fantasy.premierleague.com/api/element-summary/${playerId}/`)))
        .then((results) => {
            //console.log(results)
            results.reduce(async (memo, playerData) => {
                if (playerData.status === 'fulfilled') {
                    //console.log(playerData);
                    //playerlist.push({'id': })

                    playerList.push(Object(playerData.value.data.history));
                }
            });
        })
        .catch((error) => console.log(error)); 
        return playerList;
    }

    const returnPlayerIds = (teamId) => {
        let playerList = [];
        players.forEach(player => {
            if (player.team === teamId) {
                playerList.push(
                    player.id
                );
            }
        })
        return playerList;   
    }

    const returnPlayerName = (playerId) => {
        let playerList = [];
        players.forEach(player => {
            if (player.id === playerId) {
                playerList.push(
                    player.web_name
                );
            }
        })
        return playerList;   
    };

    const makeDataSet = async (selection) => {
        let labels = [];
        let datasets = [];
        const playerIds = returnPlayerIds(team.id);

        const playerData = await getPlayerData(playerIds)
        .then((results) => {
            labels = Array.from({length: 4}, (_, i) => i + 1)
            
            results.map((player, i) => {
                let playerDataSet = [];
                let accumData = [];
                console.log(i);
                console.log(chartDataColors());
                let color = (`rgba(${chartDataColors()[i]}, 0.9)`);
                console.log(color);
                player.map((fixture) => {
                    playerDataSet.push(fixture[selection]);
                })
                
                if (accumOptions().includes(selection)) {
                    playerDataSet.reduce(function(a,b,i) { 
                        return accumData[i] = a+b; 
                    },0);
                }
                
                const playerReturn = {
                    label: returnPlayerName(player[0].element),
                    fill: false,
                    lineTension: 0.2,
                    backgroundColor: color,
                    borderColor: color,
                    borderWidth: 1,
                    data: ((accumOptions().includes(selection)) ? accumData : playerDataSet)
                }
                datasets.push(playerReturn);
            });
            
        })
        .catch((error) => console.log(error));
        updateChartData({'labels': labels, 'datasets' : datasets})
        
    }

    return (
        <div className="container-fluid">
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

            {(chartOption === 'Options') && 
                <div className="container-fluid">
                    Choose an Option 
                </div>

            }
            
            {(chartOption != 'Options') &&
                <div className="container-fluid">
                    <h2>{team.name}</h2>
                    <TeamChart 
                        chartData={chartData}
                        title={readable(chartOption) }
                        team={team}
                    />
                </div>
            }
        </div>

    );
}

export default TeamAnalysisView;
