/* Basic assumptions:
 *
 * In calculation of depth,
 * If a node that does not exist in exploredNodes list is explored from a node then
 * assign it a depth one greater than the depth of the node that it is being explored from.
 */

/*  Outdegree can either be a forward edge or a back edge
  * A forward edge cannot have length greater than one.
  *
  * A back edge can have length greater than one.
  * 
  */

const state = require('./src/js/store/state.js');

var GRAPH_EXPLORER = {};

GRAPH_EXPLORER.setup = function setup () {
  this.exploredNodes = {};
  this.processingNodesQueue = [];
  this.queue = [];

  this.generatePositions();

  console.log(this.exploredNodes);
}

GRAPH_EXPLORER.newProcessedNode = function newProcessedNode (depth, xCell, outdegree) {
  this.depth = depth;
  this.xCell = xCell;
  this.outdegree = outdegree;
}

/* xCell calculation assumption: 
 *
 * if outdegree is 1: only child renders on parent Axis.
 *
 * if outdegree is even: [1..n/2] nodes render to the left of parent Axis and [n/2 + 1..n] render to the right.
 * Nothing renders on parent Axis.
 *
 * if outdegree is odd: [1..floor(n/2)] nodes render to the left of parent Axis
 * and [floor(n/2) + 2..n] nodes render to the right.
 * [floor(n/2) + 1] renders on the parent Axis.
 */
GRAPH_EXPLORER.getXCellVal = function getXCellVal (idx, xCell, outdegree) {
  /* outdegree is odd */
  if (outdegree & 1) {
	if ((idx + 1) === Math.floor(outdegree / 2) + 1) {
	  return xCell;
	} else if ((idx + 1) < Math.floor(outdegree / 2) + 1) {
	  return xCell - (idx + 1)
	} else {
	  return xCell + ( (idx + 1) - ( Math.floor(outdegree / 2) + 1) )
	}
  } 

  /* outdegree is even */
  else {
	if (idx < outdegree / 2) {
	  return xCell - (idx + 1);
	} else {
	  return xCell + ( (idx + 1) - (outdegree / 2) );
	}
  }
}

GRAPH_EXPLORER.updateExploredNodes = function updateExploredNodes (processingNode, depth) {
  const { outdegree, connectedNodes } = state.adjL.nodes[processingNode.nodeName];
  /* TO-DO: handle termination condition when outgoing edge is incident on a node at lower depth 
   * than the depth of the node being processed */
  if (outdegree === 0) {
	return;
  }

  connectedNodes.forEach( function (connectedNode, idx) {
	const { id: nodeName } = connectedNode;
	/* if node hasn't been processed yet, push it to processing queue */
	if (!Object.prototype.hasOwnProperty.call(this.exploredNodes, nodeName)) {
	  const xCell = this.getXCellVal(idx, processingNode.xCell, outdegree);

	  this.processingNodesQueue.push({
		nodeName: nodeName, 
		depth: processingNode.depth + 1,
		xCell,
		outdegree,
	  });
	  this.queue.push(nodeName);
	} 
  }.bind(this))
}

GRAPH_EXPLORER.generatePositions = function generatePositions () {
  if (state.adjL.root) {
	this.processingNodesQueue.push({ 
	  nodeName: state.adjL.root,
	  depth: 1,
	  xCell: 0,
	  outdegree: state.adjL.nodes[state.adjL.root].outdegree,
	});
	this.queue.push(state.adjL.root);
  }

  while (this.processingNodesQueue.length) {
	const processingNode = this.processingNodesQueue.shift();
	const qNodeName = this.queue.shift();

	this.updateExploredNodes(processingNode);
	/* once node has been explored, add it to exploredQueue */
	this.exploredNodes[processingNode.nodeName] = new this.newProcessedNode(processingNode.depth, processingNode.xCell, processingNode.outdegree);
  }
}

GRAPH_EXPLORER.setup();
