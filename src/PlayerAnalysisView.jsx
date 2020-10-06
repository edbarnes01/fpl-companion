import React, { useState } from 'react';
import {Tab, Row, Col, Nav} from 'react-bootstrap';
import http from 'axios';
import PlayerDetail from './PlayerDetail';

function PlayerAnalysisView({team, players}){
    const [playerKey, setPlayerKey] = useState('0');
    const [playerData, setPlayerData] = useState();
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);


    function getPlayerData(playerId) {
        console.log(`this is your search id: ${playerId}`)
        http.get(`https://fantasy.premierleague.com/api/element-summary/${playerId}/`)
        .then((response) =>{
            setPlayerData(Object(response.data));
        })
        .catch((error) => console.log(error));
    }

    const returnPlayers = (teamId) => {
        var playerList = [];
        players.forEach(player => {
            if (player.team === teamId) {
                playerList.push(
                    new Object(player)
                );
            }
        })
        return playerList;   
    }

    const getPlayer = (playerId) => {
        console.log(`checking for id: ${playerId}`);
        var chosenPlayer = [];
        players.forEach(player => {
            if (player.id === Number(playerId)) {
                console.log('this is the chosen player', player.web_name);
                chosenPlayer.push(player);
            }
        })
        return chosenPlayer; 
    }

    return (
        <div className="container-fluid">
            <Tab.Container 
                id="left-tabs-example" 
                activeKey={playerKey}
                onSelect={(k) => {
                    getPlayerData(k);
                    setPlayerKey(k);
                }}
                className="container-fluid"
                >
                <Row >
                    <Col>
                        <Row>
                            <Col>
                                Squad
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Nav 
                                className="flex-column"
                                variant='pills'
                                scrollable='true'
                                >
                                    {returnPlayers(team.id).map((player) =>
                                    <Nav.Item key={player.id}>
                                        <Nav.Link eventKey={player.id}>{player.web_name}</Nav.Link>
                                    </Nav.Item>)}
                                </Nav>
                            </Col>
                        </Row>
                    </Col>
                    <Col className="container-fluid">
                        <Tab.Content className="container-fluid">
                            <Tab.Pane eventKey={playerKey} className="container-fluid">
                                <PlayerDetail 
                                player={new Object(getPlayer(playerKey)[0])} 
                                playerData={new Object(playerData)} 
                                chartData={{'labels': labels, 'data' : data}}/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
}

export default PlayerAnalysisView;