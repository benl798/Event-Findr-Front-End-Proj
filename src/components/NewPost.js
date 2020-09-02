import React from 'react'
import axios from 'axios'

class NewPost extends React.Component{

  state = {
    newPost: {
      title: '',
      description: '',
      image: ''
    }
  }

  componentDidMount(){
    this.setState({widget: window.cloudinary.createUploadWidget({
      cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
      uploadPreset: 'k1jbpdku'},
      (error, result) => {this.checkUploadResult(result)})})
  }

  handleSubmit = (ev) => {
    axios.post('http://localhost:3000/posts', {
      title: this.state.newPost.title,
      description: this.state.newPost.description,
      image: this.state.newPost.image
    })
    .then(res => console.log(res))
    .catch(err => console.warn(err))
    ev.preventDefault();
  }

  handleInput = (ev) => {
    const updatedPost = this.state.newPost
    switch(ev.target.name){
      case 'title':
        updatedPost.title = ev.target.value
        break;
      case 'description':
        updatedPost.description = ev.target.value
    }
    this.setState({newPost: updatedPost})
  }

  checkUploadResult = (ev) => {
    if(ev.event === 'success'){
      const updatedPost = this.state.newPost
      updatedPost.image = ev.info.public_id
      this.setState({newPost: updatedPost})
    }
  }

  showWidget = (widget) => {
    this.state.widget.open();
  }

  render(){



    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="title">Title: </label>
          <br />
          <input
            onChange={this.handleInput}
            name="title"
            id="title"
            type="text"
          />
          <br />
          <label htmlFor="description">Description: </label>
          <br />
          <textarea
            onChange={this.handleInput}
            name="description"
            id="description"
            type="textarea"
          ></textarea>
          <br />

          <div onClick={this.showWidget}>Upload Photo</div>
          <br />
          <button>Share</button>
        </form>
      </div>
    );
  }
}

export default NewPost
