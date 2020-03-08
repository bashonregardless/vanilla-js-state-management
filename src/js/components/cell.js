import Component from '../lib/component.js';
import store from '../store/index.js';
import { DIMENSION } from '../utils/constants.js';

export default class Status extends Component {
  constructor() {
	super({
	  store,
	  element: document.querySelector('.js-status'),
	  subscribeEvent: 'cell-js'
	});
  }

  /**
   * React to state changes and render the component's HTML
   *
   * @returns {void}
   */
  render() {
	let self = this;

	function calSVGWidth () {
	  const { minX: min, maxX: max } = store.state;
	  return DIMENSION.chartXMargin + Math.abs(min) + max
	}

	function calSVGHeight () {
	  return DIMENSION.chartYMargin + store.state.maxY;
	}

	function insertNode () {
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
	}

	self.element.innerHTML = `
	<svg viewBox="-${(calSVGWidth() - 300) / 2} 0 ${calSVGWidth()} ${calSVGHeight()}"
	  width="${calSVGWidth()}"
	  height="${calSVGHeight()}"
	  class="chart-svg"
	  preserveAspectRatio="xMinYMin meet"
	>
	  <g id="node-group">
		${ insertNode() }
	  </g>
	</svg>`;
  }
}
