import React from 'react'
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class CreateUser extends React.Component {

  static propTypes = {
    router: React.PropTypes.object.isRequired,
    createUser: React.PropTypes.func.isRequired,
    signinUser: React.PropTypes.func.isRequired,
    data: React.PropTypes.object.isRequired,
  }

  state = {
    email: this.props.location.query.email || '',
    password: '',
    name: '',
    emailSubscription: false,
  }

  render () {
    if (this.props.data.loading) {
      return (<div>Loading</div>)
    }

    // redirect if user is logged in
    if (this.props.data.user) {
      console.warn('already logged in')
      this.props.router.replace('/')
    }

    return (
      <div className='w-100 pa4 flex justify-center'>
        <div style={{ maxWidth: 400 }} className=''>
          <input
            className='w-100 pa3 mv2'
            value={this.state.email}
            placeholder='Email'
            onChange={(e) => this.setState({email: e.target.value})}
          />
          <input
            className='w-100 pa3 mv2'
            type='password'
            value={this.state.password}
            placeholder='Password'
            onChange={(e) => this.setState({password: e.target.value})}
          />
          <input
            className='w-100 pa3 mv2'
            value={this.state.name}
            placeholder='Name'
            onChange={(e) => this.setState({name: e.target.value})}
          />
          <div>
            <input
              className='w-100 pa3 mv2'
              value={this.state.emailSubscription}
              type='checkbox'
              onChange={(e) => this.setState({emailSubscription: e.target.checked})}
            />
            <span>
              Subscribe to email notifications?
            </span>
          </div>

          {this.state.name && this.state.email && this.state.password &&
          <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={this.createUser}>Log in</button>
          }
        </div>
      </div>
    )
  }

  createUser = () => {
    const {email, password, name, emailSubscription} = this.state

    this.props.createUser({variables: {email, password, name, emailSubscription}})
      .then((response) => {
        this.props.signinUser({variables: {email, password}})
          .then((response) => {
            window.localStorage.setItem('graphcoolToken', response.data.signinUser.token)
            this.props.router.replace('/')
          }).catch((e) => {
            console.error(e)
            this.props.router.replace('/')
          })
      }).catch((e) => {
        console.error(e)
        this.props.router.replace('/')
      })
  }
}

const createUser = gql`
  mutation ($email: String!, $password: String!, $name: String!, $emailSubscription: Boolean!) {
    createUser(authProvider: {email: {email: $email, password: $password}}, name: $name, emailSubscription: $emailSubscription) {
      id
    }
  }
`

const signinUser = gql`
  mutation ($email: String!, $password: String!) {
    signinUser(email: {email: $email, password: $password}) {
      token
    }
  }
`

const userQuery = gql`
  query {
    user {
      id
    }
  }
`

export default graphql(createUser, {name: 'createUser'})(
  graphql(userQuery, { options: { forceFetch: true }})(
    graphql(signinUser, {name: 'signinUser'})(
      withRouter(CreateUser))
    )
)
