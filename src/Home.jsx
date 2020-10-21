import React, {useEffect, useState} from 'react';
import { Tab, Nav} from 'react-bootstrap';
import TeamChooseView from './Squads/TeamChooseView';
import CompareTeamsView from './Teams/CompareTeamsView';
import PlayerCompareView from './Players/PlayerCompareView';

const Home = ({teamContent, players}) => {

    const [option, setOption] = useState('Squads');
    useEffect(() => {
        //udpdate whatever
    },[option]);

    return (
        <div className="Home">
            <h1>
                FPL Companion 🤝
            </h1>
            
            <Tab.Container 
            id="left-tabs-example" 
            activeKey={option}
            onSelect={(k) => setOption(k)}
            >
                <Nav 
                className="flex-row"
                variant='pills'
                >
                    <Nav.Item key='Squads'>
                        <Nav.Link eventKey='Squads'>Squads</Nav.Link>
                    </Nav.Item>
                    <Nav.Item key='Teams'>
                        <Nav.Link eventKey='Teams'>Teams</Nav.Link>
                    </Nav.Item>
                    <Nav.Item key='Player'>
                        <Nav.Link eventKey='Player'>Player</Nav.Link>
                    </Nav.Item>
                </Nav>
            
                <Tab.Content>
                    <Tab.Pane eventKey='Squads'>
                        <TeamChooseView 
                            teamContent={teamContent} 
                            players={players} 
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey='Teams'>
                        <CompareTeamsView 
                            teamContent={teamContent} 
                            players={players}
                        />
                    </Tab.Pane>
                    <Tab.Pane eventKey='Player'>
                        <PlayerCompareView 
                            players={players}
                        />
                    </Tab.Pane>

                </Tab.Content>
            </Tab.Container>
           
        </div>
    );
}

export default Home;

//<TeamChooseView teamContent={teamContent} players={players} />