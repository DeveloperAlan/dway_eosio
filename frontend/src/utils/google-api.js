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

    return new Promise(resolve => {
        console.log(query);
        var destinationLat = query.destination.lat,
            destinationLng = query.destination.lng,
            originLat = query.origin.lat,
            originLng = query.origin.lng,
            proxyUrl = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = `https://maps.googleapis.com/maps/api/directions/json?destination=${destinationLat}%2C${destinationLng}&origin=${originLat}%2C${originLng}&key=${KEY}`

        console.warn(proxyUrl + targetUrl)
        resolve(fetch(proxyUrl + targetUrl)
            .then(blob => blob.json())
            .then(data => {
                console.table(data);
                return data;
            })
            .catch(e => {
                console.log(e);
                return e;
            })
        )
    })

    // return new Promise(resolve => {
    //     console.log(JSON.stringify(query))
    //     googleMapsClient.directions(query, (err, response) => {
    //         console.log(response)
    //         // console.log(status)
    //         resolve(response.json)
    //         // return res;
    //     })
    // })
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

function directionApiConversion(JSON, request) {
    JSON.request = {
        destination: {
            lat: request.destination.lat,
            lng: request.destination.lng
        },
        origin: {
            lat: request.origin.lat,
            lng: request.origin.lng
        },
        travelMode: request.travelMode || "DRIVING"
    }

    if (JSON.routes[0].bounds.northeast.lng) {
        let tempRoutes = {
            east: JSON.routes[0].bounds.northeast.lng,
            north: JSON.routes[0].bounds.northeast.lat,
            south: JSON.routes[0].bounds.southwest.lat,
            west: JSON.routes[0].bounds.southwest.lng
        }

        JSON.routes[0].bounds = tempRoutes
    }

    console.warn(request.origin)
    console.warn(request.destination)
    // console.warn(encodeGPolyline(arr))

    JSON.routes[0].legs[0].steps.map((step) => {
        const arr = [
            [step.start_location.lat, step.start_location.lng],
            [step.end_location.lat, step.end_location.lng]
        ]
        step.encoded_lat_lngs = encodeGPolyline(arr)
        step.path = [{
            lat: step.start_location.lat,
            lng: step.start_location.lng
        }, {
            lat: step.end_location.lat,
            lng: step.end_location.lng
        }]
    })

    // JSON.routes[0].legs[0].steps[0].encoded_lat_lngs = encodeGPolyline(arr)

    // debugger

    return JSON
}

function encodeGPolyline(path){
    var enc = "";
    var old = true;
    for(let c in path){
        var latlng = path[c];
        if(old === true){
            enc += encodeGPolylineNum(latlng[0])+
                   encodeGPolylineNum(latlng[1]);
        }else{
            enc += encodeGPolylineNum(latlng[0] - old[0])+
                   encodeGPolylineNum(latlng[1] - old[1]);
        }
        old = latlng;
    }
    return enc;
}

function encodeGPolylineNum(num){
    var fu = false;
    if(num < 0){
        fu = true;
    }
    //STEP2
    num = Math.round(num * 100000);
    //STEP3
    //STEP4
    num = num << 1;
    //STEP5
    if(fu){
            num = ~num;
    }
    //STEP6 - STEP7
    num = num.toString(2);
    var n = [];
    for(var c = 0; c < num.length; c++){
        n.push(num.charAt(c));
    }
    num = [];
    var nn = "";
    for(c=n.length-1;c >= 0;c--){
        nn = n[c] + nn;
        if(nn.length == 5){
            num.push(nn);
            nn = "";
        }
    }
    if(nn.length>0){
        nn = str_repeat("0",5 - nn.length) + nn;
        num.push(nn);
    }
    //STEP8 - STEP9 - STEP10 - STEP11

    for(var c = 0;c < num.length;c++){
        if(c != num.length - 1){
            num[c] = String.fromCharCode(bindec(num[c]) + 32 + 63);
        }else{
            num[c] = String.fromCharCode(bindec(num[c]) + 63);
        }
    }
    return num.join("");
}

function str_repeat(str, n){
   var ret = "";
   for (; n > 0; n >>>= 1, str += str) if (n & 1) ret += str;
   return ret;
}


function bindec(binary_string) {
   binary_string = (binary_string + '').replace(/[^01]/gi, '');
   return parseInt(binary_string, 2);
}

console.log(encodeGPolylineNum(-179.9832104));
console.log(encodeGPolyline(
    [
        [38.5,-120.2],[40.7,-120.95],[43.252,-126.453]
    ]
));

export { searchLocation, getDirections, geocode, directionApiConversion };
