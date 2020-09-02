import React from 'react'
import axios from 'axios'
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';

const BASE_URL = 'http://localhost:3000'

class ShowPost extends React.Component{

  state = {
    data: {
      liked_by: [],
      disliked_by: []
    },
    current_user: {}
  }

  componentDidMount(){
    let postLikes
    let postDislikes
    axios.get(`${BASE_URL}/posts/${this.props.match.params.id}.json`)
    .then(axiosReturn => {
      this.setState({data: axiosReturn.data})
    })
    .catch(err => console.log(err));
    //Axios request to get the current user's ID
    axios.get(`${BASE_URL}/get_current_user`)
    .then(axiosReturn => {
      this.setState({current_user: axiosReturn.data})
    })
    .catch(err => console.log(err));
  }

  //likes method
  handleLike = (ev) => {

      //declare new variables to be used as reference points
      let new_data = this.state.data
      let likes = new_data.liked_by
      let dislikes = new_data.disliked_by
      let totalLikes = likes.concat(dislikes)

      //loop through all likes and dislikes. Delete all that relate to the current user
      totalLikes.forEach(user => {
        if(user.id === this.state.current_user.id){
          axios.post(`${BASE_URL}/remove_like_from_post`, {
            post_id: this.state.data.id
          })
          .then()
          .catch(err => console.warn(err))
        }
      })

      //If the button isn't an 'unlike' button, create a new Like entry in the DB
      if(ev.target.value != 'unlike'){
        axios.post(`${BASE_URL}/create_like_for_this_post`, {
          post_id: this.state.data.id,
          status: ev.target.value
        })
        .then()
        .catch(err => console.warn(err))
      }

      //below code is to update the local state so that changes are reflected immediately on the page
      likes = likes.filter(user => {
        return user.id != this.state.current_user.id
      })
      dislikes = dislikes.filter(user => {
        return user.id != this.state.current_user.id
      })

      if(ev.target.value === 'like'){
        likes.push(this.state.current_user)
      }else if(ev.target.value === 'dislike'){
        dislikes.push(this.state.current_user)
      }
      new_data.liked_by = likes
      new_data.disliked_by = dislikes
      this.setState({data: new_data})
  }


  render(){


    let postData = this.state.data
    return(
      <div>
        <h1>Show Page</h1>
        <h3>{postData.title}</h3>
        <h5>Description</h5>
        <p>{postData.description}</p>
        <h5>Location:</h5>
        <p>Lat: {postData.latitude}</p>
        <p>Lng: {postData.longitude}</p>

        <h5>Likes:</h5>
        <p>Count: {postData.liked_by.length}</p>
        <p>
          {
            postData.liked_by.map(user => (
              <span>{user.name}, </span>
            ))
          }
        </p>
        <h5>Dislikes:</h5>
        <p>Count: {postData.disliked_by.length}</p>
        {/* Show a button to either like or unlike depending on if you have already liked it */}
        {
          postData.liked_by.some(user => user.id === this.state.current_user.id)
            ?
          <button onClick={this.handleLike} value='unlike'>Unlike</button>
            :
          <button onClick={this.handleLike} value='like'>Like</button>
        }
        {/* The same for dislikes */}
        {
          postData.disliked_by.some(user => user.id === this.state.current_user.id)
            ?
          <button onClick={this.handleLike} value='unlike'>Undislike</button>
            :
          <button onClick={this.handleLike} value='dislike'>Dislike</button>
        }
        <Image
          cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
          publicId={postData.image}
          width="700"
          crop="scale"
          />
      </div>
    );//return
  }//render
}// Class ShowPost

export default ShowPost
