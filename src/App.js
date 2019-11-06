import React, { Component } from 'react';
import LayoutContainer from './components/framework/LayoutContainer';
import LoadingContainer from './components/framework/LoadingContainer';
import ErrorBoundary from './components/framework/ErrorBoundary';

class App extends Component {

  render() {
    return (
      <ErrorBoundary>
        <LoadingContainer>
          <LayoutContainer />
        </LoadingContainer>
      </ErrorBoundary>
    );

    
  }
}

export default App;