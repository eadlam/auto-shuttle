'use strict';

var _ = require('lodash');

var shuttles = [];
var garage = [];

var Garaged = _.fill(Array(184),0);
var Shuttled = _.fill(Array(184),0);

function Shuttle(seats){
  this.id = _.uniqueId();
  this.seats = _.fill(Array(seats),0);
  this.miles = 0;
  this.riders = {};
};

// Add one rider to the shuttle. 
Shuttle.prototype.add = function(stops){
  var seat = _.findIndex(this.seats, function(s){
    return s === 0;
  });
  this.seats[seat] = stops;
};

Shuttle.prototype.isFull = function(){
  return _.min(this.seats) > 0;
};

Shuttle.prototype.isEmpty = function(){
  return _.max(this.seats) === 0;
};

Shuttle.prototype.unload = function(){
  var seats = _.map(this.seats, function(seat){
    return _.max([0, seat-1]);
  });
  this.seats = seats;
};



Shuttle.prototype.step = function(time){
  this.miles += 1;
  this.riders[time] = _.reduce(this.seats, function(total, seat){
    total = seat > 0 ? (total + 1) : total; 
    return total;
  }, 0);
};

function Station(name, seats){
  this.name = name;
  this.seats = seats;
  this.time = 0;
  this.schedules = [];
  this.shuttles = [];
  this.stopped = [];
  this.parked = [];
  this.loading = [];
  this.ready = [];
  this.next = null;
  this.shared = null;
};

Station.prototype.unload = function(){
  _.forEach(this.stopped, function(shuttle){
    shuttle.unload();
    if(shuttle.isEmpty()){
      this.parked.push(shuttle);
    } else if(shuttle.isFull()){
      this.ready.push(shuttle);
    } else {
      this.loading.push(shuttle);
    }
  }.bind(this));
  this.stopped = [];
};

Station.prototype.findSeat = function(s){
  var shuttle;

  if(this.loading.length > 0){
    shuttle = this.loading.pop();
  } else if(this.parked.length > 0){
    shuttle = this.parked.pop();
  } else if(this.shared && this.shared.parked.length > 0){
    shuttle = this.shared.parked.pop();
  } else if(garage.length > 0){
    shuttle = garage.pop();
    shuttle.miles += 1;
  } else {
    shuttle = new Shuttle(this.seats);
    shuttles.push(shuttle);
  }


  shuttle.add(s);
  if(shuttle.isFull()){
    this.ready.push(shuttle);
  } else {
    this.loading.push(shuttle);
  }

};

Station.prototype.findSeats = function(p, s){
  while(p > 0){
    this.findSeat(s);
    p--;
  }
};

Station.prototype.load = function(){
  _.forEach(this.schedules, function(schedule){
    this.findSeats(
        schedule.riders[this.time],
        schedule.stops
    );
  }.bind(this));
};

Station.prototype.receive = function(shuttle){
  this.stopped.push(shuttle);
};

Station.prototype.send = function(shuttle){
  shuttle.step(this.time);
  this.next.receive(shuttle);
};

Station.prototype.step = function(){
  var garaged = 0;
  _.forEach(this.parked, function(shuttle){
    garage.push(shuttle);
    garaged += 1;
  });
  this.parked = [];
  this.ready = this.ready.concat(this.loading);
  this.loading = [];
  this.shuttles.push(this.ready.length);
  
  Shuttled[this.time] = Shuttled[this.time] + this.ready.length;
  Garaged[this.time] = Garaged[this.time] + garaged;

  while(this.ready.length > 0){
    var shuttle = this.ready.pop();
    this.send(shuttle);
  }
  this.time += 1;
};

Station.prototype.addSchedule = function(schedule){
  var riders = _.map(schedule.out, function(s){
    return s.y;
  });

  _.forEach(schedule.in, function(s, index){
    riders[index] += s.y;
  });

  this.schedules.push({
    stops:schedule.stops,
    riders: riders
  });
};

Station.prototype.getTotalPassengers = function(time){
  var time = time ? time : this.time;
  var total = 0;
  _.forEach(this.schedules.total, function(d){
    total += d.values[time].y;
  });
  return total;
};

Station.prototype.getShuttlesNeeded = function(time){
  return Math.ceil(this.getTotalPassengers(time)/8);
};




module.exports = {
  compute: function(schedules, seats){

    
    // Instantiate Station A
    var stationA = new Station("Station A", seats);
    stationA.addSchedule({
      out: schedules.A2B.out,
      in: schedules.B2A.in,
      stops: 2
    });
    stationA.addSchedule({
      out: schedules.A2C.out,
      in: schedules.C2A.in,
      stops: 3
    });

    // Instantiate Station Ax1
    var stationAx1 = new Station("Station Ax1", seats);

    // Instantiate Station Ax2
    var stationAx2 = new Station("Station Ax2", seats);

    // Instantiate Station B1
    var stationB1 = new Station("Station B1", seats);
    stationB1.addSchedule({
      out: schedules.B2A.out,
      in: schedules.A2B.in,
      stops: 2
    });

    // Instantiate Station B2
    var stationB2 = new Station("Station B2", seats);
    stationB2.addSchedule({
      out: schedules.B2C.out,
      in: schedules.C2B.in,
      stops: 1
    });

    // Instantiate Station C
    var stationC = new Station("Station C", seats);
    stationC.addSchedule({
      out: schedules.C2B.out,
      in: schedules.B2C.in,
      stops: 1
    });
    stationC.addSchedule({
      out: schedules.C2A.out,
      in: schedules.A2C.in,
      stops: 3
    });

    // Set up routes
    stationA.next = stationAx1;
    stationAx1.next = stationB1;
    stationB1.next = stationC;
    stationC.next = stationB2;
    stationB2.next = stationAx2;
    stationAx2.next = stationA;


    // Set up shared stations (shuttles can be borrowed from shared stations)
    stationB1.shared = stationB2;
    stationB2.shared = stationB1;


    var stations = [
      stationA, 
      stationAx1, 
      stationAx2, 
      stationB1, 
      stationB2, 
      stationC
    ];

    _.times(184, function(time){
      // Load all the shuttles
      _.forEach(stations, function(station){ station.load() });

      // Step all the shuttles
      _.forEach(stations, function(station){ station.step() });

      // Unload all the shuttles
      _.forEach(stations, function(station){ station.unload() });
    });

    var data = [
      {
        name: "Station A",
        values: _.map(stationA.shuttles, function(n, time){
          return {
            x: time,
            y: n
          }
        })
      },
      {
        name: "Station Ax1",
        values: _.map(stationAx1.shuttles, function(n, time){
          return {
            x: time,
            y: n
          }
        })
      },
      {
        name: "Station Ax2",
        values: _.map(stationAx2.shuttles, function(n, time){
          return {
            x: time,
            y: n
          }
        })
      },
      {
        name: "Station B2A",
        values: _.map(stationB1.shuttles, function(n, time){
          return {
            x: time,
            y: n
          }
        })
      },
      {
        name: "Station B2C",
        values: _.map(stationB2.shuttles, function(n, time){
          return {
            x: time,
            y: n
          }
        })
      },
      {
        name: "Station C",
        values: _.map(stationC.shuttles, function(n, time){
          return {
            x: time,
            y: n
          }
        })
      }
    ];


    var shuttleStats = [];
    _.forEach(shuttles, function(shuttle, index){
      shuttleStats.push({
        name: "Shuttle " + shuttle.id,
        values: _.fill(Array(184),0) 
      });

      _.forEach(shuttleStats[index].values, function(x,n){
        shuttleStats[index].values[n] = {
          x:n,
          y:0
        }
      });

      _.forEach(shuttle.riders, function(rider, n){
          shuttleStats[index].values[n].y = 1;
      });

    });


    var simpleStats = [
      {
        name: "Shuttled",
        values: _.map(Shuttled, function(shuttles, time){
          return {
            x: time,
            y: shuttles
          }
        })
      },
      {
        name: "Garaged",
        values: _.map(Garaged, function(shuttles, time){
          return {
            x: time,
            y: shuttles
          }
        })
      },
    ];


    // Compute the shuttle and ridership stats
    //--------------------------------------------------------------------------
    var stats = {

      // Statistics about the shuttles
      shuttles:{
        
        // Total number of shuttles needed in the system
        total:shuttles.length,

        miles:{

          // The Minimum number of miles driven by any one shuttle
          min: _.min(
            _.map(shuttles, function(shuttle){
              return shuttle.miles;
          })),

          // The Maximum number of miles driven by any one shuttle
          max: _.max(
            _.map(shuttles, function(shuttle){
              return shuttle.miles;
          })),

          // The total miles driven by all shuttles
          total: _.sum(
            _.map(shuttles, function(shuttle){
              return shuttle.miles;
          })),

          // Average miles driven per shuttle 
          // (compute after this object is created)
          average: 0
        },

        riders:{

          // The total number of riders in seats throughout the day
          // This is greater than double the population because it counts riders
          // at every mile, so a single rider going between A and C will be 
          // counted 3 times going out in one direction and 3 times coming back.
          // We need this in order to compute the utilization 
          total: _.sum(
            _.map(shuttles, function(shuttle){
              return _.sum(shuttle.riders);
            })
          ),

          // The total number of seats available over the course of the day
          capacity: _.sum(
            _.map(shuttles, function(shuttle){
              return _.keys(shuttle.riders).length * shuttle.seats.length;
            })
          ),

          // The total percentage of seats used over the course of the day
          // (compute after this object is created)
          utilization: 0
        }
      }
    };

    // Average miles driven per shuttle
    stats.shuttles.miles.average = _.round(
      stats.shuttles.miles.total / shuttles.length, 2
    );

    // The total percentage of seats used over the course of the day
    stats.shuttles.riders.utilization = _.round(
      stats.shuttles.riders.total / stats.shuttles.riders.capacity, 2
    ); 
    //--------------------------------------------------------------------------

    return {
      stations:data,
      shuttles:shuttleStats,
      simple:simpleStats,
      stats:stats
    };
  }
};