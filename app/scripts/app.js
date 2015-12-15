'use strict';

// 3rd Party
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;

var mui = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager');

// Components
var SingleEdgeModel = require('./components/Main');
var OneModel = require('./components/One');

var App = React.createClass({

  getInitialState: function() {
    return {};
  },

  componentWillMount: function(){
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  // getChildContext: function() {
  //   return {
  //     muiTheme: ThemeManager.getCurrentTheme()
  //   };
  // },

  // <li><Link to="single_edge_model">Single Edge Model</Link></li>
          // <li><Link to="one_model">One Model</Link></li>

  render: function(){
    return (
      <div>
        <ul>
          
        </ul>
        <RouteHandler/>
      </div>
    );
  }
});

var routes = (
  <Route handler={App}>
    <Route name="single_edge_model" handler={SingleEdgeModel}/>
    <Route name="one_model" handler={OneModel}/>
  </Route>
);

Router.run(routes, function (Handler) {
  ReactDOM.render(<Handler/>, document.getElementById('app'));
});

module.exports = App;
