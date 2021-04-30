import React, { Component } from "react";
import '../styles/Task.css';

class Task extends Component{
    constructor(props){
        super(props);
        this.state={
            task: this.props.task
         }
        this.uri = "/Lab2/uploads?uploadingFile="+ encodeURIComponent(this.state.task.tFile);
    }

    render(){
        return <div className="iner_task" >
                    <input type="submit" value="X" onClick={this.props.deleteTaskP} className="button" />
                    <button onClick={this.props.editTaskP} className="button" >/</button>
                    <p>{this.state.task.tName}</p>
                    <p>{this.state.task.tTerm}</p>
                    <p>{this.state.task.tStatus}</p>
                    <p><a href={this.uri} style={{visibility: (this.state.task.tFile!==null)? 'visible':'hidden'}}>FILE</a></p>
                </div>
    }
}

export default Task;