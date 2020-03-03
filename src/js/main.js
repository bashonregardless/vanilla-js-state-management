import store from './store/index.js'; 

// Load up components
import Cell from './components/cell.js';
import DraggableNode from './components/genericDraggableNode.js';
import TreeEdges from './components/treeEdges.js';

// Instantiate components
const cell = new Cell();
const draggableNode = new DraggableNode();

// Initial renders
cell.render();
draggableNode.render();

const chartSvg = document.querySelector('.chart-svg');
const treeEdgesGroup= document.createElementNS("http://www.w3.org/2000/svg", 'g');
chartSvg.appendChild(treeEdgesGroup);
treeEdgesGroup.setAttribute('class', 'treeEdge-connections');

Object.values(store.state.nodeLookup).forEach(function renderTreeEdges(node) {
  const treeEdgesCount = node.forwardEdges.length;
  node.forwardEdges.forEach(function renderEdges(connection, index) {
	const pathEl= document.createElementNS("http://www.w3.org/2000/svg", 'g');
	treeEdgesGroup.appendChild(pathEl);
	treeEdgesGroup.setAttribute('class', `treeEdge-${node.id}-${connection.id}`);
	const treeEdges = new TreeEdges({ element: pathEl, node, connection, index, treeEdgesCount });
	treeEdges.render();
  });
});


const svgDraggableNode = document.querySelector('svg.genericNodeSvg rect[data-drag="draggableNode"]');
const chartItemDraggable = document.querySelectorAll('svg.chart-svg foreignObject[data-drag="draggableNode"]');

//const draggableNodes = [svgDraggableNode, chartItemDraggable];
var selectedElement = false, offset, el;
chartItemDraggable.forEach(node => {
  node.addEventListener('mousedown', startDrag);
  node.addEventListener('mousemove', drag);
  node.addEventListener('mouseup', endDrag);
  node.addEventListener('mouseleave', endDrag);
})

svgDraggableNode.addEventListener('mousedown', startDrag);
svgDraggableNode.addEventListener('mousemove', drag);
svgDraggableNode.addEventListener('mouseup', endDrag);
svgDraggableNode.addEventListener('mouseleave', endDrag);

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

