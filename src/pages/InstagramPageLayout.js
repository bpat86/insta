import React, { Component } from 'react';
import Navigation from '../pages/components/Navigation';
import InstagramSinglePageContainer from '../pages/components/instagram/containers/InstagramSinglePageContainer';
import Footer from '../pages/components/Footer';

export default class InstagramPageLayout extends Component {
	render() {
		return (
			<div className="Instagram">
				<Navigation />
				<InstagramSinglePageContainer {...this.props} />
                <Footer />
			</div>
	    );
	}
}
