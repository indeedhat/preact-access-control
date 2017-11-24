# Preact access control

This project was inspired by an article i read by Carl Vitullo at hackernoon [Link](https://hackernoon.com/role-based-authorization-in-react-c70bb7641db4)

preact-access-control gives a basic framework for doing role based auth in your preact app

## Basic usage

### Initialise
Before you can make use of the library you need to call the initialise function.

`AccessControl.init` accepts two parameters:\
`check`: a function to check if the user has access\
`fetch`: a function fetch the users auth model from wherever you want to store/cache it

```jsx
import AccessControl from 'preact-access-control';

AccessControl.init(
  (allowedRoles, authModel) => {
    // check if the user has access. For example:
    return ~allowedRoles.indexOf(authModel.group)
  },
  () => {
    // get your access model from wherever you like
    // for this example lets set a static one
    retrun {name: 'indeedhat', group: 'user'}
  }
);
```

It is worth noting that `fetch` gets called a LOT so you will probably want to implement
some kind of caching mechanism instead of making a server call each time. I plan to add a
default one at when i have time but for now you are on your own.

### Control Groups (AccessControl)
The intended way of using preact-access-control is to create control group wrappers and use them 
repeatedly throughout your application this is done with `AccessControl()`

Access control accepts a single parameter:\
`allowedRoles`: an array of the role keys you wish to have access to the group\

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

## Contributing

I would be happy to hear any comments or suggestions you have to improve the package along with any code change pull
requests

## TODO

* decide upon and implement a default caching mechanism
* implement default fetch and check methods
* allow for an optional fallback onFail parameter to be passed when creating a control group
* write some proper documentation
* write some unit tests
* publish the package when it is a little more complete and i am happy with it

### License
[MIT Licensed](./LICENSE)
