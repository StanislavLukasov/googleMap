class GoogleMapReducers {
    setZoom(state, action) {
        const googleMapZoom = action.googleMapZoom
        const nextState = Object.assign({}, state, {
            googleMapZoom
        })
        
        return nextState
    }
    
    setLocation(state, action) {
        const googleMapLocation = action.googleMapLocation
        const nextState = Object.assign({}, state, {
            googleMapLocation
        })
        
        return nextState
    }
    
    setViewport(state, action) {
        const googleMapViewport = action.googleMapViewport
        const nextState = Object.assign({}, state, {
            googleMapViewport
        })
        
        return nextState
    }
    
    setViewportOnDrag(state, action) {
        const googleMapViewportOnDrag = action.googleMapViewportOnDrag
        const nextState = Object.assign({}, state, {
            googleMapViewportOnDrag
        })
        
        return nextState
    }
    
    setPins(state, action) {
        const googleMapPins = action.googleMapPins
        const nextState = Object.assign({}, state, {
            googleMapPins
        })
        
        return nextState
    }
    
    setMarkers(state, action) {
        const googleMapMarkers = action.googleMapMarkers
        const nextState = Object.assign({}, state, {
            googleMapMarkers
        })
        
        return nextState
    }
}

export default new GoogleMapReducers()
