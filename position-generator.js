'use strict'

var POSITION_GENERATOR = {};

POSITION_GENERATOR.positionGeneratorSetup = function positionGeneratorSetup (
  rootId
) {
  this.boxWidth = 200;
  this.boxHeight = 130;

  if (rootId) {
	this.nodes = {
	  id: rootId,
	  position: {
		x: 0,
		y: 20,
	  },
	  connectedNodes: [],
	}
  }

  this.minX = 0;
  this.maxX = 0;
  this.maxY = 0;
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
	connectedNode.position = {
	  x: updatedX, 
	  y: updatedY 
	};

	if (updatedX < this.minX)
	  this.minX = updatedX;
	if (updatedX > this.maxX)
	  this.maxX = updatedX;
	if (updatedY > this.maxY)
	  this.maxY = updatedY;

	this.reposition(connectedNode);
  }, this);
}

module.exports = POSITION_GENERATOR;
