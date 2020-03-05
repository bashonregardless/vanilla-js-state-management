export default {
  addItem(state, payload) {
	state.items.push(payload);

	return state;
  },
  clearItem(state, payload) {
	state.items.splice(payload.index, 1);

	return state;
  },
  updateEdge(state, payload = {}) {
	console.log(state.nodeLookup);
	return {
	  ...state,
	  nodeLookup: {
		...state.nodeLookup,
		[payload.nodeId]: {
		  ...state.nodeLookup[payload.nodeId],
		  position: {
			...state.nodeLookup[payload.nodeId].position,
			x: payload.posX,
			y: payload.posY,
		  }
		}
	  }
	}
  }
};
