export const TABS = [
  { label: 'Insights', type: 'insights' },
  { label: 'Initiatives', type: 'initiatives' },
  { label: 'Performance', type: 'performance' }
];

/* There are two types of dimensions:
 * Fundamental dimension: These fixed numbers that calculate the dimensions of chart.
 * Derived dimension: These are derived from fundamental dimensions.
 */

export const DIMENSION = {
  nodeWidth: 280,
  chartYMargin: 200,
  chartItemIconDiameter: 40,
  waitIconDiameter: 36,
  markerAdjustment: 3,
  incidentNodeMarginTop: 22,
  backEdgeHorizontalExtension: 105,
  backEdgeVerticalLengthFromNodeBottom: 24,
  labelHeight: 20,
  // This dimension is sum of icon diameter and margin of icon sibling container and its width.
  iconForeignObjectWidth: 112,
  // This dimension is sum of backEdgeHorizontalExtension on either side of chart 105 on each side,
  // and ForeignObjectWidth for an icon rendered on right most icon foreignObject.
  chartXMargin: 322,
}
