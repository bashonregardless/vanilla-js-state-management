import store from './store/index.js'; 

// Load up components
import Cell from './components/cell.js';
import DraggableNode from './components/genericDraggableNode.js';

// Instantiate components
const cell = new Cell();
const draggableNode = new DraggableNode();

// Initial renders
cell.render();
draggableNode.render();

const svgDraggableNode = document.querySelector('svg rect[data-drag="draggableNode"]');

var selectedElement = false, offset;
svgDraggableNode.addEventListener('mousedown', startDrag);
svgDraggableNode.addEventListener('mousemove', drag);
svgDraggableNode.addEventListener('mouseup', endDrag);
svgDraggableNode.addEventListener('mouseleave', endDrag);
function startDrag(evt) {
  if (evt.target.classList.contains('draggable')) {
	console.log('inside startDrag');
	selectedElement = evt.target;
	offset = getMousePosition(evt);
	offset.x -= parseFloat(selectedElement.getAttributeNS(null, "x"));
	offset.y -= parseFloat(selectedElement.getAttributeNS(null, "y"));
  }
}

function getMousePosition(evt) {
  console.log('inside getMousePosition');
  var CTM = svgDraggableNode.getScreenCTM();
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
  }
}
function endDrag(evt) {
  console.log('inside drag');
  selectedElement = null;
}

