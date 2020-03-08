'use strict'

import { DIMENSION } from './constants';
import { getNodeXPathM, getLabelX } from './getNodeXPathM.js';

function getVh(treeEdgeCount, edgeNumber) {
  const unit = DIMENSION.treeEdgeVerticalHeightUnit;
  // odd case
  if (treeEdgeCount & 1) {
	const flrMid = Math.floor(treeEdgeCount / 2);
	if (edgeNumber < flrMid) {
	  const gap = flrMid - edgeNumber;
	  return unit * gap;
	} else {
	  const gap = edgeNumber - flrMid;
	  return unit * gap;
	}
  }
  else { // even case
	const flrMid = treeEdgeCount / 2;
	if (edgeNumber < flrMid) {
	  const gap = ((flrMid) - 1) - edgeNumber;
	  return unit * gap;
	} else {
	  const gap = edgeNumber - flrMid;
	  return unit * gap;
	}
  }
}

export function deriveEdgeDimension(
  {
	treeEdgeCount,
	edgeNumber,
  },
  {
	nodeX,
	nodeY,
	nodeDivClientHeight,
  },
  {
	connectedNodeX,
	connectedNodeY
  }
) {
  const nodeDivBottomPos = nodeDivClientHeight + nodeY;

  const nodeXPathM = nodeX + getNodeXPathM(
	treeEdgeCount,
	edgeNumber
  ),
	reqVerticalHeight = ((connectedNodeY - nodeDivBottomPos) / 2)
	- getVh(treeEdgeCount, edgeNumber);

  const pathH = connectedNodeX + (DIMENSION.nodeWidth / 2),
	incidentNodeV = connectedNodeY - DIMENSION.markerAdjustment;

  return [
	nodeXPathM,
	nodeDivBottomPos,
	reqVerticalHeight,
	pathH,
	incidentNodeV
  ];
}

export function deriveLabelDimension(
  {
	treeEdgeCount,
	edgeNumber,
  },
  {
	nodeX,
	nodeY,
	nodeDivClientHeight,
  },
  {
	connectedNodeY,
	connectedNodeX
  }
) {
  const nodeDivBottomPos = nodeDivClientHeight + nodeY;

  const nodeXPathM = nodeX + getNodeXPathM(
	treeEdgeCount,
	edgeNumber
  ),
	reqVerticalHeight = (connectedNodeY - nodeDivBottomPos) / 2,
	labelX = getLabelX(
	  nodeX,
	  connectedNodeX,
	  edgeNumber,
	  nodeXPathM,
	  treeEdgeCount
	) - (DIMENSION.waitIconDiameter / 2),
	// In calculation of labelVerticalAdjustment the assumption is that there can only be an icon on a node
	// with TreeEdgeCount = 1 and labels on node with TreeEdgeCount > 1
	labelVerticalAdjustment = (treeEdgeCount === 1)
	? (DIMENSION.waitIconDiameter / 2)
	: (DIMENSION.labelHeight / 2),
	foreignObjectWidth = (treeEdgeCount === 1)
	? DIMENSION.iconForeignObjectWidth
	: 72,
	labelY = nodeDivBottomPos + reqVerticalHeight - labelVerticalAdjustment;

  return [labelX, labelY, foreignObjectWidth];
}
