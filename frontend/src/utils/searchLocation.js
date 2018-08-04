// const googleMapsClient = require('@google/maps').createClient({
//   key: 'AIzaSyD9YvX5tuxcYw-yuUifcl5KWFAoMAh2Xsw'
// });

import googlemaps from '@google/maps';

const googleMapsClient = googlemaps.createClient({
    key: 'AIzaSyD9YvX5tuxcYw-yuUifcl5KWFAoMAh2Xsw'
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

export { searchLocation };
