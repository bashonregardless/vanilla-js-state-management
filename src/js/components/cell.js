import Component from '../lib/component.js';
import store from '../store/index.js';

export default class Status extends Component {
  constructor() {
	super({
	  store,
	  element: document.querySelector('.js-status')
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
	  return 200 + Math.abs(min) + max
	}

	function calSVGHeight () {
	  return 200 + store.state.maxY;
	}

	function insertNode (node) {
	  var flat = [];
	  function drawNode (curr) {
		const { id , position, connectedNodes } = curr;
		const { x, y } = position;
		flat.push(`
		<g id="${id}">
		  <foreignObject 
			id="item-${id}"
			x="${x}"
			y="${y}"
			width="180"
			height="100"
			class="draggable"
			data-drag="draggableNode"
		  >
			<div class="cell">${id}</div>
		  </foreignObject>
		</g>
		`)
		connectedNodes.forEach(drawNode);
	  }
	  drawNode(node);
	  return flat;
	}

	self.element.innerHTML = `
	<svg viewBox="-${calSVGWidth() / 2 - 300} 0 ${calSVGWidth()} ${calSVGHeight()}"
	  width="${calSVGWidth()}"
	  height="${calSVGHeight()}"
	  class="chart-svg"
	>
	  ${insertNode(store.state.nodes).join('')}
	</svg>`;
  }
}
