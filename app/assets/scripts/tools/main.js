"use strict";
var app=app || {};

app.trim=function(myString)
{
  return myString.replace(/^\s+/g,'').replace(/\s+$/g,'');
} 

function dump(obj) {
  var out = '';
  for (var i in obj) {
    if(typeof obj[i]===typeof {}){
      out+=dump(obj[i])+ "\n";
    }else{
     out += i + ": " + obj[i] + "\n";
   }
 }
 return out;   
}

function hashCode(str) { 
  str += '00000';
  str=hex_md5(str);
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function intToRGB(i) {
  var color= ((i >> 24) & 0xFF).toString(16) +
  ((i >> 16) & 0xFF).toString(16) +
  ((i >> 8) & 0xFF).toString(16);
  while(color.length<6){
    color="0"+color;
  }
  return color;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j])
        a.splice(j--, 1);
    }
  }
  return a;
} 

function ucfirst(str)
{
  if(str=="" || !str){return "";}
  return str.charAt(0).toUpperCase() + str.substr(1);
}

function clone(obj) {
  var copy;
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;
  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }
  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}  

app.orderBy=function(array,orderBy,order){
  app.orderByParam=orderBy;
  if(order=="ASC"){
    return array.sort(function(a,b){
      if(!isNaN(a[app.orderByParam])){
        if(a[app.orderByParam]*1>b[app.orderByParam]*1) return 1;
        if(a[app.orderByParam]*1<b[app.orderByParam]*1) return -1;
      }

      if(a[app.orderByParam]>b[app.orderByParam]) return 1;
      if(a[app.orderByParam]<b[app.orderByParam]) return -1;

      return 0;
    });
  }
  return array.sort(function(a,b){
    if(!isNaN(a[app.orderByParam])){
      if(a[app.orderByParam]*1>b[app.orderByParam]*1) return -1;
      if(a[app.orderByParam]*1<b[app.orderByParam]*1) return 1;
    }
    if(a[app.orderByParam]>b[app.orderByParam]) return -1;
    if(a[app.orderByParam]<b[app.orderByParam]) return 1;
    return 0;
  });
}

app.add=function(a,b) {
  return a*1 + b*1;
};   

app.distanceEuclidienne=function(v1,v2){
  var sum = 0;
  for (var n = 0, lng=v1.length; n < lng; n++) {
    var d=v1[n] - v2[n];
    sum += d*d;
  }
  return sum;
}

function truncateString(str, num) {
  return str.length > num ? str.slice(0, num >= 3 ? num - 3 : num) + '...' : str;
}
