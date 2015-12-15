(function(){ 'use strict';

var _ = require('lodash');
var Rx = require('rx');

var Constants = require('./Constants');
var EventStream = require('./EventStream');

var Scheduler = require('../../utils/scheduler');

var States = module.exports = new Rx.Subject();

var OUTBOUND_DIST = [0.0029,0.0029,0.003,0.0031,0.0032,0.0034,0.0036,0.0039,0.0042,0.0045,0.0049,0.0053,0.0058,0.0062,0.0065,0.0069,0.0072,0.0074,0.0076,0.0078,0.0079,0.008,0.0081,0.0081,0.0081,0.008,0.008,0.0079,0.0078,0.0076,0.0075,0.0073,0.0072,0.007,0.0067,0.0065,0.0062,0.006,0.0058,0.0056,0.0054,0.0052,0.0051,0.0049,0.0048,0.0047,0.0046,0.0046,0.0046,0.0045,0.0045,0.0045,0.0044,0.0044,0.0044,0.0044,0.0043,0.0043,0.0043,0.0043,0.0043,0.0043,0.0043,0.0043,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0043,0.0043,0.0044,0.0044,0.0045,0.0046,0.0047,0.0048,0.0049,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
var INBOUND_DIST =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.005,0.0051,0.0052,0.0053,0.0054,0.0055,0.0057,0.0058,0.0059,0.0061,0.0062,0.0063,0.0065,0.0066,0.0067,0.0068,0.0069,0.007,0.0071,0.0072,0.0072,0.0073,0.0073,0.0074,0.0074,0.0075,0.0076,0.0076,0.0077,0.0078,0.0079,0.008,0.0081,0.0082,0.0083,0.0084,0.0084,0.0085,0.0085,0.0085,0.0085,0.0085,0.0085,0.0084,0.0084,0.0083,0.0082,0.008,0.0079,0.0078,0.0076,0.0074,0.0073,0.0071,0.0069,0.0066,0.0064,0.0062,0.0059,0.0056,0.0054,0.0052,0.0049,0.0047,0.0045,0.0042,0.004,0.0038,0.0036,0.0034,0.0032,0.003,0.0028,0.0027,0.0026,0.0025,0.0024,0.0023,0.0022,0.0022,0.0021,0.0021];
var initialState = {
  type: Constants.STATE,
  name: Constants.state.RECIPE_STATE_CHANGED,
  data:{
    seats: 8,
    tripsA2B: 293,
    tripsA2C: 293,
    tripsB2A: 293,
    tripsB2C: 180,
    tripsC2A: 293,
    tripsC2B: 180,
    schedules:{
      A: {
        out:[],
        in:[],
        total:[]
      },
      C: {
        out:[],
        in:[],
        total:[]
      },
      A2B: {
        out:[],
        in:[],
        total:[]
      },
      A2C: {
        out:[],
        in:[],
        total:[]
      },
      B2A: {
        out:[],
        in:[],
        total:[]
      },
      B2C: {
        out:[],
        in:[],
        total:[]
      },
      C2A: {
        out:[],
        in:[],
        total:[]
      },
      C2B: {
        out:[],
        in:[],
        total:[]
      }
    }
  }
};

var getShuttleSchedules = function(schedules, seats){
  return Scheduler.compute(schedules, seats);
};


var computeSchedule = function(trips){
  return {
    out: _.map(OUTBOUND_DIST, function(p, index){
      return {
        x: index,
        y: Math.ceil(p * trips)
      };
    }),
    in: _.map(INBOUND_DIST, function(p, index){
      return {
        x: index,
        y: Math.ceil(p * trips)
      }
    })
  }
};


// These are the peoples schedules
var getSchedules = function(data){
  var schedules = {};
  schedules.A2B = computeSchedule(data.tripsA2B);
  schedules.A2C = computeSchedule(data.tripsA2C);
  schedules.B2A = computeSchedule(data.tripsB2A);
  schedules.B2C = computeSchedule(data.tripsB2C);
  schedules.C2A = computeSchedule(data.tripsC2A);
  schedules.C2B = computeSchedule(data.tripsC2B);
  schedules.A = {total:[]};
  schedules.C = {total:[]};

  schedules.A.total = [
    {
      name: "A2B Outgoing",
      color:"red",
      values: schedules.A2B.out
    },
    {
      name: "A2C Outgoing",
      color:"red",
      values: schedules.A2C.out
    },
    {
      name: "B2A Incoming",
      values: schedules.B2A.in
    },
    {
      name: "C2A Incoming",
      values: schedules.C2A.in
    }
  ];

  schedules.C.total = [
    {
      name: "C2A Outgoing",
      color:"red",
      values: schedules.C2A.out
    },
    {
      name: "C2B Outgoing",
      color:"red",
      values: schedules.C2B.out
    },
    {
      name: "A2C Incoming",
      values: schedules.A2C.in
    },
    {
      name: "B2C Incoming",
      values: schedules.B2C.in
    }
  ];

  schedules.A2B.total = [
    {
      name: "A2B Outgoing",
      color:"red",
      values: schedules.A2B.out
    },
    {
      name: "B2A Incoming",
      values: schedules.B2A.in
    }
  ];

  schedules.A2C.total = [
    {
      name: "A2C Outgoing",
      color:"red",
      values: schedules.A2C.out
    },
    {
      name: "C2A Incoming",
      values: schedules.C2A.in
    }
  ];

  schedules.B2A.total = [
    {
      name: "B2A Outgoing",
      color:"red",
      values: schedules.B2A.out
    },
    {
      name: "A2B Incoming",
      values: schedules.A2B.in
    }
  ];

  schedules.B2C.total = [
    {
      name: "B2C Outgoing",
      color:"red",
      values: schedules.B2C.out
    },
    {
      name: "C2B Incoming",
      values: schedules.C2B.in
    }
  ];

  schedules.C2A.total = [
    {
      name: "C2A Outgoing",
      color:"red",
      values: schedules.C2A.out
    },
    {
      name: "A2C Incoming",
      values: schedules.A2C.in
    }
  ];

  schedules.C2B.total = [
    {
      name: "C2B Outgoing",
      color:"red",
      values: schedules.C2B.out
    },
    {
      name: "B2C Incoming",
      values: schedules.B2C.in
    }
  ];

  var shuttleSchedules = getShuttleSchedules(schedules, data.seats);

  schedules.stations = shuttleSchedules.stations;
  schedules.shuttles = shuttleSchedules.shuttles;
  schedules.stats = shuttleSchedules.stats;

  return schedules;
};

initialState.schedules = getSchedules(initialState);

// Get all actions
var Actions = EventStream.filter(
  function(event){
    return event.type === Constants.ACTION;
  }
);

// Filter and reduce actions
Actions
  .filter(function(event){
    return event.name === Constants.action.SEATS_CHANGED ||
           event.name === Constants.TRIPS_CHANGED;
  })

  // TODO: When upgrading rxjs to 3.0, this method signature will change to 
  //       scan(accumulator, [seed])  
  .scan(initialState, function(state, event){
    state.data = _.assign(state.data, event.data);
    state.data.schedules = getSchedules(state.data);
    return state;
  })

  .subscribe(function(event){
    States.onNext(event);
  });


})()