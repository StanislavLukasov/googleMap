import Prefixer from 'inline-style-prefixer'

export default function styles(props) {
	let styles = {
		container: {
			width: '100%',
			height: '100%',
			background: '#f9f9f9',
			position: 'relative',
			overflow: 'hidden'
		},
		errorWrapper: {
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		},
		loadingWrapper: {
			background: '#f9f9f9',
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			zIndex: 1
		},
		mapContainer: {
			width: props.width || '100%',
			height: props.height || '100%',
			margin: 0,
			padding: 0,
			position: 'absolute',
			zIndex: 1
		},
		map: {
			width: '100%',
			height: '100%',
			margin: 0,
			padding: 0,
			position: 'relative',
			zIndex: 1
		},
		containerHidden: {
			zIndex: 0
		},
		zoomContainer: {
			position: 'absolute',
			zIndex: 3,
			top: '1.125rem', 
			left: '0.75rem', 
			cursor: 'pointer',
			display: 'table', 
			height: '2.25rem',
			border: '1px solid #bbbbbb'
		},
		zoomInContainer: {
			display: 'table-cell',
			verticalAlign: 'middle',
			background: 'white',
			textAlign: 'center',
			width: '2.25rem',
			borderRight: '1px solid #bbbbbb'
		},
		zoomOutContainer: {
			display: 'table-cell',
			verticalAlign: 'middle',
			background: 'white',
			textAlign: 'center',
			width: '2.25rem'
		},
		zoomContainerSmall: {
			width: '2rem'
		},
		zoomImage: {
			width: '0.8125rem'
		},
		searchContainer: {
			position: 'absolute',
			zIndex: 3,
			top: '1.125rem', 
			right: '0.75rem', 
			display: 'flex', 
			alignItems: 'center',
			border: '1px solid #bbbbbb',
			height: '2.25rem',
			background: 'white',
		},
		searchContentComntainer: {
			display: 'flex', 
			alignItems: 'center'
		},
		checkboxContainer: {
			display: 'inline-block',
			verticalAlign: 'middle',
			paddingLeft: '0.75rem',
			lineHeight: 0
		},
		checkboxContainerSmall: {
			paddingLeft: '0.35rem',
		},
		searchTextContainer: {
			display: 'inline-block',
			verticalAlign: 'middle',
			fontSize: '0.85rem',
			padding: '0 0.75rem 0 0.75rem',
			lineHeight: 1
		},
		searchTextContainerSmall: {
			fontSize: '0.75rem',
			padding: '0 0.35rem 0 0.35rem',
		},
		checkbox: {
			margin: 0,
			borderRadius: 0,
			border: '0.065rem solid #999999',
			WebkitAppearance: 'none',
			width: '1.125rem',
			height: '1.125rem',
			cursor: 'pointer',
			boxShadow: 'none',
			outline: 'none'
		},
		searchHereButton: {
			position: 'absolute',
			zIndex: 3,
			top: '1.125rem', 
			right: '0.75rem',
			color: props.buttonColor || 'white',
			background: props.buttonBackground || '#3E7AE3',
			height: props.buttonHeight || '2.25rem',
			minWidth: props.buttonWidth || '9.25rem',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			textAlign: 'center',
			fontSize: props.buttonFontSize || '0.85rem',
			fontWeight: props.buttonFontWeight || '400',
			padding: '0 0.5rem',
			margin: 0,
			borderRadius: 0,
			outline: 0,
			border: 0,
			cursor: 'pointer'
		},
		propertyContainer: {
			position: 'absolute',
			bottom: '1.125rem', 
			right: '0.75rem',
			width: '70%',
			maxWidth: '17rem',
			zIndex: 2
		},
		propertyContainerMobile: {
			position: 'absolute',
			bottom: 0, 
			right: 0,
			width: '100%',
			maxWidth: '100%',
			zIndex: 2
		},
		propertyOverflowContainer: {
			width: '100%',
			height: '100%',
			position: 'absolute',
			top: 0,
			right: 0,
			overflow: 'hidden'
		}
	}
	
	if(props.styles) {
		styles = props.styles
	}
	
	const prefixer = new Prefixer()
	styles = prefixer.prefix(styles)

    return styles
}