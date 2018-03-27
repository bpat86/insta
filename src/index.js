import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './pages/App';
import './styles/css/index.css';

ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));
registerServiceWorker();
