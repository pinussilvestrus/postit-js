import {
  find,
  forEach
} from 'min-dash';

import Refs from 'object-refs';

import {
  elementToString
} from './Util';

var diRefs = new Refs(
  { name: 'boardElement', enumerable: true },
  { name: 'di', configurable: true }
);

/**
 * Returns true if an element has the given meta-model type
 *
 * @param  {ModdleElement}  element
 * @param  {String}         type
 *
 * @return {Boolean}
 */
function is(element, type) {
  return element.$instanceOf(type);
}


/**
 * Find a suitable display candidate for definitions where the DI does not
 * correctly specify one.
 */
function findDisplayCandidate(definitions) {
  return find(definitions.rootElements, function(e) {
    return is(e, 'postit:PostitBoard');
  });
}


export default function PostitTreeWalker(handler, translate) {

  // list of elements to handle deferred to ensure
  // prerequisites are drawn
  var deferred = [];

  // Helpers //////////////////////

  function visitRoot(element, diagram) {
    return handler.root(element, diagram);
  }

  function logError(message, context) {
    handler.error(message, context);
  }

  // DI handling //////////////////////

  function registerDi(di) {
    var boardElement = di.boardElement;

    if (boardElement) {
      if (boardElement.di) {
        logError(
          translate('multiple DI elements defined for {element}', {
            element: elementToString(boardElement)
          }),
          { element: boardElement }
        );
      } else {
        diRefs.bind(boardElement, 'di');
        boardElement.di = di;
      }
    } else {
      logError(
        translate('no boardElement referenced in {element}', {
          element: elementToString(di)
        }),
        { element: di }
      );
    }
  }

  function handleDiagram(diagram) {
    handlePlane(diagram.plane);
  }

  function handlePlane(plane) {
    registerDi(plane);

    forEach(plane.planeElement, handlePlaneElement);
  }

  function handlePlaneElement(planeElement) {
    registerDi(planeElement);
  }


  // Semantic handling //////////////////////

  /**
   * Handle definitions and return the rendered board (if any)
   *
   * @param {ModdleElement} definitions to walk and import
   * @param {ModdleElement} [rootBoard] specific board to import and display
   *
   * @throws {Error} if no diagram to display could be found
   */
  function handleDefinitions(definitions, rootBoard) {

    // make sure we walk the correct boardElement

    var rootBoards = definitions.rootBoards;

    if (rootBoard && rootBoards.indexOf(rootBoard) === -1) {
      throw new Error(translate('rootBoard not part of postit:Definitions'));
    }

    if (!rootBoard && rootBoards && rootBoards.length) {
      rootBoard = rootBoards[0];
    }

    // no root board -> nothing to import
    if (!rootBoard) {
      throw new Error(translate('no rootBoard to display'));
    }

    // load DI from selected root board only
    handleDiagram(rootBoard);


    var plane = rootBoard.plane;

    if (!plane) {
      throw new Error(translate(
        'no plane for {element}',
        { element: elementToString(rootBoard) }
      ));
    }

    var rootElement = plane.boardElement;

    // ensure we default to a suitable display candidate (process or collaboration),
    // even if non is specified in DI
    if (!rootElement) {
      rootElement = findDisplayCandidate(definitions);

      if (!rootElement) {
        throw new Error(translate('no process or collaboration to display'));
      } else {

        logError(
          translate('correcting missing boardElement on {plane} to {rootElement}', {
            plane: elementToString(plane),
            rootElement: elementToString(rootElement)
          })
        );

        // correct DI on the fly
        plane.boardElement = rootElement;
        registerDi(plane);
      }
    }


    visitRoot(rootElement, plane);

    // handle all deferred elements
    handleDeferred(deferred);
  }

  function handleDeferred() {

    var fn;

    // drain deferred until empty
    while (deferred.length) {
      fn = deferred.shift();

      fn();
    }
  }




  // API //////////////////////

  return {
    handleDeferred: handleDeferred,
    handleDefinitions: handleDefinitions,
    registerDi: registerDi
  };
}