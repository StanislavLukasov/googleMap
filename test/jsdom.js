const jsdom = require('jsdom');

export default (documentLoaded) => {
  
  // Mock Image class since it's not found by default in jsdom
  global.Image = class Image {
    get complete() {
      return true;
    }
  };

  global.navigator = {
    userAgent: 'node.js',
  };

  jsdom.env({
    html: '<html><head></head><body></body></html>',
    scripts: [
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCxTpWl7nqXDxWstxqCAIZqr7Z90NMZKWg&libraries=geometry'
    ],
    done: (err, win) => {
      global.window = win;
      global.document = win.document;
      global.google = win.google;

      // Add other common globals
      Object.keys(win).forEach((property) => {
        if (typeof global[property] === 'undefined') {
          global[property] = win[property];
        }
      });
      // Done!
      documentLoaded();
    },
  });
};