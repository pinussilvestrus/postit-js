import $ from 'jquery';

import '../../resources/bpmn-font/css/bpmn.css';
import '../../resources/diagram-js.css';
import '../../resources/postit-js.css';

import PostItModeler from '../../lib/Modeler';

import diagramXML from '../resources/newDiagram.postit';

// modeler instance
var modeler = new PostItModeler({
  container: '#canvas',
  keyboard: {
    bindTo: window
  }
});


function exportDiagram() {

  modeler.saveXML({ format: true }, function(err, xml) {

    if (err) {
      return console.error('could not save postit diagram', err);
    }

    alert('Diagram exported. Check the developer tools!');

    console.log('DIAGRAM', xml);
  });
}


function openDiagram(bpmnXML) {

  // import diagram
  modeler.importXML(bpmnXML, function(err) {

    if (err) {
      return console.error('could not import postit diagram', err);
    }
  });
}


openDiagram(diagramXML);

// wire save button
$('#save-button').click(exportDiagram);