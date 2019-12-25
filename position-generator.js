var POSITION_GENERATOR = {};

const ownProp = Object.prototype.hasOwnProperty;

POSITION_GENERATOR.setup = function setup (
  adjacencyLists, rootId, LCA
) {
  this.rootX = 3000;
  this.rootY = 20;
  this.boxWidth = 200;
  this.boxHeight = 130;

  this.adjacencyLists = adjacencyLists;
  this.rootId = rootId;

  this.exploredNodes = {};
  this.processingNodesQueue = [];

  if (rootId) {
	this.nodes = {
	  id: rootId,
	  position: {
		x: this.rootX,
		y: this.rootY,
	  },
	  connectedNodes: [],
	}
  }

  this.minX = 0;
  this.maxX = 0;
  this.maxY = 0;

  this.generatePositions();

  console.log(JSON.stringify({
	nodes: this.nodes,
	minXCell: this.minXCell,
	maxXCell: this.maxXCell,
	maxDepth: this.maxDepth
  }));
}

POSITION_GENERATOR.insertNode = function insertNode (
  processingNodeId, id
) {
  function insertNode (curr) {
	if (curr.id === processingNodeId) {
	  curr.connectedNodes.push({
		id,
		position: {},
		connectedNodes: [],
	  });
	  return;
	}
	curr.connectedNodes.forEach(insertNode);
  }
  insertNode(this.nodes);

  this.reposition(this.nodes);
}

POSITION_GENERATOR.getLeafCount = function getLeafCount (node) {
  if (node.connectedNodes.length == 0) return 1;
  else return node.connectedNodes.map(this.getLeafCount, this)
	.reduce(function (totalLeafCount, currNodeLeafCount) {
	  return totalLeafCount + currNodeLeafCount;
	})
}

POSITION_GENERATOR.reposition = function reposition (node) {
  var leafCount = this.getLeafCount(node),
	left = node.position.x - this.boxWidth * (leafCount - 1) / 2;

  node.connectedNodes.forEach(function (connectedNode) {
	var shift = this.boxWidth * this.getLeafCount(connectedNode);
	left += shift;
	const updatedX = left - (shift + this.boxWidth) / 2,
	  updatedY = node.position.y + this.boxHeight;
	node.position = {
	  x: updatedX, 
	  y: updatedY 
	};

	if (updatedX < this.minX)
	  this.minX = updatedX;
	if (updatedX < this.maxX)
	  this.maxX = updatedX;
	if (updatedY > this.maxY)
	  this.maxY = updatedY;

	this.reposition(connectedNode);
  }, this);
}


/* Positions are generated with BFS exploration of the graph. */
POSITION_GENERATOR.generatePositions = function generatePositions () {
  if (this.rootId) {
	this.processingNodesQueue.push({ 
	  ...this.adjacencyLists[this.rootId],
	  y: this.rootY,
	  x: this.rootX,
	  index: 0,
	  totalTreeEdges: this.adjacencyLists[this.rootId].forwardEdges.length,
	});
  }

  while (this.processingNodesQueue.length) {
	const processingNode = this.processingNodesQueue.shift(),
	{ forwardEdges } = this.adjacencyLists[processingNode.id],

	forwardEdges.forEach(function (connectedNode, index) {
	  const { 
		id: nodeName, 
		icon = '',
		label = '' 
	  } = connectedNode;

	  this.insertNode(processingNode.id, nodeName);
	  /* if node hasn't been processed yet, push it to processing queue */
	  this.processingNodesQueue.push({
		...this.adjacencyLists[nodeName],
		index,
	  });
	}, this)
  }
}

module.exports = POSITION_GENERATOR;
