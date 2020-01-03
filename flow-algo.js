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
  this.index = 0;
  this.getOrder({ id: state.adjL.root })({ id: state.adjL.root });

  console.log(JSON.stringify({
    rootId: state.adjL.root,
	nodeLookup: this.exploredNodes,
	nodes: this.nodes,
	minX: this.minX,
	maxX: this.maxX,
	maxY: this.maxY
  }));
}

GRAPH_EXPLORER.newProcessedNode = function newProcessedNode(
  id,
  forwardEdges,
  backEdges,
  parent,
  displayName,
  type,
  text
) {
  this.id = id;
  this.forwardEdges = forwardEdges;
  this.backEdges = backEdges;
  this.parent = parent;
  this.displayName = displayName;
  this.type = type;
  this.text = text;
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
        ...state.adjL.nodes[currNodeId],
        forwardEdges: [],
        backEdges: [],
        parent: processingNode.id,
      });

      // add discovered forward edge
      processingNode.forwardEdges.push({ id: currNodeId, icon, label });
    }
    // else a back edge is discovered
    else {
      processingNode.backEdges.push({ id: currNodeId, icon, label });
    }
  }, this);
}


GRAPH_EXPLORER.buildGraph = function buildGraph () {
  if (state.adjL.root) {
	this.processingNodesQueue.push({ 
	  ...state.adjL.nodes[state.adjL.root],
	  forwardEdges: [],
	  backEdges: [],
	  parent: null,
	});
  }

  while (this.processingNodesQueue.length) {
	const processingNode = this.processingNodesQueue.shift();

	this.updateExploredNodes(processingNode);

    const {
      id,
      forwardEdges,
      backEdges,
      parent,
      displayName,
      type,
      text,
    } = processingNode;

    /* once node has been explored, add it to exploredQueue */
    this.exploredNodes[id] = new this.newProcessedNode(
      id,
      forwardEdges,
      backEdges,
      parent,
      displayName,
      type,
      text
    );

    if (Object.prototype.hasOwnProperty.call(this.tempPosStorage, id)) {
      this.exploredNodes[id].position = this.tempPosStorage[id];
      delete this.tempPosStorage[id];
    }
  }
}

  /* ASSUMPTION:
   * In n-ary tree if the index of subtree branch is less than floor(treeEdgeCount / 2),
   * where treeEdgeCount is total number of tree edges of connected ancestor node.
   * the query node is said to lie in the left half subtrees of connected ancestor node.
   * else,
   * it is said to lie in the right half subtrees of connected ancestor node.
   *

   * Q. Find out if a node lies is in the right half subtrees or the left half subtrees
   * of connected ancestor node ?
   * Suppose the answer is left half subtrees of connected ancestor node,
   * then the back edge will emanate from left side of query node and trace a path from this
   * direction to connected ancestor node.
   */

GRAPH_EXPLORER.getOrder = function getOrder(parent) {
  return function order(value, branchIdx) {
	const { [value.id]: cur } = this.exploredNodes;
	if (!cur.forwardEdges.length) {
	  this.exploredNodes[value.id].index = cur.index || ++this.index;
	}
	cur.forwardEdges.forEach(this.getOrder(value), this);
	if (this.exploredNodes[parent.id].forwardEdges.length === 1) {
	  this.exploredNodes[parent.id].index = cur.index;
	} else {
	  if (branchIdx === Math.floor(this.exploredNodes[parent.id].forwardEdges.length / 2) - 1)
		this.exploredNodes[parent.id].index = this.exploredNodes[parent.id].index || ++this.index;
	}
  }.bind(this);

  //function query(rootNodeId, queryNodeId) {
  //  return rootNodeId === queryNodeId
  //    ? 'middle'
  //    : this.exploredNodes[rootNodeId].index < this.exploredNodes[queryNodeId].index
  //  	? 'left'
  //  	: 'right';
  //}
}

GRAPH_EXPLORER.setup();
