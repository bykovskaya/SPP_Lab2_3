import React, { Component } from "react";
import '../styles/Task.css';

const  TASK_SERVICE_URL = 'http://localhost:8888/lab2/tasks';

class TaskForm extends Component{
    constructor(props) {
        super(props);
        this.state = { tName: '', tTerm: '' };
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeTaskName = this.onChangeTaskName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
    }

    onChangeDate(e){
        this.setState({tTerm:e.target.value});
    }

    onChangeTaskName(e){
        this.setState({tName:e.target.value});
    }

    handleSubmit(e){
        e.preventDefault();
        if(this.state.tTerm !== '' || this.state.tName !== ''){
            let formData = new FormData();
            formData.append('tName', this.state.tName);
            formData.append('tTerm', this.state.tTerm);
            if(this.fileInput.current.files[0]){
                formData.append('uploadingFile', this.fileInput.current.files[0]);    
            }
            
            fetch(TASK_SERVICE_URL,{
                method:'post',
                body: formData})
            .then(response=> response.json())
            .then(data => {
                this.props.handleChanged(data);
                this.setState({tTerm:'', tName:''});
            })
            .catch(e=>console.log(e));
        }
        else{
            this.setState({tTerm:'', tName:''});
        }
    }

    render(){
        return <div className='task-container'>
            <form className="iner_task" onSubmit={this.handleSubmit}>
                <button type="submit" className="button">V</button>
                <p className="createTask">Тема<br/><input type="text" value={this.state.tName} onChange={this.onChangeTaskName}/></p>
                <p className="createTask">Дата<br/><input type="date" value={this.state.tTerm} onChange={this.onChangeDate}/></p>
                <p className="createTask"><input type="file" ref={this.fileInput}/></p>
            </form>
            </div>
    }
}

export default TaskForm;