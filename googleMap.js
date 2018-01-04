import React, { Component } from 'react';
import _ from 'lodash'
import ErrorMessage from '../ErrorMessage'
import Property from '../Property/property'
import Loading from '../Loading'
import styles from './styles'
import content from './content'
import Actions from './store/actions'

export default class GoogleMap extends Component {
    constructor (props) {
        super(props)
        
        /**
         * @var object
         */
        this.state = {
            error: false,
            searchOnDrag: this.props.searchOnDrag || false,
            searchOnZoom: this.props.searchOnZoom || false,
            searchHereButton: this.props.searchHereButton || false,
            displayPropertyComponent: false
        }
        
        /**
         * @var string
         */
        this.mapContainerId = 'google-map--content'
        
        /**
         * @var int
         */
        this.viewportDistanceDifference = 20
        
        /**
         * @var int
         */
        this.zoom = 2
        
        /**
         * @var int
         */
        this.minimumZoom = 2
        
        /**
         * @var int
         */
        this.maximumZoom = 25
        
        /**
         * @var object
         */
        this.viewport = {}
        
        /**
         * @var object
         */
        this.viewportOnDrag = {}
        
        /**
         * @var object
         */
        this.location = {}
        
        /**
         * @var array
         */
        this.markers = []
        
        /**
         * @var array
         */
        this.pins = []
        
        /**
         * @var bool
         */
        this.loadingOnDrag = false
        
        /**
         * @var bool
         */
        this.changeViewport = true
        
        /**
         * @var bool
         */
        this.containerNode = false
        
        /**
         * @var int
         */
        this.containerWidth = 0
        
        /**
         * @var int
         */
        this.breakpoint = 420 || this.props.breakpoint
        
        /**
         * @var string
         */
        this.makrkerChangedOnHover = false
        
        /**
         * @var object|bool
         */
        this.selectedPinId = false
        
        /**
         * @var integer
         */
        this.maximumNorthLat = 84
        
        /**
         * @var integer
         */
        this.maximumSouthLat = -84
        
        /**
         * @var bool
         */
        this.initialViewport = true
        
        /**
         * @var bool
         */
        this.userChange = false
        
        /**
         * @var bool
         */
        this.renderOnlyViewport = true
    }
    
    /**
     * Check if google api script is loaded before rendering containers
     *
     * @return false
     */
    componentWillMount() {
        try {
            this.checkIfScriptIsLoaded()
            this.isTestingEnvironment()
            this.setStyles(this.props)
            this.setContent(this.props)
            this.setZoom(false, this.props.zoom)
            this.setViewport(false, this.props.viewport)
            this.setLocation(false, this.props.location)
            this.setPins(false, this.props.pins)
        } catch (e) {
            this.handleError(e)
        } 
    }
    
    /**
     * Remove event listeners on unmount
     *
     * @return false
     */
     componentWillUnmount() {
         if(this.containerNode) {
             window.removeEventListener('resize', this.handleContainerResize.bind(this))
         }
     }
    
    /**
     * Compare next props to class variables when component receives props
     *
     * @param object nextProps
     * @return false
     */
    componentWillReceiveProps(nextProps) {
        try {
            this.setStyles(nextProps)
            this.setContent(nextProps)
            
            // Search on drag
            if(nextProps.searchOnDrag !== undefined) {
                if(nextProps.searchOnDrag !== this.props.searchOnDrag){
                    this.setSearchOnDrag(nextProps.searchOnDrag)
                }
            }
            
            // Error updated
            if(nextProps.error !== undefined) {
                if(nextProps.error !== this.props.error){
                    this.setError(null, nextProps.error)
                }
            }
            
            // Zoom updated
            if(nextProps.zoom !== undefined) {
                if(nextProps.zoom !== this.props.zoom) {
                    this.setZoom(false, nextProps.zoom)
                }
            }
            
            // Viewport update
            if(nextProps.viewport !== undefined) {
                if(!_.isEqual(nextProps.viewport, this.props.viewport)) {
                    this.setViewport(false, nextProps.viewport)
                } else if(nextProps.setViewportFromProps !== this.props.setViewportFromProps) {
                    if(nextProps.setViewportFromProps) {
                        this.setViewport(false, nextProps.viewport)
                    }
                }
            }

            // Location update
            if(nextProps.location !== undefined) {
                if(!_.isEqual(nextProps.location, this.props.location)) {
                    this.setChangeViewport(true)
                    this.setSearchHereButton(false)
                    this.setLocation(false, nextProps.location)
                }
            }
            
            // Pins update
            if(nextProps.pins !== undefined) {
                if(!_.isEqual(nextProps.pins, this.props.pins)) {
                    this.setPins(false, nextProps.pins)
                }
            }
            
            // HoverPinId update
            if(nextProps.hoverPinId !== undefined) {
                if(nextProps.hoverPinId !== this.props.hoverPinId) {
                    this.setHoverPinIcon(nextProps.hoverPinId)
                }
            }
        } catch (e) {
            this.handleError(e)
        } 
    }
    
    /**
     * Checks if pins need to be re rendered after component has completed receiving props
     *
     * @param object prevProps
     * @return false
     */
    componentDidUpdate(prevProps) {
        let renderPins = false
        
        if(!_.isEqual(prevProps.viewport, this.props.viewport)) {
            renderPins = true
        }
        
        if(!_.isEqual(prevProps.location, this.props.location)) {
            renderPins = true
        }
        
        if(!_.isEqual(prevProps.pins, this.props.pins)) {
            renderPins = true
        }
        
        if(this.props.setViewportFromProps) {
            this.setChangeViewport(true)
            renderPins = true
        }
        
        try {
            if(renderPins) {
                this.renderPins()
            }
            
            // If map is zoomed out to where you get to see grey edges, change the zoom to default value
            this.checkMinimumZoomValue()
        } catch (e) {
            this.handleError(e)
        } 
    }

    
    /**
     * Render scripts after all containers have been rendered
     *
     * @return false
     */
    componentDidMount() {
        if(!this.state.error) {
            try {
                this.renderMap()
            } catch (e) {
                this.handleError(e)
            } 
        }
    }
    
    /**
     * Sets class styles from file
     *
     * @param object props
     * @return false
     */
    setStyles(props) {
        this.styles = styles(props)
    } 
    
    /**
     * Sets class content from file
     *
     * @param object props
     * @return false
     */
    setContent(props) {
        this.content = content(props)
    }
    
    /**
     * Sets search on drag state
     *
     * @param boool props
     * @return false
     */
    setSearchOnDrag(value) {
        if(value !== undefined) {
            if(value !== this.state.searchOnDrag) {
                this.setState({
                    searchOnDrag: value
                })
            }
        }
    }
    
    /**
     * Sets search here button state
     *
     * @param boool props
     * @return false
     */
    setSearchHereButton(value) {
        if(value !== undefined) {
            if(value !== this.state.searchHereButton) {
                this.setState({
                    searchHereButton: value
                })
            }
        }
    }
    
    /**
     * Sets display property component state
     *
     * @param boool props
     * @return false
     */
    setDisplayPropertyComponent(value) {
        if(value !== undefined) {
            if(value !== this.state.displayPropertyComponent) {
                this.setState({
                    displayPropertyComponent: value
                })
            }
        }
    }
    
    /**
     * Sets class error
     *
     * @param bool error
     * @param bool errorFromProps
     * @return false
     */
    setError(error, errorFromProps) {
        if(error !== null && errorFromProps == null) {
            if(this.state.error !== error) {
                this.setState({
                    error: error
                })
            }
        }
        
        if(error == null && errorFromProps !== null) {
            if(this.state.error !== errorFromProps) {
                this.setState({
                    error: errorFromProps
                })
            }
        }
    }
    
    /**
     * Sets class zoom
     *
     * @param bool zoom
     * @param bool zoomFromProps
     * @return false
     */
    setZoom(zoom, zoomFromProps) {
        if(zoom && !zoomFromProps) {
            if(this.zoom !== zoom && Number.isInteger(zoom)) {
                this.zoom = zoom 
                this.dispatchZoom(zoom)
            }
        }
        
        if(!zoom && zoomFromProps) {
            if(this.zoom !== zoomFromProps && Number.isInteger(zoomFromProps)) {
                this.zoom = zoomFromProps
                this.dispatchZoom(zoomFromProps)
            }    
        }
    }
    
    /**
     * Sets class viewport
     *
     * @param bool viewport
     * @param bool viewportFromProps
     * @return false
     */
    setViewport(viewport, viewportFromProps) {      
        // Default viewport from props
        if(this.props.defaultViewport) {
            if(this.props.defaultViewport.constructor === Object) {
                if(!_.isEqual(this.viewport, this.props.defaultViewport)) {
                    this.viewport = defaultViewport
                    this.dispatchViewport(this.props.defaultViewport)
                }
            }
        }
        
        if(viewport && !viewportFromProps) {
            if(!_.isEqual(this.viewport, viewport)) {
                if(typeof viewport === 'object') {
                    this.viewport = viewport
                    this.dispatchViewport(viewport)
                }
            }
        }
        
        if(!viewport && viewportFromProps) {
            if(!_.isEqual(this.viewport, viewportFromProps)) {
                if(typeof viewportFromProps === 'object') {
                    this.viewport = viewportFromProps
                    this.dispatchViewport(viewportFromProps)
                }
            }
        }
    }
    
    /**
     * Sets class viewport on drag
     *
     * @param bool viewport
     * @return false
     */
    setViewportOnDrag(viewport) {      
        if(typeof viewport === 'object') {
            this.viewportOnDrag = viewport
            this.loadingOnDrag = true
            this.setChangeViewport(false)
            this.dispatchViewportOnDrag(viewport)
        }
    }
    
    /**
     * Sets class location
     *
     * @param bool location
     * @param bool locationFromProps
     * @return false
     */
    setLocation(location, locationFromProps) {
        if(this.props.defaultLocation) {
            if(this.props.defaultLocation.constructor === Object) {
                if(!_.isEqual(this.location, this.props.defaultLocation)) {
                    this.location = this.props.defaultLocation
                    this.dispatchLocation(this.props.defaultLocation)
                }
            }
        }
        
        if(location && !locationFromProps) {
            if(!_.isEqual(this.location, location)) {
                if(typeof location === 'object') {
                    this.location = location
                    this.dispatchLocation(location)
                }
            }
        }
        
        if(!location && locationFromProps) {
            if(!_.isEqual(this.location, locationFromProps)) {
                if(typeof locationFromProps === 'object') {
                    this.location = locationFromProps
                    this.dispatchLocation(locationFromProps)
                }
            }
        }
    }
    
    /**
     * Sets class pins
     *
     * @param bool pins
     * @param bool pinsFromProps
     * @return false
     */
    setPins(pins, pinsFromProps) {
        // If pins
        if(pins && !pinsFromProps) {
            if(pins.constructor === Array) {
                if(!_.isEqual(this.pins, pins)) {
                    this.pins = pins
                    this.dispatchPins(pins)
                }
            }
        }
        
        // If pins from props
        if(!pins && pinsFromProps) {
            if(pinsFromProps.constructor === Array) {
                if(!_.isEqual(this.pins, pinsFromProps)) {
                    this.pins = pinsFromProps
                    this.dispatchPins(pinsFromProps)
                }
            }
        }
    }
    
    /**
     * Updates pin icon on hover
     *
     * @param string|false pinIconId
     * @return false
     */
    setHoverPinIcon(pinIconId) {
        if(this.content.marker) {
            if(this.makrkerChangedOnHover && this.content.marker.icon) {
                if(typeof this.makrkerChangedOnHover === 'object') {
                    let icon = {
                        url: this.content.marker.icon,
                        scaledSize: new google.maps.Size(36, 36)
                    }
                    
                    // Sets default icon
                    this.makrkerChangedOnHover.setIcon(icon)
                    
                    // Sets visited icon if found in storage
                    if(this.getMarkerIdFromSessionStorage(this.makrkerChangedOnHover.id)) {
                        this.setVisitedPinIcon(this.makrkerChangedOnHover.id)
                    }
                    
                    this.makrkerChangedOnHover = false
                }
            }
            
            // Sets hover icon
            if(pinIconId && this.content.marker.iconhover) {
                let marker = _.find(this.markers, {id: pinIconId })
                
                if(marker) {
                    if(typeof marker === 'object') {
                        let icon = {
                            url: this.content.marker.iconhover,
                            scaledSize: new google.maps.Size(36, 36)
                        }
                        
                        marker.setIcon(icon)
                        this.makrkerChangedOnHover = marker    
                    }
                }
            }
        }
    }
    
    /**
     * Updates pin icon if stored in session storage
     *
     * @param string pinIconId
     * @return false
     */
    setVisitedPinIcon(pinIconId) {
        // Sets default icon
        if(this.content.marker) {
            // Sets hover icon
            if(pinIconId && this.content.marker.iconvisited) {
                let marker = _.find(this.markers, {id: pinIconId })

                if(marker) {
                    if(typeof marker === 'object') {
                        let icon = {
                            url: this.content.marker.iconvisited,
                            scaledSize: new google.maps.Size(36, 36)
                        }
                        
                        marker.setIcon(icon) 
                    }
                }
            }
        }
    }
    
    /**
     * Sets marker id to session storage
     *
     * @param string markerId
     * @return false
     */
    setMarkerIdToSessionStorage(markerId) {
        if (typeof(Storage) !== "undefined" && markerId) {
            if(!this.getMarkerIdFromSessionStorage(markerId)) {
                sessionStorage.setItem(markerId, true)
                this.setVisitedPinIcon(markerId)
            }
        }
    }
    
    /**
     * Sets map center
     *
     * @return false
     */
    setMapCenterWithLocation(location) {
        if(this.map && location) {
            if(typeof location === 'object') {
                this.map.setCenter(new google.maps.LatLng(location))
            }
        } 
    }
    
    /**
     * Sets map zoom
     *
     * @return false
     */
    setMapZoom(zoom) {
        if(this.map && zoom) {
            if(Number.isInteger(zoom)) {
                if(this.map.zoom !== zoom) {
                    this.map.setZoom(zoom)
                }
            }
        } 
    }
    
    /**
     * Sets change viewport bool
     *
     * @param bool value
     * @return false
     */
    setChangeViewport(value) {
        if(value === true || value === false) {
            this.changeViewport = value
        }
    }
    
    /**
     * Gets viewport object from bounds
     *
     * @param GoogleMapBoundsInstance bounds
     * @return object result
     */
    getViewportFromBounds(bounds) {
        let result = false
        
        if(bounds) {
            if(bounds.getNorthEast().lat() && bounds.getNorthEast().lng() && bounds.getSouthWest().lat() && bounds.getSouthWest().lng()) {
                result = {
                    northeast: {
                        lat: bounds.getNorthEast().lat(),
                        lng: bounds.getNorthEast().lng()
                    },
                    northwest: {
                        lat: bounds.getNorthEast().lat(),
                        lng: bounds.getSouthWest().lng()
                    },
                    southwest: {
                        lat: bounds.getSouthWest().lat(),
                        lng: bounds.getSouthWest().lng()
                    },
                    southeast: {
                        lat: bounds.getSouthWest().lat(),
                        lng: bounds.getNorthEast().lng()
                    }
                }
            }
        }
        
        return result
    }
    
    /**
     * Gets current viewport from google maps
     *
     * @return object result
     */
    getCurrentViewPort() {
        let result = false
        
        if(this.map) {
            let bounds = this.map.getBounds()
            result = this.getViewportFromBounds(bounds)
        }
        
        return result
    }
    
    /**
     * Gets marker id from session storage
     *
     * @param string markerId
     * @return bool
     */
    getMarkerIdFromSessionStorage(markerId) {
        let result = false
        
        if (typeof(Storage) !== "undefined" && markerId) {
            if(sessionStorage[markerId]) {
                result = true
            }
        }
        
        return result
    }
    
    /**
     * Gets property image
     *
     * @param object property
     * @return bool|array
     */
    getPropertyImage(property) {
        let result = false
        let images = []

        if(property.images) {
            images = property.images

            if(images.constructor === Array) {
                if(images[0] && this.props.s3) {
                    result = this.props.s3+images[0]
                }
            }
        }

        if(result == false && this.content.property.defaultimage) {
            result = this.content.property.defaultimage
        }

        return result
    }
    
    /**
     * Gets new Google Maps bounds
     *
     * @return object GoogleMapsBoundsInstance
     */
    getNewBounds() {
        return new google.maps.LatLngBounds()
    }
    
    /**
     * Gets and sets google map markers
     *
     * @param object GoogleMapsBoundsInstance bounds
     * @return GoogleMapBoundsInstance
     */
    getMarkers(bounds) {
        this.markers = []
        
        if(this.pins.length > 0) {
            for (var pinsCount = 0; pinsCount < this.pins.length; pinsCount++) {
                if(this.pins[pinsCount].lat && this.pins[pinsCount].lng) {
                    let image = {
                        url: '/images/googleMapMarker.svg',
                        scaledSize: new google.maps.Size(36, 36)
                    }
                    
                    // Default icon
                    if(this.content.marker.icon) {
                        image.url = this.content.marker.icon
                    }
                    
                    // If marker is set in session storage
                    if(this.getMarkerIdFromSessionStorage(this.pins[pinsCount].id)) {
                        if(this.content.marker.iconvisited) {
                            image.url = this.content.marker.iconvisited
                        }
                    }
                    
                    let markerOptions = {
                        position: {
                            lat: this.pins[pinsCount].lat,
                            lng: this.pins[pinsCount].lng
                        },
                        map: this.map,
                        optimized: false,
                        icon: image
                    }
                    
                    let marker = new google.maps.Marker(markerOptions)
                    marker.id = this.pins[pinsCount].id
                    
                    if(marker) {
                        this.markers.push(marker)
                        let markerLocation = new google.maps.LatLng(marker.position.lat(), marker.position.lng())
                        
                        this.initMarkerClickEvent(marker)
                        
                        if(this.changeViewport && !this.renderOnlyViewport) {
                            bounds.extend(markerLocation)  
                        }
                    }
                }
            }
            
            this.currentViewport = this.getViewportFromBounds(bounds)
        }
        
        return bounds
    }
    
    /**
     * Dispatches zoom to store
     *
     * @param int zoom
     * @return false
     */
    dispatchZoom(zoom) {
        let dispatch = this.props.dispatch
        dispatch(Actions.setZoom(zoom))
    }
    
    /**
     * Dispatches location to store
     *
     * @param object location
     * @return false
     */
    dispatchLocation(location) {
        let dispatch = this.props.dispatch
        dispatch(Actions.setLocation(location))
    }
    
    /**
     * Dispatches viewport to store
     *
     * @param object viewport
     * @return false
     */
    dispatchViewport(viewport) {
        let dispatch = this.props.dispatch
        dispatch(Actions.setViewport(viewport))
    }
    
    /**
     * Dispatches viewport on drag to store
     *
     * @param object viewport
     * @return false
     */
    dispatchViewportOnDrag(viewport) {
        let dispatch = this.props.dispatch
        dispatch(Actions.setViewportOnDrag(viewport))
    }
    
    /**
     * Dispatches pins to store
     *
     * @param array pins
     * @return false
     */
    dispatchPins(pins) {
        let dispatch = this.props.dispatch
        dispatch(Actions.setPins(pins))
    }
    
    /**
     * Dispatches markers to store
     *
     * @param array markers
     * @return false
     */
    dispatchMarkers(markers) {
        let dispatch = this.props.dispatch
        dispatch(Actions.setMarkers(markers))
    }
    
    /**
     * Sets class testing variable to true of node environment is set to testing
     *
     * @return false
     */
    isTestingEnvironment() {
        let testing = false
        
        if(process.env.NODE_ENV == 'test') {
            testing = true
        }
        
        this.testing = testing
    }
    
    /**
     * Checks if breakpoint is small
     *
     * @return bool
     */
    isBreakpointSmall() {
        let result = false
        
        if(this.containerWidth <= this.breakpoint && this.containerWidth !== 0) {
            result = true
        }
        
        return result
    }
    
    /**
     * Checks if google maps api script has been loaded in to the DOM
     *
     * @return false
     */
    checkIfScriptIsLoaded() {
        if(!this.testing) {
            if(!window.google) {
                console.log('Google api failed to load')
                this.setError(true, null)
            }
            
            if(window.google) {
                if(!window.google.maps) {
                    console.log('Google maps api failed to load')
                    this.setError(true, null)
                }
            }
        }
    }
    
    /**
     * Sets map zoom to its default value
     *
     * @return bool result
     */
    checkMinimumZoomValue() {
        if(this.map) {
            if(this.map.zoom < this.minimumZoom) {
                this.setMapZoom(this.minimumZoom)
                this.setZoom(this.minimumZoom)
            }
            
            if(this.map.zoom > this.maximumZoom) {
                this.setMapZoom(this.maximumZoom)
                this.setZoom(this.maximumZoom)
            }
        }
    }
    
    /**
     * Checks if content should be rendered based on the google maps api script
     *
     * @return bool result
     */
    shouldRender() {
        let result = true
        
        if(!window.google) {
            result = false
        }
        
        if(window.google) {
            if(!window.google.maps) {
                result = false
            }
        }
        
        return result
    }

    /**
     * Initialises google map idle event
     *
     * @return false
     */
    initIdleEvent() {
        if(this.shouldRender()) { 
            let _this = this
            
            google.maps.event.addListener(this.map, 'idle', function() {
                if(_this.userChange) {
                    _this.userChange = false
                    let currentViewport = _this.getCurrentViewPort()
                    
                    if(currentViewport) {
                        _this.setViewport(currentViewport, false)
                        _this.setDisplayPropertyComponent(false)
                        _this.selectedPinId = false
                        
                        if(_this.state.searchOnDrag) {
                            _this.setViewportOnDrag(currentViewport, false)
                        }
                        
                        if(!_this.state.searchOnDrag) {
                            _this.setSearchHereButton(true)
                        }
                    }
                }
            })
        }
    }
    
    /**
     * Initialises google map drag start event
     *
     * @return false
     */
    initDragStartEvent() {
        if(this.shouldRender()) { 
            let _this = this
            
            google.maps.event.addListener(this.map, 'dragstart', function() {
                _this.userChange = true
            });
        }
    }
    
    /**
     * Initialises google map zoom event
     *
     * @return false
     */
    initZoomEvent() {
        if(this.shouldRender()) {
            let _this = this
            
            google.maps.event.addListener(this.map, 'zoom_changed', function() { 
                let zoom = _this.map.getZoom()
                _this.setZoom(zoom, false)
                
                let currentViewport = _this.getCurrentViewPort()
                if(currentViewport) {
                    //_this.setViewport(currentViewport, false)    
                }
            });
        }
    }
    
    /**
     * Initialises google map click event
     *
     * @return false
     */
    initClickEvent() {
        if(this.shouldRender()) {
            let _this = this
            
            google.maps.event.addListener(this.map, 'click', function() { 
                _this.setDisplayPropertyComponent(false)
                _this.selectedPinId = false
            });
        }
    }
    
    /**
     * Initialises google map click event
     *
     * @return false
     */
    initDoubleClickEvent() {
        if(this.shouldRender()) {
            let _this = this
            
            google.maps.event.addListener(this.map, 'dblclick', function() { 
                let currentViewport = _this.getCurrentViewPort()
                
                if(currentViewport) {
                    _this.setViewport(currentViewport, false)
                    _this.setDisplayPropertyComponent(false)
                    _this.selectedPinId = false
                    _this.userChange = true
                    
                    if(_this.state.searchOnDrag) {
                        _this.setViewportOnDrag(currentViewport, false)
                    }
                    
                    if(!_this.state.searchOnDrag) {
                        _this.setSearchHereButton(true)
                    }
                }
            });
        }
    }
    
    /**
     * Initialises container resize event
     *
     * @param DomElement node
     * @return false
     */
    initContainerResizeEvent(node) {
        if(node) {
            this.containerNode = node
            this.handleContainerResize(this)
            window.addEventListener('resize', this.handleContainerResize.bind(this))
        }
    }
    
    /**
     * Initialises google map marker click event
     *
     * @param GoogleMapsMrkerInstance marker
     * @return false
     */
    initMarkerClickEvent(marker) {
        if(marker) {
            let _this = this
            
            marker.addListener('click', function() {
                if(_this.props.displayPropertyComponentOnClick) {
                    // If property is already displayed
                    if(_this.state.displayPropertyComponent && marker.id) {
                        _this.selectedPinId = marker.id
                        _this.setMarkerIdToSessionStorage(marker.id)
                        _this.setDisplayPropertyComponent(false)
                    }
                    
                    // If property is not displayed
                    if(!_this.state.displayPropertyComponent && marker.id) {
                        _this.selectedPinId = marker.id
                        _this.setMarkerIdToSessionStorage(marker.id)
                        _this.setDisplayPropertyComponent(true)
                    }
                }
            });
        }
    }
    
    /**
     * Clears all google maps markers
     *
     * @return false
     */
    clearAllMarkers() {
        for (var markersCount = 0; markersCount < this.markers.length; markersCount++ ) {
            this.markers[markersCount].setMap(null)
        }
    }
    
    /**
     * Centers google map
     *
     * @return false
     */
    centerMapWithZoom() {
        if(this.map) {
            this.setMapCenterWithLocation(this.location)
            this.setMapZoom(this.minimumZoom)
        } 
    }
    
    /**
     * Checks if current class viewport should be rendered
     *
     * @param object currentViewport
     * @return bool result
     */
    shouldRenderLocationViewport(currentViewport) {
        let result = false
        
        // Compare current location distance to viewport from props
        if(typeof currentViewport === 'object' && typeof this.viewport === 'object') {
            if(currentViewport.northeast && currentViewport.southwest && this.viewport.northeast && this.viewport.southwest && !this.viewport.default) {
                let currentViewportDistance = false
                let viewportDistance = false
                
                if(currentViewport.northeast.lat && currentViewport.northeast.lng && currentViewport.southwest.lat && currentViewport.southwest.lng) {
                    // get Distance from current location and using markers
                    currentViewportDistance = this.calcDistance(
                        new google.maps.LatLng(currentViewport.northeast.lat, currentViewport.northeast.lng),
                        new google.maps.LatLng(currentViewport.southwest.lat, currentViewport.southwest.lng)
                    )
                }
                
                // Get distance from viewport from props
                if(this.viewport.northeast.lat && this.viewport.northeast.lng && this.viewport.southwest.lat && this.viewport.southwest.lng) {
                    viewportDistance = this.calcDistance(
                        new google.maps.LatLng(this.viewport.northeast.lat, this.viewport.northeast.lng),
                        new google.maps.LatLng(this.viewport.southwest.lat, this.viewport.southwest.lng)
                    )
                }
    
                // Do calculations
                if(currentViewportDistance && viewportDistance) {
                    if((viewportDistance / currentViewportDistance) > this.viewportDistanceDifference) {
                        result = true
                    }
                } 
            } 
        }
        
        // If no pins
        if(this.pins.constructor == Array) {
            if(this.pins.length == 0) {
                result = true
            }
        }
        
        if(this.props.setViewportFromProps) {
            //result = true
        }
        
        return result
    }
    
    /**
     * Calculates distance between two geolocations
     *
     * @param object p1
     * @param object p2
     * @return bool result
     */
    calcDistance(p1, p2) {
        let result = false
        
        if(window.google) {
            if(google.maps) {
                if(google.maps.geometry) {
                    result = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2)
                }
            }
        }
        
        return result
    }
    
    /**
     * Change class zoom on click
     *
     * @param bool zoomin
     * @param bool zoomout
     * @param event e
     * @return false
     */
    handleZoomOnClick(zoomin, zoomout, e) {
        e.preventDefault();
        let zoom = this.zoom
        
        if(zoomin && !zoomout) {
            zoom = zoom + 1
        }
        
        if(!zoomin && zoomout) {
            zoom = zoom - 1
        }
        
        if(zoom >= this.minimumZoom) {
            this.setZoom(zoom, false)
            
            if(this.map) {
                this.setChangeViewport(false)
                
                this.map.setZoom(zoom)
                this.setDisplayPropertyComponent(false)
                this.selectedPinId = false
                
                if(this.state.searchOnDrag) {
                    let currentViewport = this.getCurrentViewPort()
                    
                    if(currentViewport) {
                        this.setViewportOnDrag(currentViewport, false)
                    }
                }
                
                if(!this.state.searchOnDrag) {
                    this.setSearchHereButton(true)
                }
            }
        }
    }
    
    /**
     * Handle checkbox state change
     *
     * @param bool value
     * @param event e
     * @return false
     */
    handleSearchOnDragChange(value, e) {
        if(value !== undefined) {
            if(value !== this.state.searchOnDrag) {
                this.setSearchOnDrag(value)
            }
        }
    }
    
    /**
     * Set container width on resize
     *
     * @param event e
     * @return false
     */
    handleContainerResize(e) {
        if(this.containerNode) {
            let width = this.containerNode.offsetWidth
            
            if(width !== this.containerWidth) {
                this.containerWidth = width
            }
        }
    }
    
    /**
     * Dispatches a new search viewport
     *
     * @param event e
     * @return false
     */
    handleSearchHereButtonClick(e) {
        let currentViewport = this.getCurrentViewPort()
        
        if(currentViewport) {
            this.setViewportOnDrag(currentViewport, false)
            
            this.setState({
                searchHereButton: false
            })
        }
    }
    
    /**
     * Handle error
     *
     * @param string error
     * @return false
     */
    handleError(error) {
        this.setError(true, null)
    }
    
    /**
     * Renders loading container
     *
     * @return DOM element|false
     */
    renderLoading() {
        if(this.props.loading && !this.loadingOnDrag) {
            return (
                <div className="google-map--loading" style={this.styles.loadingWrapper}>
                    <Loading 
                        padding="0"
                        image={this.content.loading.image}
                    />
                </div>
            )
        }
        
        return false
    }
    
    /**
     * Renders error container
     *
     * @return DOM element|false
     */
    renderError() {
        if((this.state.error && !this.props.loading) || this.props.error) {
            return (
                <div className="google-map--error" style={this.styles.errorWrapper}>
                    <ErrorMessage 
                        image={this.content.error.image}
                        title={this.content.error.title}
                        paragraph={this.content.error.paragraph}
                    />
                </div>
            )
        }
        
        return false
    }
    
    /**
     * Renders map container
     *
     * @return DOM element|false
     */
    renderMapContainer() {
        if(!this.state.error) {
            return (
                <div style={Object.assign({},
                    this.styles.mapContainer,
                    this.props.loading && this.styles.containerHidden)}
                    ref={(node) => { this.initContainerResizeEvent(node) }}>
                    
                    <div 
                        id={this.mapContainerId} 
                        style={Object.assign({},
                        this.styles.map)}>
                    </div>
                    
                    {this.renderZoomIcons()}
                    {this.renderSearchCheckbox()}
                    {this.renderSearchHereButton()}
                    {this.renderPropertyComponent()}
                </div>
            )
        }
        
        return false
    }
    
    /**
     * Renders zoom icons on top of the map
     *
     * @return DOM element|false
     */
    renderZoomIcons() {
        if(this.content.zoom.zoomin && this.content.zoom.zoomout) {
            return (
                <div style={this.styles.zoomContainer} id="google-map--zoom-container">
                    <div style={Object.assign({},
                        this.styles.zoomInContainer,
                        this.isBreakpointSmall() && this.styles.zoomContainerSmall)}
                        id="google-map--zoomin-container" 
                        onClick={this.handleZoomOnClick.bind(this, true, false)}>
                        
                        <img src={this.content.zoom.zoomin} alt="zoom-in" style={this.styles.zoomImage} id="google-map--zoomin-image"/>
                    </div>
                    
                    <div style={Object.assign({},
                        this.styles.zoomOutContainer,
                        this.isBreakpointSmall() && this.styles.zoomContainerSmall)} 
                        id="google-map--zoomout-container"
                        onClick={this.handleZoomOnClick.bind(this, false, true)}>
                        
                        <img src={this.content.zoom.zoomout} alt="zoom-out" style={this.styles.zoomImage} id="google-map--zoomout-image"/>
                    </div>
                </div>
            )
        }
        
        return false
    }
    
    /**
     * Renders searchbox on top of the map
     *
     * @return DOM element|false
     */
    renderSearchCheckbox() {
        if(this.content.search && this.content.checkbox && !this.state.searchHereButton && !this.props.mobileBreakpoint) {
            if(this.content.search.title && this.content.checkbox.image) {
                return (
                    <div style={this.styles.searchContainer} id="google-map--search-container">
                        <div style={this.styles.searchContentComntainer}>
                            <div style={Object.assign({},
                                this.styles.checkboxContainer,
                                this.isBreakpointSmall() && this.styles.checkboxContainerSmall)} 
                                id="google-map--checkbox-container">
                        
                                <input 
                                    name="search-on-drag"
                                    id="search-on-drag"
                                    type="checkbox"
                                    style={Object.assign({},
                                        this.styles.checkbox,
                                        this.state.searchOnDrag && {
                                            backgroundImage: 'url(' + this.content.checkbox.image + ')' || 'none',
                                            backgroundSize: '100%',
                                            border: 0
                                        }
                                    )}
                                    checked={this.state.searchOnDrag}
                                    onChange={this.handleSearchOnDragChange.bind(this, !this.state.searchOnDrag)}
                                />
                            </div>
                            
                            <div style={Object.assign({},
                                this.styles.searchTextContainer,
                                this.isBreakpointSmall() && this.styles.searchTextContainerSmall)} 
                                id="google-map--search-text-container">
                                
                                {this.content.search.title}
                            </div>
                        </div>
                    </div>
                )
            }
        }
        
        return false
    }
    
    /**
     * Renders search here button
     *
     * @return DOM element|false
     */
    renderSearchHereButton() {
        if(this.state.searchHereButton) {
            return (
                <button 
                    style={this.styles.searchHereButton} 
                    id="google-map--search-here-button"
                    onClick={this.handleSearchHereButtonClick.bind(this)}>
                    
                    {this.content.search.searchhere || 'Search here'}
                </button>
            )
        }
        
        return false
    }
    
    /**
     * Renders new google map instance
     *
     * @return false
     */
    renderMap() {
        if(document.getElementById(this.mapContainerId)) {
            if(this.shouldRender()) {
                // Styles object is only passed to turn the logo white
                this.map = new google.maps.Map(document.getElementById(this.mapContainerId), {
                    zoom: this.zoom,
                    center: new google.maps.LatLng(this.location),
                    scrollwheel: false,
                    streetViewControl: false,
                    disableDefaultUI: true,
                    styles: [
                      {
                          elementType: 'labels.text.fill', stylers: [
                              {color: ''}
                          ]
                      },
                      
                    ]
                })  
                
                this.renderPins()
                this.initDragStartEvent()
                this.initIdleEvent()
                this.initZoomEvent()
                this.initClickEvent()
                this.initDoubleClickEvent()
            }
        }
        
        return false
    }
    
    /**
     * Renders class pins
     *
     * @return false
     */
    renderPins() {
        if(this.shouldRender() && this.pins.constructor === Array) {
            this.currentViewport = false
            this.clearAllMarkers()
            
            let bounds = this.getNewBounds()
            let currentViewport = this.viewport
        
            bounds = this.getMarkers(bounds)
            
            // Set from newBounds
            if(this.currentViewport) {
                currentViewport = this.currentViewport
            }
            
            if(!this.renderOnlyViewport) {
                // If pins dont extend most of viewport then extend viewport bounds
                if(this.shouldRenderLocationViewport(currentViewport) && this.changeViewport) {
                    if(this.viewport.northeast && this.viewport.southwest) {
                        let northeast = new google.maps.LatLng(this.viewport.northeast.lat, this.viewport.northeast.lng)
                        bounds.extend(northeast)  
                        
                        let southwest = new google.maps.LatLng(this.viewport.southwest.lat, this.viewport.southwest.lng)
                        bounds.extend(southwest)  
                    }
                }
            }
            
            if(this.renderOnlyViewport) {
                if(this.viewport.northeast && this.viewport.southwest) {
                    let northeast = new google.maps.LatLng(this.viewport.northeast.lat, this.viewport.northeast.lng)
                    bounds.extend(northeast)  
                    
                    let southwest = new google.maps.LatLng(this.viewport.southwest.lat, this.viewport.southwest.lng)
                    bounds.extend(southwest)  
                } 
            }
            
            if(this.map && this.changeViewport) {
                this.map.fitBounds(bounds)
                this.map.panToBounds(bounds)
            }
            
            if(this.props.setViewportFromProps) {
                this.setChangeViewport(false)
            }
        }
        
        return false
    }
    
    /**
     * Renders Property component on marker click
     *
     * @return Property component
     */
    renderPropertyComponent() {
        if(this.state.displayPropertyComponent && this.props.displayPropertyComponentOnClick && this.pins && this.selectedPinId) {
            // If array
            if(this.pins.constructor === Array) {
                // If more than one
                if(this.pins.length > 0) {
                    let property = false
                    property = _.find(this.pins, {id: this.selectedPinId })
                    
                    if(property) {
                        return (
                            <div style={this.styles.propertyOverflowContainer}>
                                <div style={Object.assign({},
                                    this.styles.propertyContainer,
                                    this.props.mobileBreakpoint && this.styles.propertyContainerMobile)}>
                                    
                                    <Property
                                        pointText={this.content.property.pointstext}
                                        bedImage={this.content.property.bed}
                                        sleepsImage={this.content.property.sleeps}
                                        bathroomImage={this.content.property.bath}
                                        reviewsImage={this.content.property.reviews}
                                        pointsBackgroundColor={this.props.pointsBackgroundColor || false}
                                        descriptionColor={this.props.descriptionColor || false}
                                        displayImage={true}
                                        pointsToggle={this.props.pointsToggle || false}
                                        href={'/' + property.path}
                                        imageSource={this.getPropertyImage(property)}
                                        pointAmount={property.points}
                                        locationTitle={property.canonical_address}
                                        bedroomNumber={property.bedrooms}
                                        bathroomNumber={property.bathrooms}
                                        sleepsNumber={property.sleeps}
                                        reviewsNumber={property.review_count}
                                        tripType={property.trip_type}
                                        inlineView={this.props.mobileBreakpoint || false}
                                    />
                                </div>
                            </div>
                        )
                    }
                }
            }
        }
        
        return false
    }

    /**
     * Renders DOM elements
     *
     * @return DOM elements
     */
    render() {
        try {
            return (
                <div style={this.styles.container}>
                    {this.renderLoading()}
                    {this.renderError()}
                    {this.renderMapContainer()}
                </div>
            )
        } catch (e) {
            this.handleError(e)
        } 
    }
}
