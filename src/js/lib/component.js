// We're importing the store Class here so we can test against it in the constructor
import Store from '../store/store.js';

export default {
  init: function(props = {}) {

	this.render = this.render || function() {};

	// If there's a store passed in, subscribe to the state change
	if(props.store instanceof Store) {
	  props.subscribeEvent.split(' ').forEach(evt => {
		props.store.events.subscribe(
		  evt, () => this.render()
		);
	  }, this);
	}

	// Store the HTML element to attach the render to if set
	if(props.hasOwnProperty('element')) {
	  this.element = props.element;
	}

	return this;
  }
}
