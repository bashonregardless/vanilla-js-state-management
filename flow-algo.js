'use strict'

/* Basic assumptions:
 *
 * In calculation of depth,
 * If a node that does not exist in exploredNodes list is explored from a node then
 * assign it a depth one greater than the depth of the node that it is being explored from.
 */

/* Edge Classification :-
 *
 * Tree Edge: Visit new vertex via edge.
 *
 * Forward Edge: Node -> Decendant
 *
 * Back Edge: Node -> Ancestor
 */

const state = require('./src/js/store/state.js');

var GRAPH_EXPLORER = {};

GRAPH_EXPLORER.setup = function setup () {
  this.exploredNodes = {};
  this.processingNodesQueue = [];

  this.minXCell = 0;
  this.maxXCell = 0;

  this.maxDepth = 0;

  this.generatePositions();

  console.log(JSON.stringify({
	nodes: this.exploredNodes,
	minXCell: this.minXCell,
	maxXCell: this.maxXCell,
	maxDepth: this.maxDepth
  }));
}

GRAPH_EXPLORER.newProcessedNode = function newProcessedNode (
  depth, xCell, forwardEdge, backEdge, parent
) {
  this.depth = depth;
  this.xCell = xCell;
  //this.outdegree = outdegree;
  this.forwardEdge = forwardEdge;
  this.backEdge = backEdge;
  this.parent = parent;
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
    if (idx + 1 === Math.floor(outdegree / 2) + 1) {
      return xCell;
    } else if (idx + 1 < Math.floor(outdegree / 2) + 1) {
      return xCell - (idx + 1)
    } else {
      return xCell + (idx + 1 - (Math.floor(outdegree / 2) + 1))
    }
  }

  /* outdegree is even */
  else {
    if (idx < outdegree / 2) {
      return xCell - (idx + 1);
    } else {
      return xCell + (idx + 1 - outdegree / 2);
    }
  }
}

GRAPH_EXPLORER.updateExploredNodes = function updateExploredNodes (processingNode) {
  const { connectedNodes } = state.adjL.nodes[processingNode.nodeName];
  const { length: outdegree } = connectedNodes;

  const totalTreeEdge = connectedNodes.filter(function countTreeEdge (node) {
    return !Object.prototype.hasOwnProperty.call(this.exploredNodes, node.id);
  }.bind(this)).length;

  if (outdegree === 0) {
	return;
  }

  connectedNodes.forEach( function (connectedNode, idx) {
	const { id: nodeName, icon = '', label = '' } = connectedNode;
	/* if node hasn't been processed yet, push it to processing queue */
	if (!Object.prototype.hasOwnProperty.call(this.exploredNodes, nodeName)) {
	  const xCell = this.getXCellVal(idx, processingNode.xCell, outdegree);

	  /* update xCell min and max */
	  if (xCell < this.minXCell) this.minXCell = xCell;
	  if (xCell > this.maxXCell) this.maxXCell = xCell;

	  this.processingNodesQueue.push({
		nodeName: nodeName, 
		depth: processingNode.depth + 1,
		xCell,
		outdegree: state.adjL.nodes[nodeName].outdegree,
		forwardEdge: [],
		backEdge: [],
		parent: processingNode.nodeName,
	  });
	  // add discovered forward edge
	  processingNode.forwardEdge.push( {id: nodeName, icon, label } );

	  /* update max depth */
	  if (processingNode.depth + 1 > this.maxDepth) this.maxDepth = processingNode.depth + 1;
	} 
	// else a back edge is discovered
	else {
	  processingNode.backEdge.push( { id: nodeName, icon, label });
	}
  }.bind(this))
}

GRAPH_EXPLORER.generatePositions = function generatePositions () {
  if (state.adjL.root) {
	this.processingNodesQueue.push({ 
	  nodeName: state.adjL.root,
	  depth: 1,
	  xCell: 0,
	  //outdegree: state.adjL.nodes[state.adjL.root].outdegree,
	  forwardEdge: [],
	  backEdge: [],
	  parent: null,
	});
  }

  while (this.processingNodesQueue.length) {
	const processingNode = this.processingNodesQueue.shift();

	this.updateExploredNodes(processingNode);
	/* once node has been explored, add it to exploredQueue */
	this.exploredNodes[processingNode.nodeName] = new this.newProcessedNode(
	  processingNode.depth, 
	  processingNode.xCell,
	  processingNode.outdegree,
	  processingNode.forwardEdge,
	  processingNode.backEdge,
	  processingNode.parent,
	);
  }
}

GRAPH_EXPLORER.setup();
