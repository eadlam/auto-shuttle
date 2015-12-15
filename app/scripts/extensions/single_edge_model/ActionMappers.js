(function(){ 'use strict';

var Rx = require('rx');

var Constants = require('./Constants');
var EventStream = require('./EventStream');

var Router = require('react-router');

var Actions = module.exports = new Rx.Subject();

var UserEvents = EventStream.filter(function(event){
  return event.type === Constants.USER_EVENT;
});


var SEATS_CHANGED = function(event){
  return event.name === Constants.user_event.SEATS_CHANGED; 
};

var TRIPS_A_CHANGED = function(event){
  return event.name === Constants.user_event.TRIPS_A_CHANGED; 
};

var TRIPS_B_CHANGED = function(event){
  return event.name === Constants.user_event.TRIPS_B_CHANGED; 
};

// Seats Changed
UserEvents
  .filter(SEATS_CHANGED)
  .subscribe(function(event){
    Actions.onNext({
      type: Constants.ACTION,
      name: Constants.action.SEATS_CHANGED,
      data: event.data
    });
  });

// TRIPS_A Changed
UserEvents
  .filter(TRIPS_A_CHANGED)
  .subscribe(function(event){
    Actions.onNext({
      type: Constants.ACTION,
      name: Constants.action.TRIPS_A_CHANGED,
      data: event.data
    });
  });

// TRIPS_B Changed
UserEvents
  .filter(TRIPS_B_CHANGED)
  .subscribe(function(event){
    Actions.onNext({
      type: Constants.ACTION,
      name: Constants.action.TRIPS_B_CHANGED,
      data: event.data
    });
  });

})();