import Component from '../lib/component.js';
import store from '../store/index.js';

export default class Status extends Component {
  constructor() {
	super({
	  store,
	  element: document.querySelector('.js-status')
	});
  }

  /**
   * React to state changes and render the component's HTML
   *
   * @returns {void}
   */
  render() {
	let self = this;

	function calcX (xCell) {
	  if (xCell === 0) {
		return 1000;
	  }
	  if (xCell < 0) {
		return 1000 - (Math.abs(xCell) * 300) - 60;
	  }
	  if (xCell > 0) {
		return 1000 + (xCell * 300) + 60;
	  }
	}

	function getX1 (xCell) {
	  if (xCell === 0)
		return 1000 + (xCell * 300) + (300 / 2);

	  if (xCell < 0)
		return 1000 - (Math.abs(xCell) * 300) + (300 / 2) - (Math.abs(xCell) * 60); 

	  if (xCell > 0)
		return 1000 + (xCell * 300) + (300 / 2) + (xCell * 60);
	}

	function getX2 (xcell) {
	  if (xcell === 0)
		return 1000 + (xcell * 300) + (300 / 2);

	  if (xcell < 0)
		return 1000 - (Math.abs(xcell) * 300) + (300 / 2) - (Math.abs(xcell) * 60); 

	  if (xcell > 0)
		return 1000 + (xcell * 300) + (300 / 2) + (xcell * 60);
	}

	function getY1 (depth) {
	  return ((depth) * 240) - 60
	}

	function getY2 (depth) {
	  return ((depth) * 240)
	}

	function getXForwardEdgePathM (xCell, outdegree, edgeNumber) {
	  if (xCell === 0)
		return 1000 + (Math.abs(xCell) * 300) + (300 * ( (edgeNumber + 1) / (outdegree + 1) ))

	  if (xCell < 0)
		return 1000 - (Math.abs(xCell) * 300) + (300 * ( (edgeNumber + 1) / (outdegree + 1) )) - (Math.abs(xCell) * 60)

	  if (xCell > 0)
		return 1000 + (Math.abs(xCell) * 300) + (300 * ( (edgeNumber + 1) / (outdegree + 1) )) + (Math.abs(xCell) * 60)
	}

	function getYForwardEdgePathM (depth, outdegree, edgeNumber) {
	  return (depth * 240) - 60
	}

	function getPathv (outdegree) {
	  if (outdegree === 1)
		return 60;

	  if (outdegree > 1)
		return 34;
	}

	function getPathh (edgeNumber, outdegree, xCell) {
	  /* if outdegree is odd */
	  if (outdegree & 1) {
		if (edgeNumber + 1 === Math.floor(outdegree / 2) + 1)
		  return 0;

		else if ( (edgeNumber + 1) < Math.floor(outdegree / 2) + 1)
		  return ( 300 * ( (edgeNumber + 1) / (outdegree + 1) ) ) + ( Math.abs(xCell) * 60 ) + (300 / 2);

		else
		  return ( 300 - ( 300 * ( (edgeNumber + 1) / (outdegree + 1) ) )) + ( Math.abs(xCell) * 60 ) + (300 / 2);
	  }

	  else {
		if (edgeNumber < outdegree / 2)
		  return `-${( 300 * ( (edgeNumber + 1) / (outdegree + 1) ) ) + ( Math.abs((outdegree / 2) - edgeNumber) * 60 ) + (300 / 2)}`;
		else
		  return ( 300 - ( 300 * ( (edgeNumber + 1) / (outdegree + 1) ) )) + ( Math.abs(outdegree - edgeNumber) * 60 ) + (300 / 2);
	  }
	}

	//	function getPath ({ id, depth, xCell, outdegree }) {
	//	  return [...Array(outdegree).keys()].map( function (edgeNumber) {
	//		  return `
	//		   <path stroke="black"
	//			 d="M ${getXPathM(xCell, outdegree, edgeNumber)},${getYPathM(depth, outdegree, edgeNumber)}
	//			 v ${getPathv(outdegree)}
	//			 m 0,0
	//			 h ${outdegree > 1 ? getPathh(edgeNumber, outdegree, xCell) : 0}
	//			 m 0,0
	//			 v ${getPathv(outdegree)}"
	//		   />
	//		   `;
	//	  }).join('')
	//	}

	function getForwardEdgePath ({ depth, xCell, outdegree, forwardEdge, backEdge }) {
	  return [...Array(forwardEdge.length).keys()].map( function (edgeNumber) {
		  return `
		   <path stroke="black"
			 d="M ${getXForwardEdgePathM(xCell, forwardEdge.length, edgeNumber)},${getYForwardEdgePathM(depth, forwardEdge.length, edgeNumber)}
			 v ${getPathv(forwardEdge.length)}
			 ${forwardEdge.length > 1 ? `m 0,0` : ''}
			 ${forwardEdge.length > 1 ? `h ${getPathh(edgeNumber, forwardEdge.length, xCell)}` : 0}
			 ${forwardEdge.length > 1 ? `m 0,0` : ''}
			 ${forwardEdge.length > 1 ? `v ${getPathv(forwardEdge.length)}` : ''}"
		   />
		   `;
	  }).join('')
	}

	function getXBackEdgePathM (connectedNode, parent, xCell) {
	  if (store.state[parent].xCell > xCell) {
		if (xCell < 0)
		  return 1000 - (Math.abs(xCell) * 300) + (300 * (1 / 4)) - (Math.abs(xCell) * 60)
	  } 
	  else {
		if (xCell > 0)
		  return 1000 + (Math.abs(xCell) * 300) + (Math.abs(xCell) * 60) + (300 * (3 / 4));
	  }
	}

	function getYBackEdgePathM (connectedNode, depth) {
	  //const { depth } = store.state[connectedNode];
	  return (depth * 240) - 60 - 180
	}

	function getBackEdgePathv (connectedNode) {
	  const { depth } = store.state[connectedNode];
	  return (depth * 240) - 90;
	}

	function getBackEdgePathh (connectedNode, xCell) {
	  const { xCell: connectedNodeXCell } = store.state[connectedNode];
	  if (connectedNodeXCell === 0) {
		return (300 * (3 / 4)) + ( (Math.abs(xCell) - Math.abs(connectedNodeXCell) ) * 60);
	  }
	}

	function getBackEdgePath ({ depth, xCell, outdegree, forwardEdge, backEdge, parent }) {
	  return backEdge.map( function (connectedNode) {
		return `
		  <path stroke="black"
			d="M ${getXBackEdgePathM(connectedNode, parent, xCell)},${getYBackEdgePathM(connectedNode, depth)}
			v -${getBackEdgePathv(connectedNode)}
			m 0,0
			h ${getBackEdgePathh(connectedNode, xCell)}"
		  />
		`;
	  }).join('');
	}

	self.element.innerHTML = `
	<svg viewBox="0 0 2000 2000" width="2000" height="2000">
	  ${Object.keys(store.state).map( item => {
		const { depth, xCell, outdegree, forwardEdge, backEdge, parent } = store.state[item];
		return `
		<g id="${item}">
		  <foreignObject x="${calcX(xCell)}" y="${((depth - 1) * 240)}" width="300" height="180">
		    <div class="cell">${item}</div>
		  </foreignObject>
		  ${getForwardEdgePath(store.state[item])}
		  ${getBackEdgePath(store.state[item])}
		</g>
		`
	  }).join('')}
	</svg>`;
  }
}

//${store.state.nodes.map(item => {
//  const { id, depth, xCell, outdegree } = item;
//  return `
//		  <g id="${id}">
//			<foreignObject x="${calcX(xCell)}" y="${((depth - 1) * 240)}" width="300" height="180">
//			  <div class="cell">text</div>
//			</foreignObject>
//			${getPath(item)}
//		  </g>
//		  `
//}).join('')}

//${ outdegree === 1 && `
//			  <line x1="${getX1(xCell)}" y1="${getY1(depth)}" x2="${getX2(xCell)}" y2="${getY2(depth)}" stroke="black" />
//			` }
