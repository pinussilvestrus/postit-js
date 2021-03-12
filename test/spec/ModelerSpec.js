import Modeler from 'lib/Modeler';

import Viewer from 'lib/Viewer';

import TestContainer from 'mocha-test-container-support';

import {
  setPostitJS,
  clearPostitJS,
  insertCSS
} from 'test/TestHelper';

import simpleXML from 'test/fixtures/simple.xml';

import complexXML from 'test/fixtures/complex.xml';

import emptyXML from 'test/fixtures/empty.xml';

var singleStart = window.__env__ && window.__env__.SINGLE_START === 'modeler';

insertCSS('postit-js.css', require('assets/postit-js.css').default);


describe('Modeler', function() {

  var container;

  var modeler;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  function createModeler(xml) {

    clearPostitJS();

    modeler = new Modeler({
      container: container,
      keyboard: {
        bindTo: document
      }
    });

    setPostitJS(modeler);

    return modeler.importXML(xml).then(function(result) {
      return { error: null, warnings: result.warnings, modeler: modeler };
    }).catch(function(err) {
      return { error: err, warnings: err.warnings, modeler: modeler };
    });
  }


  (singleStart ? it.only : it)('should import simple board', function() {
    return createModeler(simpleXML).then(function(result) {

      expect(result.error).not.to.exist;
    });
  });


  it('should import complex', function() {
    return createModeler(complexXML).then(function(result) {

      expect(result.error).not.to.exist;
    });
  });


  it('should not import empty definitions', function() {

    // given
    return createModeler(emptyXML).then(function(result) {

      var modeler = result.modeler;

      // when
      return modeler.importXML(emptyXML);
    }).catch(function(err) {

      // then
      expect(err.message).to.equal('no rootBoard to display');
    });
  });


  it('should re-import simple board', function() {

    // given
    return createModeler(simpleXML).then(function(result) {

      var modeler = result.modeler;

      // when
      // mimic re-import of same diagram
      return modeler.importXML(simpleXML);
    }).then(function(result) {

      var warnings = result.warnings;

      // then
      expect(warnings).to.be.empty;
    });
  });


  describe('editor actions support', function() {

    it('should ship all actions', function() {

      // given
      var expectedActions = [
        'undo',
        'redo',
        'copy',
        'paste',
        'stepZoom',
        'zoom',
        'removeSelection',
        'moveCanvas',
        'moveSelection',
        'selectElements',
        'spaceTool',
        'lassoTool',
        'handTool',
        'alignElements',
        'setColor',
        'directEditing',
        'moveToOrigin'
      ];

      var modeler = new Modeler();

      // when
      var editorActions = modeler.get('editorActions');

      // then
      var actualActions = editorActions.getActions();

      expect(actualActions).to.eql(expectedActions);
    });

  });


  describe('configuration', function() {

    // given
    it('should configure Canvas', function() {

      // given
      var modeler = new Modeler({
        container: container,
        canvas: {
          deferUpdate: true
        }
      });

      // when
      return modeler.importXML(simpleXML).then(function() {

        var canvasConfig = modeler.get('config.canvas');

        // then
        expect(canvasConfig.deferUpdate).to.be.true;
      });
    });
  });


  it('should handle errors', function() {

    var xml = 'invalid stuff';

    var modeler = new Modeler({ container: container });

    return modeler.importXML(xml).catch(function(err) {

      expect(err).to.exist;
    });
  });


  it('should create new diagram', function() {
    var modeler = new Modeler({ container: container });
    return modeler.createDiagram();
  });


  describe('dependency injection', function() {

    it('should provide self as <postitjs>', function() {

      // when
      return createModeler(simpleXML).then(function(result) {

        var modeler = result.modeler;
        var err = result.error;

        if (err) {
          throw err;
        }

        // then
        expect(modeler.get('postitjs')).to.equal(modeler);
      });
    });


    it('should inject mandatory modules', function() {

      // when
      return createModeler(simpleXML).then(function(result) {

        var modeler = result.modeler;
        var err = result.error;

        // then

        if (err) {
          throw err;
        }

        expect(modeler.get('alignElements')).to.exist;
        expect(modeler.get('autoScroll')).to.exist;
        expect(modeler.get('postitCopyPaste')).to.exist;
        expect(modeler.get('contextPad')).to.exist;
        expect(modeler.get('copyPaste')).to.exist;
        expect(modeler.get('alignElements')).to.exist;
        expect(modeler.get('editorActions')).to.exist;
        expect(modeler.get('keyboard')).to.exist;
        expect(modeler.get('keyboardMoveSelection')).to.exist;
        expect(modeler.get('labelEditingProvider')).to.exist;
        expect(modeler.get('modeling')).to.exist;
        expect(modeler.get('move')).to.exist;
        expect(modeler.get('paletteProvider')).to.exist;
        expect(modeler.get('resize')).to.exist;
        expect(modeler.get('snapping')).to.exist;
        expect(modeler.get('imageSelection')).to.exist;
        expect(modeler.get('canvasCreate')).to.exist;
      });

    });

  });


  it('should expose Viewer', function() {
    expect(Modeler.Viewer).to.equal(Viewer);
  });

});
