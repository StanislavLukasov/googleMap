class GoogleMapActions {
    setZoom(googleMapZoom) {
        return {
            type: 'SET_ZOOM',
            googleMapZoom
        }
    }
    
    setLocation(googleMapLocation) {
        return {
            type: 'SET_LOCATION',
            googleMapLocation
        }
    }
    
    setViewport(googleMapViewport) {
        return {
            type: 'SET_VIEWPORT',
            googleMapViewport
        }
    }
    
    setViewportOnDrag(googleMapViewportOnDrag) {
        return {
            type: 'SET_VIEWPORT_ON_DRAG',
            googleMapViewportOnDrag
        }
    }
    
    setPins(googleMapPins) {
        return {
            type: 'SET_PINS',
            googleMapPins
        }
    }
    
    setMarkers(googleMapMarkers) {
        return {
            type: 'SET_MARKERS',
            googleMapMarkers
        }
    }
}

export default new GoogleMapActions()
