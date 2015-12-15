'use strict'; 

module.exports = {
  stamp: function(){
    var t = new Date();
    return '[' + [t.getHours(), t.getMinutes(), t.getSeconds()].join(':') + ']';
  }
};