import React, { useEffect, useState } from 'react';
import allSettled from 'promise.allsettled';
import http from 'axios';
import { Dropdown, Button} from 'react-bootstrap';
import TeamChart from './TeamChart';

const TeamWholeView = ({team, players}) => {
    const [chartOption, setChartOption] = useState('Options');
    const [chartData, updateChartData] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (loading) {
            console.log('Loading...');
            if (chartData) {
                updateChartData(makeDataSet(chartOption));
                setLoading(false);
            } 
        }
    }, [team]);
    


    function camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return word.toUpperCase();
        }).replace(/\s+/g, ' ');
    }

    function readable(str) {
        return camelize(str.replace(/_/g, ' '))
    }

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

    const labelOptions = [
        "total_points", "minutes", "goals_scored", 
    "assists", "yellow_cards", "red_cards", "bonus", 
    "bps", "influence", "creativity", "threat", 
    "ict_index",  "value", "selected", "transfers_in",
    "transfers_out"]
    
    const makeDataSet = (selection) => {
        var labels = [];
        var datasets = [];
        const playerIds = returnPlayerIds(team.id);
        const playerData = getPlayerData(playerIds)
        .then((results) => {
            labels.push(Array.from(Array(results[0].length).keys()));
            
            results.map((player) => {
                var playerDataSet = [];
                player.map((fixture) => {
                    playerDataSet.push(fixture[selection]);
                })
                //console.log(player[0].element);
                const playerReturn = {
                    label: returnPlayerName(player[0].element),
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 1,
                    data: playerDataSet
                }
                console.log(playerDataSet);
                datasets.push(playerReturn);
                //console.log(playerReturn);
            });
        })
        .catch((error) => console.log(error));

        return {'labels': labels, 'datasets' : datasets};
    }

    return (
        <div>
            <Button 
            onClick={() => updateChartData(makeDataSet(chartOption))}
            >
            Get
            </Button>
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
                <div>
                    Choose an Option 
                    <h2>{JSON.stringify(chartData, null, 2)}</h2>
                </div>

            }
            {(chartOption != 'Options') &&
                <TeamChart 
                chartData={chartData}
                title={chartOption}
                team={team}
                />}
        </div>

    );
}

export default TeamWholeView;

/*

*/