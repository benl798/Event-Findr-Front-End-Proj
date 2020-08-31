import React from 'react';
import axios from 'axios';
import {Route, Link, HashRouter as Router} from 'react-router-dom';

import MyPosts from './components/MyPosts'
import Feed from './components/Feed'

class App extends React.Component{



  render(){
    return(
      <div>
        <h1>My Local</h1>

          <Router>
            <nav>
              <Link to='/'>Feed</Link> | &nbsp;
              <Link to='/myPosts'>My Posts</Link> | &nbsp;
                <hr/>
            </nav>

            <Route exact path='/' component={Feed}/>
            <Route exact path='/myPosts' component={MyPosts}/>

          </Router>
      </div>
    );
  }//render
}//class App

export default App;
