/*!
 * libnmap
 * Copyright(c) 2013-2018 Jason Gerfen <jason.gerfen@gmail.com>
 * License: MIT
 */

'use strict'

const os = require('os');
const ip = require('ip-address');
const cidrjs = require('cidr-js');
const netmask = require('netmask').Netmask;

const validation = require('./validation.js');

const v6 = ip.Address6;
const cidr = new cidrjs();


class network {


  /**
   * @function range
   * Calculates all possible hosts per CIDR
   *
   * @param {Object} opts Application defaults
   * @param {Object} host - CIDR formatted network range
   *
   * @returns {Array}
   */
  range(opts, host) {

    const tools = require('./tools.js');

    const blocks = cidr.list(host);
    let splitat = Math.round(blocks.length / opts.blocksize);

    const results = [];
    let tarray = [];

    // Make sure we account for valid subnet ranges
    splitat = (splitat > 256) ? Math.round(splitat / 255) : splitat;

    if (splitat > 1) {

      // Spllit blocks up by offset
      tarray = tools.chunk(blocks, splitat);
      tarray.forEach(block => {
        results.push(block);
      });
    } else {
      results.push(blocks.join(' '));
    }

    return results;
  }


  /**
   * @function calculate
   * Performs calculation on subnet blocks
   *
   * @param {Object} opts Application defaults
   *
   * @returns {Array}
   */
  calculate(opts) {
    const tools = require('./tools.js');

    const blocks = [];
    let results = [];
    const tresults = [];
    const tests = validation.patterns;

    opts.range.forEach(host => {

      switch (true) {

        /* singular IPv4, IPv6 or RFC-1123 hostname */
        case (validation.test(tests.hostname, host) ||
              validation.test(tests.IPv4, host) ||
              validation.test(tests.IPv6, host)):

          results.push(host);

          break;

        /* IPv4 CIDR notation; break up into chunks for parallel processing */
        case (validation.test(tests.IPv4CIDR, host)):

          tresults.push(this.range(opts, host));

          break;

        /* IPv4 range notation */
        case (validation.test(tests.IPv4Range, host)):

          results.push(host);

          break;

        case (validation.test(tests.IPv6CIDR, host)):
            
          /* Add IPv6 calculations to assist with parallel processing */
          results.push(host);

          break;

        default:

          /* Silently discard specified element as invalid */
          break;
      }
    });

    if (tresults.length > 0) {
      results = tools.merge(results, tresults[0])
    }

    return results;
  }

  
  /**
   * @function adapters
   * Obtain network adapter information and return an array of
   *           ranges as an array for CIDR calculations
   *
   * @param {Object} obj User supplied object
   *
   * @returns {Array}
   */
  adapters(obj) {
    const ret = [];
    let adapter = '';
    let subnet = '';
    const adapters = os.networkInterfaces();

    for (const iface in adapters) {

      for (const dev in adapters[iface]) {
        adapter = adapters[iface][dev];

        if (!adapter.internal) {

          if (!adapter.netmask)
            return false;

          if (adapter.netmask) {

            subnet = adapter.netmask;

            if (validation.test(validation.net.IPv6, subnet)) {

              /* Convert netmask to CIDR notation if IPv6 */
              subnet = new v6(netmask).subnet.substring(1);
            } else {

              /* Convert netmask to CIDR */
              subnet = new netmask(`${adapter.address}/${subnet}`);
              adapter.address = subnet.base;
              subnet = subnet.bitmask;
            }

            ret.push(`${adapter.address}/${subnet}`);
          }
        }
      }
    }

    return ret;
  }
  
}


module.exports = new network;