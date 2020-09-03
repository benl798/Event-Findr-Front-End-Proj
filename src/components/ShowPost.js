import React from 'react'
import axios from 'axios'
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import { Redirect, Link } from "react-router-dom";
import GoogleMapReact from 'google-map-react';

import '../App.css'

const MapMarker = ({ text }) => <div id='mapMarker'>{text}</div>;
const BASE_URL = 'http://localhost:3000'
const MAP_URL = 'https://www.google.com/maps/dir/?api=1&destination='

class ShowPost extends React.Component{

  state = {
    data: {
      liked_by: [],
      disliked_by: [],
      comments: []
    },
    current_user: {
      following_ids: []
    },
    postOwner: {
      name: '',
      id: 0
    },
    redirect: null,
    followButtonValue: null,
    center: {lat: 0, lng: 0},
    zoom: 13,
    distance_from_me: null,
    comment: ''
  }

  componentDidMount(){
    let postLikes
    let postDislikes
    axios.get(`${BASE_URL}/posts/${this.props.match.params.id}.json`)
    .then(axiosReturn => {
      this.setState({data: axiosReturn.data})

      let newCenter = this.state.center
      newCenter.lat = this.state.data.latitude
      newCenter.lng = this.state.data.longitude
      this.setState({center: newCenter})

      axios.get(`${BASE_URL}/distance_from_me/${this.state.data.id}`)
      .then(res => {
        this.setState({distance_from_me: res.data.toFixed(2)})
      })
      .catch(err => console.warn(err))

      axios.get(`${BASE_URL}/get_owner_of_post/${this.state.data.id}`)
      .then(res => {
        let postOwner = this.state.postOwner
        postOwner.name = res.data.name
        postOwner.id = res.data.id
        this.setState({postOwner: postOwner})
        axios.get(`${BASE_URL}/get_current_user`)
        .then(axiosReturn => {
          this.setState({current_user: axiosReturn.data})
          if(this.state.current_user.id != this.state.postOwner.id){
            if(this.state.current_user.following_ids.includes(this.state.postOwner.id)){
              this.setState({followButtonValue: 'Unfollow'})
            } else {
              this.setState({followButtonValue: 'Follow'})
            }
          }
        })
        .catch(err => console.log(err))
      })
      .catch(err => console.warn(err))
    })
    .catch(err => console.log(err));
  }


  setPostOwner = (post_id) => {
    axios.get(`${BASE_URL}/get_owner_of_post/${post_id}`)
    .then(res => {
      let postOwner = this.state.postOwner
      postOwner.name = res.data.name
      postOwner.id = res.data.id
      this.setState({postOwner: postOwner})
    })
    .catch(err => console.warn(err))
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
  } // handleLike

  deletePost = () => {
    axios.delete(`${BASE_URL}/posts/${this.props.match.params.id}`)
    .then(res => {
      this.setState({redirect: '/'})
    })
    .catch(err => console.warn(err))
  }

  handleFollow = (method) => {
      axios.post(`${BASE_URL}/follow_this_user`, {
        followed_id: this.state.postOwner.id,
        method: method
      })
      .then(res => {
        if(this.state.followButtonValue === 'Follow'){
          this.setState({followButtonValue: 'Unfollow'})
        } else if(this.state.followButtonValue === 'Unfollow'){
          this.setState({followButtonValue: 'Follow'})
        }
      })
      .catch(err => console.warn(err))
  }

  handleCommentInput = (ev) => {
    this.setState({comment: ev.target.value})
  }

  addCommentToPost = () => {
    axios.post(`${BASE_URL}/posts/${this.state.data.id}/add_comment_to_post`, {
      comment: this.state.comment
    })
    .then(res => {
      this.setState({data: res.data, comment: ''})
    })
    .catch(err => console.warn(err))
  }


  render(){

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    let postData = this.state.data
    return(
      <div className="post-container-css">
        <div className='post'>
          <span className="name">{this.state.postOwner.name}</span>
          <Image
            className='image'
            cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}
            publicId={postData.image}
            width="700"
            crop="scale"
            />
          <span className="title">{postData.title}</span>
          <span className="descript">{postData.description}</span>
          <span className="location">Distance from me: {this.state.distance_from_me}km.</span>
          <a
            className="directions"
            target="_blank"
            href={`${MAP_URL}${postData.latitude},${postData.longitude}`}>
            Get Directions
          </a>
          <span className="likes">Likes: {postData.liked_by.length}</span>
          <span className="dislikes">DisLikes: {postData.disliked_by.length}</span>
          {
            postData.user_id === this.state.current_user.id
            &&
            <span className="delete" onClick={this.deletePost}>Delete Post</span>
          }
          <div className='comments-container'>
            {
              this.state.data.comments.reverse().map(c => <p className="comments">{c.comment}</p>)
            }
          </div>
          <input
            id='comment-input'
            onChange={this.handleCommentInput}
            type="text"
            className="make-comment"
            placeholder="Add a comment..."
          />
        <button type="submit" onClick={this.addCommentToPost} className="comment">Comment</button>
          {
            this.state.followButtonValue
            &&
            <button
              className='follow'
              onClick={() => this.handleFollow(this.state.followButtonValue)}>
              {this.state.followButtonValue} {this.state.postOwner.name}
            </button>
          }
          <div className='buttonBox'>
            {
              postData.liked_by.some(user => user.id === this.state.current_user.id)
              ?
              <button onClick={this.handleLike} value='unlike'>Remove Like</button>
              :
              <button onClick={this.handleLike} value='like'>Like</button>
            }
            {/* The same for dislikes */}
            {
              postData.disliked_by.some(user => user.id === this.state.current_user.id)
              ?
              <button onClick={this.handleLike} value='unlike'>Remove Dislike</button>
              :
              <button onClick={this.handleLike} value='dislike'>Dislike</button>
            }
          </div>
        </div>
      </div>
    );//return
  }//render
}// Class ShowPost

export default ShowPost
