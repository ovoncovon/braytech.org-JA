import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';

import ErrorBoundary from './components/ErrorBoundary';
import * as serviceWorker from './serviceWorker';
import runOnceTasks from './utils/runOnceTasks';
import packageJSON from '../package.json';

import App from './App';

import store from './store';

class AppEntry extends React.Component {
  constructor(props) {
    super();
    
    this.state = {
      updateAvailable: false
    };

    runOnceTasks();

    console.log(`%c Braytech ${packageJSON.version}`, 'font-family: sans-serif; font-size: 24px;');
  }

  config = {
    onUpdate: registration => {
      console.warn('Service worker update available');
      console.log(registration);

      this.setState({
        updateAvailable: true
      });

      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    },
    onSuccess: registration => {
      console.warn('Service worker registered');
      console.log(registration);
    }
  };

  componentDidMount() {
    serviceWorker.register(this.config);
  }

  render() {
    return (
      <Provider store={store}>
        <ErrorBoundary app>
          <App {...this.state} />
        </ErrorBoundary>
      </Provider>
    );
  }
}

Sentry.init({dsn: "https://832f7de2a459422491d4a4e7251d6a37@sentry.io/5168531"});

ReactDOM.render(<AppEntry />, document.getElementById('root'));