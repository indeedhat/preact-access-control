import 'whatwg-fetch';
import {componentRegister} from './index';

const authCache = {
  time: 0,
  data: null,
};

const AccessDefaults = {
  authCache: (callback, timeout) => {
    if ('function' !== typeof callback) {
      throw new Error('Invalid callback');
    }
    if (!timeout || isNaN(timeout)) {
      throw new Error('Invalid timeout');
    }

    const now = +new Date;
    if (authCache.data && now < (authCache.time + timeout)) {
      componentRegister.passToComponents(authCache.data);
    } else {
      callback((data) => {
        authCache.data = data;
        authCache.time = now;
        componentRegister.passToComponents(data);
      });
    }
  },

  fetch: (url, timeout) => {
    return () => {
      AccessDefaults.authCache((callback) => {
        fetch(url)
          .then((response) => {
            return response.json();
          }).then((data) => {
          callback(data);
        });
      }, timeout || 30000);
    };
  },

  check: (allowedRoles, authData) => {
    return !!~allowedRoles.indexOf(authData.group);
  }
};

export default AccessDefaults;
export {AccessDefaults};