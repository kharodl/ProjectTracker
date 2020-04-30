import React, { Component } from 'react';
import { ListGroup, Button, Card } from "react-bootstrap";
import FadeIn from 'react-fade-in';
import ModalTemplate from "../ModalTemplate";
import CreateProject from "./CreateProject";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: this.props.data.projects,
      show_project: false,
      showCreateProject: false
    };
  }

  fetchMembers = (tid, tname, tlead) => {
    fetch('/api/user/team/' + tid).then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        const error = new Error(res.error);
        throw error;
      }
    }).then(data => {
      this.setState({
        members: data,
        team: {name: tname, id: tid, lead_id: tlead},
        show_project: true
      });
    }).catch(err => {
      console.error(err);
      this.setState({
        message: 'An error occured fetching this team'
      });
    });
  }

  render() {
    return (
      <FadeIn>
        <h3>Project List</h3>
        <ModalTemplate
          show={this.state.showCreateProject}
          onHide={() => this.setState({showCreateProject: false})}
          title="Create Project"
          component={CreateProject}
          teams={this.props.data.teams}
          team_id={this.props.data.team_id}
          updateProjects={this.props.updateProjects}
        />
        <Button variant="info" className='btn-block centered pad-em' onClick={() => this.setState({showCreateProject: true})}>
          Create Project
        </Button>
        <ListGroup horizontal='lg'>
          {this.props.data.projects.map(project =>
            <Card
              key={project.id}>
              {project.name}
              <br/>
              <p className='unpadded medium-muted text-small'>Click to view team details</p>
            </Card>
          )}
        </ListGroup>
        <p>{this.state.message}&nbsp;</p>
      </FadeIn>
    );
  }
}

export default Projects;
