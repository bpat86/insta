import React, { Component } from 'react';
import Loader from '../../images/loading.svg';

export default class LoadingSpinner extends Component {
	render() {
		return (
			<div className="loadingContainer">
				<span className="loading spinner">
					<img alt="Loading..." src={Loader} />
					<span className="text">Loading...</span>
				</span>
			</div>
	    );
	}
}
