// const googleMapsClient = require('@google/maps').createClient({
//   key: 'AIzaSyD9YvX5tuxcYw-yuUifcl5KWFAoMAh2Xsw'
// });

import googlemaps from '@google/maps';
import axios from 'axios';

const KEY = 'AIzaSyD9YvX5tuxcYw-yuUifcl5KWFAoMAh2Xsw'

const googleMapsClient = googlemaps.createClient({
    key: KEY
})

function searchLocation(search) {
    return new Promise(resolve => {
        googleMapsClient.geocode({
          address: search
        }, function(err, response) {
          if (!err) {
            console.log(response.json.results);
            resolve(response.json.results);
          }
        });
    })
}

function getDirections(query) {

    // return new Promise(resolve => {
    //     console.log(query);
    //     var destinationLat = query.destination.lat,
    //         destinationLng = query.destination.lng,
    //         originLat = query.origin.lat,
    //         originLng = query.origin.lng,
    //         proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    //         targetUrl = `https://maps.googleapis.com/maps/api/directions/json?destination=${destinationLat}%2C${destinationLng}&origin=${originLat}%2C${originLng}&key=${KEY}`

    //     console.warn(proxyUrl + targetUrl)
    //     resolve(fetch(proxyUrl + targetUrl)
    //         .then(blob => blob.json())
    //         .then(data => {
    //             console.table(data);
    //             return data;
    //         })
    //         .catch(e => {
    //             console.log(e);
    //             return e;
    //         })
    //     )
    // })

    return new Promise(resolve => {
        console.log(query)
        googleMapsClient.directions(query, (err, response) => {
            console.log(response)
            // console.log(status)
            resolve(response.json)
            // return res;
        })
    })
}


function geocode(place) {
    const query = {
        address: place
    }
    googleMapsClient.geocode(query, (status, results) => {
        console.log(results);
        console.log(status);
        return results;
    })
}

function latlngBounds(origin, destination ) {
    // debugger
    var bounds = googleMapsClient.LatLngBounds(
        origin,
        destination
    )

    console.log(bounds);
}

export { searchLocation, getDirections, geocode, latlngBounds };
