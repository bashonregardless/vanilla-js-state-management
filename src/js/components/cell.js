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

	function calSVGWidth () {
	  const { minXCell: min, maxXCell: max } = store.state;
	  return 200 + ( (Math.abs(min) + Math.abs(max) + 1) * 60) + ( (Math.abs(min) + Math.abs(max) + 1) * 300)
	}

	function calSVGHeight (depth) {
	  return 200 + store.state.maxDepth * 240;
	}

	function calcX (xCell) {
	  if (xCell === 0) {
		return (calSVGWidth() / 2 );
	  }
	  if (xCell < 0) {
		return (calSVGWidth() / 2 ) - (Math.abs(xCell) * 300) - 60;
	  }
	  if (xCell > 0) {
		return (calSVGWidth() / 2 ) + (xCell * 300) + 60;
	  }
	}

	function getXForwardEdgePathM (xCell, outdegree, edgeNumber) {
	  if (xCell === 0)
		return (calSVGWidth() / 2 ) + (Math.abs(xCell) * 300) + (300 * ( (edgeNumber + 1) / (outdegree + 1) ))

	  if (xCell < 0)
		return (calSVGWidth() / 2 ) - (Math.abs(xCell) * 300) + (300 * ( (edgeNumber + 1) / (outdegree + 1) )) - (Math.abs(xCell) * 60)

	  if (xCell > 0)
		return (calSVGWidth() / 2 ) + (Math.abs(xCell) * 300) + (300 * ( (edgeNumber + 1) / (outdegree + 1) )) + (Math.abs(xCell) * 60)
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
	  if (store.state.nodes[parent].xCell > xCell) {
		if (xCell < 0)
		  return (calSVGWidth() / 2 ) - (Math.abs(xCell) * 300) + (300 * (1 / 4)) - (Math.abs(xCell) * 60)
	  } 
	  else {
		if (xCell > 0)
		  return (calSVGWidth() / 2 ) + (Math.abs(xCell) * 300) + (Math.abs(xCell) * 60) + (300 * (3 / 4));
	  }
	}

	function getYBackEdgePathM (connectedNode, depth) {
	  return (depth * 240) - 60 - 180
	}

	function getBackEdgePathv (connectedNode) {
	  const { depth } = store.state.nodes[connectedNode];
	  return (depth * 240) - 90;
	}

	function getBackEdgePathh (connectedNode, xCell) {
	  const { xCell: connectedNodeXCell } = store.state.nodes[connectedNode];
	  if (connectedNodeXCell === 0) {
		return (300 * (3 / 4)) + ( (Math.abs(xCell) - Math.abs(connectedNodeXCell) ) * 60);
	  }
	}

	function getBackEdgePath ({ depth, xCell, outdegree, forwardEdge, backEdge, parent }) {
	  return backEdge.map( function (connectedNode) {
		const { id = '', icon = '', label = '' } = connectedNode;
		return `
		  <path stroke="black"
			d="M ${getXBackEdgePathM(id, parent, xCell)},${getYBackEdgePathM(id, depth)}
			v -${getBackEdgePathv(id)}
			m 0,0
			h ${getBackEdgePathh(id, xCell)}"
		  />
		`;
	  }).join('');
	}

	self.element.innerHTML = `
	<svg viewBox="0 0 ${calSVGWidth()} ${calSVGHeight()}"
	  width="${calSVGWidth()}"
	  height="${calSVGHeight()}"
	>
	  ${Object.keys(store.state.nodes).map( item => {
		const { depth, xCell, outdegree, forwardEdge, backEdge, parent } = store.state.nodes[item];
		return `
		<g id="${item}">
		  <foreignObject x="${calcX(xCell)}" y="${((depth - 1) * 240)}" width="300" height="180">
		    <div class="cell">${item}</div>
		  </foreignObject>
		  ${getForwardEdgePath(store.state.nodes[item])}
		  ${getBackEdgePath(store.state.nodes[item])}
		</g>
		`
	  }).join('')}
	</svg>`;
  }
}
