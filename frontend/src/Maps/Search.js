import React, {Component} from 'react'
import SearchInput, {createFilter} from 'react-search-input'
import SearchResult from './SearchResult'
import { searchLocation } from '../utils/searchLocation'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchTerm: "",
            searchResults: []
        }
    }

    async searchUpdated(value) {
        if (value == "") {
            this.setState({searchResults: []})
        }
        try {
            let location = await searchLocation(value);
            console.log(location);
            this.setState({searchResults: location});
            this.setState({searchTerm: value});
        } catch (err) {
            console.log(err);
        }
    }

    onResultClick(address) {
        console.log(address);
    }

    render() {
        return (
            <div>
                <SearchInput className="search-input" onChange={this.searchUpdated.bind(this)} />
                {
                    this.state.searchResults.map(result => {
                    console.log(result.formatted_address);
                    return (
                        <SearchResult address={result.formatted_address} onClick={this.onResultClick.bind(this, result.formatted_address)}/>
                    )
                })}
            </div>
        )
    }
}

export default Search