import React, { Component } from 'react';

class SearchResult extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div onClick={this.props.onClick} className="address">
                {this.props.address}
                
            </div>
        )
    }
}

export default SearchResult;