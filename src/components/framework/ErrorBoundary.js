import React, { Component } from 'react';
import store from '../../store';
import { setPlatformError } from '../../actions';
import { FRIENDLY_ERROR_MESSAGES } from '../../util/web3/errorMessaging';
import PlatformError from "../error-pages/PlatformError";

class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { errorDetail: null };
    }
    
    componentDidCatch(error, errorInfo) {
      const errorDetail = FRIENDLY_ERROR_MESSAGES[error];
      this.setState({errorDetail: errorDetail});

      store.dispatch(setPlatformError(errorDetail));

      console.error("Platform Error:", error);
      console.error("Platform Error Info:", errorInfo);
    }
    
    render() {
      const errorDetail = this.state.errorDetail;
      if (errorDetail) {
        return (<PlatformError errorTitle={errorDetail.title} errorMessage={errorDetail.message} additionalMessage={errorDetail.additionalMessage} />);
      }
      // Render children if there's no error
      return this.props.children;
    }  
  }
  export default ErrorBoundary;