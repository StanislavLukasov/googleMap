import React from 'react';
import { expect } from 'chai';
import Component from '../googleMap';
import ComponentWithStore from '../index';
import Content from '../content';
import { mount, shallow } from 'enzyme';
import loadDOM from './jsdom';
import Actions from '../store/actions'
import Reducers from '../store/reducers'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const util = require('util')

const mockStore = configureMockStore([thunk]);
let store;

const mockFunction = function(){
    let object = {}
    return object
}

store = mockStore({
    googleMap: {
        googleMapViewport: {}
    }
});

window.google = function(){
    return {}
}

window.google.maps = function(){
    return {}
}

let basicProps = {
    dispatch: mockFunction
}

let basicWrapper = mount(
    <Component {...basicProps}/>
);

let pins = [
    {
        lat: 51.406697,
        lng: -0.025194,
        id: 1234,
        path: '/path',
        points: 100,
        bedrooms: 2,
        bathrooms: 4,
        sleeps: 1,
        review_count: 4,
        trip_type: 'any',
        canonical_address: 'London, UK'
    },
    {
        lat: 51.516229,
        lng: -0.130668,
        id: 4321,
        path: '/path',
        points: 100,
        bedrooms: 2,
        bathrooms: 4,
        sleeps: 1,
        review_count: 4,
        trip_type: 'any',
        canonical_address: 'London, UK'
    }
]

let props = {
    pins: pins,
    zoom: 4,
    searchOnDrag: true,
    searchOnZoom: true,
    displayPropertyComponentOnClick: true,
    dispatch: mockFunction
}

let wrapper = mount(
    <Component {...props}/>
);

let storeWrapper = mount(
    <Provider store={store}>
        <ComponentWithStore {...props}/>
    </Provider>
);

const mockLatLong = function(){
    return 55
}

const mockGetNorthEast = function(){
    let object = {
        lat: mockLatLong,
        lng: mockLatLong
    }
    
    return object
}

const mockGetSouthWest = function(){
    let object = {
        lat: mockLatLong,
        lng: mockLatLong
    }
    
    return object
}

const mockBounds = function(){
    let object = {
        getNorthEast: mockGetNorthEast,
        getSouthWest: mockGetSouthWest
    }
    
    return object
}

describe('GoogleMap component', () => {
    beforeEach((done) => {
        loadDOM(done);
    });

    it('It exists!', () => {
    	expect(Component).to.exist
    });
    
    it('It renders containers', () => {
        expect(basicWrapper.find('#google-map--content')).to.have.length(1)
        expect(basicWrapper.find('.google-map--error')).to.have.length(0)
        expect(basicWrapper.find('ErrorMessage')).to.have.length(0)
        expect(basicWrapper.find('.google-map--loading')).to.have.length(0)
        expect(basicWrapper.find('Loading')).to.have.length(0)
    });
    
    it('It renders containers on error', () => {
        basicWrapper.instance().setError(true, null)
        
        expect(basicWrapper.find('#google-map--content')).to.have.length(0)
        expect(basicWrapper.find('.google-map--error')).to.have.length(1)
        expect(basicWrapper.find('ErrorMessage')).to.have.length(1)
        expect(basicWrapper.find('.google-map--loading')).to.have.length(0)
        expect(basicWrapper.find('Loading')).to.have.length(0)
    });
    
    it('It renders containers on load', () => {
        basicWrapper.instance().setError(false, null)
        basicWrapper.setProps({ loading: true })
        
        expect(basicWrapper.find('#google-map--content')).to.have.length(1)
        expect(basicWrapper.find('.google-map--error')).to.have.length(0)
        expect(basicWrapper.find('ErrorMessage')).to.have.length(0)
        expect(basicWrapper.find('.google-map--loading')).to.have.length(1)
        expect(basicWrapper.find('Loading')).to.have.length(1)
        
        basicWrapper.setProps({ loading: false })
    });
    
    it('It renders error from props', () => {
        basicWrapper.instance().setError(null, false)
        basicWrapper.setProps({ error: true })
        expect(basicWrapper.state().error).to.equal(true)
        
        expect(basicWrapper.find('#google-map--content')).to.have.length(0)
        expect(basicWrapper.find('.google-map--error')).to.have.length(1)
        expect(basicWrapper.find('ErrorMessage')).to.have.length(1)
    });
    
    it('It renders styles', () => {
        let styles = wrapper.instance().styles
        let result = false
        
        if(Object.keys(styles).length > 0 && styles.constructor === Object) {
            result = true
        }
        
        // Default styles
        expect(result).to.deep.equal(true)
        
        // Styles from props
        let newstyles = {
            style: 'new'
        }
        
        wrapper.setProps({ styles: newstyles })
        expect(wrapper.instance().styles).to.deep.equal(newstyles)
    });
        
    it('It renders content from props', () => {
        let content = wrapper.instance().content
        let result = false

        if(Object.keys(content).length > 0 && content.constructor === Object) {
            result = true
        }

        expect(result).to.deep.equal(true)
        
        // Content from props
        let contentWithProps = Content({
            content: {
                error: {
                    title: 'New title'
                }
            }
        })
        
        expect(contentWithProps.error.title).to.equal('New title');
    });
    
    it('It renders pins if passed from props', () => {
        let componentPins = wrapper.instance().pins
        expect(componentPins).to.deep.equal(pins)
        
        let pinsFromProps = [
            {
                lat: 11.222,
                lng: 11.222
            },
            {
                lat: 22.222,
                lng: 22.222
            }
        ]
        
        wrapper.setProps({ pins: pinsFromProps })
        expect(wrapper.instance().pins).to.deep.equal(pinsFromProps)
        
        let markers = wrapper.instance().markers.length
        expect(markers).to.equal(2)
        
        wrapper.setProps({ pins: [] })
        expect(wrapper.instance().pins).to.deep.equal([])
        
        markers = wrapper.instance().markers.length
        expect(markers).to.equal(0)
    });
    
    it('It renders correct location', () => {
        let locationFromProps = {
            lat: 11.111, 
            lng: 22.222
        }
        
        //Default location
        expect(wrapper.instance().location).to.deep.equal({})
        
        // Viewport from props
        wrapper.setProps({ location: locationFromProps })
        expect(wrapper.instance().location).to.deep.equal(locationFromProps)
        
        wrapper.setProps({ location: {} })
        expect(wrapper.instance().location).to.deep.equal({})
    });
    
    it('It renders correct viewport', () => {
        let viewportFromProps = {
            northeast: {
                lat: 11.111,
                lng: 11.111
            },
            southwest: {
                lat: 22.222,
                lng: 22.222
            }
        }
        
        //Default location
        expect(wrapper.instance().viewport).to.deep.equal({})
        
        // Viewport from props
        wrapper.setProps({ viewport: viewportFromProps })
        expect(wrapper.instance().viewport).to.deep.equal(viewportFromProps)
        
        wrapper.setProps({ viewport: {} })
        expect(wrapper.instance().viewport).to.deep.equal({})
    });
    
    it('It returns current viewport', () => {
        let viewportFromProps = {
            northeast: {
                lat: 33.333,
                lng: 11.111
            },
            southwest: {
                lat: 55.555,
                lng: 22.222
            }
        }
        
        wrapper.setProps({ viewport: viewportFromProps })
        let result = wrapper.instance().getCurrentViewPort()
        //expect(result).to.deep.equal(viewportFromProps)
    });
    
    it('It sets zoom from props', () => {
        expect(wrapper.instance().zoom).to.equal(props.zoom)
        wrapper.setProps({ zoom: 10 })
        expect(wrapper.instance().zoom).to.equal(10)
        
        wrapper.setProps({ zoom: 3 })
        expect(wrapper.instance().zoom).to.equal(3)
    });
    
    it('It should render viewport from props if markers are too far from viewport', () => {
        let surrey = {
            northeast: {
                lat: 51.4715328,
                lng: 0.05821630000000001
            },
            southwest: {
                lat: 51.0714964,
                lng: -0.8489291
            }
        }
        
        let uk = {
            northeast: {
                lat: 60.91569999999999,
                lng: 33.9165549
            },
            southwest: {
                lat: 34.5614,
                lng: -8.8988999
            }
        }
        
        // London
        wrapper.setProps({ pins: [
            {
                lat: 51.6723432,
                lng: 0.148271
            },
            {
                lat: 51.4245427,
                lng: 0.0006275000000000001
            }
        ]})
        
        wrapper.instance().renderOnlyViewport = false
        
        // Dont need to render viewport from props
        wrapper.setProps({ viewport: surrey })
        let result = wrapper.instance().shouldRenderLocationViewport(surrey)
        expect(result).to.equal(false)
        
        // Need torender viewport from props
        let bounds = wrapper.instance().getNewBounds()
        wrapper.setProps({ viewport: uk })
        wrapper.instance().getMarkers(bounds)
        let currentViewport = wrapper.instance().currentViewport
        
        result = wrapper.instance().shouldRenderLocationViewport(currentViewport)
        expect(result).to.equal(true)
        
        // On no pins
        wrapper.setProps({ pins: []})
        wrapper.instance().getMarkers(bounds)
        currentViewport = wrapper.instance().currentViewport
        
        result = wrapper.instance().shouldRenderLocationViewport(currentViewport)
        expect(result).to.equal(true)
    });
    
    it('It uses setZoom action and reducer as it should', () => {
        let value = 4
        const actionOutput = Actions.setZoom(value)
        expect(actionOutput).to.deep.equal({ type: 'SET_ZOOM', googleMapZoom: value })

        let state = false
        let reducerOutput = Reducers.setZoom(state,{ type:"SET_ZOOM", googleMapZoom: 4 })
        expect(reducerOutput).to.deep.equal({ googleMapZoom: 4 })
    });
    
    it('It uses setLocation action and reducer as it should', () => {
        let value = {
            lat: 45.000,
            lng: 45.000
        }
        
        const actionOutput = Actions.setLocation(value)
        expect(actionOutput).to.deep.equal({ type: 'SET_LOCATION', googleMapLocation: value })

        let state = {}
        let newLocation = {
            lat: 45.000,
            lng: 45.000
        }
        
        let reducerOutput = Reducers.setLocation(state,{ type:"SET_LOCATION", googleMapLocation: newLocation })
        expect(reducerOutput).to.deep.equal({ googleMapLocation: newLocation })
    });
    
    it('It uses setViewport action and reducer as it should', () => {
        let value = {
            northeast: {
                lat: 52.6754542,
                lng: 13.7611175
            },
            southwest: {
                lat: 52.338234,
                lng: 13.088346
            }
        }
        
        const actionOutput = Actions.setViewport(value)
        expect(actionOutput).to.deep.equal({ type: 'SET_VIEWPORT', googleMapViewport: value })

        let state = {}
        let newViewport = {
            northeast: {
                lat: 10.123,
                lng: 10.123
            },
            southwest: {
                lat: 10.123,
                lng: 10.123
            }
        }
        
        let reducerOutput = Reducers.setViewport(state,{ type:"SET_VIEWPORT", googleMapViewport: newViewport })
        expect(reducerOutput).to.deep.equal({ googleMapViewport: newViewport })
    });
    
    it('It uses setViewportOnDrag action and reducer as it should', () => {
        let value = {
            northeast: {
                lat: 52.6754542,
                lng: 13.7611175
            },
            southwest: {
                lat: 52.338234,
                lng: 13.088346
            }
        }
        
        const actionOutput = Actions.setViewportOnDrag(value)
        expect(actionOutput).to.deep.equal({ type: 'SET_VIEWPORT_ON_DRAG', googleMapViewportOnDrag: value })

        let state = {}
        let newViewport = {
            northeast: {
                lat: 10.123,
                lng: 10.123
            },
            southwest: {
                lat: 10.123,
                lng: 10.123
            }
        }
        
        let reducerOutput = Reducers.setViewportOnDrag(state,{ type:"SET_VIEWPORT_ON_DRAG", googleMapViewportOnDrag: newViewport })
        expect(reducerOutput).to.deep.equal({ googleMapViewportOnDrag: newViewport })
    });
    
    it('It uses setPins action and reducer as it should', () => {
        let value = [
            { lat: 12.22, lng: 13.33 },
            { lat: 12.22, lng: 13.33 }
        ]
        
        const actionOutput = Actions.setPins(value)
        expect(actionOutput).to.deep.equal({ type: 'SET_PINS', googleMapPins: value })

        let state = {}
        let newPins = [
            { lat: 11.11, lng: 12.11 },
            { lat: 11.11, lng: 12.11 }
        ]
        
        let reducerOutput = Reducers.setPins(state,{ type:"SET_PINS", googleMapPins: newPins })
        expect(reducerOutput).to.deep.equal({ googleMapPins: newPins })
    });
    
    it('It uses setMarkers action and reducer as it should', () => {
        let value = [
            {
                position: {
                    lat: 11.111,
                    lng: 22.222
                },
                map: 'googleMap'
            }
        ]
        
        const actionOutput = Actions.setMarkers(value)
        expect(actionOutput).to.deep.equal({ type: 'SET_MARKERS', googleMapMarkers: value })

        let state = {}
        let newMarkers = [
            {
                position: {
                    lat: 22.333,
                    lng: 11.222
                },
                map: 'googleMap'
            }
        ]
        
        let reducerOutput = Reducers.setMarkers(state,{ type:"SET_MARKERS", googleMapMarkers: newMarkers })
        expect(reducerOutput).to.deep.equal({ googleMapMarkers: newMarkers })
    });
    
    it('It updates viewport store after dispatch', () => {
        storeWrapper.setProps({ viewport: 'uk' })
        let wrapperProps = storeWrapper.find('GoogleMap').props()
        
        //console.log(wrapperProps)
        //expect(storeWrapper.instance().zoom).to.equal(8)
    });
    
    it('It renders zoom in and out icons', () => {
        expect(wrapper.find('#google-map--zoomin-container')).to.have.length(1)
        expect(wrapper.find('#google-map--zoomin-container')).to.have.length(1)
        expect(wrapper.find('#google-map--zoomout-container')).to.have.length(1)
        expect(wrapper.find('#google-map--zoomin-image')).to.have.length(1)
        expect(wrapper.find('#google-map--zoomout-image')).to.have.length(1)
    });
    
    it('It changes class zoom on click', () => {
        let zoom = wrapper.instance().zoom
        wrapper.find('#google-map--zoomin-container').simulate('click');
        zoom = zoom + 1
        expect(wrapper.instance().zoom).to.equal(zoom)
        
        wrapper.find('#google-map--zoomout-container').simulate('click');
        zoom = zoom - 1
        expect(wrapper.instance().zoom).to.equal(zoom)
    });
    
    it('It renders on drag search box', () => {
        expect(wrapper.find('#google-map--search-container')).to.have.length(1)
        expect(wrapper.find('#google-map--checkbox-container')).to.have.length(1)
        expect(wrapper.find('#google-map--search-text-container')).to.have.length(1)
        expect(wrapper.find('#search-on-drag')).to.have.length(1)
    });
    
    it('It changes on drag state', () => {
        let state = wrapper.state().searchOnDrag
        wrapper.find('#search-on-drag').simulate('change');
        expect(wrapper.state().searchOnDrag).to.equal(!state)
    });
    
    it('It renders search here button', () => {
        expect(wrapper.find('#google-map--search-container')).to.have.length(1)
        expect(wrapper.find('button#google-map--search-here-button')).to.have.length(0)
        wrapper.setState({ searchHereButton: true })
        expect(wrapper.find('button#google-map--search-here-button')).to.have.length(1)
        
        wrapper.instance().map = {
            getBounds: mockBounds
        }
        
        wrapper.find('button#google-map--search-here-button').simulate('click')
        expect(wrapper.find('button#google-map--search-here-button')).to.have.length(0)
        expect(wrapper.find('#google-map--search-container')).to.have.length(1)
    });
    
    it('It changes marker icon on when hoverid is passed in props', () => {
        let pins = [
            {
                lat: 51.406697,
                lng: -0.025194,
                id: 12345
            }
        ]
        
        let content = Content({})
        
        // Default icon
        wrapper.setProps({ pins: pins })
        let icon = wrapper.instance().markers[0].icon
        expect(icon.url).to.equal(content.marker.icon)
        
        // Hover icon
        wrapper.setProps({ hoverPinId: 12345 })
        icon = wrapper.instance().markers[0].icon
        expect(icon.url).to.equal(content.marker.iconhover)
        
        // Default icon
        wrapper.setProps({ hoverPinId: false })
        icon = wrapper.instance().markers[0].icon
        expect(icon.url).to.equal(content.marker.icon)
    });
    
    it('It renders property component', () => {
        wrapper.instance().selectedPinId = 1234
        wrapper.instance().pins = pins
        wrapper.setState({ displayPropertyComponent: true })
        expect(wrapper.find('Property')).to.have.length(1)
        
        wrapper.setState({ displayPropertyComponent: false })
        expect(wrapper.find('Property')).to.have.length(0)
    });
});
