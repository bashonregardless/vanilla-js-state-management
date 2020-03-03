'use strict'

import { DIMENSION } from './constants';
import { getNodeXPathM, getLabelX } from './getNodeXPathM.js';

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
    reqVerticalHeight = (connectedNodeY - nodeDivBottomPos) / 2,
    pathH = connectedNodeX + (DIMENSION.nodeWidth / 2),
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
