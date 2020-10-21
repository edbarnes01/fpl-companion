import React, { useState, useEffect } from 'react';
import PlayerCompareChart from './PlayerCompareChart';
import { BsDashCircle, BsArrowRight, BsFillPersonCheckFill, BsBackspace } from "react-icons/bs";
import { Row, Col, Dropdown} from 'react-bootstrap';
import http from 'axios';
import { accumOptions } from '../utils/ChartUtils';
import { readable } from '../utils/StringUtils';
import { dynamicColor } from '../utils/ChartUtils'


const PlayerCompareView = (players) => {
    const [chartOption, setChartOption] = useState('Options');
    
    const [chartPlayers, setChartPlayer] = useState([]);
    useEffect(() => {
        makeDataSet(chartOption);
    }, [chartOption, chartPlayers]);

    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState([])

    const labelOptions = [
        "total_points", "minutes", "goals_scored", 
    "assists", "yellow_cards", "red_cards", "bonus", 
    "bps", "influence", "creativity", "threat", 
    "ict_index",  "value", "selected", "transfers_in",
    "transfers_out"]

    const handleChange = (event) => {
        setSearchValue(event.target.value);
        //console.log(searchValue);
    };

    useEffect(() => {
        //console.log('testing')
        const test = ['a','b']
        const results = players.players.filter(person => {
            //console.log(searchValue.split(" "));
            let matched = false;
            let search = searchValue.split(" ");
            if (search.length === 1) {
                if (person.first_name.toLowerCase().includes(search[0].toLowerCase())) {
                    //console.log('true');
                    matched = true;
                }
            } else {
                if (person.second_name.toLowerCase().includes(search[1].toLowerCase())
                    && person.first_name.toLowerCase().includes(search[0].toLowerCase())
                    ) {
                        //console.log('true');
                        matched = true;
                    }
            }
            return matched;
            
        });
        const sortedRes = results.sort((a, b) => a.web_name.localeCompare(b.web_name));
        setSearchResults(sortedRes);
    }, [searchValue]);

    const [playerDataSets, setPlayerDataSets] = useState();

    const makeDataSet = () => {
        const returning = chartPlayers.map((player) => returnData(chartOption, player.data, player.player.web_name));
        setPlayerDataSets(returning);
    };

    const getPlayerData = (player) => {
        //console.log(player);
        //console.log(`this is your search id: ${player.id}`)
        http.get(`https://fantasy.premierleague.com/api/element-summary/${player.id}/`)
        .then((response) =>{
            //console.log(response.data);
            setChartPlayer(chartPlayers => [...chartPlayers, {'player': player, 'data': response.data}]);
            returnData(chartOption, response.data);
            //setPlayerData(playerData, [...playerData, response]);
        })
        .catch((error) => console.log(error));
    }
    
    const returnData = (option, playerData, playerName) => {
        let color = dynamicColor();
        console.log(`top of return data ${typeof playerData}`)
        let labels = [];
        let data = [];
        let accumData = [];
        const history = playerData.history;
        for (const [key, value] of Object.entries(history)) {
            console.log(key, value);
            labels.push(value.round);
            data.push(value[option]);
        }

        if (accumOptions().includes(option)) {
            data.reduce(function(a,b,i) { 
                return accumData[i] = a+b; 
            },0);
        }
        const dataset = {
            label: playerName,
            fill: false,
            lineTension: 0.1,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            data: accumOptions().includes(option) ? accumData : data
            }
        //console.log(labels);
        //console.log( {'labels': labels, 'data' : accumOptions().includes(option) ? accumData : data});
        return(dataset);
    }
    
    const playerClick = async (player) => {

        if (chartPlayers.filter(item => item.player === player).length > 0) {
            setChartPlayer(chartPlayers.filter(item => item.player !== player));
        } else {
            const data = getPlayerData(player);
            console.log(data);
            
        }
        
        console.log(`chart players is ${chartPlayers}`);
        
    };



    return (
        <div className="Full">
            <Row className="col-top">
                <Col className="col-top">
                    {chartPlayers.length > 0 &&
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
                            
                        </div>
                    }
                    {chartPlayers.length === 0 && 
                        <div>
                            <Col>
                                <h1>
                                    Choose some players 
                                </h1>
                                
                                <h1>
                                    to compare
                                    <BsArrowRight />
                                </h1>
                            </Col>
                            
                        </div>
                    }  
                    {(chartPlayers.length > 0 && chartOption != 'Options') &&
                        <PlayerCompareChart chartData={playerDataSets} title={chartOption}/>  
                    }

                </Col>
                <Col className="col-top">
                    <Row className="col-top">
                        <Col>
                            
                            {chartPlayers.length > 0 &&
                                <ul className="player-list">
                                    {chartPlayers.map(player => (
                                        
                                        <Row className="xIcon-row" >
                                            {`${player.player.first_name.charAt(0)}. ${player.player.second_name} `} 
                                            <BsDashCircle className="xIcon" onClick={() => playerClick(player.player)}/>
                                        </Row>
                                        
                                    ))}
                                </ul>
                            }
                        </Col>
                        <Col>
                        <Row className="xIcon-row">
                            <input 
                            type="text" 
                            placeholder="Search"
                            value={searchValue} 
                            onChange={handleChange} 
                            />
                            <BsBackspace className="xIcon" onClick={() => setSearchValue('')}/>
                        </Row>
                            
                            {searchValue != '' &&
                                <div className="xIcon">
                                    {searchResults.length > 0 &&
                                        <ul className="search-list">
                                        {searchResults.map(item => (
                                            <li 
                                                key={item.id}
                                                onClick={() => playerClick(item)}
                                            >   
                                                {chartPlayers.filter(e => e.player === item).length > 0 && 
                                                    <BsFillPersonCheckFill />
                                                }
                                                {`${item.first_name.charAt(0)}. ${item.second_name} `}
                                                
                                            </li>
                                        ))}
                                        </ul>
                                    }
                                    {searchResults.length === 0 &&
                                        <label>
                                            No results.
                                        </label>
                                    }

                                    
                                </div>
                            }
                        </Col>
                        
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default PlayerCompareView;

//{JSON.stringify(chartPlayers, null, 2)}
//<PlayerCompareChart chartData={playerDataSets} title={chartOption}/>