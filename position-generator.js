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

POSITION_GENERATOR.setup = function setup (adjacencyLists, rootName) {
  this.adjacencyLists = adjacencyLists;
  this.rootName = rootName;

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

  forwardEdges.forEach( function (connectedNode, idx) {
	const { id: nodeName, icon = '', label = '' } = connectedNode;
	/* if node hasn't been processed yet, push it to processing queue */
	if (!Object.prototype.hasOwnProperty.call(this.exploredNodes, nodeName)) {
	  const xCell = this.getXCellVal(idx, processingNode.xCell, totalTreeEdge);

	  /* update xCell min and max */
	  if (xCell < this.minXCell) this.minXCell = xCell;
	  if (xCell > this.maxXCell) this.maxXCell = xCell;

	  this.processingNodesQueue.push({
		...this.adjacencyLists[nodeName],
		depth: processingNode.depth + 1,
		xCell,
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

	const { xCell, depth, id } = processingNode;

	/* check for collisions */
	if (this.lookupGridElement(xCell, depth, id)) {
	  //this.resolveCollision(this.grid[`${x},${y}`], nodeName);
	}

	/* add element to grid */
	this.setGridElement(xCell, depth, id);

	/* once node has been explored, add it to explored list */
	this.exploredNodes[id] = new this.newPositionNode(
	  depth, 
	  xCell,
	);
  }
}

POSITION_GENERATOR.setGridElement = function setGridElement (x, y, nodeName) {
  this.grid[`${x},${y}`] = nodeName;
}

POSITION_GENERATOR.lookupGridElement = function lookupGridElement (x, y, nodeName) {
  return Object.prototype.hasOwnProperty.call(this.grid, `${x},${y}`);
}

POSITION_GENERATOR.resolveCollision = function resolveCollision (occupantNode, newNode) {
  this.findLCA(occupantNode, newNode);
}

module.exports = POSITION_GENERATOR;
