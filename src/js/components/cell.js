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

	self.element.innerHTML = `
	<svg viewBox="0 0 2000 2000" width="2000" height="2000">
		${store.state.nodes.map(item => {
		  return `
		  <g>
			<foreignObject x="${calcX(item.xCell)}" y="${((item.depth - 1) * 200) + 60}" width="160" height="160">
			  <div class="cell">text</div>
			</foreignObject>
			</g>
		  `
		}).join('')}
	</svg>
	  `;
	}
}
