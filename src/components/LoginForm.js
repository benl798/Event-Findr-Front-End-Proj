import React from 'react';

class LoginForm extends React.Component{

  state = {
    email: '',
    password: ''
  }

  handleSubmit = (ev) => {
    this.props.onLoginSubmit(this.state.email, this.state.password);
    ev.preventDefault();
  }

  //Set state of the email and password fields
  handleInput = (ev) => {
    switch(ev.target.name){
      case 'email':
        this.setState({email: ev.target.value})
        break;
      case 'password':
        this.setState({password: ev.target.value})
    }
  }

  render(){
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="email">Email: </label>
          <br />
          <input
            onChange={this.handleInput}
            name="email"
            id="email"
            type="email"
          />
          <br />
          <label htmlFor="password">Password:</label>
          <br />
          <input
            onChange={this.handleInput}
            name="password"
            id="password"
            type="password"
          />
          <br />
          <button>Login</button>
        </form>
      </div>
    );
  }
}


export default LoginForm
