import React from 'react'
import axios from 'axios';
import { Redirect } from "react-router-dom";



import LoginForm from './LoginForm'


class LoginPage extends React.Component{

  state = {
    redirect: null
  }

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.usePosition);
    } else {
      console.warn('Geolocation not supported by this browser.');
    }
  }

  usePosition = (pos) => {
    axios.post('http://localhost:3000/update_my_location', {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    })
    .then()
    .catch(err => console.warn(err))
  }


  handleLogin = (email, pass) => {
    const request = {'email': email, 'password': pass}
    axios.post('http://localhost:3000/api/user_token', {auth: request})
    .then(result => {
      localStorage.setItem("jwt", result.data.jwt)
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data.jwt;
      axios.get('http://localhost:3000/setUserName.json')
      .then(data => {
        this.props.handleLogin(data.data);
        this.setState({redirect: '/'})
        this.getLocation();
        setInterval(this.getLocation, 60000)
      })
      .catch(err => console.warn(err))
    })
    .catch(err => {
      console.warn(err)
    })


  }

  render(){
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div>
        <LoginForm onLoginSubmit={this.handleLogin}/>
      </div>
    );
  }
}

export default LoginPage
