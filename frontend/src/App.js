import React, { Component } from 'react'
import axios from 'axios'

import EOSIOClient from './utils/eosio-client'
import IOClient from './utils/io-client'
import { updatePostsForCreateAndEdit, updatePostsForLike, updatePostsForDelete } from './utils/posts-updater'
import CreatePost from './CreatePost/CreatePost'
import Posts from './Posts/Posts'
import MapComponent from './Maps/Maps'
import Search from './Maps/Search'
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
      directions: {}
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
      destinationLatLng: location.geometry.location
    });

    let origin = {}
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.geoSuccess, null)
    }
  }

  geoSuccess = async (position)  =>{
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
      destination: this.state.currentLocation.geometry.location
    })})
    // debugger
    // latlngBounds(origin, this.state.currentLocation.geometry.location)
  }

  render () {
//     var test = {
//   "geocoded_waypoints": [
//     {
//       "geocoder_status": "OK",
//       "place_id": "EigyMzk5IFMgTW9yZ2FuIFN0LCBDaGljYWdvLCBJTCA2MDYwOCwgVVNB",
//       "types": [
//         "street_address"
//       ]
//     },
//     {
//       "geocoder_status": "OK",
//       "place_id": "EigxMDAxIFcgQ2VybWFrIFJkLCBDaGljYWdvLCBJTCA2MDYwOCwgVVNB",
//       "types": [
//         "street_address"
//       ]
//     }
//   ],
//   "request": {
//     "destination": {
//       "lat": 41.85258,
//       "lng": -87.65141
//     },
//     "origin": {
//       "lat": 41.85073,
//       "lng": -87.65125999999998
//     },
//     "travelMode": "DRIVING"
//   },
//   "routes": [
//     {
//       "bounds": {
//         "east": -87.65126000000001,
//         "north": 41.85257,
//         "south": 41.85076,
//         "west": -87.65141000000001
//       },
//       "copyrights": "Map data ©2017 Google",
//       "legs": [
//         {
//           "distance": {
//             "text": "0.1 mi",
//             "value": 203
//           },
//           "duration": {
//             "text": "1 min",
//             "value": 76
//           },
//           "end_address": "1001 W Cermak Rd, Chicago, IL 60608, USA",
//           "end_location": {
//             "lat": 41.8525704,
//             "lng": -87.65140550000001
//           },
//           "start_address": "2399 S Morgan St, Chicago, IL 60608, USA",
//           "start_location": {
//             "lat": 41.8507582,
//             "lng": -87.6512578
//           },
//           "steps": [
//             {
//               "distance": {
//                 "text": "0.1 mi",
//                 "value": 203
//               },
//               "duration": {
//                 "text": "1 min",
//                 "value": 76
//               },
//               "end_location": {
//                 "lat": 41.8525704,
//                 "lng": -87.65140550000001
//               },
//               "end_point": {
//                 "lat": 41.8525704,
//                 "lng": -87.65140550000001
//               },
//               "instructions": "Head <b>north</b> on <b>S Morgan St</b> towards <b>W Cermak Rd</b>",
//               "lat_lngs": [
//                 {
//                   "lat": 41.85076,
//                   "lng": -87.65126000000001
//                 },
//                 {
//                   "lat": 41.852250000000005,
//                   "lng": -87.6513
//                 },
//                 {
//                   "lat": 41.852360000000004,
//                   "lng": -87.65131000000001
//                 },
//                 {
//                   "lat": 41.85244,
//                   "lng": -87.65133
//                 },
//                 {
//                   "lat": 41.85257,
//                   "lng": -87.65141000000001
//                 }
//               ],
//               "maneuver": "",
//               // "path": [
//               //   {
//               //     "lat": 41.85076,
//               //     "lng": -87.65126000000001
//               //   },
//               //   {
//               //     "lat": 41.852250000000005,
//               //     "lng": -87.6513
//               //   },
//               //   {
//               //     "lat": 41.852360000000004,
//               //     "lng": -87.65131000000001
//               //   },
//               //   {
//               //     "lat": 41.85244,
//               //     "lng": -87.65133
//               //   },
//               //   {
//               //     "lat": 41.85257,
//               //     "lng": -87.65141000000001
//               //   }
//               // ],
//               "start_location": {
//                 "lat": 41.8507582,
//                 "lng": -87.6512578
//               },
//               "start_point": {
//                 "lat": 41.8507582,
//                 "lng": -87.6512578
//               },
//               "travel_mode": "DRIVING"
//             }
//           ],
//           "traffic_speed_entry": [],
//           "via_waypoint": [],
//           "via_waypoints": []
//         }
//       ],
//       "summary": "S Morgan St",
//       "warnings": [],
//       "waypoint_order": []
//     }
//   ],
//   "status": "OK"
// }

    return (
      <div className={`layoutStandard ${this.state.createOpen ? 'createOpen' : ''}`}>
        <div className='logo'>DWAY</div>
        <Search onSearchLocation={this.updateSearchLocation.bind(this)}/>
        <MapComponent isMarkerShown={false} directions={this.state.directions}/>
        <div className='main'>
          <div className='toggleCreate' onClick={this.toggleCreate} />
          <CreatePost createPost={this.createPost} />
          <div className='cards'>
            <Posts
              posts={this.state.posts}
              handleOnChange={this.handleOnChange}
              deletePost={this.deletePost}
              editPost={this.editPost}
              likePost={this.likePost}
            />
          </div>
        </div>
      </div>
    )
  }
}
App.displayName = 'App' // Tell React Dev Tools the component name

export default App
