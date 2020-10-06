import React, { useEffect, useState } from 'react';
import allSettled from 'promise.allsettled';
import http from 'axios';
import { Dropdown, Button, Col} from 'react-bootstrap';
import TeamChart from './TeamChart';


function TeamAnalysisView({team, players}){
    
    var dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

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
    
    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return word.toUpperCase();
        }).replace(/\s+/g, ' ');
    }

    function readable(str) {
        return camelize(str.replace(/_/g, ' '))
    }

    const labelOptions = [
        "total_points", "minutes", "goals_scored", 
    "assists", "yellow_cards", "red_cards", "bonus", 
    "bps", "influence", "creativity", "threat", 
    "ict_index",  "value", "selected", "transfers_in",
    "transfers_out"]

    const getPlayerData = async (listPlayerIds) => {
        var playerList = [];
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
        var playerList = [];
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
        var playerList = [];
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
        var labels = [];
        var datasets = [];
        const playerIds = returnPlayerIds(team.id);

        const playerData = await getPlayerData(playerIds)
        .then((results) => {
            labels = Array.from({length: 4}, (_, i) => i + 1)
            
            results.map((player) => {
                var playerDataSet = [];

                player.map((fixture) => {
                    playerDataSet.push(fixture[selection]);
                })

                const playerReturn = {
                    label: returnPlayerName(player[0].element),
                    fill: false,
                    lineTension: 0,
                    fillColor: "rgba(000,111,111,55)",
                    strokeColor: "rgba(000,111,111,55)",
                    pointColor: "rgba(000,111,111,55)",
                    backgroundColor: player.element,
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 1,
                    data: playerDataSet
                }
                datasets.push(playerReturn);
            });
            
        })
        .catch((error) => console.log(error));
        updateChartData({'labels': labels, 'datasets' : datasets})
        
    }

    return (
        <div className="container-fluid">
            <Dropdown>
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
