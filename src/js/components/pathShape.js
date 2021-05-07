import { deriveEdgeDimension } from '../utils/deriveDimensions';

function getPathShape (
  nodeId,
  connectedNodeId,
) {
  const {
	edgeNumber
  } = this;

  const {
	treeEdgeCount,
  } = this;

  // Get DOM nodes reference
  const nodeForeignObject = document.querySelector(`#item-${nodeId}`),
	connectedNodeForeignObject = document.querySelector(`#item-${connectedNodeId}`),
	nodeContainerDiv = document.querySelector(`#item-${nodeId} > div`);

  // Get svg node attributes
  const {
	x: nodeX,
	y: nodeY,
  } = nodeForeignObject.getBBox(),
	{
	  x: connectedNodeX,
	  y: connectedNodeY,
	} = connectedNodeForeignObject.getBBox(),
	// Get node client attributes
	{ clientHeight : nodeDivClientHeight } = nodeContainerDiv;

  let [
	nodeXPathM,
	nodeDivBottomPos,
	reqVerticalHeight,
	pathH,
	incidentNodeV
  ] = deriveEdgeDimension(
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
  );

  return `
	  M ${nodeXPathM},${nodeDivBottomPos}
	  v ${reqVerticalHeight}
	  m 0,0
	  H ${pathH}
	  m 0,0
	  V ${incidentNodeV}
	`;
}

export default getPath() {
  const { id: nodeId } = this.node,
	{ id: connectedNodeId } = this.connection;

  const pathShape = this.getPathShape(
	nodeId,
	connectedNodeId,
  );

  return `
	  <path
		id="connection-${nodeId}-${connectedNodeId}"
		stroke='#000000'
		strokeWidth='2'
		d="${pathShape}"
	  />
	`
}

