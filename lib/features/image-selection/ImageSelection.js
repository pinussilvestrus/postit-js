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

}

ImageSelection.prototype._getParentContainer = function() {
  return this._canvas.getContainer();
};


ImageSelection.IMAGE_SELECTION_MARKUP = '<div id="image-selection-modal" class="io-dialog-local">'+
    '<div class="io-dialog-section first">'+
      '<div class="image-selection-input-wrapper"><input id="image-selection-input" class="bordered-element"></input></div>'+
      '<div class="labeled-input">'+
      '<label for="image-selection-input" class="static-value"><!--Search / -->URL:</label>'+
      '</div>'+
    '</div">'+
    '<div>'+
      '<!--<div class="row image-selection-preview io-dialog-section">'+
      '<div class="col-xs"><div class="box-row"></div></div>'+
      '</div>-->'+
    '</div>'+
    '<div class="io-dialog-section">'+
    '<div class="line-spacer"></div>'+
    '<label for="image-upload"><div class="io-dialog-text-hint">'+
      '<a style="display:block"><ul id="image-dialog-text-hint-list" class="horizontal">'+
        '<li><div class="image-dialog-upload-icon"></div></li>'+
        '<li id="image-selection-files-text-error">An error occured during the file upload.</li>'+
        '<li id="image-selection-files-text-upload">Upload files here</li>'+
      '</ul></a>'+
    '</div></label>'+
    '<input type="file" id="image-upload" style="display:none" multiple/>'+
    '<div class="io-dialog-section">'+
    '<div class="buttons image-selection-submit-wrapper"><button id="image-selection-submit">Upload</button></div>'+
    '</div>'+
    '</div>'+
  '</div>';

ImageSelection.prototype.select = function(element) {

  // var source = prompt(this._translate('Input an image url'), '');

  const self = this;

  const container = this._container = domify(ImageSelection.IMAGE_SELECTION_MARKUP);

  const canvas = document.getElementById('canvas');

  canvas.insertBefore(container, canvas.firstChild);
  const mousePos = getMousePos(null);
  container.style.left = mousePos.pageX + 'px';
  container.style.top = mousePos.pageY + 'px';

  const inputField = document.getElementById('image-selection-input');
  const submitButton = document.getElementById('image-selection-submit');
  const imageUploadTextError = document.getElementById('image-selection-files-text-error');
  const imageUploadTextUpload = document.getElementById('image-selection-files-text-upload');
  const imageUploadTextList = document.getElementById('image-dialog-text-hint-list');
  const imageUploadReader = document.getElementById('image-upload');
  const modal = document.getElementById('image-selection-modal');
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
        const plural =+ (uploadResult.length == 1) ? '' : 's';
        uploadDisplayText += ' file'+ plural + ' selected';
        filesToUpload = uploadResult; // uploaded files are saved in global var
      }
      imageUploadTextList.style.height = uploadTextListHeight;
      imageUploadTextError.style.display = 'none';
      imageUploadTextUpload.innerHTML = uploadDisplayText;
      document.getElementsByClassName('image-dialog-upload-icon')[0].classList.remove('image-dialog-upload-icon-error');
    } else {
      uploadTextListHeight = imageUploadTextList.style.height;
      imageUploadTextList.style.display = 'auto';
      imageUploadTextError.style.display = 'block';
      imageUploadTextUpload.innerHTML = 'Upload again';
      document.getElementsByClassName('image-dialog-upload-icon')[0].classList.add('image-dialog-upload-icon-error');
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