const state = require('./src/js/store/state.js');

var GRAPH_EXPLORER = {};

GRAPH_EXPLORER.setup = function setup () {
  this.exploredNodes = {};
  this.processingNodesQueue = [];

  this.generatePositions();

  console.log(this.exploredNodes);
}

GRAPH_EXPLORER.newProcessedNode = function newProcessedNode (depth, xCell) {
  this.depth = depth;
  this.xCell = xCell;
}

GRAPH_EXPLORER.updateExploredNodes = function updateExploredNodes (processingNode, depth) {
  /* handle termination condition when outgoing edge is incident on a node at lower depth 
   * than the depth of the node being processed */
  if (state.nodes[processingNode.nodeName].outdegree === 0) {
	return;
  }

  state.nodes[processingNode.nodeName].connectedNodes.forEach( function (nodeName) {
	/* if node hasn't been processed yet, push it to processing queue */
	if (!Object.prototype.hasOwnProperty.call(this.exploredNodes, nodeName)) {
	  this.processingNodesQueue.push({ nodeName: nodeName, depth: processingNode.depth + 1 });
	} else {
	  this.exploredNodes[nodeName].depth = processingNode.depth + 1;
	  this.updateExploredNodes({ nodeName, depth: this.exploredNodes[nodeName].depth });
	}
  }.bind(this))
}

GRAPH_EXPLORER.generatePositions = function generatePositions () {
  if (state.root) {
	this.processingNodesQueue.push({ nodeName: state.root, depth: 1 });
  }

  while (this.processingNodesQueue.length) {
	const processingNode = this.processingNodesQueue.shift();

	this.updateExploredNodes(processingNode);
	/* once node has been explored, add it to exploredQueue */
	this.exploredNodes[processingNode.nodeName] = new this.newProcessedNode(processingNode.depth);
  }
}

GRAPH_EXPLORER.setup();
