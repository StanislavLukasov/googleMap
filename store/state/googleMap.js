import reducers from '../reducers'

const initialState = {
    googleMapZoom: 3,
    googleMapLocation: {},
    googleMapViewport: {},
    googleMapViewportOnDrag: {},
    googleMapPins: [],
    googleMapMarkers: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'SET_ZOOM':
            return reducers.setZoom(state, action)
        case 'SET_LOCATION':
            return reducers.setLocation(state, action)
        case 'SET_VIEWPORT':
            return reducers.setViewport(state, action)
        case 'SET_VIEWPORT_ON_DRAG':
            return reducers.setViewportOnDrag(state, action)
        case 'SET_PINS':
            return reducers.setPins(state, action)
        case 'SET_MARKERS':
            return reducers.setMarkers(state, action)
        default:
            return state
    }
}
