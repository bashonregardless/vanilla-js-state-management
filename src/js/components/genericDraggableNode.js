import Component from '../lib/component.js';
import store from '../store/index.js';

export default class Status extends Component {
  constructor() {
	super({
	  store,
	  element: document.querySelector('.draggable-container')
	});

  }

  /**
   * React to state changes and render the component's HTML
   *
   * @returns {void}
   */
  render() {
	let self = this;

	self.element.innerHTML = `
	  <svg 
		viewBox="0 0 30 20"
		class="svg-el"
	  >
		<rect 
		  x="0"
		  y="0"
		  width="30"
		  height="20"
		  fill="#fafafa"
		/>
		<rect 
		  x="4"
		  y="5"
		  width="8"
		  height="10"
		  fill="#007bff"
		  class="draggable" 
		  data-drag="draggableNode"
		/>
		<rect x="18" y="5" width="8" height="10"   fill="#888"/>
	  </svg>`;
  }
}
