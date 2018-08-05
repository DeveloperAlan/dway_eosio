import React, { Component } from 'react'
import axios from 'axios'

import EOSIOClient from './utils/eosio-client'
import IOClient from './utils/io-client'
import { updatePostsForCreateAndEdit, updatePostsForLike, updatePostsForDelete } from './utils/posts-updater'
import CreatePost from './CreatePost/CreatePost'
import MapComponent from './Maps/Maps'
import Search from './Maps/Search'
import Loading from './ui/loading/Loading.js'
import SearchInput, {createFilter} from 'react-search-input'
import { getDirections, geocode, directionApiConversion } from './utils/google-api'
import MapPage from './MapPage'
import Scores from './scores.json'

class App extends Component {

    // Instantiate shared eosjs helper and socket io helper
    constructor (props) {
      super(props)
      this.state = {
        scores:[],
        id: {}, 
        name: '', 
        userName: '', 
        score: '', 
        ranking: {}
      }
      console.log(props);
    }

    loadScores = async () => {
        fetch('./scores.json')
            .then(r => r.json())
            .then(json => {
            this.Scores = json
            })
    }

    render() {
        return (
            <div className={`layoutStandard ${this.state.createOpen ? 'createOpen' : ''}`}>
              <div className='logo'>DWAY</div>
              <div className='main'>
              <div className='score-title-space'> 
                Scores
              </div>
              <div className='container padding-30'>
                <div className='card-item padding-30' key={this.props.scores.id}>
                    <label
                        className='margin-bottom-15'
                        name='ranking'
                        value={this.props.scores.ranking}
                        placeholder='Ranking'
                    />
                    <label
                        className='margin-bottom-15'
                        name='name'
                        value={this.props.scores.name}
                        placeholder='Name'
                    />
                    <label
                        className='margin-bottom-15'
                        name='userName'
                        value={this.props.scores.username}
                        placeholder='Username'
                    />
                    <label
                        className='margin-bottom-15'
                        name='score'
                        value={this.props.scores.score}
                        placeholder='Score'
                    />
                </div>
                </div>
            </div>
        </div>
        )
    }
}

    App.displayName = 'Scores'
    export default App

