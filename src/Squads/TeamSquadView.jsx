import React, { useState } from 'react';
import { Tab, Row, Col, Nav, Dropdown} from 'react-bootstrap';
import TeamAnalysisView from './TeamAnalysisView';
import PlayerAnalysisView from './PlayerAnalysisView';


const TeamSquadView = ({team, players}) => {
    const [viewOption, setViewOption] = useState('Player');
    
    return (
        <div className="container-fluid" sm={9}>
            <Col>
                <Tab.Container 
                    id="left-tabs-example" 
                    activeKey={viewOption}
                    onSelect={(o) => setViewOption(o)}
                    className="container-fluid"
                    >
                    <Row className="container-fluid">
                        
                            <Nav 
                            className="flex-row"
                            variant='pills'
                            >
                                <Nav.Item key='Player'>
                                    <Nav.Link eventKey='Player'>Player</Nav.Link>
                                </Nav.Item>
                                <Nav.Item key='Team'>
                                    <Nav.Link eventKey='Team'>Team</Nav.Link>
                                </Nav.Item>
                                
                            </Nav>
                        
                    </Row>
                    
                    <Row >
                        <Tab.Content>
                            <Tab.Pane sm={9} eventKey='Player'>
                                <PlayerAnalysisView 
                                    className="pad-top"
                                    team={team}
                                    players={players}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey='Team'>
                                <TeamAnalysisView 
                                    className="pad-top"
                                    team={team}
                                    players={players}
                                />
                            </Tab.Pane>
                        </Tab.Content>
                    </Row>
                </Tab.Container>
            </Col>
        </div>
    );
}

export default TeamSquadView;
