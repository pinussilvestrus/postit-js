import {
  domify,
} from 'min-dom';

export default function TopModal(canvas, translate) {

  this._canvas = canvas;
  this._translate = translate;

  TopModal.HTML_MARKUP = '<div id="pjs-top-modal-wrapper" class="pjs-wrapper"><div class="pjs-wrapper-inner"><div id="pjs-top-modal" class="pjs-ui-element-bordered"></div></div></div>';

  const canvasDOM = document.getElementById('canvas');

  const container = this._container = domify(TopModal.HTML_MARKUP);

  canvasDOM.insertBefore(container, canvas.firstChild);

  this.modalWrapperDOM = document.getElementById('pjs-top-modal-wrapper');
  this.modalDOM = document.getElementById('pjs-top-modal');

}

TopModal.prototype.$inject = [
  'canvas',
  'translate'
];

/**
 * displaySuccessModal
 *
 * @param {String} text
 *
 * @returns
 */
TopModal.prototype.displaySuccessModal = function(text) {
  this.modalWrapperDOM.classList.add('pjs-visible');
  this.modalDOM.classList.add('pjs-success-box');
  this.modalDOM.classList.add('pjs-top-modal-fadeinout');

  this.modalDOM.innerHTML = text;
  const self = this;
  setTimeout(() => {
    self.modalDOM.classList.remove('pjs-top-modal-fadeinout');
    self.modalWrapperDOM.classList.remove('pjs-visible');
  }, 3000);
};

/**
 * displayErrorModal
 *
 * @param {String} text
 *
 * @returns
 */
TopModal.prototype.displayErrorModal = function(text) {
  this.modalWrapperDOM.classList.add('pjs-visible');
  this.modalDOM.classList.add('pjs-error-box');
  this.modalDOM.classList.add('pjs-top-modal-fadeinout');

  this.modalDOM.innerHTML = text;
  const self = this;
  setTimeout(() => {
    self.modalDOM.classList.remove('pjs-top-modal-fadeinout');
    self.modalWrapperDOM.classList.remove('pjs-visible');
  }, 3000);
};

