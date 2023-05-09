import inherits from 'inherits-browser';

import CoreModule from './core';
import TranslateModule from 'diagram-js/lib/i18n/translate';
import SelectionModule from 'diagram-js/lib/features/selection';
import OverlaysModule from 'diagram-js/lib/features/overlays';

import BaseViewer from './BaseViewer';

export default function Viewer(options) {
  BaseViewer.call(this, options);
}

inherits(Viewer, BaseViewer);

// modules the viewer is composed of
Viewer.prototype._modules = [
  CoreModule,
  TranslateModule,
  SelectionModule,
  OverlaysModule
];

// default moddle extensions the viewer is composed of
Viewer.prototype._moddleExtensions = {};