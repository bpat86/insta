import React, { Component } from 'react';

export default class Footer extends Component {
    getCurrentYear = () => {
        const currentTime = new Date();
        const currentYear = currentTime.getFullYear();

        return currentYear;
    }

	render() {
        return (
        	<div className="footer">
            	<div className="container-lg">
	            	<div className="footerContainer">
						<h5>Copyright &copy; Bobby Patterson { this.getCurrentYear() } All Rights Reserved</h5>
					</div>
            	</div>
            </div>
        )
    }
}
