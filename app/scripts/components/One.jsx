(function(){

'use strict';

var _ = require('lodash');

var React = require('react');

// Material-UI libs
var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;
var Card = mui.Card;
var CardMedia = mui.CardMedia;
var List = mui.List;
var ListItem = mui.ListItem;
var RightNav = mui.RightNav;

// react-d3 libs
var rd3 = require('react-d3');
var BarChart = rd3.BarChart;


var Scheduler = require('../utils/scheduler');
var Constants = require('../constants');


var initialState = {
    seats: Constants.SEATS,
    tripsA2B: _.round(Constants.A_DIST * Constants.P, 0),
    tripsA2C: _.round(Constants.A_DIST * Constants.P, 0),
    tripsB2A: _.round(Constants.A_DIST * Constants.P, 0),
    tripsB2C: _.round(Constants.BC_DIST * Constants.P, 0),
    tripsC2A: _.round(Constants.A_DIST * Constants.P, 0),
    tripsC2B: _.round(Constants.BC_DIST * Constants.P, 0),
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
};

var getShuttleSchedules = function(schedules, seats){
  return Scheduler.compute(schedules, seats);
};


var computeSchedule = function(trips){
  return {
    out: _.map(Constants.OUTBOUND_DIST, function(p, index){
      return {
        x: index,
        y: Math.ceil(p * trips)
      };
    }),
    in: _.map(Constants.INBOUND_DIST, function(p, index){
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

  schedules.periods = schedules.A.total.length;


  // Calculate schedules.A.total as multiple schedules
  // In the graph, shows up as multiple colors
  // ---------------------------------------------------------------------------
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
  // ---------------------------------------------------------------------------

  // Calculate schedules.A.total as a single schedule
  // In the graph, shows up as one color
  // ---------------------------------------------------------------------------
  // var aggregateA = _.map(schedules.A2B.out, function(point){
  //   return point.y;
  // });

  // _.forEach(schedules.A2C.out, function(point, n){
  //   aggregateA[n] += point.y;
  // });

  // _.forEach(schedules.B2A.in, function(point, n){
  //   aggregateA[n] += point.y;
  // });

  // _.forEach(schedules.C2A.in, function(point, n){
  //   aggregateA[n] += point.y;
  // });

  // schedules.A.total = [
  //   {
  //     name: "A2B Outgoing",
  //     color:"red",
  //     values: _.map(aggregateA, function(y, n){
  //       return {
  //         x: n,
  //         y: y
  //       }
  //     })
  //   }
  // ];
  //----------------------------------------------------------------------------





  // Calculate schedules.C.total as multiple schedules
  // In the graph, shows up as multiple colors
  // ---------------------------------------------------------------------------
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
  //----------------------------------------------------------------------------


  // Calculate schedules.C.total as a single schedule
  // In the graph, shows up as one color
  // ---------------------------------------------------------------------------
  // var aggregateC = _.map(schedules.C2A.out, function(point){
  //   return point.y;
  // });

  // _.forEach(schedules.C2B.out, function(point, n){
  //   aggregateC[n] += point.y;
  // });

  // _.forEach(schedules.A2C.in, function(point, n){
  //   aggregateC[n] += point.y;
  // });

  // _.forEach(schedules.B2C.in, function(point, n){
  //   aggregateC[n] += point.y;
  // });

  //   schedules.C.total = [
  //   {
  //     name: "A2B Outgoing",
  //     color:"red",
  //     values: _.map(aggregateC, function(y, n){
  //       return {
  //         x: n,
  //         y: y
  //       }
  //     })
  //   }
  // ];
  //----------------------------------------------------------------------------





  // Calculate schedules.B2A.total as multiple schedules
  // In the graph, shows up as multiple colors
  // ---------------------------------------------------------------------------
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
  //----------------------------------------------------------------------------

  // Calculate schedules.B2A.total as a single schedule
  // In the graph, shows up as one color
  // ---------------------------------------------------------------------------
  // var aggregateBA = _.map(schedules.B2A.out, function(point){
  //   return point.y;
  // });

  // _.forEach(schedules.A2B.in, function(point, n){
  //   aggregateBA[n] += point.y;
  // });

  // schedules.B2A.total = [
  //   {
  //     name: "A2B Outgoing",
  //     color:"red",
  //     values: _.map(aggregateBA, function(y, n){
  //       return {
  //         x: n,
  //         y: y
  //       }
  //     })
  //   }
  // ];
  //----------------------------------------------------------------------------




  // Calculate schedules.B2A.total as multiple schedules
  // In the graph, shows up as multiple colors
  // ---------------------------------------------------------------------------
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
  //----------------------------------------------------------------------------

  // Calculate schedules.B2A.total as a single schedule
  // In the graph, shows up as one color
  // ---------------------------------------------------------------------------
  // var aggregateBC = _.map(schedules.B2C.out, function(point){
  //   return point.y;
  // });

  // _.forEach(schedules.C2B.in, function(point, n){
  //   aggregateBC[n] += point.y;
  // });

  // schedules.B2C.total = [
  //   {
  //     name: "A2B Outgoing",
  //     color:"red",
  //     values: _.map(aggregateBC, function(y, n){
  //       return {
  //         x: n,
  //         y: y
  //       }
  //     })
  //   }
  // ];
  //----------------------------------------------------------------------------

  // Calculates A2B, A2C, C2A, and C2B total
  // Not really necessary because we use these in the aggregates of
  // A.total and C.total
  //----------------------------------------------------------------------------
  // schedules.A2B.total = [
  //   {
  //     name: "A2B Outgoing",
  //     color:"red",
  //     values: schedules.A2B.out
  //   },
  //   {
  //     name: "B2A Incoming",
  //     values: schedules.B2A.in
  //   }
  // ];

  // schedules.A2C.total = [
  //   {
  //     name: "A2C Outgoing",
  //     color:"red",
  //     values: schedules.A2C.out
  //   },
  //   {
  //     name: "C2A Incoming",
  //     values: schedules.C2A.in
  //   }
  // ];

  // schedules.C2A.total = [
  //   {
  //     name: "C2A Outgoing",
  //     color:"red",
  //     values: schedules.C2A.out
  //   },
  //   {
  //     name: "A2C Incoming",
  //     values: schedules.A2C.in
  //   }
  // ];

  // schedules.C2B.total = [
  //   {
  //     name: "C2B Outgoing",
  //     color:"red",
  //     values: schedules.C2B.out
  //   },
  //   {
  //     name: "B2C Incoming",
  //     values: schedules.B2C.in
  //   }
  // ];
  //----------------------------------------------------------------------------



  var shuttleSchedules = getShuttleSchedules(schedules, data.seats);

  schedules.stats = shuttleSchedules.stats;
  schedules.stations = shuttleSchedules.stations;
  schedules.shuttles = shuttleSchedules.shuttles;
  schedules.simple = shuttleSchedules.simple;

  return schedules;
};

initialState.schedules = getSchedules(initialState);

var OneModel = module.exports = React.createClass({

  getInitialState: function(){
    console.log("Initial State", initialState);
    return initialState;
  },

  handleTripsA2B: function(e){},
  handleTripsA2C: function(e){},
  handleTripsB2A: function(e){},
  handleTripsB2C: function(e){},
  handleTripsC2A: function(e){},
  handleTripsC2B: function(e){},

  style:{
    image:{
      width: '900px',
      maxHeight: '800px'
    }
  },

  render: function(){
    return (
      <div>
          <div style={{float:'left', marginTop:'30px'}}>

            <table className="stats">
              <tbody>
                <tr>
                  <td className="row-header">Riders:</td>
                  <td className="data">{Constants.P}</td>
                </tr>
                <tr><td></td><td></td></tr>
                <tr>
                  <td className="row-header">Shuttle Seats:</td>
                  <td className="data">{this.state.seats}</td>
                </tr>
                <tr>
                  <td className="row-header">Total Shuttles:</td>
                  <td className="data">{this.state.schedules.stats.shuttles.total}</td>
                </tr>
                <tr>
                  <td className="row-header">Capacity Utilization:</td>
                  <td className="data">{this.state.schedules.stats.shuttles.riders.utilization}</td>
                </tr>
                <tr><td></td><td></td></tr>
                <tr>
                  <td className="row-header">Min Miles:</td>
                  <td className="data">{this.state.schedules.stats.shuttles.miles.min}</td>
                </tr>
                <tr>
                  <td className="row-header">Max Miles:</td>
                  <td className="data">{this.state.schedules.stats.shuttles.miles.max}</td>
                </tr>
                <tr>
                  <td className="row-header">Average Miles:</td>
                  <td className="data">{this.state.schedules.stats.shuttles.miles.average}</td>
                </tr>
                <tr>
                  <td className="row-header">Total Miles:</td>
                  <td className="data">{this.state.schedules.stats.shuttles.miles.total}</td>
                </tr>
                
              </tbody>
            </table>
  
          </div>
          <div style={{float:'right', width:"950px"}}>
            <BarChart
                  data={this.state.schedules.A.total}
                  width={1000}
                  height={150}
                  title='A Pickups'
                  yAxisLabel="Riders"
                  xAxisLabel="Nth time step (5 minute increments)"
                />
          </div>
          <div style={{float:'right', width:"950px"}}>
            <BarChart
                  data={this.state.schedules.B2A.total}
                  width={1000}
                  height={150}
                  title='B to A Pickups'
                  yAxisLabel="Riders"
                  xAxisLabel="Nth time step (5 minute increments)"
                />
          </div>
          <div style={{float:'right', width:"950px"}}>
            <BarChart
                  data={this.state.schedules.B2C.total}
                  width={1000}
                  height={150}
                  title='B to C Pickups'
                  yAxisLabel="Riders"
                  xAxisLabel="Nth time step (5 minute increments)"
                />
          </div>
          <div style={{float:'right', width:"950px"}}>
            <BarChart
                  data={this.state.schedules.C.total}
                  width={1000}
                  height={150}
                  title='C Pickups'
                  yAxisLabel="Riders"
                  xAxisLabel="Nth time step (5 minute increments)"
                />
          </div>
          <div style={{float:'right', width:"950px"}}>
            <BarChart
                  data={this.state.schedules.simple}
                  width={1000}
                  height={400}
                  title='Occupied Shuttles (dark) & Garaged shuttles (light)'
                  yAxisLabel="Shuttles"
                  xAxisLabel="Nth time step (5 minute increments)"
                />
          </div>
          <div style={{float:'right', width:"950px"}}>
            <BarChart
                  data={this.state.schedules.shuttles}
                  width={1000}
                  height={400}
                  title='Occupied Shuttles: each color represents a shuttle'
                  yAxisLabel="Shuttles"
                  xAxisLabel="Nth time step (5 minute increments)"
                />
          </div>
          
      </div>
    )
  }
});

})();