const state = require('./src/js/store/state.js');

var GRAPH_EXPLORER = {};

GRAPH_EXPLORER.setup = function setup () {
  this.exploredNodes = {};
  this.processingNodes = {};
  this.queue = [];

  this.generatePositions();

  console.log(this.exploredNodes);
}

GRAPH_EXPLORER.newProcessedNode = function newProcessedNode (depth, xCell) {
  this.depth = depth;
  this.xCell = xCell;
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

GRAPH_EXPLORER.updateExploredNodes = function updateExploredNodes (/* processingNode, depth */qNodeName) {
  const { outdegree, connectedNodes } = /* state.adjL.nodes[processingNode.nodeName] */state.adjL.nodes[qNodeName];
  /* TO-DO: handle termination condition when outgoing edge is incident on a node at lower depth 
   * than the depth of the node being processed */
  if (outdegree === 0) {
	return;
  }

  connectedNodes.forEach( function (nodeName, idx) {
	/* if node hasn't been processed yet, push it to processing queue */
	if (!Object.prototype.hasOwnProperty.call(this.exploredNodes, nodeName) && !this.queue.includes(nodeName)) {
	  const xCell = this.getXCellVal(idx, /* processingNode.xCell */this.processingNodes[qNodeName].xCell, outdegree);

	  //this.processingNodes.push({
	  //  nodeName: nodeName, 
	  //  depth: /* processingNode.depth */this.processingNode[nodeName].depth + 1,
	  //  xCell,
	  //});

	  this.processingNodes[nodeName] = {
	    nodeName: nodeName, 
	    depth: /* processingNode.depth */this.processingNodes[qNodeName].depth + 1,
	    xCell,
	  };
	  this.queue.push(nodeName);
	} else {
	  if (Object.prototype.hasOwnProperty.call(this.processingNodes, qNodeName) && Object.prototype.hasOwnProperty.call(this.exploredNodes, nodeName)) {
		this.exploredNodes[nodeName].depth = /* processingNode.depth */this.processingNodes[qNodeName].depth + 1;
	  } else {
		this.processingNodes[nodeName].depth = this.exploredNodes[qNodeName].depth + 1;
	  }
	  //this.updateExploredNodes({ 
	  //  nodeName,
	  //  xCell: /* processingNode.xCell */this.processingNodes[qNodeName].xCell,
	  //  depth: this.exploredNodes[nodeName].depth
	  //});
	  this.updateExploredNodes(nodeName);
	}
  }.bind(this))
}

GRAPH_EXPLORER.generatePositions = function generatePositions () {
  if (state.adjL.root) {
	this.processingNodes[state.adjL.root] = {
	  nodeName: state.adjL.root,
	  depth: 1,
	  xCell: 0,
	}
	//this.processingNodes.push({ 
	//  nodeName: state.adjL.root,
	//  depth: 1,
	//  xCell: 0
	//});
	this.queue.push(state.adjL.root);
  }

  while (/* this.processingNodes.length */this.queue.length) {
	//const processingNode = this.processingNodesQueue.shift();
	const qNodeName = this.queue.shift();

	this.updateExploredNodes(/* processingNode */qNodeName);
	/* once node has been explored, add it to exploredQueue */
	this.exploredNodes[/* processingNode.nodeName */qNodeName] = new this.newProcessedNode(/* processingNode.depth, processingNode.xCell */this.processingNodes[qNodeName].depth, this.processingNodes[qNodeName].xCell);
	delete this.processingNodes[qNodeName];
  }
}

GRAPH_EXPLORER.setup();
