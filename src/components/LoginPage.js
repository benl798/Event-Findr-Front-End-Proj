import React from 'react'
import axios from 'axios';
import { Redirect } from "react-router-dom";

import LoginForm from './LoginForm'
import SignupForm from './SignupForm'


const BASE_URL = 'https://chris-ben-group-project.herokuapp.com'


class LoginPage extends React.Component{

  state = {
    // redirect: null,
    //xyz are the login, register and button containers
    x: null,
    y: null,
    z: null
  }

  componentDidMount(){
    this.setState({
      x: document.getElementById('login'),
      y: document.getElementById('register'),
      z: document.getElementById('btn')
    })
  }

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.usePosition);
    } else {
      console.warn('Geolocation not supported by this browser.');
    }
  }

  usePosition = (pos) => {
    axios.post(`${BASE_URL}/update_my_location`, {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    })
    .then()
    .catch(err => console.warn(err))
  }


  handleLogin = (email, pass) => {
    const request = {'email': email, 'password': pass}
    axios.post(`${BASE_URL}/api/user_token`, {auth: request})
    .then(result => {
      localStorage.setItem("jwt", result.data.jwt)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.jwt;
      axios.get(`${BASE_URL}/get_current_user`)
      .then(data => {
        this.props.handleLogin(data.data);
        this.getLocation();
        setInterval(this.getLocation, 60000)
        this.props.history.push('/');
      })
      .catch(err => console.warn(err))
    })
    .catch(err => {
      console.warn(err)
    })


  } // handleLogin

  handleSignup = (name, email, pass) => {
    axios.post(`${BASE_URL}/api/users`, {
      name: name,
      email: email,
      password: pass
    })
    .then(res => {
      this.handleLogin(email, pass);
    })
    .catch(err => console.warn(err))
  }

  toggleLoginRegister = (buttonVal) => {
    let x = this.state.x
    let y = this.state.y
    let z = this.state.z
    if(buttonVal === 'l'){
      x.style.left = "50px";
      y.style.left = "450px";
      z.style.left = "0";
    } else if(buttonVal === 'r'){
      x.style.left = "-400px";
      y.style.left = "50px";
      z.style.left = "110px";
    }
  }

  render(){
    // if (this.state.redirect) {
    //   console.log('Redirecting');
    //   return <Redirect to={this.state.redirect} />
    // }
    return(
      <div className='login-page-css'>
        <div className="hero">
          <div className="form-box">
            <h2 className="title">Our Website Name</h2>
            <div className="button-box">
              <div id="btn"></div>
              <button className="toggle-btn" onClick={() => this.toggleLoginRegister('l')}>Log In</button>
              <button className="toggle-btn" onClick={() => this.toggleLoginRegister('r')}>Register</button>
            </div>
            <LoginForm onLoginSubmit={this.handleLogin}/>
            <SignupForm onSignupSubmit={this.handleSignup}/>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage
