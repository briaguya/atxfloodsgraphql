import React from 'react'
import { render } from 'react-dom'
import TodoApp from './components/TodoApp'

import CreateUser from './components/CreateUser'
import LoginUser from './components/LoginUser'

import { Router, Route, browserHistory } from 'react-router'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import './style.css'

// Paste your endpoint for the Simple API here.
// Info: https://github.com/graphcool-examples/react-apollo-todo-example#2-create-graphql-api-with-graphcool
const networkInterface = createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/cj1sgcb2r1lp70109cqcaq449' })

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }

    // get the authentication token from local storage if it exists
    if (localStorage.getItem('graphcoolToken')) {
      req.options.headers.authorization = `Bearer ${localStorage.getItem('graphcoolToken')}`
    }
    next()
  },
}])

const client = new ApolloClient({
  networkInterface,
})

function filter (previousState = 'SHOW_ALL', action) {
  if (action.type === 'SET_FILTER') {
    return action.filter
  }

  return previousState
}

const store = createStore(
  combineReducers({
    filter,
    apollo: client.reducer(),
  }),
  // initial state
  {},
  compose(
    applyMiddleware(client.middleware()),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)

render(
  <ApolloProvider store={store} client={client}>
    <Router>
        <Route path='/' component={TodoApp} />
        <Route path='login' component={LoginUser} />
        <Route path='signup' component={CreateUser} />
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
)
