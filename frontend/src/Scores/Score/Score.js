import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Editscore from '../EditScore/EditScore'

class Score extends Component {
  ////

  render () {
    return (
      <div className={`card-item ${this.state.liked ? 'liked' : ''}`} key={this.props.score.pkey}>
        <div className='padding-30'>
          <div className='heart' onClick={() => {this.likescore(this.props.score)}}></div>
          <h2 className="margin-top-0">{this.props.score.title}</h2>
          <p>{this.props.score.content}</p>
        </div>
        <div className='padding-30 card-footer grid-3'>
          <div className='detailAvatar'>{this.props.score.author}</div>
        </div>
        <div className='padding-30 grid-2'>
          <div onClick={() => {this.props.deletescore(this.props.score)}} className='iconDelete'></div>
          <div onClick={this.toggleEditing} className='iconEdit'></div>
        </div>
      </div>
    ) : (
    )
  }
}
Score.displayName = 'score' // Tell React Dev Tools the component name

// Assign Prop Types
Score.propTypes = {
  score: PropTypes.shape({
    _id: PropTypes.shape({
      timestamp: PropTypes.number.isRequired,
      author: PropTypes.string.isRequired
    }),
    author: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,

}

export default Score
