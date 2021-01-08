# postit-js

[![Netlify Status](https://api.netlify.com/api/v1/badges/72130b1d-f56b-473e-8f3b-50a5af916e64/deploy-status)](https://app.netlify.com/sites/postit-js-demo/deploys) ![Build Status](https://github.com/pinussilvestrus/postit-js/workflows/ci/badge.svg)


Create post-it brainstorming boards - built with [diagram-js](https://github.com/bpmn-io/diagram-js).

![Screencast](./docs/screencast.gif)

Checkout the [**Demo**](https://postit-js-demo.netlify.app/) or the [**Experiments Page**](https://postit-js-experiments.netlify.app/) to get some inspiration.

## Features

* Create resizable Post-its on the Canvas (squared and circled) via
  * Palette
  * Double Click (latest element type will be respected)
* Change the color of Post-its
* Create simple Text Boxes on the Canvas
* Create grouping frame elements on the Canvas
* Add external image resources on the Canvas

## Installation

Install the package to include it into your web application

```sh
$ npm install postit-js-core --save
```

## Usage

To get started, create a [postit-js](https://github.com/pinussilvestrus/postit-js) instance
and render a post-it board into your web application

```javascript
import 'postit-js-core/assets/postit-js.css';
import PostItModeler from 'postit-js-core/lib/Modeler';

let xml; // my post-it xml 
const modeler = new PostItModeler({
  container: '#canvas',
  keyboard: {
    bindTo: window,
  }
});

modeler.importXML(xml, function(err) {
  if (err) {
    return console.error('could not import postit board', err);
  }

  console.log('board rendered');
});
```

For using `postit-js` inside your web application you'll need a source code bundler, e.g. [webpack](https://webpack.js.org/). Checkout the [example](./example) for getting inspiration. 

### Development Setup

Spin up the application for development, all strings attached:

```sh
$ npm install
$ cd  example
$ npm install
$ npm run dev
```

## Extensions

Since [`diagram-js`](https://github.com/bpmn-io/diagram-js) and also this project is extendable by design, there exist a couple of great community maintained extensions

* [`drag-drop-images`](https://github.com/xanpj/postit-js-extensions#drag-drop-images) - Drag and drop image files on the board
* [`selection-organizer`](https://github.com/xanpj/postit-js-extensions#selection-organizer) - Organize and distribute groups of elements
* [`properties-panel`](https://github.com/xanpj/postit-js-extensions#properties-panel) - Properties panel for post-it elements

## License

MIT

Contains parts of ([bpmn-io](https://github.com/bpmn-io)) released under the [bpmn.io license](http://bpmn.io/license).
