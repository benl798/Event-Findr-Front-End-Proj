import React from 'react'
import axios from 'axios'
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';



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
    this.props.showHidePostForm(false);
    axios.post('http://localhost:3000/posts', {
      title: this.state.newPost.title,
      description: this.state.newPost.description,
      image: this.state.newPost.image
    })
    .then()
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

  closePost = () => {
    this.props.showHidePostForm(false);
  }

  render(){

    return(
      <div className='newpost-css'>
        <form onSubmit={this.handleSubmit}>
          <h3>New Post</h3>
          <label htmlFor="title">Title</label>
          <input
            onChange={this.handleInput}
            name="title"
            id="title"
            type="text"
          />
          <label htmlFor="description">Description</label>
          <textarea
            onChange={this.handleInput}
            name="description"
            id="description"
            type="textarea"
          ></textarea>
          <div className='uploadImage' onClick={this.showWidget}>Upload Photo</div>
          <Image
            className='previewImg'
            cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
            publicId={this.state.newPost.image}
            width="200"
            crop="scale"
            />
          <button>Share</button>
          <p className='closeButton' onClick={this.closePost}>X</p>
        </form>
      </div>
    );
  }
}

export default NewPost
