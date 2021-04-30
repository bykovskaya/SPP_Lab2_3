import React, { Component } from "react";
import ReactDOM from "react-dom";

import '../styles/TaskList.css';
import TaskForm from '../components/TaskForm.js';
import TaskContainer from '../components/TaskContainer.js';
import Filter from "./TaskFilter";

const  TASK_SERVICE_URL = 'http://localhost:8888/lab2/tasks';

class TaskList extends Component{
    constructor(props){
        super(props);
        this.state={
            showStat: 'Все', 
            tasks:[]
        };
        this.fetchTasks = this.fetchTasks.bind(this);
        this.onDataDelete = this.onDataDelete.bind(this);
        this.onDataUpdate = this.onDataUpdate.bind(this);
        this.handleNewTask = this.handleNewTask.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
    }

    fetchTasks(){
        this.setState({...this.state});
        fetch(TASK_SERVICE_URL)
            .then(response => response.json())
            .then(result => {
                this.setState({tasks: result});
            })
            .catch(e => console.log(e));
    }

    handleNewTask(data){
        this.setState({tasks: data});
    }
    
    componentDidMount(){
        this.fetchTasks();

        ReactDOM.render(
            <Filter getFiltVal={this.onStatusChange}/>,
            document.getElementById('filter')
        )
    }

    onStatusChange(newValue){
        this.setState({showStat:newValue});
    }

    onDataDelete(data){
        if(data != null)
        {
            let t_tasks = this.state.tasks;
            for(let i = 0; i < t_tasks.length; i++) 
            {
                if(t_tasks[i].tId == data)
                {
                    t_tasks.splice(i, 1);
                    break;
                }
            }
            this.setState({tasks:t_tasks});
        }
        else
        {
            console.log("Не удалилось");
        }
    }

    onDataUpdate(data){
        if(data != undefined)
        {
            let t_tasks = this.state.tasks;
            for(let i = 0; i < t_tasks.length; i++) 
            {
                if(t_tasks[i].tId == data.tId)
                {
                    t_tasks[i] = data;
                    break;
                }
            }
            this.setState({tasks:t_tasks});
        }
        else
        {
            console.log("Не удалось обновить");
        }
    }

    render(){
        return <div> <TaskForm handleChanged={this.handleNewTask}/>
                {this.state.tasks.map((val) => {
                    if(this.state.showStat === 'Все'){
                        return <TaskContainer key={val.tId} task={val} trigger={this.onDataDelete} update={this.onDataUpdate}/> 
                    }
                    else if(val.tStatus === this.state.showStat)
                        return <TaskContainer key={val.tId} task={val} trigger={this.onDataDelete} update={this.onDataUpdate}/> 
                }) }
                
            </div>
    }
}

export default TaskList;