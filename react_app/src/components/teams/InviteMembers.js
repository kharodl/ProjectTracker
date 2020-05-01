import React, {Component} from "react";
import {Form, Button, FormGroup, FormControl, FormLabel} from "react-bootstrap"
import "./Teams.css";

class InviteMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      message: ''
    };
  }

  handleInputChange = (event) => {
    const {value, name} = event.target;
    this.setState({[name]: value});
  }

  onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/teams/join', {
      method: 'POST',
      body: JSON.stringify({team_id: this.props.team_id}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status === 404) {
        this.setState({
          message: "No such user"
        });
      } else if (res.status === 412) {
        this.setState({
          message: "User is already in this team"
        });
      } else {
        const error = new Error(res.error);
        throw error;
      }
    }).then(data => {
      if (data !== undefined) {
        this.props.updateTeamMembers();
        this.props.onHide();
        alert(data.fname + " " + data.lname + " has been added to the team."); // TODO replace with toast
      }
    }).catch(err => {
      console.error(err);
      this.setState({
        message: 'An error occured inviting this user'
      });
    });
  }

  render() {
    return (
      <div className="InviteMembers">
        <Form onSubmit={this.onSubmit} className='wide pad-em'>
          <FormGroup>
            <FormLabel className="text-muted">Team Member's Email</FormLabel>
            <FormControl type="email" name="email" placeholder="Enter Team Member's Email" value={this.state.email} onChange={this.handleInputChange} maxLength="100" autoComplete="off" required="required"/>
          </FormGroup>

          <Button variant='info' type="submit" className="btn-block">Submit</Button>
          <p>{this.state.message}&nbsp;</p>
        </Form>
      </div>);
  }
}

export default InviteMembers;
