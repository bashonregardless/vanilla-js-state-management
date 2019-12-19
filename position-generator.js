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

const ownProp = Object.prototype.hasOwnProperty;

POSITION_GENERATOR.setup = function setup (adjacencyLists, rootId, LCA) {
  this.adjacencyLists = adjacencyLists;
  this.rootId = rootId;
  this.LCA = LCA;

  this.exploredNodes = {};
  this.processingNodesQueue = [];
 
  this.minXCell = 0;
  this.maxXCell = 0;

  this.maxDepth = 0;

  this.grid = {};
  
  this.resolvingNodes = {};
  this.collisionResolveQueue = [];

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
  depth, xCell, index, totalTreeEdges
) {
  this.depth = depth;
  this.xCell = xCell;
  this.index = index;
  this.totalTreeEdges = totalTreeEdges;
}

POSITION_GENERATOR.calTotalTreeEdges = function calTotalTreeEdges (forwardEdges) {
  return forwardEdges.filter(function countTreeEdge (node) {
	return !ownProp.call(this.exploredNodes, node.id);
  }.bind(this)).length;
}

POSITION_GENERATOR.updatePositionNodes = function updatePositionNodes (processingNode) {
  const { forwardEdges } = this.adjacencyLists[processingNode.id];
  const { length: outdegree } = forwardEdges;

  //const totalTreeEdge = forwardEdges.filter(function countTreeEdge (node) {
  //  return !ownProp.call(this.exploredNodes, node.id);
  //}.bind(this)).length;

  if (processingNode.parent) {
	processingNode.xCell = this.getXCellVal(
	  processingNode.index,
	  this.exploredNodes[processingNode.parent].xCell,
	  //this.calTotalTreeEdges(this.exploredNodes[processingNode.parent].totalTreeEdges)
	  this.exploredNodes[processingNode.parent].totalTreeEdges
	);
	processingNode.totalTreeEdges = this.calTotalTreeEdges(forwardEdges);
  }

  if (outdegree === 0) {
	return;
  }

  forwardEdges.forEach( function (connectedNode, index) {
	const { id: nodeName, icon = '', label = '' } = connectedNode;
	/* if node hasn't been processed yet, push it to processing queue */
	if (!ownProp.call(this.exploredNodes, nodeName)) {
	  const xCell = this.getXCellVal(
		index,
		processingNode.xCell,
		this.calTotalTreeEdges(forwardEdges)
	  );

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
  if (this.rootId) {
	this.processingNodesQueue.push({ 
	  ...this.adjacencyLists[this.rootId],
	  depth: 0,
	  xCell: 0,
	  index: 0,
	  totalTreeEdges: this.adjacencyLists[this.rootId].forwardEdges.length,
	});
  }

  while (this.processingNodesQueue.length) {
	const processingNode = this.processingNodesQueue.shift();

	this.updatePositionNodes(processingNode);

	const { xCell, depth, id, index, totalTreeEdges } = processingNode;

	/* check for collisions */
	if (this.lookupGridElement(xCell, depth)) {
	  this.resolveCollision(this.grid[`${xCell},${depth}`], id, index);
	}

	/* add element to grid */
	this.setGridElement(xCell, depth, id);

	/* once node has been explored, add it to explored list */
	this.exploredNodes[id] = new this.newPositionNode(
	  depth, 
	  xCell,
	  index,
	  totalTreeEdges,
	);
  }
}

POSITION_GENERATOR.setGridElement = function setGridElement (x, y, id) {
  this.grid[`${x},${y}`] = id;
}

POSITION_GENERATOR.lookupGridElement = function lookupGridElement (x, y) {
  return ownProp.call(this.grid, `${x},${y}`);
}

/* FACT:
 * - Collisions are resloved at every level in level order traversal of the graph.
 *   In our case we traverse left to right.
 * - A collision always happens between collinding nodes LCA children's children.
 *   Only two nodes participate in collision, one is the added new node's parent,
 *   the other is its left sibling, i.e, LCA[spineRootIdx - 1], no matter even if
 *   added new node spans past LCA[spineRootIdx - 1] left most child.
 *
 * QUESTION:
 * - Can LCA ever be a node more than two level higher?
 * - Is LCA always exactly the node two level higher?
 *
 * ANSWER:
 * - LCA will always be a node two level higher.
 */
POSITION_GENERATOR.resolveCollision = function resolveCollision (
  occupantNode, 
  newNode,
  newNodeIndex
) {
  const lca = this.LCA.findLCA(occupantNode, newNode);

  const {
	adjacencyLists:
	{
	  [newNode]: adjLNewN,
	  [lca]: { 
		forwardEdges: lcaForwardEdges
	  },
	  [lca]: adjLLCA
	},
	adjacencyLists: adjL,
  } = this;

  const newNodeXCell = this.getXCellVal(
	newNodeIndex,
	this.exploredNodes[adjLNewN.parent].xCell,
	this.adjacencyLists[adjLNewN.parent].forwardEdges.length
  );

  // find new node spine root which is child of lca
  let stub = adjLNewN;
  while (stub.parent !== lca) {
	stub = this.adjacencyLists[stub.parent];
  }

  let spineRootIdx;
  adjLLCA.forwardEdges.forEach(function getSpineRootIdx (connectedNode, index) {
	if (connectedNode.id === stub.id) {
	  spineRootIdx = index;
	}
  })

  /* Decision? to shift left or to shift right */
  /* TO-DO: Inside grid lookup add axis child in case of even children */
  let shiftDirection;
  // To shift left, first check the leftmost child of lca to see if the cell left to it is vacant
  if (!ownProp.call(
	this.grid,
	`${this.exploredNodes[lcaForwardEdges[0].id].xCell - 1},${this.exploredNodes[lcaForwardEdges[0].id].depth}`
  )) {
	shiftDirection = 'left';

	let shiftSteps;
	//(case 1) is leftmost node of new colliding node beyond leftmost node of LCA's leftmost child
	// TO-CHECK: if children of LCA[spineRootIdx - 1] are colliding with more children of colliding node
	if (this.exploredNodes[this.adjacencyLists[lcaForwardEdges[0].id].forwardEdges[0].id].xCell > newNodeXCell) {
	  shiftSteps = Math.ceil(adjLNewN.parent.forwardEdges.length / 2);
	} 

	//(case 2) is leftmost node of new colliding node colliding with one of children of LCA[spineRootIdx - 1]
	const caseTwo = this.adjacencyLists[lcaForwardEdges[spineRootIdx - 1].id].forwardEdges.some(function (connectedNode) {
	  return this.exploredNodes[connectedNode.id].xCell >= newNodeXCell
	}.bind(this))

	if (caseTwo) {
	  shiftSteps = (
		Math.floor(this.adjacencyLists[lcaForwardEdges[spineRootIdx - 1].id].forwardEdges.length / 2) +
		Math.ceil(this.adjacencyLists[adjLNewN.parent].forwardEdges.length / 2)
	  ) -
		(
		  Math.abs(
			(this.exploredNodes[adjLNewN.parent].xCell) - (this.exploredNodes[lcaForwardEdges[spineRootIdx - 1].id].xCell)
		  )
		)
	}
	
	//(case 3) is leftmost node of new colliding node colliding with one of children of LCA[0..spineRootIdx - 2]
	// TO-CHECK: if children of LCA[spineRootIdx - 1] are colliding with more children of colliding node
	
	for (let i = 0; i <= spineRootIdx - 1; i++) {
	  const { id: lcaForwardEdgeId } = lcaForwardEdges[i];
	  const {
		[lcaForwardEdgeId]: {
		  xCell,
		  depth,
		}
	  } = this.exploredNodes;

	  delete this.grid[`${xCell},${depth}`]
	  this.exploredNodes[lcaForwardEdges[i].id].xCell = xCell - shiftSteps;
	  this.setGridElement(
		this.exploredNodes[lcaForwardEdges[i].id].xCell,
		depth,
		lcaForwardEdgeId
	  );

	  this.collisionResolveQueue.push(lcaForwardEdgeId);

	  while (this.collisionResolveQueue.length) {
		const resolvingNode = this.collisionResolveQueue.shift();
		this.updateAfterCollision(resolvingNode, newNode);
	  }
	}
  } else {
	shiftDirection = 'right';

	let shiftSteps;
	//(case 1) is leftmost node of new colliding node beyond leftmost node of LCA's leftmost child
	// TO-CHECK: if children of LCA[spineRootIdx - 1] are colliding with more children of colliding node
	if (this.exploredNodes[this.adjacencyLists[lcaForwardEdges[0].id].forwardEdges[0].id].xCell > newNodeXCell) {
	  shiftSteps = Math.ceil(adjLNewN.parent.forwardEdges.length / 2);
	} 

	//(case 2) is leftmost node of new colliding node colliding with one of children of LCA[spineRootIdx - 1]
	const caseTwo = this.adjacencyLists[lcaForwardEdges[spineRootIdx - 1].id].forwardEdges.some(function (connectedNode) {
	  return this.exploredNodes[connectedNode.id].xCell >= newNodeXCell
	}.bind(this))

	if (caseTwo) {
	  shiftSteps = (
		Math.floor(this.adjacencyLists[lcaForwardEdges[spineRootIdx - 1].id].forwardEdges.length / 2) +
		Math.ceil(this.adjacencyLists[adjLNewN.parent].forwardEdges.length / 2)
	  ) -
		(
		  Math.abs(
			(this.exploredNodes[adjLNewN.parent].xCell) - (this.exploredNodes[lcaForwardEdges[spineRootIdx - 1].id].xCell)
		  )
		)
	}
	
	//(case 3) is leftmost node of new colliding node colliding with one of children of LCA[0..spineRootIdx - 2]
	// TO-CHECK: if children of LCA[spineRootIdx - 1] are colliding with more children of colliding node
	
	for (let i = spineRootIdx; i < lcaForwardEdges.length; i++) {
	  const { id: lcaForwardEdgeId } = lcaForwardEdges[i];
	  const {
		[lcaForwardEdgeId]: {
		  xCell,
		  depth,
		}
	  } = this.exploredNodes;

	  delete this.grid[`${xCell},${depth}`]
	  this.exploredNodes[lcaForwardEdges[i].id].xCell = xCell + shiftSteps;
	  this.setGridElement(
		this.exploredNodes[lcaForwardEdges[i].id].xCell,
		depth,
		lcaForwardEdgeId
	  );

	  this.collisionResolveQueue.push(lcaForwardEdgeId);

	  while (this.collisionResolveQueue.length) {
		const resolvingNode = this.collisionResolveQueue.shift();
		this.updateAfterCollision(resolvingNode, newNode);
	  }
	}
  }
}

POSITION_GENERATOR.updateAfterCollision = function updateAfterCollision (processingNode, newNode) {
  const { forwardEdges } = this.adjacencyLists[processingNode];
  const { length: outdegree } = forwardEdges;

  const totalTreeEdge = forwardEdges.filter(function countTreeEdge (node) {
    return !ownProp.call(this.resolvingNodes, node.id);
  }.bind(this)).length;

  if (outdegree === 0) {
	return;
  }

  forwardEdges.forEach(function (connectedNode, index) {
	const { id, icon = '', label = '' } = connectedNode;
	if (ownProp.call(this.exploredNodes, id)) {
	  /* if node hasn't been processed yet, push it to processing queue */
	  if (!ownProp.call(this.resolvingNodes, id)) {
		const { 
		  [id]: {
			xCell,
			depth,
		  }
		} = this.exploredNodes;

		const updatedXCell = this.getXCellVal(
		  index,
		  this.exploredNodes[processingNode].xCell,
		  totalTreeEdge
		);

		/* update xCell min and max */
		if (updatedXCell < this.minXCell) this.minXCell = updatedXCell;
		if (updatedXCell > this.maxXCell) this.maxXCell = updatedXCell;

		delete this.grid[`${xCell},${depth}`];
		this.setGridElement(updatedXCell, depth, id);
		this.exploredNodes[id].xCell = updatedXCell;
		this.collisionResolveQueue.push(id);
	  } 
	}
  }.bind(this))
}

module.exports = POSITION_GENERATOR;
