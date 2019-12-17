'use strict'

  /* Adjacency Lists:
   * The way a graph is specified is adjacency lists.
   *
   * It is a bunch of lists for each node,
   * for each node, a list tells the nodes that vertex is connected to.
   *
   * In other words, the nodes that can be reached in one step via an edge.
   */

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
  this.size = 101;
  this.exploredNodes = {};
  this.processingNodesQueue = [];
 
  this.minXCell = 0;
  this.maxXCell = 0;

  this.maxDepth = 0;

  this.grid = {};
  
  /* In Eulerian tour every edge is visited twice.
   * Depth First Search preorder traversal.
   *
   * eulerTour array is populated with nodes as they are visited
   * but with repetitions.
   */
  this.eulerTour = [];

  // depth for each node corresponding to euler tour
  this.depthArray = [];

  // stores first appearance index of every node
  //this.firstAppearanceIndex = [...Array(this.size)];
  this.firstAppearanceIndex = {};

  // pointer to euler walk
  this.ptr;

  // sparse table
  this.dp = [...Array(this.size)].map(x => Array(18).fill(-1));

  // stores depth for all nodes in the tree
  //this.level = [...Array(this.size)];
  this.level = {};

  // store log values
  this.logn = [...Array(this.size)];

  // store power of 2
  this.powTwo = [...Array(20)];

  this.buildGraph();

  // perform precalculations
  this.preCalculations();

  this.ptr = 0;

  this.populateEulerTour(this.exploredNodes[state.adjL.root], null, 0);

  // create level depth array corresponding to the euler tour array
  this.createDepthArray();

  // build sparse table
  this.buildSparseTable(this.depthArray.length);

  console.log(`LCA(actionThree, actionTwo) is ${this.findLCA('actionThree', 'actionTwo')}`);
  console.log(`LCA(filterOne, actionTwo) is ${this.findLCA('filterOne', 'actionTwo')}`);
  console.log(`LCA(filterOne, actionThree) is ${this.findLCA('filterOne', 'actionThree')}`);
  console.log(`LCA(ifThenOne, actionThree) is ${this.findLCA('ifThenOne', 'actionThree')}`);

  console.log(JSON.stringify({
	nodes: this.exploredNodes,
	minXCell: this.minXCell,
	maxXCell: this.maxXCell,
	maxDepth: this.maxDepth
  }));
}

GRAPH_EXPLORER.preCalculations = function preCalculations () {
  // memorize powers of 2
  this.powTwo[0] = 1;
  for (let i = 1; i < 18; i++) {
	this.powTwo[i] = this.powTwo[i - 1] * 2;
  }

  // memorize log(n) values
  let val = 1, ptr = 0;
  for (let i = 1; i < this.size; i++) {
	this.logn[i] = ptr - 1;

	if (val === i) {
	  val *= 2;
	  this.logn[i] = ptr;
	  ptr++;
	}
  }
}

GRAPH_EXPLORER.buildSparseTable = function buildSparseTable (size) {
  // fill base case values
  for (let i = 1; i < size; i++) {
	this.dp[i-1][0] = (this.depthArray[i] > this.depthArray[i - 1]) ? i - 1 : i;
  }

  // dynamic programming to fill sparse table
  for (let i = 1; i < 15; i++) {
	for (let j = 0; j < size; j++) {
	  if (this.dp[j][i - 1] !== -1 && this.dp[j + this.powTwo[i - 1]][i - 1] !== -1) {
		this.dp[j][i] =
		  (this.depthArray[this.dp[j][i - 1]] > this.depthArray[this.dp[j + this.powTwo[i - 1]][i - 1]]) ?
		  this.dp[j + this.powTwo[i - 1]][i - 1] : this.dp[j][i - 1];
	  } else {
		break;
	  }
	}
  }
}


GRAPH_EXPLORER.findLCA = function findLCA (u, v) {
  if (u === v) {
	return u;
  }

  if (this.firstAppearanceIndex[u] > this.firstAppearanceIndex[v]) {
	let temp = v;
	v = u;
	u = temp;
  }

  // range minimum query
  return this.eulerTour[this.query(this.firstAppearanceIndex[u], this.firstAppearanceIndex[v])];
}

GRAPH_EXPLORER.query = function query (l, r) {
  let d = r - l;
  let dx = this.logn[d];

  if (l === r) return l;

  if (this.depthArray[this.dp[l][dx]] > this.depthArray[this.dp[r - this.powTwo[dx]][dx]]) {
	return this.dp[r - this.powTwo[dx]][dx];
  } else {
	return this.dp[l][dx];
  };
}

GRAPH_EXPLORER.newProcessedNode = function newProcessedNode (
  nodeName, depth, xCell, forwardEdge, backEdge, parent
) {
  this.id = nodeName;
  this.depth = depth;
  this.xCell = xCell;
  //this.outdegree = outdegree;
  this.forwardEdge = forwardEdge;
  this.backEdge = backEdge;
  this.parent = parent;
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
GRAPH_EXPLORER.getXCellVal = function getXCellVal (idx, xCell, treeedge) {
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

GRAPH_EXPLORER.populateEulerTour = function populateEulerTour (cur, prev, dep) { 
  const { id } = cur;

  // record first appearance index for cur node
  if (!Object.prototype.hasOwnProperty.call(this.firstAppearanceIndex, id)) {
	this.firstAppearanceIndex[id] = this.ptr;
  }

  this.level[id] = dep;

  // push root to euler tour
  this.eulerTour.push(id);
  
  // increment euler tour pointer
  this.ptr++;

  this.exploredNodes[id].forwardEdge.forEach(function (nodeName) {
	if (nodeName !== prev) {
	  this.populateEulerTour(nodeName, id, dep + 1);
	}

	// push cur again in backtrack if euler tour
	this.eulerTour.push(id);

	// increment euler tour pointer
	this.ptr++;
  }.bind(this))
}

GRAPH_EXPLORER.createDepthArray = function createDepthArray () { 
  this.eulerTour.forEach(function populateDepthArray (eulerTourNodeName) {
	this.depthArray.push(this.level[eulerTourNodeName])
  }.bind(this))
}

GRAPH_EXPLORER.buildGraph = function buildGraph () {
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

	const { xCell, depth, nodeName, forwardEdge, backEdge, parent } = processingNode;

	/* check for collisions */
	if (this.lookupGridElement(xCell, depth, nodeName)) {
	  //this.resolveCollision(this.grid[`${x},${y}`], nodeName);
	}

	/* add element to grid */
	this.setGridElement(xCell, depth, nodeName);

	/* once node has been explored, add it to exploredQueue */
	this.exploredNodes[nodeName] = new this.newProcessedNode(
	  nodeName,
	  depth, 
	  xCell,
	  //outdegree,
	  forwardEdge,
	  backEdge,
	  parent,
	);
  }
}

GRAPH_EXPLORER.setGridElement = function setGridElement (x, y, nodeName) {
  this.grid[`${x},${y}`] = nodeName;
}

GRAPH_EXPLORER.lookupGridElement = function lookupGridElement (x, y, nodeName) {
  return Object.prototype.hasOwnProperty.call(this.grid, `${x},${y}`);
}

GRAPH_EXPLORER.resolveCollision = function resolveCollision (occupantNode, newNode) {
  this.findLCA(occupantNode, newNode);
}

GRAPH_EXPLORER.setup();
