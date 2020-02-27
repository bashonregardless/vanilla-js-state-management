import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as S from './styles';

import _map from 'lodash/map';

const IconBgColors = {
  action: "#2EA843",
  trigger: "#0070DD",
  ifThen: "#3D51D4",
  filter: "#D93737",
}

export class ChartItem extends Component {

  shouldComponentUpdate(nextProps) {
    return (this.props.data.itemsRendered === nextProps.data.itemsRendered);
  }

  componentDidMount() {
    this.props.data.setItemsState(true);
  }

  componentWillUnmount() {
    this.props.data.setItemsState(false);
  }

  onClickChart = event => {
    const { type, id } = event.currentTarget.dataset || {};

    if (type === 'action' || type === 'trigger') {
      this.props.onOpenPreview(id);
    } else {
      return null;
    }
  }

  renderChartNode(item) {
    const {
      displayName = "Trigger",
      type = "action",
      text,
      id,
    } = item || {};

    return (
      <S.Wrapper data-type={type} data-id={id} onClick={this.onClickChart}>
        <S.IconWrapper bgColor={IconBgColors[type]}>
          <S.StyledIcon className="material-icons" name="assignment">assignment</S.StyledIcon>
        </S.IconWrapper>
        <S.ChartWrapper>
          <S.FlexWrapper>
            <S.ChartTitle color={IconBgColors[type]}>{displayName} </S.ChartTitle>
            <S.Message>{text}</S.Message>
          </S.FlexWrapper>
        </S.ChartWrapper>
      </S.Wrapper>
    );
  }

  onOpenPreview = event => {
    this.props.onOpenPreview(event);
  }

  insertNode = (node) => {
    const { id, position = {} } = node;
    const { x, y } = position;
    return (
      <foreignObject
        id={`item-${id}`}
        x={x}
        y={y}
        width="280"
        height="150"
      >
        {this.renderChartNode(node)}
        {/*<ChartItem
          item={node}
          onOpenPreview={this.props.onOpenPreview}
        />*/}
      </foreignObject>
    )
  }

  render() {
    return (
      <g id="items">
        {
          Object.values(this.props.data.flowData.nodesLookup).map(node => {
            return this.insertNode(node)
          })
        }
      </g>
    )
  }
}

ChartItem.propTypes = {
  item: PropTypes.object,
  onOpenPreview: PropTypes.func,
};

export default ChartItem;
