import React from 'react'
import axios from 'axios'
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import {Route, Link, HashRouter as Router} from 'react-router-dom';


import NewPost from './NewPost'

class Feed extends React.Component{

  state = {
    data: [],
    createNewPost: false
  }

  componentDidMount(){
    axios.get('http://localhost:3000/posts.json')
    .then(axiosReturn => {
      this.setState({data: axiosReturn.data})
    })
    .catch(err => console.log(err));
  }

  showPostForm = () => {
    this.setState({createNewPost: true})
  }


  render(){
    return(
      <div>
        {this.state.createNewPost ?
          <NewPost />
          :
          <button onClick={this.showPostForm}>New Post</button>
        }
        {
          this.state.data.reverse().map(post => (
            <div>
              <Link to={`/post/${post.id}`}>{post.title}</Link>
              <h5>{post.description}</h5>
              <Image
                cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
                publicId={post.image}
                width="250"
                crop="scale"
                />
            </div>
          ))
        }
      </div>
    );//return
  }//render
}//class Feed

export default Feed
