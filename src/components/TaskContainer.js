import React, { Component } from "react";
import '../styles/TaskContainer.css';
import Task from '../components/Task.js';
import TaskEdit from '../components/TaskEdit.js';

const  TASK_SERVICE_URL = 'http://localhost:8888/lab2/tasks';

class TaskContainer extends Component{
    constructor(props){
        super(props);
        this.state={
            onEdit:false,
            task: this.props.task
        }
        this.editTask = this.editTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
    }

    deleteTask(){
        fetch(TASK_SERVICE_URL+'?tId='+this.state.task.tId,{
            method: 'delete',
        })
        .then(response=>response.json())
        .then(data => {
            if(data.message === 'DELETED')
                this.props.trigger(this.state.task.tId);
            else
                this.props.trigger(null);
        })
        .catch(e=>console.log(e));
    }

    editTask(){
        this.setState({
            onEdit:true
        });
    }

    updateTask(data){
        if(data !== undefined){
            this.props.update(data); 
            this.setState({
                task:data
            });  
        }
        this.setState({
            onEdit:false
        });
    }

    render(){
        if(this.state.onEdit === false){
                return <div id={this.state.task.tId} className='task-container'>
                        <Task task={this.state.task} deleteTaskP={this.deleteTask} editTaskP={this.editTask}/>
                    </div>
            }
        else{
                return <div id={this.state.task.tId} className='task-container'>
                        <TaskEdit task={this.state.task} updateTaskP={this.updateTask}/>
                    </div>
            }   
    }
}

export default TaskContainer;