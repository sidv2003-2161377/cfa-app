import React, { useEffect, useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DialogTitle from '@mui/material/DialogTitle';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'db3ba4bba0msh065590261cdcd2dp12356fjsn9717c4e7c362',
    'X-RapidAPI-Host': 'free-nba.p.rapidapi.com'
  }
};

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState('all');
  const [team, setTeam] = useState('all');
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch('https://free-nba.p.rapidapi.com/teams?page=0', options)
    .then(response => response.json())
    .then(response => setTeams(response.data.map(obj => obj.full_name)))
  }, []);

  const handlePositionChange = (event) => { 
    let updatedPos = event.target.value;
    setPosition(updatedPos);
    
    fetch(`https://free-nba.p.rapidapi.com/players?per_page=100&search=${query}`, options)
      .then(response => response.json())
      .then(response => {
        let filtered = response.data;
        if (updatedPos !== 'all') {
          filtered = response.data.filter(row => row.position.includes(updatedPos))
        }
        setData(filtered);
      })
      .catch(err => console.error(err));
  }

  const handleTeamChange = (event) => { 
    let updatedTeam = event.target.value;
    setTeam(updatedTeam);

    fetch(`https://free-nba.p.rapidapi.com/players?per_page=100&search=${query}`, options)
      .then(response => response.json())
      .then(response => {
        let filtered = response.data;
        if (updatedTeam !== 'all') {
          filtered = filtered.filter(row => row.team.full_name.includes(updatedTeam));
        }
        setData(filtered);
      })
      .catch(err => console.error(err));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    fetch(`https://free-nba.p.rapidapi.com/players?per_page=100&search=${query}`, options)
      .then(response => response.json())
      .then(response => {
        let filtered = response.data;
        if (position !== 'all') {
          filtered = response.data.filter(row => row.position.includes(position))
        }
        if (team !== 'all') {
          filtered = filtered.filter(row => row.team.full_name.includes(team));
        }
        setData(filtered);
      })
      .catch(err => console.error(err));
  }

  return (
    
    <div className="container" headers="h1">
      NBA Player Finding Application
      <div className="search-bar">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Enter NBA player name" onChange={(e) => setQuery(e.target.value)} value={query} />
          <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="icon-style" />
          </button>
        </form>
      </div>


      Filter By:
      <div color="gray">
        <FormControl fullWidth={false} sx={{ m: 2, minWidth: 200, color: 'white', }}>
          <InputLabel id="position-label" sx={{fontColor: 'white'}}>Position</InputLabel>
          <Select
            labelId="position-label"
            value={position}
            label="Position"
            onChange={handlePositionChange}
          >
            <MenuItem value={'all'}>All</MenuItem>
            <MenuItem value={'G'}>Guard</MenuItem>
            <MenuItem value={'F'}>Forward</MenuItem>
            <MenuItem value={'C'}>Center</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth={false} sx={{ m: 2, minWidth: 200, color: 'white', }}>
          <InputLabel id="teams-label">Team</InputLabel>
          <Select
            labelId="teams-label"
            value={team}
            label="Teams"
            onChange={handleTeamChange}
          >
            <MenuItem value={'all'}>All</MenuItem>
            {teams.map((team, index) => {
              return (
                <MenuItem key={index} value={team}>{team}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>

      NBA Player Information

      <TableContainer component={Paper}>
      <Table aria-label="json table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.first_name}</TableCell>
              <TableCell>{row.last_name}</TableCell>
              <TableCell>{row.position}</TableCell>
              <TableCell>{row.team.full_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        
    </div>
  );
}

export default App;