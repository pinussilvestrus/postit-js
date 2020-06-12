export function getMousePosition(event) {
  event = event || window.event;

  var pageX = event.pageX;
  var pageY = event.pageY;

  // IE 8
  if (pageX === undefined) {
    pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return { pageX, pageY };
}

