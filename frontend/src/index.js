import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import MapPage from './MapPage'
import registerServiceWorker from './utils/registerServiceWorker'
import './assets/styles/core.css'
import { BrowserRouter as Router, Route} from 'react-router-dom'

ReactDOM.render((
        <Router>
            <div>
                <Route exact path='/' component={App}/>
                <Route path='/map' component={MapPage}/>
            </div>
        </Router>
    ), 
    document.getElementById('root'))
    registerServiceWorker()
