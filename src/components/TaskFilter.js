import React, { Component } from "react";

class Filter extends Component{
    constructor(props){
        super(props);
        this.setFilt = this.setFilt.bind(this);
    }

    setFilt(e){
        this.props.getFiltVal(e.target.value);
    }

    render(){
        return <select name="comboStatusFilter" onChange={this.setFilt}>
        <option>Все</option>
        <option>Новая</option>
        <option>Выполняется</option>
        <option>Завершено</option>
    </select>
    }
}

export default Filter;