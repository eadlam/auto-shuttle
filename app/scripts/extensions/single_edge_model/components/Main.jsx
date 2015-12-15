(function(){

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

// var LineChart = require("react-chartjs").Line;

var Constants = require('../Constants');
var EventStream = require('../EventStream');
var UserEvents = require('../UserEvents');

var rd3 = require('react-d3');
var BarChart = rd3.BarChart;

var chartData = [
    { 
      name: "Series A",
      values: []
    }
  ];

var labels = [];
for(var i = 0; i < 96; i++){
  labels.push(i);
}

var getChartData = function(data, label){
  
  var chartData = [
    { 
      name: "Series A",
      values: []
    }
  ];

  _.forEach(data, function(x, index){
    console.log(chartData)
    chartData[0].values.push({
      "x": index,
      "y": x
    })
  });

  return chartData;
}

var SingleEdgeModel = module.exports = React.createClass({

  getInitialState: function(){
    return {
      schedules:{
        A: { 
          out:[], 
          in:[], 
          total:[
            {
              name: "A2B Outgoing",
              values: []
            },
            {
              name: "B2A Incoming",
              values: []
            },
            {
              name: "C2A Incoming",
              values: []
            }
          ]
        },
        C: { 
          out:[], 
          in:[], 
          total:[
            {
              name: "A2B Outgoing",
              values: []
            },
            {
              name: "B2A Incoming",
              values: []
            },
            {
              name: "C2A Incoming",
              values: []
            }
          ]
        },
        A2B: { 
          out:[], 
          in:[], 
          total:[
            {
              name: "A2B Outgoing",
              values: []
            },
            {
              name: "B2A Incoming",
              values: []
            },
            {
              name: "C2A Incoming",
              values: []
            }
          ]
        },
        A2C: { 
          out:[], 
          in:[], 
          total:[
            {
              name: "A2B Outgoing",
              values: []
            },
            {
              name: "B2A Incoming",
              values: []
            },
            {
              name: "C2A Incoming",
              values: []
            }
          ]
        },
        B2A: { 
          out:[], 
          in:[], 
          total:[
            {
              name: "A2B Outgoing",
              values: []
            },
            {
              name: "B2A Incoming",
              values: []
            },
            {
              name: "C2A Incoming",
              values: []
            }
          ]
        },
        B2C: { 
          out:[], 
          in:[], 
          total:[
            {
              name: "A2B Outgoing",
              values: []
            },
            {
              name: "B2A Incoming",
              values: []
            },
            {
              name: "C2A Incoming",
              values: []
            }
          ]
        },
        C2A: { 
          out:[], 
          in:[], 
          total:[
            {
              name: "A2B Outgoing",
              values: []
            },
            {
              name: "B2A Incoming",
              values: []
            },
            {
              name: "C2A Incoming",
              values: []
            }
          ]
        },
        C2B: { 
          out:[], 
          in:[], 
          total:[
            {
              name: "A2B Outgoing",
              values: []
            },
            {
              name: "B2A Incoming",
              values: []
            },
            {
              name: "C2A Incoming",
              values: []
            }
          ]
        },
      }

    };
  },

  componentDidMount: function(){
    // Get all actions
    var States = EventStream.filter(
      function(event){
        // console.log("filtering states:", event);
        return event.type === Constants.STATE;
      }
    );

    // console.log("Component mounted");

    States.subscribe(function(event){
      this.setState(event.data);
    }.bind(this));

    UserEvents.onNext({
      type: Constants.USER_EVENT,
      name: Constants.SEATS_CHANGED,
      data: {
        seats: 8
      }
    });
  },

  handleTripsA2B: function(e){
    UserEvents.onNext({
      type: Constants.USER_EVENT,
      name: Constants.TRIPS_CHANGED,
      data: {
        tripsA2B: e.target.value
      }
    });
  },

  handleTripsA2C: function(e){
    UserEvents.onNext({
      type: Constants.USER_EVENT,
      name: Constants.TRIPS_CHANGED,
      data: {
        tripsA2C: e.target.value
      }
    });
  },

  handleTripsB2A: function(e){
    UserEvents.onNext({
      type: Constants.USER_EVENT,
      name: Constants.TRIPS_CHANGED,
      data: {
        tripsB2A: e.target.value
      }
    });
  },

  handleTripsB2C: function(e){
    UserEvents.onNext({
      type: Constants.USER_EVENT,
      name: Constants.TRIPS_CHANGED,
      data: {
        tripsA2B: e.target.value
      }
    });
  },

  handleTripsC2A: function(e){
    UserEvents.onNext({
      type: Constants.USER_EVENT,
      name: Constants.TRIPS_CHANGED,
      data: {
        tripsC2A: e.target.value
      }
    });
  },

  handleTripsC2B: function(e){
    UserEvents.onNext({
      type: Constants.USER_EVENT,
      name: Constants.TRIPS_CHANGED,
      data: {
        tripsC2B: e.target.value
      }
    });
  },

  style:{
    image:{
      width: '900px',
      maxHeight: '800px'
    }
  },

  render: function(){
    return (
      <div>
        <Card style={{padding:'10px', width:'1220px'}} className="flexContainer">
          <div style={{float:'left'}}>

            <div style={{width:'200px', marginRight:'10px'}}>
              <TextField fullWidth={true} 
                         floatingLabelText="Seats"
                         value={this.state.seats}
                         onKeyUp={this.handleSeatsInput} />
            </div> 

            <div style={{width:'200px',  marginRight:'10px'}}>
              <TextField fullWidth={true}
                        floatingLabelText="Trips from A to B"
                        hintText="Trips generated from A to B"
                        onKeyUp={this.handleTripsA2B} 
                        value={this.state.tripsA2B}/>
            </div>

            <div style={{width:'200px'}}>
              <TextField fullWidth={true}
                        floatingLabelText="Trips from A to C"
                        hintText="Trips generated from A to C"
                        onKeyUp={this.handleTripsA2C}
                        value={this.state.tripsA2C} />
            </div>

            <div style={{width:'200px'}}>
              <TextField fullWidth={true}
                        floatingLabelText="Trips from B to A"
                        hintText="Trips generated from B to A"
                        onKeyUp={this.handleTripsB2A}
                        value={this.state.tripsB2A} />
            </div>

            <div style={{width:'200px'}}>
              <TextField fullWidth={true}
                        floatingLabelText="Trips from B to C"
                        hintText="Trips generated from B to C"
                        onKeyUp={this.handleTripsB2C}
                        value={this.state.tripsB2C} />
            </div>

            <div style={{width:'200px'}}>
              <TextField fullWidth={true}
                        floatingLabelText="Trips from C to A"
                        hintText="Trips generated from C to A"
                        onKeyUp={this.handleTripsC2A}
                        value={this.state.tripsC2A} />
            </div>

            <div style={{width:'200px'}}>
              <TextField fullWidth={true}
                        floatingLabelText="Trips from C to B"
                        hintText="Trips generated from C to B"
                        onKeyUp={this.handleTripsC2B}
                        value={this.state.tripsC2B} />
            </div>


          </div>
          <div style={{float:'right', width:"950px"}}>
            <BarChart
                  data={this.state.schedules.A.total}
                  width={1000}
                  height={150}
                  title='A Pickups'
                />
          </div>
          <div style={{float:'right', width:"950px"}}>
            <BarChart
                  data={this.state.schedules.B2A.total}
                  width={1000}
                  height={150}
                  title='B to A Pickups'
                />
          </div>
          <div style={{float:'right', width:"950px"}}>
            <BarChart
                  data={this.state.schedules.B2C.total}
                  width={1000}
                  height={150}
                  title='B to C Pickups'
                />
          </div>
          <div style={{float:'right', width:"950px"}}>
            <BarChart
                  data={this.state.schedules.C.total}
                  width={1000}
                  height={150}
                  title='C Pickups'
                />
          </div>
        </Card>
      </div>
    )
  }
});


})();