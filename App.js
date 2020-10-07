import React from 'react';
import Navigation from'./Navigation/Navigation.js'
import { Provider } from 'react-redux'
import Store from './Store/configureStore'


export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <Navigation />
      </Provider>
    )
  }
}