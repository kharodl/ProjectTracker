import React, {Component} from 'react';
import './App.css';

import PivotNavbar from './components/PivotNavbar';
import Routes from './Routes';

// const Context = React.createContext();

class App extends Component {
  _isMounted = false;

  constructor() {
    super();
    //Set default message
    this.state = {
      is_auth: false,
      teams: [],
      team_id: -1,
      projects: [],
      project_id: -1
    }
  }

  componentDidMount() {
    this._isMounted = true;
    fetch('/api/user/auth').then(res => {
      if (res.status === 200) {
        if (this._isMounted) {
          this.setState({ is_auth: true });
        }
      } else if (res.status === 401) {
        if (this._isMounted) {
          this.setState({ is_auth: false });
        }
      } else {
        const error = new Error(res.error);
        throw error;
      }
    }).catch(console.error);

    this.updateTeams();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleDataChange = (event) => {
    const { value, name } = event.target;
    console.log(name);
    if (name === 'team_id') {
      this.setState({
        [name]: value
      }, this.updateProjects());
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  updateTeams = () => {
    fetch('/api/teams/currentuser').then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        const error = new Error(res.error);
        throw error;
      }
    }).then(data => {
      if (this._isMounted) {
        this.setState({
          teams: data,
          team_id: data[0].id
        }, this.updateProjects());
      }
    }).catch(console.error);
  }

  updateProjects = () => {
    console.log(this.state.team_id);
    fetch('/api/projects/team/' + this.state.team_id).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        const error = new Error(res.error);
        throw error;
      }
    }).then(data => {
      console.log(data);
      if (this._isMounted) {
        this.setState({
          projects: data,
        });
        if (data[0] !== undefined) {
          this.setState({
            project_id: data[0].id
          });
        }
      }
    }).catch(console.error);
  }

  render () {
    return (
      <div className="App">
        <PivotNavbar data={this.state} handleDataChange={this.handleDataChange}/>
        <Routes data={this.state} />
        <p>team id: {this.state.team_id}</p>
        <p>project id: {this.state.project_id}</p>
        <p>Auth: {this.state.is_auth ? 'ok' : 'failed'}</p>
      </div>
    );
  }
}

export default App;
