var POSITION_GENERATOR = require('./position-generator');
var COLLISION_RESOLVER = Object.create(POSITION_GENERATOR);

const ownProp = Object.prototype.hasOwnProperty;

COLLISION_RESOLVER.setup = function setup (adjacencyLists, rootId, LCA) {
  this.resolvingNodes = {};
  this.collisionResolveQueue = [];
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
 * - LCA will always be a node two level higher is wrong!
 */
COLLISION_RESOLVER.resolveCollision = function resolveCollision (
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
		  totalTreeEdges,
		}
	  } = this.exploredNodes;

	  delete this.grid[`${xCell},${depth}`]
	  if (totalTreeEdges !== 0 && totalTreeEdges % 2 === 0) {
		delete this.grid[`${xCell},${depth + 1}`];
	  }
	  this.exploredNodes[lcaForwardEdges[i].id].xCell = xCell - shiftSteps;
	  this.setGridElement(
		this.exploredNodes[lcaForwardEdges[i].id].xCell,
		depth,
		lcaForwardEdgeId,
		totalTreeEdges,
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
		  totalTreeEdges,
		}
	  } = this.exploredNodes;

	  delete this.grid[`${xCell},${depth}`]
	  if (totalTreeEdges !== 0 && totalTreeEdges % 2 === 0) {
		delete this.grid[`${xCell},${depth + 1}`];
	  }
	  this.exploredNodes[lcaForwardEdges[i].id].xCell = xCell + shiftSteps;
	  this.setGridElement(
		this.exploredNodes[lcaForwardEdges[i].id].xCell,
		depth,
		lcaForwardEdgeId,
		totalTreeEdges,
	  );

	  this.collisionResolveQueue.push(lcaForwardEdgeId);

	  while (this.collisionResolveQueue.length) {
		const resolvingNode = this.collisionResolveQueue.shift();
		this.updateAfterCollision(resolvingNode, newNode);
	  }
	}
  }
}

COLLISION_RESOLVER.updateAfterCollision = function updateAfterCollision (processingNode, newNode) {
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
			totalTreeEdges,
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

module.exports = COLLISION_RESOLVER;
