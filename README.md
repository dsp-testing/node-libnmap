# node-libnmap [![Build Status](https://travis-ci.org/jas-/node-libnmap.png?branch=master)](https://travis-ci.org/jas-/node-libnmap)

Access nmap using node.js

## install ##
To install `npm install node-libnmap`

## methods ##
* `scan`      Performs scan given available range & optional port
* `discover`  Retrieves list of online network neighbors

## options ##
* `nmap`      {String}    Path to NMAP binary
* `verbose`   {Boolean}   Turn on verbosity during scan(s)
* `ports`     {String}    Range of ports to scan
* `range`     {Array}     An array of hostnames/ipv4/ipv6, CIDR or ranges
* `timeout`   {Number}    Number of minutes to wait for host/port response
* `blocksize` {Number}    Number of hosts per network scanning block
* `threshold` {Number}    Max number of  spawned process
* `flags`     {Array}     Array of flags for .spawn()
* `udp`       {Boolean}   UDP scan mode enabled
* `json`      {Boolean}   JSON object as output, false produces XML

## tests ##
To test `npm test`

## example ##
A default usage example. For more advanced and possible options please
see [here](https://gist.github.com/jas-/eae6b0c6e82a4e072b97)

### scan ###
A manually specified scan example using a single host (both IPv4 & IPv6 notation),
a CIDR range a host range as well as a port range specification.

```javascript
var nmap = require('node-libnmap')
  , opts = {
      range: [
        'scanme.nmap.org',
        '10.0.2.0/25',
        '192.168.10.80-120',
        'fe80::42:acff:fe11:fd4e/64'
      ]
    };

nmap.scan(opts, function(err, report) {
  if (err) throw new Error(err);

  for (var item in report) {
    console.log(JSON.stringify(report[item]));
  }
});
```
