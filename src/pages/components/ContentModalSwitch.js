import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';
import ScrollToTop from '../../pages/components/ScrollToTop';

/* Top Level Pages */
import MainPageLayout from '../MainPageLayout';
import InstagramPageLayout from '../InstagramPageLayout';

export default class ContentModalSwitch extends Component {
	previousLocation = this.props.location;

    componentWillUpdate(nextProps) {
        const { location } = this.props;
        const instagramPostReloaded = (nextProps.history.action !== 'POP') && ((! location.state) || (! location.state.showModal) || (! location.pathname.includes('_')));

        if (instagramPostReloaded) {
        	this.previousLocation = location
        }
    }

	render() {
		const { location } = this.props;

	    const isModal = !!(
		    location.pathname.includes('_') &&
		    this.previousLocation !== location
	    )

	    return (
			<div>
				<ScrollToTop>
				    <Switch location={isModal ? this.previousLocation : location}>
				        <Route exact path='/' component={MainPageLayout} />
				        {
                            isModal ? <Route exact path='/instagram/:id/:user?' component={MainPageLayout} /> :
				          	<Route exact path='/instagram/:id/:user?' component={InstagramPageLayout} />
				        }
				    </Switch>
			    </ScrollToTop>
			</div>
		);
	}
}
