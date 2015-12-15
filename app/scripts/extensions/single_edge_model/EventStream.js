(function(){

  var Rx = require('rx');

  var EventStream = module.exports = new Rx.Subject();

  var ActionMappers = require('./ActionMappers');
  var StateReducers = require('./StateReducers');
  var UserEvents    = require('./UserEvents');

  var collect = function(event){
    EventStream.onNext(event);
  };

  UserEvents.subscribe(collect);
  ActionMappers.subscribe(collect);
  StateReducers.subscribe(collect);

  // EventStream.subscribe(function(event){
  //   // console.log(event);
  // });

})();