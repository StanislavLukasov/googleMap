import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux'
import { Router, Route, browserHistory } from 'react-router'
import Demo from '../index.js'
import GeolocationGoogleMapLocationTransformer from '../../Transformers/geolocationGoogleMapLocationTransformer'
import GeolocationGoogleMapViewportTransformer from '../../Transformers/geolocationGoogleMapViewportTransformer'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

let location = GeolocationGoogleMapLocationTransformer({})
let viewport = GeolocationGoogleMapViewportTransformer({})

let ComponentWithProps = React.createClass({
	render: function () {
		return (
			<Demo
				zoom={8}
				location={location}
				viewport={viewport}
				pins={[
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
						canonical_address: 'Unnamed Road, Vaughans, Saint Thomas Lowland Parish, Saint Kitts and Nevis'
					}
				]}
				width="500px"
				height="500px"
				loading={false}
				searchOnDrag={false}
				searchOnZoom={true}
				displayPropertyComponentOnClick={true}
				mobileBreakpoint={true}
			/>
		);
	}
});

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={ComponentWithProps}/>
		</Router>
	</Provider>
, document.querySelector('.main'))
