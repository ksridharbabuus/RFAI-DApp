import React, { Component } from 'react'
import { Route } from 'react-router'
import HomeContainer from './layouts/home/HomeContainer'


// Styles // TBD Following Three Style to be removed...
// import './css/oswald.css'
// import './css/open-sans.css'
// import './css/pure-min.css'

import './css/main.min.css'

//import './App.css'

class App extends Component {
  render() {
    // <div className="App">
    return (
      
      <div class="container-fluid p-0">
        <Route exact path="/" component={HomeContainer}/>

        <footer></footer>
      </div>

    );
  }
}

export default App
