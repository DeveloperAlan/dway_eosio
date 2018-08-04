import React, { Component } from 'react'
import ReactLoading from 'react-loading';

export default class Loading extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="row">
            {
                (this.props.loading) ? <ReactLoading color={"#000"}/> : null
            }
            </div>
        )
    }
}