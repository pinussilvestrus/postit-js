import {
  domify,
  event as domEvent
} from 'min-dom';

import {
  fileReader,
  isImage,
} from '../../util/FileUtil.js';

import {
  getMousePosition
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
    'files': this._translate('files'),
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
    '<div class="pjs-io-dialog-section">'+
    '<div class="pjs-section-spacer"></div>'+
    '<label for="pjs-image-upload"><div class="pjs-io-dialog-text-hint">'+
      '<a style="display:block"><ul id="pjs-image-dialog-text-hint-list" class="pjs-horizontal">'+
        '<li><div class="pjs-general-icon pjs-image-dialog-upload-icon"></div></li>'+
        '<li id="pjs-image-selection-files-text-error">'+text['An error occured during the file upload']+'</li>'+
        '<li id="pjs-image-selection-files-text-upload">'+text['Upload files here']+'</li>'+
        '<li><div class="pjs-general-icon pjs-image-dialog-upload-icon-warning pjs-tooltip">'+
          '<span class="pjs-tooltiptext">'+text['Upload from local is for demo purposes only. It slows down the page and increases the file size.']+'</span>'+
        '</div></li>'+
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

ImageSelection.prototype.select = function(element, callback = null) {

  const self = this;

  const container = this._container = domify(ImageSelection.IMAGE_SELECTION_MARKUP);

  const canvas = document.getElementById('canvas');
  canvas.insertBefore(container, canvas.firstChild);

  const mousePosition = getMousePosition(null);
  container.style.left = mousePosition.pageX + 'px';
  container.style.top = mousePosition.pageY + 'px';

  const inputField = document.getElementById('pjs-image-selection-input'),
        submitButton = document.getElementById('pjs-image-selection-submit'),
        imageUploadTextError = document.getElementById('pjs-image-selection-files-text-error'),
        imageUploadTextUpload = document.getElementById('pjs-image-selection-files-text-upload'),
        imageUploadTextList = document.getElementById('pjs-image-dialog-text-hint-list'),
        imageUploadReader = document.getElementById('pjs-image-upload'),
        modal = document.getElementById('pjs-image-selection-modal');

  var uploadTextListHeight = imageUploadTextList.style.height;

  var source, filesToUpload;

  // focus url input field on modal open
  inputField.focus();

  // remove modal by clicking anywhere else
  const canvasDefaultClick = domEvent.bind(canvas, 'click', function(ev) {
    if (modal) {
      const mousePos = getMousePosition(ev);
      if ((mousePos.pageX > modal.offsetLeft+modal.clientWidth
          || mousePos.pageX < modal.offsetLeft)
          || (mousePos.pageY > modal.offsetTop+modal.clientHeight
          || mousePos.pageY < modal.offsetTop)) {
        removeImageSelectionModal();
      }
    }
  });

  // open file dialog
  domEvent.bind(imageUploadReader, 'change', async function() {
    inputField.disabled = 'true';

    let uploadDisplayText;

    let uploadResultObj = await fileReader(null, imageUploadReader.files),
        uploadResult = uploadResultObj.results,
        errors = uploadResultObj.errors;

    if (!errors) {
      let uploadedFilesCount = (uploadResult.length) ? uploadResult.length : null;
      uploadDisplayText = uploadedFilesCount;

      if (isNaN(uploadedFilesCount) === false) {

        const filePluralText =+ (uploadResult.length == 1) ? text['file'] : text['files'];
        uploadDisplayText += ' ' + filePluralText + ' ' + text['selected'];

        // uploaded files are saved in global var
        filesToUpload = uploadResult;
      }

      displayUploadStaging(uploadDisplayText);
    } else {
      displayError();
    }
  });

  // upload button
  domEvent.bind(submitButton, 'click', async function() {
    source = filesToUpload;

    // (1) call from canvas, providing a target element
    if (element !== null) {

      // (1.1) local file selection upload
      if (source) {
        for (const f in filesToUpload) {
          updateImageSource(self, filesToUpload[f]);
        }

      // (1.2) url upload
      } else {
        const url = inputField.value.trim();
        source = await isImage(url) ? url : '';
        updateImageSource(self, source);
      }

      self._eventBus.fire('imageSelection.complete', { element: element });

    // (2) external call w/o canvas target
    } else {

      // (2.1 default) local file selection data is used

      // (2.2) url upload
      if (!source) {
        const url = inputField.value.trim();
        source = await isImage(url) ? url : '';
      }

      callback(source);
    }

    // error handling not necessary as default img will be shown in error situation
    removeImageSelectionModal();
  });

  // enter pressed
  domEvent.bind(inputField, 'keyup', function(esvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      submitButton.click();
    }
  });

  function displayUploadStaging(text) {
    imageUploadTextList.style.height = uploadTextListHeight;
    imageUploadTextError.style.display = 'none';
    imageUploadTextUpload.innerHTML = text;

    document.getElementsByClassName('pjs-image-dialog-upload-icon')[0].classList.remove('pjs-image-dialog-upload-icon-error');
  }

  function displayError() {
    uploadTextListHeight = imageUploadTextList.style.height;

    imageUploadTextList.style.height = 'auto';
    imageUploadTextError.style.display = 'block';
    imageUploadTextUpload.innerHTML = text['Upload again'];

    document.getElementsByClassName('pjs-image-dialog-upload-icon')[0].classList.add('pjs-image-dialog-upload-icon-error');
  }

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
