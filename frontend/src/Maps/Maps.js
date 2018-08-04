import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps"

const Maps = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD9YvX5tuxcYw-yuUifcl5KWFAoMAh2Xsw&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
  {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
)

class MapComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    isMarkerShown: false,
    isMapShown: false
  }

  componentDidMount() {
  }

  handleMarkerClick = () => {
  }

  render = () => {
    return (
      <div className='lgcards'> 
        {this.props.isMapShown ? 
        <Maps className="maps"
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          directions={this.props.directions}
        />
        : null }
      </div>
    )
  }
}

export default MapComponent