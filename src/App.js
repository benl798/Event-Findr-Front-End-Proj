import React from 'react';
import axios from 'axios';
import {Redirect, Route, Link, HashRouter as Router} from 'react-router-dom';


import Feed from './components/Feed'
import LoginPage from './components/LoginPage'
import ShowPost from './components/ShowPost'
import NewPost from './components/NewPost'


import './css/feed.css'
import './css/cards.css'
import './css/login.css'
import './css/newpost.css'
import './css/showpage.css'
import './css/header-footer.css'


const BASE_URL = 'http://localhost:3000'

class App extends React.Component{



  state = {
    currentUser: undefined,
    createNewPost: false
  }

  componentDidMount(){
    console.log(this.props);

  }


  handleLogin = (user) => {
    this.setState({currentUser: user})
  }

  handleLogout = () => {
    this.setState({currentUserName: undefined})
    axios.defaults.headers.common['Authorization'] = undefined;
  }

  buttonClick = () => {
    console.log('This.props is');
    console.log(this.props);
  }

  showHidePostForm = (bool) => {
    this.setState({createNewPost: bool})
  }



  render(){
    return(
      <Router>
        {
          this.state.currentUser !== undefined && (
            <div className='header-footer-css'>
              <header>
                <a className="title">Our Website Name</a>
                <nav>
                  <ul className="nav_links">
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/'>My Profile</Link></li>
                    <li><Link onClick={this.handleLogout} to='/login'>Logout</Link></li>
                  </ul>
                </nav>
                <button onClick={() => this.showHidePostForm(true)}>New Post</button>
              </header>
            </div>
          )
        }
        {
          this.state.createNewPost
          &&
          <NewPost showHidePostForm={this.showHidePostForm} refreshFeed={this.refreshFeed}/>
        }
        <Route
          exact path='/login'
          render={(props) => <LoginPage handleLogin={this.handleLogin} {...props} />}
          />
        <Route exact path='/' component={Feed}/>
        <Route exact path='/post/:id' component={ShowPost}/>
        {
          this.state.currentUser !== undefined && (
            <div className='header-footer-css'>
              <footer>
                <a className="title2" href="#">Developed by Stevo and Gingee</a>
                <nav className="fill">
                  <ul className="nav_links">
                    <div className="icons">
                      <li>
                        <a href="https://github.com/Chris-Stevenson-Git/Group-Proj-React-Frontend">
                          <i className="fa fa-github"></i>
                        </a>
                      </li>
                      <li><a href="https://twitter.com/50cent/status/22366597012"><i className="fa fa-twitter"></i></a></li>
                      <li><a href="https://www.instagram.com/p/3h2BrqmDbo/?utm_source=ig_embed"><i className="fa fa-instagram"></i></a></li>
                    </div>
                  </ul>
                </nav>
              </footer>
            </div>
          )
        }

      </Router>
    )
  }//render
}//class App

export default App;
