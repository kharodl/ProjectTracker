import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Container, Col, Row, Button } from "react-bootstrap";
import FadeIn from 'react-fade-in';
import ModalTemplate from "../ModalTemplate";
import ViewTask from "./tasks/ViewTask";
import CreateTask from "./tasks/CreateTask";
import TaskCard from "./tasks/TaskCard";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      modalView: false,
      modalCreate: false,
      taskType: 0,
      message: ''
    }
  }

  render() {
    return (
      this.props.data.projects.length > 0 ?
        <FadeIn>
          <ModalTemplate
            show={this.state.modalCreate}
            onHide={() => this.setState({modalCreate: false})}
            title="Create Task"
            component={CreateTask}
            user_id={this.props.data.user.id}
            project_id={this.props.data.project_id}
            team_members={this.props.data.team_members}
            updateTasks={this.props.updateTasks}
            taskType={this.state.taskType}
            taskState={1}
          />
          <ModalTemplate
            show={this.state.modalView}
            onHide={() => this.setState({modalView: false})}
            title={this.state.task.name}
            component={ViewTask}
            task={this.state.task}
            project_id={this.props.data.project_id}
            team_members={this.props.data.team_members}
            updateTasks={this.props.updateTasks}
          />
          <Container>
            <Row>
              {this.props.data.active_tasks.map((taskType, index) =>
                <Col lg key={index}>
                  <h3>{taskType.name}</h3>
                  <div className="task-cards">
                    <Button
                      variant='info'
                      className='btn-block centered pad-em'
                      onClick={() => this.setState({
                        taskType: index,
                        modalCreate: true
                      })}>Create {taskType.name} Task</Button>
                    {taskType.container.map(task =>
                      <TaskCard
                        key={task.id}
                        task={task}
                        bg={task.assignee_id === this.props.data.user.id ?
                              'success' : task.assignee_id !== null ?
                              'primary' :
                              ''}
                        onClick={() => this.setState({
                          task: task,
                          modalView: true
                        })}/>
                    )}
                  </div>
                </Col>
              )}
            </Row>
          </Container>
        </FadeIn>
      : <Redirect to='teams'></Redirect>
    );
  }
}

export default Dashboard
