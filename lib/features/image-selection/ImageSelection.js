import {
  domify,
  event as domEvent
} from 'min-dom';


import {
  fileReader
} from '../../util/FileUtil.js';

import {
  getMousePos
} from '../../util/ScreenUtil.js';

var LOW_PRIORITY = 500;
var text;

export default function ImageSelection(canvas, eventBus, modeling, translate) {

  this._canvas = canvas;
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

  text = { 'URL': this._translate('URL'),
    'An error occured during the file upload': this._translate('An error occured during the file upload'),
    'Upload files here': this._translate('Upload files here'),
    'Upload from local is for demo purposes only. It slows down the page and increases the file size.': this._translate('Upload from local is for demo purposes only. It slows down the page and increases the file size.'),
    'Upload': this._translate('Upload'),
    'file': this._translate('file'),
    'selected': this._translate('selected'),
    'Upload again': this._translate('Upload again'),
  };

  ImageSelection.IMAGE_SELECTION_MARKUP = '<div id="pjs-image-selection-modal" class="pjs-io-dialog-local">'+
    '<div class="pjs-io-dialog-section pjs-first">'+
      '<div id="pjs-image-selection-input-wrapper"><input id="pjs-image-selection-input" class="pjs-ui-element-bordered"></input></div>'+
      '<div class="pjs-labeled-input">'+
      '<label for="pjs-image-selection-input" class="pjs-input-text-static"><!--Search / -->'+text['URL']+':</label>'+
      '</div>'+
    '</div">'+
    '<div>'+
      '<!--<div class="pjs-row pjs-image-selection-preview pjs-io-dialog-section">'+
      '<div class="pjs-col-xs"><div class="pjs-box-row"></div></div>'+
      '</div>-->'+
    '</div>'+
    '<div class="pjs-io-dialog-section">'+
    '<div class="pjs-section-spacer"></div>'+
    '<label for="pjs-image-upload"><div class="pjs-io-dialog-text-hint">'+
      '<a style="display:block"><ul id="pjs-image-dialog-text-hint-list" class="pjs-horizontal">'+
        '<li><div class="pjs-general-icon pjs-image-dialog-upload-icon"></div></li>'+
        '<li id="pjs-image-selection-files-text-error">'+text['An error occured during the file upload']+'</li>'+
        '<li id="pjs-image-selection-files-text-upload">'+text['Upload files here']+'</li>'+
        '<li>(<div class="pjs-general-icon pjs-image-dialog-upload-icon-warning pjs-tooltip">'+
          '<span class="pjs-tooltiptext">'+text['Upload from local is for demo purposes only. It slows down the page and increases the file size.']+'</span>'+
        '</div>)</li>'+
      '</ul></a>'+
    '</div></label>'+
    '<input type="file" id="pjs-image-upload" style="display:none" multiple/>'+
    '<div class="pjs-io-dialog-section">'+
    '<div class="pjs-buttons pjs-image-selection-submit-wrapper"><button id="pjs-image-selection-submit">'+text['Upload']+'</button></div>'+
    '</div>'+
    '</div>'+
  '</div>';

}

ImageSelection.prototype._getParentContainer = function() {
  return this._canvas.getContainer();
};

ImageSelection.prototype.select = function(element) {

  // var source = prompt(this._translate('Input an image url'), '');

  const self = this;

  const container = this._container = domify(ImageSelection.IMAGE_SELECTION_MARKUP);

  const canvas = document.getElementById('canvas');

  canvas.insertBefore(container, canvas.firstChild);
  const mousePos = getMousePos(null);
  container.style.left = mousePos.pageX + 'px';
  container.style.top = mousePos.pageY + 'px';

  const inputField = document.getElementById('pjs-image-selection-input');
  const submitButton = document.getElementById('pjs-image-selection-submit');
  const imageUploadTextError = document.getElementById('pjs-image-selection-files-text-error');
  const imageUploadTextUpload = document.getElementById('pjs-image-selection-files-text-upload');
  const imageUploadTextList = document.getElementById('pjs-image-dialog-text-hint-list');
  const imageUploadReader = document.getElementById('pjs-image-upload');
  const modal = document.getElementById('pjs-image-selection-modal');
  var uploadTextListHeight = imageUploadTextList.style.height;

  var source, filesToUpload;
  inputField.focus();

  // remove modal by clicking anywhere else
  const canvasDefaultClick = domEvent.bind(canvas, 'click', function(ev) {
    if (modal) {
      const mousePos = getMousePos(ev);
      if ((mousePos.pageX > modal.offsetLeft+modal.clientWidth
          || mousePos.pageX < modal.offsetLeft)
          || (mousePos.pageY > modal.offsetTop+modal.clientHeight
          || mousePos.pageY < modal.offsetTop)) {
        removeImageSelectionModal();
      }
    }
  });

  // open file dialog
  domEvent.bind(imageUploadReader, 'change', async function(ev) {
    inputField.disabled = 'true';
    let uploadDisplayText;
    let uploadResultObj = await fileReader(null, imageUploadReader.files);
    let uploadResult = uploadResultObj.uploadResult;
    let errors = uploadResultObj.errors;
    if (!errors) {
      let uploadedFilesCount = (uploadResult.length) ? uploadResult.length : null;
      uploadDisplayText = uploadedFilesCount;
      if (isNaN(uploadedFilesCount) === false) {
        const plural =+ (uploadResult.length == 1) ? '' : 's'; // TODO translate s
        uploadDisplayText += ' ' + text['file'] + plural + ' ' + text['selected'];
        filesToUpload = uploadResult; // uploaded files are saved in global var
      }
      imageUploadTextList.style.height = uploadTextListHeight;
      imageUploadTextError.style.display = 'none';
      imageUploadTextUpload.innerHTML = uploadDisplayText;
      document.getElementsByClassName('pjs-image-dialog-upload-icon')[0].classList.remove('pjs-image-dialog-upload-icon-error');
    } else {
      uploadTextListHeight = imageUploadTextList.style.height;
      imageUploadTextList.style.display = 'auto';
      imageUploadTextError.style.display = 'block';
      imageUploadTextUpload.innerHTML = text['Upload again'];
      document.getElementsByClassName('pjs-image-dialog-upload-icon')[0].classList.add('pjs-image-dialog-upload-icon-error');
    }
  });

  // upload button
  domEvent.bind(submitButton, 'click', async function(ev) {
    let errors;
    source = filesToUpload;
    if (source) {
      for (const f in filesToUpload) {
        errors = updateImageSource(self, filesToUpload[f]);
      }
    } else if (!source) {
      source = inputField.value;
      errors = updateImageSource(self, source);
    }
    if (!errors) {
      removeImageSelectionModal();
    }
  });

  // enter pressed
  domEvent.bind(inputField, 'keyup', function(ev) {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      submitButton.click();
    }
  });

  function updateImageSource(self, source) {
    self._modeling.updateProperties(element, {
      source: source
    });
  }

  function removeImageSelectionModal() {
    if (modal && modal.parentNode) {
      modal.parentNode.removeChild(modal);
      if (canvasDefaultClick) {
        canvas.removeEventListener('click', canvasDefaultClick);
      }
    }
  }

};

ImageSelection.prototype.$inject = [
  'canvas',
  'eventBus',
  'modelng',
  'translate'
];