export const getCurrentCity = async () => {
    console.log('1')
  if (window.navigator.geolocation) {
    console.log('2')
    return window.navigator.geolocation.getCurrentPosition(successFunction, errorFunction)
  }
}

// Get the latitude and the longitude;
function successFunction (position) {
    console.log('3aqui')
  var lat = position.coords.latitude
  var lng = position.coords.longitude
 return codeLatLng(lat, lng)
}

function errorFunction () {
  console.log('Error location.js')
}

function codeLatLng (lat, lng) {
  const geocoder = new window.google.maps.Geocoder()

  var latlng = new window.google.maps.LatLng(lat, lng)
  geocoder.geocode({ latLng: latlng }, (results, status) => {
    let city
    let country
    if (status === window.google.maps.GeocoderStatus.OK) {
      console.log(results)
      if (results[1]) {
        // find country name
        for (var i = 0; i < results[0].address_components.length; i++) {
          if (results[0].address_components[i].types[0] === 'country') {
            country = results[0].address_components[i].short_name
          }
          for (var b = 0; b < results[0].address_components[i].types.length; b++) {
            // there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
            if (results[0].address_components[i].types[b] === 'administrative_area_level_1') {
              // this is the object you are looking for
              city = results[0].address_components[i]
              break
            }
          }
        }
        // city data
        console.log(`${country} / ${city.long_name}`)
        return `${country} / ${city.long_name}`
      } else {
        console.log('No results found')
      }
    } else {
      console.log(`Geocoder failed due to:  + ${status}`)
    }
  })
}
