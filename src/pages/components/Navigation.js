import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navigation extends Component {
    constructor(props){
        super(props);
        this.state = {
            isHidden: false,
            isScrolled: false
        };
    }

    hideNav = () => {
        const newScrollPosition = window.scrollY;
        const maximumScrollLength = this.previousScrollPosition > 60;

        if (newScrollPosition > this.previousScrollPosition && maximumScrollLength) {
            this.setState({ isHidden: true });
        } else {
            this.setState({ isHidden: false });
        }

        if (newScrollPosition > !this.previousScrollPosition && maximumScrollLength) {
            this.setState({ isScrolled: true });
        } else {
            this.setState({ isScrolled: false });
        }

        this.previousScrollPosition = newScrollPosition;
    }

    componentDidMount() {
        this.addEventListeners();
    }

    componentWillUnmount() {
        this.removeEventListeners();
    }

    addEventListeners = () => {
        window.addEventListener('scroll', this.hideNav, false);
    }

    removeEventListeners = () => {
        const navLogo = document.querySelector('.logo');

        navLogo.removeEventListener('mouseleave', this.changeTagline, false);
        window.removeEventListener('scroll', this.hideNav, false);
    }

    render() {
        const { isHidden, isScrolled } = this.state;

        let classHide = isHidden ? " hide" : "";
        let classScrolled = isScrolled ? " scrolled" : "";

        return (
            <nav className={"globalNav" + classHide + classScrolled}>
            	<div className="container-lg">
            		<ul className="navRoot">
            			<li className="navSection logo">
                            <span className="logoContainer">
                				<Link
                                    className="rootLink item-home colorize"
                                    to="/"
                                    >
                                    <h1 className="terminal">bobbypatterson:~$</h1>
                                </Link>
                                <Link
                                    className="rootLink item-tagline colorize"
                                    to="/"
                                    >
                                </Link>
                            </span>
            			</li>
            			<li className="navSection secondary">
                            <Link
                                className="rootLink colorize"
                                to={`/`}
                                >
                                Home
                            </Link>
            			</li>
            		</ul>
            	</div>
            </nav>
        );
    }
}
