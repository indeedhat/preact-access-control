# Preact access control

This project was inspired by an article i read by Carl Vitullo at hackernoon [Link](https://hackernoon.com/role-based-authorization-in-react-c70bb7641db4)

preact-access-control gives a basic framework for doing role based auth in your preact app

## Update Notes
version 0.4.0 has been reworked to better deal with async fetch methods, i honestly don't know what i was thinking with 
the previous implementation

## Basic usage

### Initialise
Before you can make use of the library you need to call the initialise function.

`AccessControl.init` accepts two parameters:\
`check`: a function to check if the user has access\
`fetch`: a function fetch the users auth model from wherever you want to store/cache it and pass it the predefined callback

```jsx
import AccessControl from 'preact-access-control';

AccessControl.init(
  (allowedRoles, authModel) => {
    // check if the user has access. For example:
    return ~allowedRoles.indexOf(authModel.group)
  },
  (callback) => {
    // get your access model from wherever you like
    // for this example lets set a static one
    callback({name: 'indeedhat', group: 'user'});
  }
);
```

It is worth noting that `fetch` gets called a LOT so you will probably want to implement
some kind of caching mechanism instead of making a server call each time.

here is an example of the same init making use of the default auth cache

```jsx
import {AccessControl, AccessDefaults} from 'preact-access-control';

AccessControl.init(
  (allowedRoles, authModel) => {
    // check if the user has access. For example:
    return ~allowedRoles.indexOf(authModel.group)
  },
  (callback) => {
    // get your access model from wherever you like
    // for this example lets set a static one
    AccessDefaults.authCache((callback) {
      callback({name: 'indeedhat', group: 'user'});
    });
  }
);
```


### Control Groups (AccessControl)
The intended way of using preact-access-control is to create control group wrappers and use them 
repeatedly throughout your application this is done with `AccessControl()`

Access control accepts two parameters:\
`allowedRoles`: an array of the role keys you wish to have access to the group\
`defaultOnFaol`: this is an optional parameter that will be passed to the components onFail if nothing is passed to `
onFail` (See below for details of `onFail`)

```jsx
const UserAccess  = AccessControl(['user', 'admin']);
const AdminAccess = AccessControl(['admin']);
```

Creating control groups in this way makes it simple to add access control to your routs with preact-router

```jsx
import {Router, Route} from 'preact-router';

...

render() {
    return (
      <div id="page">
        <Header/>
        <Log name='body'>
          <Router>
            <Route component={UserAccess(HomePage)} default />
            <Route component={AdminAccess(AdminHome)} path='/admin' />
          </Router>
        </Log>
      </div>
    );
  }
```

you can also add a fallback for when a route fails with the control groups optional second parameter `onFail`:

`onFail`: accepts a number of different input types:

| Param type | Result                                                                |
|------------|-----------------------------------------------------------------------|
| string     | the user will be routed to the given url                              |
| function   | the function will be ran with no parameters                           |
| Component  | the component will be rendered in place of the blocked Component      |
| array      | the array contents will be rendered in place of the blocked Component |

if nothing is passed to `onFail` then the blocked Component will just not be rendered with nothing in its place

### AccessComponent

Access can also be defined on a case by case basis by using the `AccessComponent`

```jsx
import {AccessComponent} from 'preact-access-control';

...

<AccessComponent roles={['moderator', 'admin']}>
  <SomeComponent />
  <SomeOtherComponent />
</AccessComponent>
```

As with the control groups `AccessComponent` optionally accepts a `onFail` property with identical results

```jsx
<AccessComponent roles={['moderator', 'admin']} onFail={() => { /* do something */ }}>
  <SomeComponent />
  <SomeOtherComponent />
</AccessComponent>
```

### AccessControls

Finally the callbacks set on `AccessControl.init` are exposed in case you wish to call them manually at a later date

```jsx
import {AccessControls} from 'preact-access-control';

// manually fetch data
const authModel = AccessControls.fetch();

// manually check a role
const access = AccessComtrols.check(['user'], authModel);
```

Any time you manually call `AccessControls.fetch` the updated authModel will be passed to all access groups 
and mounted AccessComponents, this can be prevented by passing `true` to `AccessControls.fetch()`

## Default Methods
This library provides a number of default methods for managing your auth details

### accessCache
This is a simple caching mechanism for your users auth details, it accepts two parameters\
`callback`: this is your custom function for returning the users auth details (this function should accept a single 
callback parameter)\
`timeout`: the cache timeout in milliseconds, the auth details will only be reloaded after the timeout his expired 
and an AuthComponent is reloaded
 
### fetch
this method uses fetch to return your JSON encoded auth data from a server API, it takes two parameters:\
`url`: the URL of your API endpoint
`timeout`: (optional - default 30000)the length of time in ms the details will be cached for before re-fetching 

### check
this method checks the users auth details for access against the access list declared in the AccessComponent.\
It assumes that the auth data object has a group field

```jsx
{
  group: 'user',
  ...
}
```

## Contributing

I would be happy to hear any comments or suggestions you have to improve the package along with any code change pull
requests

## TODO

* write some proper documentation
* write some unit tests
* publish the package when it is a little more complete and i am happy with it

### License
[MIT Licensed](./LICENSE)
