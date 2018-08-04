import React, {Component} from 'react'
import SearchInput, {createFilter} from 'react-search-input'
import SearchResult from './SearchResult'
import { searchLocation } from '../utils/google-api'

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

    onResultClick(result) {
        console.log(result);
        this.props.onSearchLocation(result)
    }

    render() {
        return (
            <div className='lgcards'>
                <SearchInput className="search-input" onChange={this.searchUpdated.bind(this)} />
                {
                    this.state.searchResults.map(result => {
                    console.log(result.formatted_address);
                    return (
                        <SearchResult address={result.formatted_address} onClick={this.onResultClick.bind(this, result)}/>
                    )
                })}
            </div>
        )
    }
}

export default Search