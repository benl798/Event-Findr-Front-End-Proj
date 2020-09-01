import React from 'react';
import axios from 'axios';
import {Route, Link, HashRouter as Router} from 'react-router-dom';


import MyPosts from './components/MyPosts'
import Feed from './components/Feed'
import LoginPage from './components/LoginPage'

class App extends React.Component{


  state = {
    currentUserName: undefined
  }

  componentDidMount(){
    console.log('API = ', process.env.REACT_APP_CLOUDINARY_KEY);
    console.log('name = ', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);

    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(usePosition);
      } else {
        console.warn('Geolocation not supported by this browser.');
      }
    }

    const usePosition = function(pos){
      console.log(`Latitude: ${pos.coords.latitude}`);
      console.log(`Longitude: ${pos.coords.longitude}`);
    }

    // setInterval(getLocation, 1000);
  }

  componentDidUpdate(){
    // console.log('The state has changed!');
  }

  handleLogin = (name) => {
    this.setState({currentUserName: name})
  }

  handleLogout = () => {
    this.setState({currentUserName: undefined})
    axios.defaults.headers.common['Authorization'] = undefined;
  }


  render(){
    return(
      <div>
        <h1>My Local</h1>

          <Router>
              {this.state.currentUserName != undefined ?
                <nav>
                  <p>Hello {this.state.currentUserName}</p>
                  <Link onClick={this.handleLogout} to='/login'>Logout</Link> | &nbsp;
                  <Link to='/'>Feed</Link> | &nbsp;
                  <Link to='/myPosts'>My Posts</Link> | &nbsp;
                </nav>
                  : //else for ternary
                <nav>
                  <Link to='/login'>Login</Link>
                </nav>
              }
                <hr/>

            <Route exact path='/' component={Feed}/>
            <Route exact path='/myPosts' component={MyPosts}/>
            <Route exact path='/login' render={() => <LoginPage handleLogin={this.handleLogin} />}/>

          </Router>
      </div>
    );
  }//render
}//class App

export default App;
