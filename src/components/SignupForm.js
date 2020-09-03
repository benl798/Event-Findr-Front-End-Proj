import React from 'react';

class SignupForm extends React.Component{

  state = {
    name: '',
    email: '',
    password: ''
  }

  handleSubmit = (ev) => {
    this.props.onSignupSubmit(this.state.name, this.state.email, this.state.password);
    ev.preventDefault();
  }

  //Set state of the email and password fields
  handleInput = (ev) => {
    switch(ev.target.name){
      case 'name':
        this.setState({name: ev.target.value})
        break;
      case 'email':
        this.setState({email: ev.target.value})
        break;
      case 'password':
        this.setState({password: ev.target.value})
    }
  }

  render(){
    return(
      <form id="register" className="input-group" onSubmit={this.handleSubmit}>
        <input
          onChange={this.handleInput}
          name="name"
          id="name"
          type="text"
          className="input-field"
          placeholder="Enter Name"
        />
        <input
          onChange={this.handleInput}
          name="email"
          id="email"
          type="email"
          className="input-field"
          placeholder="Enter Email"
        />
        <input
          onChange={this.handleInput}
          name="password"
          id="password"
          type="password"
          className="input-field"
          placeholder="Enter Password"
        />
      <button className="submit-btn">Sign Up</button>
      </form>
    );
  }
}


export default SignupForm
