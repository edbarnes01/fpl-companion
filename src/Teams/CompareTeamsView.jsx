import React, { useState, useEffect } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import allSettled from 'promise.allsettled';
import rateLimit from 'axios-rate-limit';
import axios from 'axios';
import { readable } from '../utils/StringUtils';
import { MetroSpinner } from 'react-spinners-kit';
import CompareTeamsChart from './CompareTeamsChart';
import { dynamicColor } from '../utils/ChartUtils'
import { accumOptions } from '../utils/ChartUtils';

const CompareTeamsView = ({teamContent, players}) => {
    
    
    const [chartOption, setChartOption] = useState('Options');
    
    const [loading, setLoading] = useState(true);

    const [chartDataSets, setChartDataSets] = useState([]);
    useEffect(() => {
        makeDataSet(chartOption);
    }, [chartOption]);

    const [dataSets, updateDataSets] = useState([]);
    
    useEffect(() => {
        console.log(dataSets);
        if (dataSets.length === 20) {
            setLoading(false);
        }
    });
    

    const http = rateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 1 })
    const getPlayerData = async (listPlayerIds) => {
        let playerList = [];
        const playerData = await allSettled(listPlayerIds.map((playerId) => http.get(`https://fantasy.premierleague.com/api/element-summary/${playerId}/`)))
        .then((results) => {
            results.reduce(async (memo, playerDatum) => {
                if (playerDatum.status === 'fulfilled') {
                    playerList.push(Object(playerDatum.value.data.history));
                } else {
                    console.log('Not fulfilled');
                }
            })
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

    const returnTeamName = (teamId) => {
        let teamName = '';
        teamContent.forEach(team => {
            if (team.id === teamId) {
                teamName = team.name
            }
        })
        return teamName;   
    };

    const labelOptions = [
        "total_points", "goals_scored", "yellow_cards", "bonus", 
    "bps", "creativity", "threat", "value", "selected", "transfers_in",
    "transfers_out"]

    const getTeamData = async () => {

        const teamIds = Array.from({length: 20}, (_, i) => i + 1)
        await teamIds.forEach((teamId) => {
            const playerIds = returnPlayerIds(teamId);
            console.log(teamId);
            const returnedPlayerData = getPlayerData(playerIds)
            .then((results) => {
                const teamToPush = {id: teamId, name: returnTeamName(teamId), data: results};
                updateDataSets(dataSets => [...dataSets, teamToPush]);
            })
        });
    }

    const makeDataSet = async (selection, teamId) => {
        
        console.log(selection);
        let returningTeamData = {labels: [1, 2, 3, 4], datasets: []};
        dataSets.map((team) => {
            let color = dynamicColor();
            let teamData = [0, 0, 0, 0];
            let accumData = [];
            team.data.map((player) => {
                player.map((fixture, i) => {
                    teamData[fixture.round - 1] += fixture[selection]
                });
            });
            console.log(`${team.name} is ${teamData}`);
            
            if (accumOptions().includes(selection)) {
                teamData.reduce(function(a,b,i) { 
                    return accumData[i] = a+b; 
                },0);
            } 
            
            returningTeamData.datasets.push({
                label: team.name,
                fill: false,
                lineTension: 0.1,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                data: accumOptions().includes(selection) ? accumData : teamData
                });
            
        });
        

        setChartDataSets(returningTeamData);
    };
    
    return loading ? (
        <div>
            <Button
                onClick={() => getTeamData()}
            >
                Get Team Data
            </Button>

            {(dataSets.length > 0 && dataSets.length < 20) && 
                <div>
                    <MetroSpinner />
                </div>
            }
        </div>
    ) : (
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
           
            <CompareTeamsChart teamData={chartDataSets} title={chartOption} />
            
        </div>
    );
}

export default CompareTeamsView;

/*
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
            {JSON.stringify(dataSets, null, 2)}
            {JSON.stringify(loading, null, 2)}
            {loading && 
            <MetroSpinner />
            }
            {(chartOption === 'Options') && 
                    <body className='body'>
                        Choose an Option 
                        {JSON.stringify(dataSets.length, null, 2)}
                    </body>
            }
            
            {(chartOption != 'Options' && dataSets[20] === Object) &&
                <div className="container-fluid">
                    <h2>Compare Teams</h2>
                    {JSON.stringify((dataSets[20] != Object), null, 2)}
                    
                </div>
            }
            
        </div>
*/