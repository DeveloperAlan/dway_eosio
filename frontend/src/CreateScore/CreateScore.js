import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CreateScore extends Component {
  state = {
    title: '',
    content: '',
    tag: ''
  }

  handleOnChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  createScore = e => {
    e.preventDefault()
    this.props.createScore({ ...this.state})
    this.setState({
      title: '',
      content: '',
      tag: ''
    })
  }

  render () {
    return (
      <div className='createContainer padding-30'>
        <div className='card-item padding-30'>
          <input
            className='margin-bottom-15'
            name='title'
            value={this.state.title}
            onChange={this.handleOnChange}
            placeholder='Title'
          />
          <textarea
            className='margin-bottom-15'
            name='content'
            value={this.state.content}
            onChange={this.handleOnChange}
            rows={4}
            placeholder='Content'
          />
          <input
            className='margin-bottom-15'
            name='tag'
            value={this.state.tag}
            onChange={this.handleOnChange}
            placeholder='Tag'
          />
          <button
            onClick={this.createScore}
            type='submit'
            className='margin-right-15'
          >Create Score</button>
        </div>
      </div>
    )
  }
}
CreateScore.displayName = 'CreateScore' // Tell React Dev Tools the component name

// Assign Prop Types
CreateScore.propTypes = {
  createScore: PropTypes.func.isRequired
}

export default CreateScore
