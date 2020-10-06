import React, { useState } from 'react';
import { Tab, Row, Col, Nav} from 'react-bootstrap';
import TeamSquadView from './TeamSquadView'

const TeamChooseView = ({teamContent, players}) => {
    const [key, setKey] = useState('0');
    
    //console.log(team);
    return (
        <div className="container-fluid">
            <Row>
                <Tab.Container 
                id="left-tabs-example" 
                activeKey={key}
                onSelect={(k) => setKey(k)}
                >   
                    <Col sm={3}>
                        <Nav 
                        className="flex-column"
                        variant='pills'
                        >
                            {teamContent.map((team) => 
                            <Nav.Item key={team.id}>
                                <Nav.Link eventKey={team.id}>{team.name}</Nav.Link>
                            </Nav.Item>)}
                        </Nav>
                    </Col>
                
                    {(key != '0') && ( <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey={key}>

                                
                                <TeamSquadView 
                                    team={new Object(teamContent[(Number(key)) - 1])} 
                                    players={players} 
                                />
                                
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>)}
                </Tab.Container>
            </Row>    
        </div>
    )
};

export default TeamChooseView;