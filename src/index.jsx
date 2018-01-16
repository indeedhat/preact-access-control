/**
 * Created by 4423 on 11/23/2017.
 */
import {h, Component} from 'preact';
import {route} from 'preact-router';
import _ from 'lodash';
import {AccessDefaults} from './helpers';


const AccessControls = {
  check: null,
  fetch: null
};


let componentRegister = [];
componentRegister.kill = function(component) {
  let index = componentRegister.indexOf(component);
  if (~index) {
    componentRegister.splice(index, 1);
  }
};

componentRegister.passToComponents = (model) => {
  componentRegister.map(component => {
    component.updateAuthDetails(model);
  });
};


class AccessComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {user: {}};

    if ('function' !== typeof AccessControls.check || 'function' !== typeof AccessControls.fetch) {
      throw new Error('Please call ')
    }

    componentRegister.push(this);
  }

  updateAuthDetails = (user) => {
    if (!_.isEqual(this.state.user, user)) {
      this.setState({user});
    }
  };

  componentWillMount() {
    AccessControls.fetch();
  };

  componentWillUnmount() {
    componentRegister.kill(this);
  }

  render({onFail, roles, children}, {user}) {
    if (AccessControls.check(roles, user)) {
      return <span>{children}</span>;
    }

    if (onFail instanceof Component || 'object' === typeof onFail) {
      return onFail;
    }

    if (Component.isPrototypeOf(onFail)) {
      const OnFail = onFail;
      return <OnFail/>;
    }

    if ('function' === typeof onFail) {
      onFail();
    } else if ('string' === typeof onFail) {
      route(onFail);
    }

    return null;
  }
}


function AccessControl(allowedRoles, defaultOnFail)
{
  return (ChildComponent, onFail) => {
    return (props) => {
      return (
        <AccessComponent onFail={onFail || defaultOnFail} roles={allowedRoles}>
          <ChildComponent {...props} />
        </AccessComponent>

      );
    }
  };
}


AccessControl.init = (checkCb, fetchCb) => {
  if ('function' !== typeof checkCb) {
    throw new Error('check must be callable');
  }
  if ('function' !== typeof fetchCb) {
    throw new Error('fetch must be callable');
  }

  AccessControls.check = checkCb;
  AccessControls.fetch = () => {
    fetchCb(componentRegister.passToComponents);
  };
};


export {AccessControl, AccessComponent, AccessControls, AccessDefaults, componentRegister};
export default AccessControl;
