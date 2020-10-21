
import http from 'axios';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import './App.css';
import Home from './Home';


function App() {

  const [teamContent, teamUpdate] = useState([]);
  const [players, playerUpdate] = useState([]);  
  const [isFetched, fetchUpdate] = useState(false);

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  
  const getPlayers = () => {
    http.get(`https://fantasy.premierleague.com/api/bootstrap-static/`)
    .then((response) =>{
        const playerArray = response.data.elements;
        playerUpdate(playerArray);
    })
    .catch((error) => console.log(error));
    };

  const getData = () => {
    http.get(`https://fantasy.premierleague.com/api/bootstrap-static/`)
        .then((response) => {
            teamUpdate(response.data.teams);
            
            
            getPlayers()
            return response.data.teams;
        })
        .catch((error) => console.log(error));
  }

  useEffect(() => {
    if (teamContent.length > 0) {
      fetchUpdate(true);
    }
  });

  return isFetched ? (
    <div className="Home">
      <Home teamContent={teamContent} players={players} />
    </div>
  ) : (
    <div className="App">
      <header className="App-header">
        <Button 
        onClick={() => getData()}
        >
          Enter
        </Button>
      </header>
    </div>
  );
}

export default App;
