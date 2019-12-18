'use strict'

/* Adjacency Lists:
 * The way a graph is specified is adjacency lists.
 *
 * It is a bunch of lists for each node,
 * for each node, a list tells the nodes that vertex is connected to.
 *
 * In other words, the nodes that can be reached in one step via an edge.
 */

const state = require('./src/js/store/state.js');
const LCA = require('./lca-algo');
const POSITION_GENERATOR = require('./position-generator');

var GRAPH_EXPLORER = {};

GRAPH_EXPLORER.setup = function setup () {
  this.exploredNodes = {};
  this.exploredPositionNodes = {};
  this.processingNodesQueue = [];
 
  this.buildGraph();

  LCA.setup(this.exploredNodes, state.adjL.root);

  POSITION_GENERATOR.setup(this.exploredNodes, state.adjL.root);

  // console.log(`LCA(actionThree, actionTwo) is ${this.findLCA('actionThree', 'actionTwo')}`);
  // console.log(`LCA(filterOne, actionTwo) is ${this.findLCA('filterOne', 'actionTwo')}`);
  // console.log(`LCA(filterOne, actionThree) is ${this.findLCA('filterOne', 'actionThree')}`);
  // console.log(`LCA(ifThenOne, actionThree) is ${this.findLCA('ifThenOne', 'actionThree')}`);
  //console.log(`LCA(D, E) is ${LCA.findLCA('D', 'E')}`);
  //console.log(`LCA(F, E) is ${LCA.findLCA('F', 'E')}`);
  //console.log(`LCA(K, E) is ${LCA.findLCA('K', 'E')}`);
  //console.log(`LCA(J, H) is ${LCA.findLCA('J', 'H')}`);

  //console.log(JSON.stringify({
  //  nodes: this.exploredNodes,
  //  minXCell: POSITION_GENERATOR.minXCell,
  //  maxXCell: POSITION_GENERATOR.maxXCell,
  //  maxDepth: POSITION_GENERATOR.maxDepth
  //}));
}

GRAPH_EXPLORER.newProcessedNode = function newProcessedNode (
  nodeName, forwardEdges, backEdge, parent
) {
  this.id = nodeName;
  this.forwardEdges = forwardEdges;
  this.backEdge = backEdge;
  this.parent = parent;
}

GRAPH_EXPLORER.updateExploredNodes = function updateExploredNodes (processingNode) {
  const { connectedNodes } = state.adjL.nodes[processingNode.nodeName];
  const { length: outdegree } = connectedNodes;

  if (outdegree === 0) {
	return;
  }

  connectedNodes.forEach( function (connectedNode, idx) {
	const { id: nodeName, icon = '', label = '' } = connectedNode;
	/* if node hasn't been processed yet, push it to processing queue */
	if (!Object.prototype.hasOwnProperty.call(this.exploredNodes, nodeName)) {
	  this.processingNodesQueue.push({
		nodeName: nodeName, 
		forwardEdges: [],
		backEdge: [],
		parent: processingNode.nodeName,
	  });

	  // add discovered forward edge
	  processingNode.forwardEdges.push( {id: nodeName, icon, label } );
	} 
	// else a back edge is discovered
	else {
	  processingNode.backEdge.push( { id: nodeName, icon, label });
	}
  }.bind(this))
}


GRAPH_EXPLORER.buildGraph = function buildGraph () {
  if (state.adjL.root) {
	this.processingNodesQueue.push({ 
	  nodeName: state.adjL.root,
	  forwardEdges: [],
	  backEdge: [],
	  parent: null,
	});
  }

  while (this.processingNodesQueue.length) {
	const processingNode = this.processingNodesQueue.shift();

	this.updateExploredNodes(processingNode);

	const { nodeName, forwardEdges, backEdge, parent } = processingNode;

	/* once node has been explored, add it to exploredQueue */
	this.exploredNodes[nodeName] = new this.newProcessedNode(
	  nodeName,
	  forwardEdges,
	  backEdge,
	  parent,
	);
  }
}

GRAPH_EXPLORER.setup();
