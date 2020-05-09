var LOW_PRIORITY = 500;

export default function ImageSelection(eventBus, modeling, translate) {

  this._eventBus = eventBus;
  this._modeling = modeling;
  this._translate = translate;

  var self = this;

  eventBus.on('create.end', LOW_PRIORITY, function(event) {
    var context = event.context,
        element = context.shape,
        hints = context.hints;

    if (hints.selectImage) {
      self.select(element);
    }
  });

}

ImageSelection.prototype.select = function(element) {

  var source = prompt(this._translate('Input an image url'), '');

  if (source === null || source == '') {
    return;
  }

  this._modeling.updateProperties(element, {
    source: source
  });

};

ImageSelection.prototype.$inject = [
  'eventBus',
  'modelng',
  'translate'
];