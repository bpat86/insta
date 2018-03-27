import { Component } from 'react';
import { withRouter } from 'react-router-dom';

class ScrollToTop extends Component {
	componentDidUpdate(prevProps) {
		const { location } = this.props;

		if (location !== prevProps.location && !location.pathname.includes('=') && !prevProps.location.pathname.includes('_')) {
			window.scrollTo(0, 0);
		}
	}

	render() {
		return this.props.children
	}
}

export default withRouter(ScrollToTop);
