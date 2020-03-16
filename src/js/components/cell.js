import Proto from '../utils/helpers/proto.js';

import Component from '../lib/component.js';
import TreeEdges from './treeEdges.js';

import store from '../store/index.js';
import { DIMENSION } from '../utils/constants.js';

var Cell = function(props = {}) {
  var obj = {
	props: {
	  store,
	  element: document.querySelector('#root'),
	  subscribeEvent: '',
	},

	componentDidMount() {
	  const foreignObjectDraggable = 
		document.querySelectorAll('svg.chart-svg foreignObject[data-drag="draggableNode"]');

	  var selectedElement = false, offset, el;
	  foreignObjectDraggable.forEach(node => {
		node.addEventListener('mousedown', startDrag);
		node.addEventListener('mousemove', drag);
		node.addEventListener('mouseup', endDrag);
		node.addEventListener('mouseleave', endDrag);
		//node.addEventListener('click', onClickInsertLeaf);
	  })

	  function onClickInsertLeaf(evt) {
		el = evt.target.classList.contains('cell') 
		  ? evt.target.parentElement
		  : evt.target;
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
		}
	  }

	  function endDrag(evt) {
		console.log('inside end drag');
		const nodeId = selectedElement.getAttributeNS("", 'data-nodeid');
		const posX = selectedElement.getAttributeNS(null, 'x');
		const posY = selectedElement.getAttributeNS(null, 'y');
		store.state.nodeLookup[nodeId].forwardEdges.forEach(function renderEdges(connection, index) {
		  //store.dispatch('reposition', {posX, posY, nodeId});
		  store.dispatch('updateEdge', {posX, posY, nodeId});
		});
		selectedElement = null;
	  }

	},

	calSVGWidth () {
	  const { minX: min, maxX: max } = store.state;
	  return DIMENSION.chartXMargin + Math.abs(min) + max
	},

	calSVGHeight () {
	  return DIMENSION.chartYMargin + store.state.maxY;
	},

	insertNode () {
	  var nodesHTML = '';
	  function drawNode (currNode) {
		const { id } = currNode;
		const { position, connectedNodes } = currNode;
		const { x, y } = position;
		var htmlStr = `
		  <foreignObject
			id="item-${id}"
			data-nodeid="${id}"
			x="${x}"
			y="${y}"
			width="300"
			height="200"
			class="draggable"
			data-drag="draggableNode"
		  >
			<div class="cell">${id}</div>
		  </foreignObject>
		`
		nodesHTML += htmlStr;
		connectedNodes.forEach(drawNode);
	  }
	  drawNode(store.state.nodes);
	  return nodesHTML;
	},

	render() {
	  /**
	   * React to state changes and render the component's HTML
	   *
	   * @returns {void}
	   */

	  //this.element.innerHTML = `
	  return
		`<svg 
			viewBox={-((this.calSVGWidth() - 300) / 2) 0 this.calSVGWidth() this.calSVGHeight()}
			width={this.calSVGWidth()}
			height={this.calSVGHeight()}
			class="chart-svg"
			preserveAspectRatio="xMinYMin meet"
		  >
			<g id="node-group">
			  { this.insertNode() }
			</g>
			<TreeEdges />
		  </svg>`;
	  //`<svg 
	  //  	viewBox="-${(this.calSVGWidth() - 300) / 2} 0 ${this.calSVGWidth()} ${this.calSVGHeight()}"
	  //  	width="${this.calSVGWidth()}"
	  //  	height="${this.calSVGHeight()}"
	  //  	class="chart-svg"
	  //  	preserveAspectRatio="xMinYMin meet"
	  //    >
	  //  	<g id="node-group">
	  //  	  ${ this.insertNode() }
	  //  	</g>
	  //  	<TreeEdges />
	  //    </svg>
	  //  `
	},
  }

  return Proto.create(
	Component.init.call(obj, obj.props)
  )
}

export default Cell;
