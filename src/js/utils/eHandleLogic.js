/* NOTE that the code in this entire file was part of main.js.
* It has been moved here as part of code cleanup process.
* Refer commit message for gist
*/
const svgDraggableNode = document.querySelector('svg.genericNodeSvg rect[data-drag="draggableNode"]');
const foreignObjectDraggable = document.querySelectorAll('svg.chart-svg foreignObject[data-drag="draggableNode"]');

var selectedElement = false, offset, el;

foreignObjectDraggable.forEach(node => {
  node.addEventListener('mousedown', startDrag);
  node.addEventListener('mousemove', drag);
  node.addEventListener('mouseup', endDrag);
  node.addEventListener('mouseleave', endDrag);
  node.addEventListener('click', onClickInsertLeaf);
})

function onClickInsertLeaf(evt) {
  el = evt.target.classList.contains('cell') ? evt.target.parentElement : evt.target;
  const nodeId = el.getAttributeNS("", 'data-nodeid');
  store.dispatch('insertLeaf', { 
	parentId: nodeId, 
	['newNode']: {
	  id: 'newNode',
	  connectedNodes: []
	}
  });
}

function startDrag(evt) {
  el = evt.target.classList.contains('cell') ? evt.target.parentElement : evt.target;
  console.log(el, el.classList);
  //if (evt.target.classList.contains('draggable')) {
  if (el.classList.contains('draggable')) {
	console.log('inside startDrag');
	selectedElement = el;
	offset = getMousePosition(evt);
	offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
	offset.y -= parseFloat(selectedElement.getAttributeNS(null, "y"));
  }
}

function getMousePosition(evt) {
  console.log('inside getMousePosition');
  //var CTM = evt.target.getScreenCTM();
  var CTM = selectedElement.getScreenCTM();
  return {
	x: (evt.clientX - CTM.e) / CTM.a,
	y: (evt.clientY - CTM.f) / CTM.d
  };
}

function drag(evt) {
  if (selectedElement) {
	console.log('inside drag');
	evt.preventDefault();
	var coord = getMousePosition(evt);
	selectedElement.setAttributeNS(null, "x", coord.x - offset.x);
	selectedElement.setAttributeNS(null, "y", coord.y - offset.y);
	const nodeId = selectedElement.getAttributeNS("", 'data-nodeid');
	const posX = selectedElement.getAttributeNS(null, 'x');
	const posY = selectedElement.getAttributeNS(null, 'y');
	store.state.nodeLookup[nodeId].forwardEdges.forEach(function renderEdges(connection, index) {
	  store.dispatch('reposition', {posX, posY, nodeId});
	});
  }
}

function endDrag(evt) {
  console.log('inside end drag');
  selectedElement = null;
}

