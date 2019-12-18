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

var POSITION_GENERATOR = {};

POSITION_GENERATOR.setup = function setup (adjacencyLists, rootName, LCA) {
  this.adjacencyLists = adjacencyLists;
  this.rootName = rootName;
  this.LCA = LCA;

  this.exploredNodes = {};
  this.processingNodesQueue = [];
 
  this.minXCell = 0;
  this.maxXCell = 0;

  this.maxDepth = 0;

  this.grid = {};
  
  this.generatePositions();

  console.log(JSON.stringify({
	nodes: this.exploredNodes,
	minXCell: this.minXCell,
	maxXCell: this.maxXCell,
	maxDepth: this.maxDepth
  }));
}

/* xCell calculation assumption: 
 *
 * if treeedge is 1: only child renders on parent Axis.
 *
 * if treeedge is even: [1..n/2] nodes render to the left of parent Axis and [n/2 + 1..n] render to the right.
 * Nothing renders on parent Axis.
 *
 * if treeedge is odd: [1..floor(n/2)] nodes render to the left of parent Axis
 * and [floor(n/2) + 2..n] nodes render to the right.
 * [floor(n/2) + 1] renders on the parent Axis.
 */
POSITION_GENERATOR.getXCellVal = function getXCellVal (idx, xCell, treeedge) {
  /* treeedge is odd */
  if (treeedge & 1) {
    if (idx + 1 === Math.floor(treeedge / 2) + 1) {
      return xCell;
    } else if (idx + 1 < Math.floor(treeedge / 2) + 1) {
      return xCell - (idx + 1)
    } else {
      return xCell + (idx + 1 - (Math.floor(treeedge / 2) + 1))
    }
  }

  /* treeedge is even */
  else {
    if (idx < treeedge / 2) {
      return xCell - (idx + 1);
    } else {
      return xCell + (idx + 1 - treeedge / 2);
    }
  }
}

POSITION_GENERATOR.newPositionNode = function newPositionNode (
  depth, xCell 
) {
  this.depth = depth;
  this.xCell = xCell;
}

POSITION_GENERATOR.updatePositionNodes = function updatePositionNodes (processingNode) {
  const { forwardEdges } = this.adjacencyLists[processingNode.id];
  const { length: outdegree } = forwardEdges;

  const totalTreeEdge = forwardEdges.filter(function countTreeEdge (node) {
    return !Object.prototype.hasOwnProperty.call(this.exploredNodes, node.id);
  }.bind(this)).length;

  if (outdegree === 0) {
	return;
  }

  forwardEdges.forEach( function (connectedNode, index) {
	const { id: nodeName, icon = '', label = '' } = connectedNode;
	/* if node hasn't been processed yet, push it to processing queue */
	if (!Object.prototype.hasOwnProperty.call(this.exploredNodes, nodeName)) {
	  const xCell = this.getXCellVal(index, processingNode.xCell, totalTreeEdge);

	  /* update xCell min and max */
	  if (xCell < this.minXCell) this.minXCell = xCell;
	  if (xCell > this.maxXCell) this.maxXCell = xCell;

	  this.processingNodesQueue.push({
		...this.adjacencyLists[nodeName],
		depth: processingNode.depth + 1,
		xCell,
		index,
	  });

	  /* update max depth */
	  if (processingNode.depth + 1 > this.maxDepth) this.maxDepth = processingNode.depth + 1;
	} 
  }.bind(this))
}

/* Positions are generated with BFS exploration of the graph.
 * This allows us to figure out the direction in which nodes 
 * are to be adjusted to resolve collisions.
 */
POSITION_GENERATOR.generatePositions = function generatePositions () {
  if (this.rootName) {
	this.processingNodesQueue.push({ 
	  ...this.adjacencyLists[this.rootName],
	  depth: 0,
	  xCell: 0,
	});
  }

  while (this.processingNodesQueue.length) {
	const processingNode = this.processingNodesQueue.shift();

	this.updatePositionNodes(processingNode);

	const { xCell, depth, id, index } = processingNode;

	/* check for collisions */
	if (this.lookupGridElement(xCell, depth, id)) {
	  this.resolveCollision(this.grid[`${xCell},${depth}`], id, index);
	}

	/* add element to grid */
	this.setGridElement(xCell, depth, id);

	/* once node has been explored, add it to explored list */
	this.exploredNodes[id] = new this.newPositionNode(
	  depth, 
	  xCell,
	  index,
	);
  }
}

POSITION_GENERATOR.setGridElement = function setGridElement (x, y, nodeName) {
  this.grid[`${x},${y}`] = nodeName;
}

POSITION_GENERATOR.lookupGridElement = function lookupGridElement (x, y, nodeName) {
  return Object.prototype.hasOwnProperty.call(this.grid, `${x},${y}`);
}

POSITION_GENERATOR.resolveCollision = function resolveCollision (occupantNode, newNode, newNodeIndex) {
  const newNodeXCell = this.getXCellVal(newNodeIndex, this.exploredNodes[this.adjacencyLists[newNode].parent].xCell, this.adjacencyLists[this.adjacencyLists[newNode].parent].forwardEdges.length);
  const lca = this.LCA.findLCA(occupantNode, newNode);

  // find new node spine root which is child of lca
  let stub = this.adjacencyLists[newNode];
  while (stub.parent !== lca) {
	stub = this.adjacencyLists[stub.parent];
  }

  let spineRootIdx;
  this.adjacencyLists[lca].forwardEdges.forEach(function getSpineRootIdx (connectedNode, index) {
	if (connectedNode.id === stub.id) {
	  spineRootIdx = index;
	}
  })

  /* Decision? to shift left or to shift right */
  let shiftDirection;
  // check the leftmost child of lca to see if the cell left to it is vacant
  if (!Object.prototype.hasOwnProperty.call(this.grid, `${this.exploredNodes[this.adjacencyLists[lca].forwardEdges[0].id].xCell - 1}, ${this.exploredNodes[this.adjacencyLists[lca].forwardEdges[0].id].depth}`)) {
	shiftDirection = 'left';

	let shiftSteps;
	//(case 1) is leftmost node of new colliding node beyound leftmost node of LCA's leftmost child
	if (this.exploredNodes[this.adjacencyLists[this.adjacencyLists[lca].forwardEdges[0].id].forwardEdges[0].id].xCell > newNodeXCell) {
	  shiftSteps = Math.ceil(this.adjacencyLists[newNode].parent.forwardEdges.length / 2);
	} 

	//(case 2) is leftmost node of new colliding node colliding with one of children of LCA[spineRootIdx - 1]
	const caseTwo = this.adjacencyLists[this.adjacencyLists[lca].forwardEdges[spineRootIdx - 1].id].forwardEdges.some(function (connectedNode) {
	  return this.exploredNodes[connectedNode.id].xCell >= newNodeXCell
	}.bind(this))

	if (caseTwo) {
	  shiftSteps = (Math.floor(this.adjacencyLists[this.adjacencyLists[lca].forwardEdges[spineRootIdx - 1].id].forwardEdges.length / 2) + Math.ceil(this.adjacencyLists[newNode].forwardEdges.length / 2)) -
		Math.abs((Math.abs(newNodeXCell) - Math.abs(this.exploredNodes[this.adjacencyLists[lca].forwardEdges[spineRootIdx - 1].id].xCell)))
	  let hi;
	}
	
	//(case 3) is leftmost node of new colliding node colliding with one of children of LCA[0..spineRootIdx - 2]
  } else {
	shiftDirection = 'right';
  }


  //for (let i = spineRootIdx; i < this.adjacencyLists[lca].forwardEdges.length; i++) {

  //  this.exploredNodes[this.adjacencyLists[lca].forwardEdges[i]].xCell.
  //}
}

module.exports = POSITION_GENERATOR;
