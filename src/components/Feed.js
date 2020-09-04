import React from 'react'
import axios from 'axios'
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import {Route, Link, HashRouter as Router} from 'react-router-dom';
import GoogleMapReact from 'google-map-react';




const BASE_URL = 'https://chris-ben-group-project.herokuapp.com'
const MyMapMarker = ({ text }) => <div className='myMarker'>{text}</div>;
const EvMapMarker = ({ id }) => <Link to={`/post/${id}`}><div className='evMarker'></div></Link>

class Feed extends React.Component{

  state = {
    data: [],
    center: {lat: 0, lng: 0},
    zoom: 13,
    events_near_me: []
  }

  componentDidMount(){
    this.refreshFeed('/index_near_me')
    axios.get(`${BASE_URL}/get_current_user`)
    .then(data => {
      this.setState({current_user: data.data})
      let newCenter = this.state.center
      newCenter.lat = data.data.latitude
      newCenter.lng = data.data.longitude
      this.setState({center: newCenter})
    })
    .catch(err => console.warn(err))

    axios.get(`${BASE_URL}/index_near_me`)
    .then(data => {
      this.setState({events_near_me: data.data})
      console.log(data);
    })
    .catch(err => console.warn(err))
  }

  showHidePostForm = (bool) => {
    this.setState({createNewPost: bool})
  }

  refreshFeed = (path) => {
    axios.get(`${BASE_URL}${path}`)
    .then(axiosReturn => {
      this.setState({data: axiosReturn.data})
      console.log(axiosReturn.data);
    })
    .catch(err => console.log(err));
  }


  render(){
    return(
      <div className='main-page-css'>
          <div className="pimg1">
            <div className="ptext">
              <p className="border-welcome">
                Welcome
              </p>
              <p className="welcome-message">A SEI 37 Project by Christopher Stevenson and Benjamin Luck</p>
            </div>
          </div>

          <section className="section section-light">
            <h2 className="section section-light">Event Findr</h2>
            <p className="section section-light">
              This is a website built to let you see what's going on around near you. A platform to see cool events that are happening near you and give you the opportunity to follow the poster and keep up to date with their events and happenings.
            </p>
          </section>

          <div className="pimg2">
            <h5 className="events">Events near you</h5>
              {
                this.state.center.lat && (
                  <div className="bigmap">
                    <GoogleMapReact
                      bootstrapURLKeys={{ key: 'AIzaSyDWqy6cjGoLQ-NtYFw0qOn3nnYM2lg8cEM' }}
                      defaultCenter={this.state.center}
                      defaultZoom={this.state.zoom}
                      >
                      <MyMapMarker
                        lat={this.state.center.lat}
                        lng={this.state.center.lng}
                        text='You'
                        />
                      {
                        this.state.events_near_me.map(event =>(
                          <EvMapMarker
                            lat={event.latitude}
                            lng={event.longitude}
                            id={event.id}
                            />
                        ))
                      }
                    </GoogleMapReact>
                  </div>
                )
              }
          </div>

          <section className="section section-dark">
            <h2 className="section section-dark">Sort your feed</h2>
            <button
              type="button"
              className="search"
              onClick={() => this.refreshFeed('/index_all')}
              >All Posts</button>
            <button
              type="button"
              className="search"
              onClick={() => this.refreshFeed('/index_follows')}
              >My Follows</button>
            <button
              type="button"
              className="search"
              onClick={() => this.refreshFeed('/index_near_me')}
              >Near me</button>
          </section>

          <div className="pimg3">
            <div className='cards-css'>
              <div className='card-container'>
                {
                  this.state.data.reverse().map(post => (
                    <div className='card'>
                      <Link to={`/post/${post.id}`}>
                        <Image
                          className='card-image'
                          cloudName='dvmqosqwr'
                          publicId={post.image}
                          width="500"
                          crop="scale"
                          />
                      </Link>
                      <span className="title">{post.title}</span>
                      <span className="likes">Likes: {post.liked_by.length}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
      </div>
    );//return
  }//render
}//class Feed

export default Feed
