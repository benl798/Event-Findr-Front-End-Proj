import React from 'react'
import axios from 'axios'

class Feed extends React.Component{

  state = {
    data: []
  }

  componentDidMount(){
    axios.get('http://localhost:3000/posts.json')
    .then(axiosReturn => {
      this.setState({data: axiosReturn.data})
    })
    .catch(err => console.log(err));
  }

  render(){
    return(
      <div>
        {
          this.state.data.map(post => (
            <div>
              <h3>{post.title}</h3>
              <h5>{post.description}</h5>
              <img src={post.image} alt={post.title}/>
            </div>
          ))
        }
      </div>
    );//return
  }//render
}//class Feed

export default Feed
