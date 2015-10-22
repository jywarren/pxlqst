###pxlqst

A pixel quest.

http://pxlqst.com


##Rules

1. No objects larger than 1x1 pixels
2. No text

****

##Setup

1. From the root directory, run `bower install`.
2. Open index.html in a browser.

##Contributing

1. This project uses `grunt` to do a lot of things, including concatenate source files from /src/ to pxlqst.js. Run `npm install` or `sudo npm install` from the root directory to install Grunt if you don't have it already. 
2. You may need to install grunt-cli: `npm install -g grunt-cli`.
3. Run `grunt` in the root directory, and it will watch for changes and concatenate them on the fly.

##Test adventure

Pxlqst comes with a [test suite](https://github.com/jywarren/pxlqst/issues/4) using [Jasmine](https://jasmine.github.io) which lead the tester on an adventure through the dungeons. To run this test adventure, run `rake jasmine` from the root directory, then navigate to http://localhost:8888. 

