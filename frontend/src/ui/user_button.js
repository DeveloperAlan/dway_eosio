import React, { Component } from "react";
import Popup from 'react-popup';


class UserButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false
        }
    }

    handleButtonClick() {
        Popup.alert("You currently have 40 Sustainability points")
        console.log(this.state.showModal)
    }

    render() {
        return (
            <div>
                <button onClick={this.handleButtonClick.bind(this)}className="header-right">
                Ace
                </button>
                <Popup />
            </div>
        )
    }
}

export default UserButton;