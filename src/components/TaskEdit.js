import React, { Component } from "react";
import '../styles/Task.css';

const  TASKEDIT_UPD_URL = 'http://localhost:8888/lab2/task';

class TaskEdit extends Component{
    constructor(props){
        super(props);
        this.state={
            tTerm:this.toDate(this.props.task.tTerm),
            tStatus:this.props.task.tStatus,
            tFile:this.props.task.tFile
        };
        this.toDate = this.toDate.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.sendChanges = this.sendChanges.bind(this);
        this.handleCombChange = this.handleCombChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.fileInput = React.createRef();
        this.oldTask={
            tTerm:this.toDate(this.props.task.tTerm),
            tStatus:this.props.task.tStatus,
            tFile:this.props.task.tFile
        };
    }
        
    toDate(d){
        let yyyy_mm_dd = d[6]+d[7]+d[8]+d[9]+'-'+d[3]+d[4]+'-'+d[0]+d[1];
        return yyyy_mm_dd;
    }
    
    sendChanges(e){
        e.preventDefault();
        let lFileName;

        if(this.fileInput.current === null){
            lFileName = this.oldTask.tFile;
        }
        else{
            if(this.fileInput.current.files[0] === undefined){
                lFileName = null;
            }
            else{
                lFileName = this.fileInput.current.files[0].name;
            }
        }
        
        if((this.state.tTerm   !== '' && this.state.tTerm !== this.oldTask.tTerm) || 
            this.state.tStatus !== this.oldTask.tStatus                           ||
            lFileName          !== this.oldTask.tFile){
                const formData = new FormData();
                formData.append('tTerm', this.state.tTerm);
                formData.append('tStatus', this.state.tStatus);
                if(this.fileInput.current !== null){
                    if(this.fileInput.current.files[0] !== undefined){
                        formData.append('uploadingFile', this.fileInput.current.files[0]);    
                    }
                    else{
                        formData.append('uploadingFile', lFileName);
                    }
                }
                else{
                    formData.append('uploadingFile', lFileName);
                }
                fetch(TASKEDIT_UPD_URL+'?tId='+this.props.task.tId,{
                    method:'put',
                    body: formData})
                .then(response=> response.json())
                .then(data => this.props.updateTaskP(data))
                .catch(e=>console.log(e));
        }
        else{
            this.props.updateTaskP();
        }
    }
    
    handleCombChange(e){
        this.setState({tStatus:e.target.value})
    }

    handleDateChange(e){
        this.setState({tTerm:e.target.value})
    }
    
    deleteFile(e){
        this.setState({tFile:null})
    }
    
    render(){
        return <form className="iner_task" onSubmit={this.sendChanges}>
                    <button type="submit" className="button">V</button>
                    <p>{this.props.task.tName}</p>
                    <input type="date" value={this.state.tTerm} onChange={this.handleDateChange}/>
                    <select name="comboStatus" onChange={this.handleCombChange}>
                        <option>{this.state.tStatus}</option>
                        <option>Новая</option>
                        <option>Выполняется</option>
                        <option>Завершено</option>
                    </select>
                    <FileInput file={this.state.tFile} deleteFile={this.deleteFile} r={this.fileInput}/>
                </form>
    }
}

class FileInput extends Component{
    render(){
        if(this.props.file === null){
            return <p><input type="file" ref={this.props.r} /></p>
        }
        else{
            return <p>FILE
                <input type="submit" value="X" onClick={this.props.deleteFile} className="button"/>
            </p>
        }
    }
}

export default TaskEdit;