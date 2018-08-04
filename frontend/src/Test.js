import React, { Component } from 'react'
import axios from 'axios'

import EOSIOClient from './utils/eosio-client'
import IOClient from './utils/io-client'
import { updatePostsForCreateAndEdit, updatePostsForLike, updatePostsForDelete } from './utils/posts-updater'
import CreatePost from './CreatePost/CreatePost'
import Posts from './Posts/Posts'
import MapComponent from './Maps/Maps'
import Search from './Maps/Search'
import Loading from './ui/loading/Loading.js'
import SearchInput, {createFilter} from 'react-search-input'
import { getDirections, geocode, directionApiConversion } from './utils/google-api'

class App extends Component {

  // Instantiate shared eosjs helper and socket io helper
  constructor (props) {
    super(props)
    const contractAccount = process.env.REACT_APP_EOSIO_CONTRACT_ACCOUNT
    this.eosio = new EOSIOClient(contractAccount)
    this.io = new IOClient()
    this.state = {
      createOpen: false,
      posts: [],
      currentLocation: {},
      searchedLocation: "",
      destinationLatLng: {},
      directions: {},
      loading: false,
      isMapShown: true
    }
  }
  updateSearchLocation = async (location) => {
    console.log(location)
    console.log(location.formatted_address)
    console.log(location.geometry.location)
    this.setState({
      currentLocation: location,
      searchedLocation: location.formatted_address,
      destinationLatLng: location.geometry.location,
      loading: true
    });

    let origin = {}
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.geoSuccess, null)
    }
  }


  geoSuccess = async (position)  => {
    let origin = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }

    let directionsResponse = await getDirections({
      origin: origin,
      destination: this.state.currentLocation.geometry.location
    })

    // console.log(JSON.stringify(directionApiConversion(directionsResponse, {
    //   origin: origin,
    //   destination: this.state.currentLocation.geometry.location
    // })))
    // debugger
    this.setState({directions: directionApiConversion(directionsResponse, {
      origin: origin,
      destination: this.state.currentLocation.geometry.location,

    })})
    this.setState({loading: false})
    // debugger
    // latlngBounds(origin, this.state.currentLocation.geometry.location)
  }

  // home page
  // then redirect to map
  // add particles in home page for extra aesthetic.

  render () {
    return (
      <div className={`layoutStandard ${this.state.createOpen ? 'createOpen' : ''}`}>
        <div className='logo'>DWAY</div>
        <MapComponent className='full-grid' isMarkerShown={false} directions={this.state.directions} isMapShown={this.state.isMapShown}/>
      </div>
    )
  }

}

App.displayName = 'App' // Tell React Dev Tools the component name

export default App
