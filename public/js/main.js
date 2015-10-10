/* globals io*/
'use strict';

var socket = io(location.origin);
var room = null;
var modules = {};
