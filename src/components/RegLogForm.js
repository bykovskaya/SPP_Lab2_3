import React, { Component } from "react";
import ReactDOM from "react-dom";

import TaskList from '../components/TaskList.js'
import '../styles/RegLogForm.css';

const  USER_URL = '/lab2/users';

class RegLogForm extends Component {
    constructor(props) {
        super(props);
        this.state = { login: '', password: '', message: '', status: 0};
        this.onChangeLogin = this.onChangeLogin.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    onChangeLogin(e){
        let value = e.target.value;
        this.setState({ login: value });
    }

    onChangePassword(e){
        let value = e.target.value;
        this.setState({ password: value });
    }

    handleSubmit(e, action){
        e.preventDefault();
        let url = USER_URL;
        switch(action){
            case 'Registrate':
                url+='/reg';
                break;
            case 'Login':
                url+='/log';
                break;
        }
        fetch(url, {
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({login:this.state.login, password:this.state.password})
        })
        .then(response => {
            this.setState({status: response.status});
            response.json()
            .then(data     => {
                console.log(data);
                this.setState({message:data.message});
                if(this.state.status == 200){
                    ReactDOM.render(
                        <TaskList />,
                        document.getElementById('taskList')
                    )
                }
            })
        })
        .catch(error   => console.log(error));

        this.setState({ login: '', password: '' });
    }

    handleButtonClick(e){
        e.preventDefault();
        if(this.state.login !== '' && this.state.password !== '')
            this.handleSubmit(e, e.target.value);
        else
            this.setState({message:"Введите логин и пароль!"});
    }

    render() {
        return (
            <form /*onSubmit={this.handleSubmit}*/>
                <label>Login:</label><br />
                <input type="text" value={this.state.login} onChange={this.onChangeLogin} /><br />
                <label>Password</label><br />
                <input type="password" value={this.state.password} onChange={this.onChangePassword} /><br /><br />
                <input type="submit" value="Registrate" onClick={this.handleButtonClick} />
                <input type="submit" value="Login" onClick={this.handleButtonClick} />
                <p className='message'>{this.state.message}</p>
            </form >
        );
    }
}

export default RegLogForm;