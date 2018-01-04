import { connect } from 'react-redux'
import GoogleMap from './googleMap'

const mapStateToProps = state => ({ state })
const mapDispatchToProps = dispatch => ({ dispatch })
const mergeProps = ({ state }, { dispatch }, ownProps) => {

    const { googleMapLocation, googleMapMarkers, googleMapPins, googleMapViewport, googleMapViewportOnDrag, googleMapZoom } = state.googleMap

    return Object.assign({}, ownProps, {
        googleMapLocation, 
        googleMapMarkers, 
        googleMapPins, 
        googleMapViewport, 
        googleMapViewportOnDrag,
        googleMapZoom,
        dispatch
    })
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(GoogleMap)
