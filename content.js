export default function content(props) {
	let content = {
		error: {
			title: 'Oops, something went wrong',
			paragraph: 'There has been a technical error, sorry about that. Please try again.'
		},
		loading: {
			image: false
		},
		marker: {
			icon: '/images/googleMapMarker.svg',
			iconhover: '/images/googleMapMarkerHover.svg',
			iconvisited: '/images/googleMapMarkerVisited.svg'
		},
		zoom: {
			zoomin: '/images/googleMapZoomInDefault.svg',
			zoomout: '/images/googleMapZoomOutDefault.svg'
		},
		search: {
			title: 'Search as I move the map',
			searchhere: 'Search here'
		},
		checkbox: {
			image: '/images/googleMapCheckboxTick.svg'
		},
		property: {
			defaultimage: '/images/googleMapDefaultPropertyImage.svg',
			bed: '/images/googleMapBeds.svg',
			sleeps: '/images/googleMapSleeps.svg',
			bath: '/images/googleMapBaths.svg',
			reviews: '/images/googleMapReviews.svg',
			pointstext: 'Points'
		}
	}
	
	if(props.content) {
		if(typeof props.content == 'object') {
			// Error
			if(props.content.error) {
				if(props.content.error.title) {
					content.error.title = props.content.error.title
				}
				
				if(props.content.error.paragraph) {
					content.error.paragraph = props.content.error.paragraph
				}
			}
			
			// Loading
			if(props.content.loading && props.s3) {
				if(props.content.loading.image) {
					content.loading.image = props.s3+props.content.loading.image
				}
			}
			
			// Marker
			if(props.content.marker && props.s3) {
				// Default
				if(props.content.marker.icon) {
					content.marker.icon = props.s3+props.content.marker.icon
				}
				
				// Hover
				if(props.content.marker.iconhover) {
					content.marker.iconhover = props.s3+props.content.marker.iconhover
				}
				
				// Visited
				if(props.content.marker.iconvisited) {
					content.marker.iconvisited = props.s3+props.content.marker.iconvisited
				}
			}
			
			// Zoom
			if(props.content.zoom && props.s3) {
				if(props.content.zoom.zoomin) {
					content.zoom.zoomin = props.s3+props.content.zoom.zoomin
				}
				
				if(props.content.zoom.zoomout) {
					content.zoom.zoomout = props.s3+props.content.zoom.zoomout
				}
			}
			
			// Search
			if(props.content.search) {
				if(props.content.search.title) {
					content.search.title = props.content.search.title
				}
				
				if(props.content.search.searchhere) {
					content.search.searchhere = props.content.search.searchhere
				}
			}
			
			// Checkbox
			if(props.content.checkbox && props.s3) {
				if(props.content.checkbox.image) {
					content.checkbox.image = props.s3+props.content.checkbox.image
				}
			}
			
			// Property
			if(props.content.property && props.s3) {
				if(props.content.property.defaultimage) {
					content.property.defaultimage = props.s3+props.content.property.defaultimage
				}
				
				if(props.content.property.bed) {
					content.property.bed = props.s3+props.content.property.bed
				}
				
				if(props.content.property.sleeps) {
					content.property.sleeps = props.s3+props.content.property.sleeps
				}
				
				if(props.content.property.bath) {
					content.property.bath = props.s3+props.content.property.bath
				}
				
				if(props.content.property.reviews) {
					content.property.reviews = props.s3+props.content.property.reviews
				}
				
				if(props.content.property.pointstext) {
					content.property.pointstext = props.content.property.pointstext
				}
			}
		}
	}

    return content
}