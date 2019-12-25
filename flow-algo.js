'use strict'

/* Adjacency Lists:
 * The way a graph is specified is adjacency lists.
 *
 * It is a bunch of lists for each node,
 * for each node, a list tells the nodes that vertex is connected to.
 *
 * In other words, the nodes that can be reached in one step via an edge.
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
const POSITION_GENERATOR = require('./position-generator');

var GRAPH_EXPLORER = Object.create(
  require('./position-generator')
);

GRAPH_EXPLORER.setup = function setup () {
  this.exploredNodes = {};
  this.processingNodesQueue = [];
 
  this.positionGeneratorSetup(state.adjL.root);
  this.buildGraph();

  console.log(JSON.stringify({
	nodes: this.nodes,
	minX: this.minX,
	maxX: this.maxX,
	maxY: this.maxY
  }));
}

GRAPH_EXPLORER.newProcessedNode = function newProcessedNode (
  id, forwardEdges, backEdge, parent
) {
  this.id = id;
  this.forwardEdges = forwardEdges;
  this.backEdge = backEdge;
  this.parent = parent;
}

GRAPH_EXPLORER.updateExploredNodes = function updateExploredNodes (processingNode) {
  const { connectedNodes } = state.adjL.nodes[processingNode.id];
  const { length: outdegree } = connectedNodes;

  if (outdegree === 0) {
	return;
  }

  connectedNodes.forEach(function (connectedNode, idx) {
	const { 
	  id: currNodeId, 
	  icon = '', 
	  label = '' 
	} = connectedNode;

	/* if node hasn't been processed yet, push it to processing queue */
	if (!Object.prototype.hasOwnProperty.call(this.exploredNodes, currNodeId)) {
	  this.insertNode(processingNode.id, currNodeId);

	  this.processingNodesQueue.push({
		id: currNodeId, 
		forwardEdges: [],
		backEdge: [],
		parent: processingNode.nodeName,
	  });

	  // add discovered forward edge
	  processingNode.forwardEdges.push( {id: currNodeId, icon, label } );
	} 
	// else a back edge is discovered
	else {
	  processingNode.backEdge.push( { id: currNodeId, icon, label });
	}
  }, this);
}


GRAPH_EXPLORER.buildGraph = function buildGraph () {
  if (state.adjL.root) {
	this.processingNodesQueue.push({ 
	  id: state.adjL.root,
	  forwardEdges: [],
	  backEdge: [],
	  parent: null,
	});
  }

  while (this.processingNodesQueue.length) {
	const processingNode = this.processingNodesQueue.shift();

	this.updateExploredNodes(processingNode);

	const {
	  id,
	  forwardEdges,
	  backEdge,
	  parent
	} = processingNode;

	/* once node has been explored, add it to exploredQueue */
	this.exploredNodes[id] = new this.newProcessedNode(
	  id,
	  forwardEdges,
	  backEdge,
	  parent,
	);
  }
}

GRAPH_EXPLORER.setup();
