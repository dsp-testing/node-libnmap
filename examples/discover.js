/*!
 * node-libnmap
 * Copyright(c) 2013-2015 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

var nmap = require('../');

nmap.discover(function(err, report) {
  if (err) console.log(new Error(err));

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});