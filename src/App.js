import React from 'react';
import axios from 'axios';
import {Route, Link, HashRouter as Router} from 'react-router-dom';

import MyPosts from './components/MyPosts'
import Feed from './components/Feed'
import LoginPage from './components/LoginPage'

class App extends React.Component{

  state = {
    currentUserName: 'PLACEHOLDER NAME'
  }

  setNameOnLogin = (name) => {
    this.setState({currentUserName: name})
  }


  render(){
    return(
      <div>
        <h1>My Local</h1>

          <Router>
            <nav>
              {this.state.currentUserName != 'PLACEHOLDER NAME' &&
                <p>Hello {this.state.currentUserName}</p>
              }
              <Link to='/login'>Login</Link> | &nbsp;
              <Link to='/'>Feed</Link> | &nbsp;
              <Link to='/myPosts'>My Posts</Link> | &nbsp;
                <hr/>
            </nav>

            <Route exact path='/' component={Feed}/>
            <Route exact path='/myPosts' component={MyPosts}/>
            <Route exact path='/login'><LoginPage setNameOnLogin={this.setNameOnLogin}/></Route>


          </Router>
      </div>
    );
  }//render
}//class App

export default App;
