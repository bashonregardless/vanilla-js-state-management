/* CONNECTION BOUNDARIES:
 *
 * Tree edge: There is only one tree edge incident on each node.
 * This incident edge intersects a node at (width / 2).
 * There can be multiple tree edges outgoing from a node.
 *
 * Back edge: There can be more than one back edge incident on a node.
 * All these edges are incident at the horizontal edge of a node.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import * as S from './styles';

export class ChartConnection extends Component {
  getItemXForwardEdgePathM(itemX, totalEdgeCount, edgeNumber) {
    // if odd number of total edges
    const width = 280;
    if (totalEdgeCount & 1) {
      return itemX + (width * (edgeNumber + 1) / (totalEdgeCount + 1))
    } else {
      if (edgeNumber < totalEdgeCount / 2) {
        return itemX + (width * (edgeNumber + 1) / (totalEdgeCount + 2))
      } else {
        return itemX + (width * (edgeNumber + 2) / (totalEdgeCount + 2))
      }
    }
  }

  getPathv(totalEdgeCount, edgeNumber) {
    if (totalEdgeCount & 1) {
      const dist = Math.abs(Math.floor(totalEdgeCount / 2) - edgeNumber);
      return 48 - dist * 16;
    } else {
      if (edgeNumber < totalEdgeCount / 2) {
        const dist = Math.abs(Math.floor(totalEdgeCount / 2) - edgeNumber);
        return 48 - dist * 16;
      } else {
        const dist = Math.abs((edgeNumber + 1) - Math.floor(totalEdgeCount / 2));
        return 48 - dist * 16;
      }
    }
  }

  getForwardEdgePath(
    item,
    connection,
    edgeNumber,
    connectedNodePosition,
    totalEdgeCount
  ) {
    const { id: itemId } = item;
    const { id: connectionId } = connection;
    const svgOffset = document.querySelector('svg').getBoundingClientRect();
    const {
      a,
      b,
      c,
      d,
      e,
      f
    } = document.querySelector('svg').getScreenCTM();

    const {
      x: itemSvgBBoxX,
      y: itemSvgBBoxY,
      height: itemSvgBBoxHeight
    } = document.querySelector(`#item-${itemId}`).getBBox();

    const {
      x: itemDivX,
      y: itemDivY,
      height: itemDivHeight,
      bottom: itemDivBottom
    } = document.querySelector(`#item-${itemId} > div`).getBoundingClientRect();

    const {
      x: connectionSvgBBoxX,
      y: connectionSvgBBoxY,
      height: connectionSvgBBoxHeight
    } = document.querySelector(`#item-${connectionId}`).getBBox();
    const reqItemX = this.getItemXForwardEdgePathM(itemSvgBBoxX, totalEdgeCount, edgeNumber);

    return (
      <path
        id={`connection-${itemId}-${connectionId}`}
        stroke='black'
        stroke-linejoin="round"
        d={`
            M ${reqItemX},${(itemDivBottom - svgOffset.y) * (1 / a)}
            v ${this.getPathv(totalEdgeCount, edgeNumber)}
            m 0,0
            H ${connectionSvgBBoxX + 140}
            m 0,0
            V ${connectionSvgBBoxY}
		`}
	  />
    )
  }

  insertConnection = (node) => {
    const {
      id,
      position = {},
      forwardEdges = {},
      backEdges = {}
    } = node;
    const { x, y } = position;
    const totalEdgeCount = forwardEdges.length + backEdges.length;

    return forwardEdges.map(function drawConnection(connection, index) {
      const { id } = connection;

      return (
        this.getForwardEdgePath(
          node,
          connection,
          index,
          this.props.data.flowData.nodesLookup[id].position,
          totalEdgeCount
        )
      )
    }, this)
  }


  render() {
    return (
      <g id="connections">
        {
          Object.values(this.props.data.flowData.nodesLookup).map(node => {
            return this.insertConnection(node)
          })
        }
      </g>
    )
  }
}

export default ChartConnection;
