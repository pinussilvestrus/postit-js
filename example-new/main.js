import $ from 'jquery';

import 'postit-js-core/assets/postit-js.css';
import PostItModeler from 'postit-js-core/lib/Modeler';

import newBoardXML from './resources/newBoard.xml';
import emptyBoardXML from './resources/emptyBoard.xml';

import './style.css';

// modeler instance
var modeler = new PostItModeler({
  container: '#canvas',
  keyboard: {
    bindTo: window,
  }
});

/* screen interaction */
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

const state = {
  fullScreen: false,
  keyboardHelp: false,
};
document.getElementById('js-toggle-fullscreen').addEventListener('click', function() {
  state.fullScreen = !state.fullScreen;
  if (state.fullScreen) {
    enterFullscreen(document.documentElement);
  } else {
    exitFullscreen();
  }
});
document.getElementById('js-toggle-keyboard-help').addEventListener('click', function() {
  state.keyboardHelp = !state.keyboardHelp;
  let displayProp = 'none';
  if (state.keyboardHelp) {
    displayProp = 'block';
  }
  document.getElementById('io-dialog-main').style.display = displayProp;
});
document.getElementById('io-dialog-main').addEventListener('click', function() {
  state.keyboardHelp = !state.keyboardHelp;
  let displayProp = 'none';
  if (!state.keyboardHelp) {
    document.getElementById('io-dialog-main').style.display = displayProp;
  }
});

/* file functions */
function openFile(file, callback) {

  // check file api availability
  if (!window.FileReader) {
    return window.alert(
      'Looks like you use an older browser that does not support drag and drop. ' +
      'Try using a modern browser such as Chrome, Firefox or Internet Explorer > 10.');
  }

  // no file chosen
  if (!file) {
    return;
  }

  var reader = new FileReader();

  reader.onload = function(e) {

    var xml = e.target.result;

    callback(xml);
  };

  reader.readAsText(file);
}

var fileInput = $('<input type="file" />').appendTo(document.body).css({
  width: 1,
  height: 1,
  display: 'none',
  overflow: 'hidden'
}).on('change', function(e) {
  openFile(e.target.files[0], openBoard);
});


function openBoard(xml) {

  // import board
  modeler.importXML(xml).catch(function(err) {
    if (err) {
      return console.error('could not import postit board', err);
    }
  });
}

function saveSVG() {
  return modeler.saveSVG();
}

function saveBoard() {
  return modeler.saveXML({ format: true });
}

// bootstrap board functions
$(function() {

  var downloadLink = $('#js-download-board');
  var downloadSvgLink = $('#js-download-svg');

  var openNew = $('#js-open-new');
  var openExistingBoard = $('#js-open-board');

  $('.buttons a').click(function(e) {
    if (!$(this).is('.active')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);

    if (data) {
      link.addClass('active').attr({
        'href': 'data:application/xml;charset=UTF-8,' + encodedData,
        'download': name
      });
    } else {
      link.removeClass('active');
    }
  }

  var exportArtifacts = debounce(function() {

    saveSVG().then(function(result) {
      setEncoded(downloadSvgLink, 'board.svg', result.svg);
    });

    saveBoard().then(function(result) {
      setEncoded(downloadLink, 'board.xml', result.xml);
    });
  }, 500);

  modeler.on('commandStack.changed', exportArtifacts);

  openNew.on('click', function() {
    openBoard(emptyBoardXML);
  });

  openExistingBoard.on('click', function() {
    var input = $(fileInput);

    // clear input so that previously selected file can be reopened
    input.val('');
    input.trigger('click');
  });

});

// bootstrapping
initSentry();
initGA();

openBoard(newBoardXML);


// helpers //////////////////////

function debounce(fn, timeout) {
  var timer;

  return function() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, timeout);
  };
}

function initSentry() {
  if (import.meta.env.SENTRY_DSN && import.meta.env.SOURCE_VERSION && typeof Sentry !== 'undefined') {
    Sentry.init({
      dsn: import.meta.env.SENTRY_DSN,
      release: import.meta.env.SOURCE_VERSION
    });

    // TEST
    // Sentry.captureException(new Error('Something broke'));
  }
}

function initGA() {
  window.dataLayer = window.dataLayer || [];
  function gtag() {dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-72700874-2');
}
