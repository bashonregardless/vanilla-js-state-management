{ triggerOne: 
   newProcessedNode {
     depth: 1,
     xCell: 0,
     outdegree: 1,
     forwardEdge: [ 'actionOne' ],
     backEdge: [],
     parent: null },
  actionOne: 
   newProcessedNode {
     depth: 2,
     xCell: 0,
     outdegree: 1,
     forwardEdge: [ 'ifThenOne' ],
     backEdge: [],
     parent: 'triggerOne' },
  ifThenOne: 
   newProcessedNode {
     depth: 3,
     xCell: 0,
     outdegree: 2,
     forwardEdge: [ 'filterOne', 'actionTwo' ],
     backEdge: [],
     parent: 'actionOne' },
  filterOne: 
   newProcessedNode {
     depth: 4,
     xCell: -1,
     outdegree: 1,
     forwardEdge: [ 'actionThree' ],
     backEdge: [ 'actionOne' ],
     parent: 'ifThenOne' },
  actionTwo: 
   newProcessedNode {
     depth: 4,
     xCell: 1,
     outdegree: 0,
     forwardEdge: [],
     backEdge: [],
     parent: 'ifThenOne' },
  actionThree: 
   newProcessedNode {
     depth: 5,
     xCell: -1,
     outdegree: 0,
     forwardEdge: [],
     backEdge: [],
     parent: 'filterOne' } }
