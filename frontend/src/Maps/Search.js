import React, {Component} from 'react'
import SearchInput, {createFilter} from 'react-search-input'
import SearchResult from './SearchResult'
import { searchLocation } from '../utils/google-api'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchTerm: "",
            searchResults: [],
            searched: false,
            value: ""
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
            this.setState({searched: false});
        } catch (err) {
            console.log(err);
        }
    }

    onResultClick(result) {
        console.log(result);
        if (result == "") {
            this.setState({
                searchTerm: "",
                value: "",
                searchResults: []
            })
            return
        }
        this.setState({
            searchTerm: result.formatted_address,
            value: result.formatted_address
        })
        this.props.onSearchLocation(result)
    }

    onButtonClick() {
        this.setState({
            searched: true
        })

        this.props.handleSearch()
    }

    render() {
        return (
            <div className='lgcards'>
                <div className="row">
                    <SearchInput value={this.state.value} className="search-input" onChange={this.searchUpdated.bind(this)} placeholder="Destination Address"/>
                    {
                        !this.state.searched && this.state.searchResults.map(result => {
                                return (
                                    <SearchResult address={result.formatted_address} onClick={this.onResultClick.bind(this, result)}/>
                                )
                        })
                    }
                </div>
                <div className="row">
                    <button onClick={this.onButtonClick.bind(this)}>Search</button>
                </div>
            </div>
        )
    }
}

export default Search