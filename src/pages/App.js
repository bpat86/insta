import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import ContentModalSwitch from './components/ContentModalSwitch';

export default class App extends Component {
    render() {
        return (
            <Router>
                <Route component={ContentModalSwitch} />
            </Router>
        )
    }
}
