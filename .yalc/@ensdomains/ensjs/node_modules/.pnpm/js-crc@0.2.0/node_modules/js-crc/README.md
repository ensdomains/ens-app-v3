# js-crc
[![Build Status](https://travis-ci.org/emn178/js-crc.svg?branch=master)](https://travis-ci.org/emn178/js-crc)
[![Coverage Status](https://coveralls.io/repos/emn178/js-crc/badge.svg?branch=master)](https://coveralls.io/r/emn178/js-crc?branch=master)  
[![NPM](https://nodei.co/npm/js-crc.png?stars&downloads)](https://nodei.co/npm/js-crc/)  
Simple CRC checksum functions for JavaScript(CRC-16 and CRC-32).

## Download
[Compress](https://raw.github.com/emn178/js-crc/master/build/crc.min.js)  
[Uncompress](https://raw.github.com/emn178/js-crc/master/src/crc.js)

## Installation
You can also install js-crc by using Bower.

    bower install js-crc

For node.js, you can use this command to install:

    npm install js-crc

## Usage
You could use like this:
```JavaScript
crc32('Message to hash');
crc16('Message to hash');
```
If you use node.js, you should require the module first:
```JavaScript
var crc32 = require('js-crc').crc32;
var crc16 = require('js-crc').crc16;
```
It supports AMD:
```JavaScript
require(['your/path/crc.js'], function (crc) {
  var crc32 = crc.crc32;
  var crc16 = crc.crc16;
  // ...
});

## Example
```JavaScript
crc32('The quick brown fox jumps over the lazy dog'); // 414fa339
crc32('The quick brown fox jumps over the lazy dog.'); // 519025e9

// It also supports byte `Array`, `Uint8Array`, `ArrayBuffer` input:
crc32([0]); // d202ef8d
crc32(new Uint8Array([0])); // d202ef8d
```

## License
The project is released under the [MIT license](http://www.opensource.org/licenses/MIT).

## Contact
The project's website is located at https://github.com/emn178/js-crc  
Author: Chen, Yi-Cyuan (emn178@gmail.com)
