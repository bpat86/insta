import React, { Component } from 'react';
import Navigation from '../pages/components/Navigation';
import InstagramFeedContainer from '../pages/components/instagram/containers/InstagramFeedContainer';
import Footer from '../pages/components/Footer';

export default class AboutPageLayout extends Component {
	render() {
        const { history } = this.props;

		return (
			<div className="About">
                <Navigation />
                <section>
                    <InstagramFeedContainer
                        history={history}
                    />
                </section>
                <Footer />
			</div>
	    );
	}
}
