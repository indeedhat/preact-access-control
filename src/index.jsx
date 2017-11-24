/**
 * Created by 4423 on 11/23/2017.
 */
import {h, Component} from 'preact';
import {route} from 'preact-router';

let AccessControl = (allowedRoles) => {
  return (ChildComponent) => {
    return class AcComponent extends Component {
      constructor(props) {
        super(props);
        this.state = {user: {}};

        if ('function' !== typeof AccessMethods.check || 'function' !== typeof AccessMethods.fetch) {
          console.error('Please run AccessControl.init');
        }

        this.onPathChange();
      }

      onPathChange() {
        this.setState({user:  AccessMethods.fetch()});
      };

      render({ onFail }, { user }) {
        if (AccessMethods.check(allowedRoles, user)) {
          return <ChildComponent {... this.props}/>;
        } else if (['function', 'Component'].includes(typeof onFail)) {
          const OnFail = onFail;
          return <OnFail {... this.props}/>;
        } else if ('object' === typeof onFail) {
          return onFail;
        } else if ('string' === typeof onFail) {
          route(onFail);
        }

        return null;
      }
    }
  };
};

AccessControl.init = (check, fetch) => {
  AccessMethods.check = check;
  AccessMethods.fetch = fetch;
};

const AccessMethods = {
  check: null,
  fetch: null
};

export default AccessControl; 
export AccessControl;