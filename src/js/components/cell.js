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

	function calcX (xCell) {
	  if (xCell === 0) {
		return 1000;
	  }
	  if (xCell < 0) {
		return 1000 - (Math.abs(xCell) * 300) - 60;
	  }
	  if (xCell > 0) {
		return 1000 + (xCell * 300) + 60;
	  }
	}

	function getX1 (xCell) {
	  if (xCell === 0)
		return 1000 + (xCell * 300) + (300 / 2);

	  if (xCell < 0)
		return 1000 - (Math.abs(xCell) * 300) + (300 / 2) - (Math.abs(xCell) * 60); 

	  if (xCell >= 0)
		return 1000 + (xCell * 300) + (300 / 2) + (xCell * 60);
	}

	function getX2 (xcell) {
	  if (xcell === 0)
		return 1000 + (xcell * 300) + (300 / 2);

	  if (xcell < 0)
		return 1000 - (Math.abs(xcell) * 300) + (300 / 2) - (Math.abs(xcell) * 60); 

	  if (xcell >= 0)
		return 1000 + (xcell * 300) + (300 / 2) + (xcell * 60);
	}

	function getY1 (depth) {
	  return ((depth) * 240) - 60
	}

	function getY2 (depth) {
	  return ((depth) * 240)
	}

	self.element.innerHTML = `
	<svg viewBox="0 0 2000 2000" width="2000" height="2000">
		${store.state.nodes.map(item => {
		  return `
		  <g id="${item.id}">
			<foreignObject x="${calcX(item.xCell)}" y="${((item.depth - 1) * 240)}" width="300" height="180">
			  <div class="cell">text</div>
			</foreignObject>
			${ item.outdegree === 1 && `
			  <line x1="${getX1(item.xCell)}" y1="${getY1(item.depth)}" x2="${getX2(item.xCell)}" y2="${getY2(item.depth)}" stroke="black" />
			` }
		  </g>
		  `
		}).join('')}
	</svg>`;
  }
}
