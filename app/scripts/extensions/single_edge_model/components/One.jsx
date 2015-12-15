(function(){

         // <div style={{float:'right', width:"950px"}}>
         //    <BarChart
         //          data={this.state.schedules.stations}
         //          width={1000}
         //          height={400}
         //          title='Stations'
         //        />
         //  </div>
         //  <div style={{float:'right', width:"950px"}}>
         //    <BarChart
         //          data={this.state.schedules.shuttles}
         //          width={1000}
         //          height={400}
         //          title='Shuttles'
         //        />
         //  </div>

          // <div style={{float:'right', width:"950px"}}>
          //   <BarChart
          //         data={this.state.schedules.stations}
          //         width={1000}
          //         height={400}
          //         title='Stations'
          //       />
          // </div>


'use strict';

var _ = require('lodash');
var React = require('react');

var mui = require('material-ui');
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;
var Card = mui.Card;
var CardMedia = mui.CardMedia;
var List = mui.List;
var ListItem = mui.ListItem;
var RightNav = mui.RightNav;

var rd3 = require('react-d3');
var BarChart = rd3.BarChart;

var Scheduler = require('../../../utils/scheduler');

var OUTBOUND_DIST = [0.0029,0.0029,0.003,0.0031,0.0032,0.0034,0.0036,0.0039,0.0042,0.0045,0.0049,0.0053,0.0058,0.0062,0.0065,0.0069,0.0072,0.0074,0.0076,0.0078,0.0079,0.008,0.0081,0.0081,0.0081,0.008,0.008,0.0079,0.0078,0.0076,0.0075,0.0073,0.0072,0.007,0.0067,0.0065,0.0062,0.006,0.0058,0.0056,0.0054,0.0052,0.0051,0.0049,0.0048,0.0047,0.0046,0.0046,0.0046,0.0045,0.0045,0.0045,0.0044,0.0044,0.0044,0.0044,0.0043,0.0043,0.0043,0.0043,0.0043,0.0043,0.0043,0.0043,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0042,0.0043,0.0043,0.0044,0.0044,0.0045,0.0046,0.0047,0.0048,0.0049,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; 
var INBOUND_DIST =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.005,0.0051,0.0052,0.0053,0.0054,0.0055,0.0057,0.0058,0.0059,0.0061,0.0062,0.0063,0.0065,0.0066,0.0067,0.0068,0.0069,0.007,0.0071,0.0072,0.0072,0.0073,0.0073,0.0074,0.0074,0.0075,0.0076,0.0076,0.0077,0.0078,0.0079,0.008,0.0081,0.0082,0.0083,0.0084,0.0084,0.0085,0.0085,0.0085,0.0085,0.0085,0.0085,0.0084,0.0084,0.0083,0.0082,0.008,0.0079,0.0078,0.0076,0.0074,0.0073,0.0071,0.0069,0.0066,0.0064,0.0062,0.0059,0.0056,0.0054,0.0052,0.0049,0.0047,0.0045,0.0042,0.004,0.0038,0.0036,0.0034,0.0032,0.003,0.0028,0.0027,0.0026,0.0025,0.0024,0.0023,0.0022,0.0022,0.0021,0.0021];

var m = 1;
var t = 1516 * m;

var aMult  = .1912;
var bcMult = .1175;

var initialState = {
    seats: 10,
    tripsA2B: _.round(aMult*t,0),
    tripsA2C: _.round(aMult*t,0),
    tripsB2A: _.round(aMult*t,0),
    tripsB2C: _.round(bcMult*t,0),
    tripsC2A: _.round(aMult*t,0),
    tripsC2B: _.round(bcMult*t,0),
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

  // schedules.A.total = [
  //   {
  //     name: "A2B Outgoing",
  //     color:"red",
  //     values: schedules.A2B.out
  //   },
  //   {
  //     name: "A2C Outgoing",
  //     color:"red",
  //     values: schedules.A2C.out
  //   },
  //   {
  //     name: "B2A Incoming",
  //     values: schedules.B2A.in
  //   },
  //   {
  //     name: "C2A Incoming",
  //     values: schedules.C2A.in
  //   }
  // ];


  var aggregateA = _.map(schedules.A2B.out, function(point){
    return point.y;
  });

  _.forEach(schedules.A2C.out, function(point, n){
    aggregateA[n] += point.y;
  });

  _.forEach(schedules.B2A.in, function(point, n){
    aggregateA[n] += point.y;
  });

  _.forEach(schedules.C2A.in, function(point, n){
    aggregateA[n] += point.y;
  });


  schedules.A.total = [
    {
      name: "A2B Outgoing",
      color:"red",
      values: _.map(aggregateA, function(y, n){
        return {
          x: n,
          y: y
        }
      })
    }
  ];

  // schedules.C.total = [
  //   {
  //     name: "C2A Outgoing",
  //     color:"red",
  //     values: schedules.C2A.out
  //   },
  //   {
  //     name: "C2B Outgoing",
  //     color:"red",
  //     values: schedules.C2B.out
  //   },
  //   {
  //     name: "A2C Incoming",
  //     values: schedules.A2C.in
  //   },
  //   {
  //     name: "B2C Incoming",
  //     values: schedules.B2C.in
  //   }
  // ];

  var aggregateC = _.map(schedules.C2A.out, function(point){
    return point.y;
  });

  _.forEach(schedules.C2B.out, function(point, n){
    aggregateC[n] += point.y;
  });

  _.forEach(schedules.A2C.in, function(point, n){
    aggregateC[n] += point.y;
  });

  _.forEach(schedules.B2C.in, function(point, n){
    aggregateC[n] += point.y;
  });

    schedules.C.total = [
    {
      name: "A2B Outgoing",
      color:"red",
      values: _.map(aggregateC, function(y, n){
        return {
          x: n,
          y: y
        }
      })
    }
  ];

  var aggregateBA = _.map(schedules.B2A.out, function(point){
    return point.y;
  });

  _.forEach(schedules.A2B.in, function(point, n){
    aggregateBA[n] += point.y;
  });


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

  // schedules.B2A.total = [
  //   {
  //     name: "B2A Outgoing",
  //     color:"red",
  //     values: schedules.B2A.out
  //   },
  //   {
  //     name: "A2B Incoming",
  //     values: schedules.A2B.in
  //   }
  // ];

  schedules.B2A.total = [
    {
      name: "A2B Outgoing",
      color:"red",
      values: _.map(aggregateBA, function(y, n){
        return {
          x: n,
          y: y
        }
      })
    }
  ];

  // schedules.B2C.total = [
  //   {
  //     name: "B2C Outgoing",
  //     color:"red",
  //     values: schedules.B2C.out
  //   },
  //   {
  //     name: "C2B Incoming",
  //     values: schedules.C2B.in
  //   }
  // ];

  var aggregateBC = _.map(schedules.B2C.out, function(point){
    return point.y;
  });

  _.forEach(schedules.C2B.in, function(point, n){
    aggregateBC[n] += point.y;
  });

  schedules.B2C.total = [
    {
      name: "A2B Outgoing",
      color:"red",
      values: _.map(aggregateBC, function(y, n){
        return {
          x: n,
          y: y
        }
      })
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
                  <td className="data">{t}</td>
                </tr>
                <tr><td></td><td></td></tr>
                <tr>
                  <td className="row-header">Shuttle Seats:</td>
                  <td className="data">{this.state.seats}</td>
                </tr>
                
              </tbody>
            </table>
  
          </div>
          
          <div style={{float:'right', width:"900px"}}>
            <BarChart
                  data={this.state.schedules.simple}
                  width={1000}
                  height={400}
                  title='Fewer, Bigger'
                />
          </div>
          
      </div>
    )
  }
});



// <div style={{float:'right', width:"950px"}}>
//             <BarChart
//                   data={this.state.schedules.A.total}
//                   width={1000}
//                   height={150}
//                   title='A Pickups'
//                 />
//           </div>
//           <div style={{float:'right', width:"950px"}}>
//             <BarChart
//                   data={this.state.schedules.B2A.total}
//                   width={1000}
//                   height={150}
//                   title='B to A Pickups'
//                 />
//           </div>
//           <div style={{float:'right', width:"950px"}}>
//             <BarChart
//                   data={this.state.schedules.B2C.total}
//                   width={1000}
//                   height={150}
//                   title='B to C Pickups'
//                 />
//           </div>
//           <div style={{float:'right', width:"950px"}}>
//             <BarChart
//                   data={this.state.schedules.C.total}
//                   width={1000}
//                   height={150}
//                   title='C Pickups'
//                 />
//           </div>
})();