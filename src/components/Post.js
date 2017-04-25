import React from 'react'

export default class Post extends React.Component {

  static propTypes = {
    post: React.PropTypes.object,
  }

  render () {
    return (
      <div className='pa3 bg-black-05 ma3'>
        <div
          className='w-100'
          style={{
            backgroundImage: `url(${this.props.post.imageUrl})`,
            backgroundSize: 'cover',
            paddingBottom: '100%',
          }}
        />
        <div className='pt3'>
          Description: {this.props.post.description}&nbsp;<br/>
          Number: {this.props.post.number} <br/>
          Tripled: {this.props.post.numberTripled}
        </div>
      </div>
    )
  }
}
