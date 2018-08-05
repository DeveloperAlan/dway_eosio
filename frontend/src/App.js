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
import MapPage from './MapPage'

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
      isMapShown: false,
      hidden: false
    }
  }

  // Enable Realtime updates via Socket.io
  async componentDidMount () {
    this.loadPosts()
    this.io.onMessage('createpost', (post) => {
      this.setState((prevState) => ({ posts: updatePostsForCreateAndEdit(prevState, post) }))
    })
    this.io.onMessage('editpost', (post) => {
      this.setState((prevState) => ({ posts: updatePostsForCreateAndEdit(prevState, post) }))
    })
    this.io.onMessage('deletepost', (post) => {
      this.setState((prevState) => ({ posts: updatePostsForDelete(prevState, post) }))
    })
  }

  // Load posts
  loadPosts = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts`)
    this.setState({ posts: response.data.reverse() })
  }

  // Create a post
  createPost = async (post) => {
    try {
      const newPost = {
        ...post,
        _id: {
          timestamp: Math.floor(Date.now() / 1000),
          author: process.env.REACT_APP_EOSIO_ACCOUNT
        },
        author: process.env.REACT_APP_EOSIO_ACCOUNT
      }

      await this.eosio.transaction(
        process.env.REACT_APP_EOSIO_ACCOUNT,
        'createpost', {
          timestamp: newPost._id.timestamp,
          author: newPost._id.author,
          ...post
        }
      )
      this.setState((prevState) => ({ posts: updatePostsForCreateAndEdit(prevState, newPost) }))
      this.toggleCreate()
    } catch (err) {
      console.error(err)
    }
  }

  // Edit a post
  editPost = async (post) => {
    try {
      await this.eosio.transaction(
        process.env.REACT_APP_EOSIO_ACCOUNT,
        'editpost',
        {
          timestamp: post._id.timestamp,
          author: post._id.author,
          ...post
        }
      )
      this.setState((prevState) => ({ posts: updatePostsForCreateAndEdit(prevState, post) }))
    } catch (err) {
      console.error(err)
    }
  }

  // Delete a post
  deletePost = async (post) => {
    try {
      await this.eosio.transaction(
        process.env.REACT_APP_EOSIO_ACCOUNT,
        'deletepost',
        {
          timestamp: post._id.timestamp,
          author: post._id.author
        }
      )
      this.setState((prevState) => ({ posts: updatePostsForDelete(prevState, post) }))
    } catch (err) {
      console.error(err)
    }
  }

  // Like a post
  likePost = async (post) => {
    try {
      await this.eosio.transaction(
        process.env.REACT_APP_EOSIO_ACCOUNT,
        'likepost', {
          timestamp: post._id.timestamp,
          author: post._id.author
        }
      )
      this.setState((prevState) => ({ posts: updatePostsForLike(prevState, post) }))
    } catch (err) {
      console.error(err)
    }
  }

  // Toggle if create window is open
  toggleCreate = () => {
    this.setState(prevState => ({
      createOpen: !prevState.createOpen
    }))
  }

  updateSearchLocation = async (location) => {
    console.log(location)
    console.log(location.formatted_address)
    console.log(location.geometry.location)
    this.setState({
      currentLocation: location,
      searchedLocation: location.formatted_address,
      destinationLatLng: location.geometry.location,
    });

    let origin = {}
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.geoSuccess, null)
    }
  }

  handleSearch(event, target) {
    this.setState({
      isMapShown: true,
      hidden: true,
      loading: true
    })
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

  render () {
    return (
      <div className={`layoutStandard ${this.state.createOpen ? 'createOpen' : ''}`}>
        <div className='logo'>DWAY</div>
        <div className='main'>
        <div>
          {this.state.hidden ? null : <div className='header-title'>Let's start your journey.</div> }
          <Search handleSearch={this.handleSearch.bind(this)}
            onSearchLocation={this.updateSearchLocation.bind(this)}/>
          {this.state.searchedLocation ? null : <div>{this.state.searchedLocation}</div>}
          <Loading loading={this.state.loading} />
        </div>
        <MapComponent isMarkerShown={false} directions={this.state.directions}isMapShown={this.state.isMapShown}/>
        </div>
      </div>
    )
  }

}

App.displayName = 'App' // Tell React Dev Tools the component name

export default App
