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
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        targetUrl = 'https://maps.googleapis.com/maps/api/directions/json?destination=-33.8688197%2C151.2092955&origin=-33.8732191%2C151.1995765&key=AIzaSyD9YvX5tuxcYw-yuUifcl5KWFAoMAh2Xsw'

    fetch(proxyUrl + targetUrl)
        .then(blob => blob.json())
        .then(data => {
            console.table(data);
            document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
            return data;
        })
        .catch(e => {
            console.log(e);
            return e;
        });
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

export { searchLocation, getDirections, geocode };
