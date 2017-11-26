import 'whatwg-fetch';

const authCache = {
  time: 0,
  data: null
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
    if (authCache.data && authCache.time > (authCache.time + timeout)) {
      return authCache.data;
    }

    authCache.data = callback();
    authCache.time = now;

    return authCache.data;
  },

  fatch: (url) => {
    return AccessDefaults.authCache(() => {
      return fetch(url);
    }, 30000);
  },

  check: (allowedRoles, authData) => {
    return !!~allowedRoles.indexOf(authData.group);
  }
};

export default AccessDefaults;
export {AccessDefaults};