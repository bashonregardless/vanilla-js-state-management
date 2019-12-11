//export default {
//  nodes : [
//	{ id: "triggerOne", depth: 1, xCell: 0, outdegree: 1 },
//	{ id: "actionOne", depth: 2, xCell: 0, outdegree: 1  },
//	{ id: "ifThenOne", depth: 3, xCell: 0, outdegree: 2  },
//	{ id: "filterOne", depth: 4, xCell: -1, outdegree: 2  },
//	{ id: "actionTwo", depth: 4, xCell: 1, outdegree: 0  },
//	{ id: "actionThree", depth: 5, xCell: -1, outdegree: 1 } 
//  ]
//}
export default {
  triggerOne: {
     depth: 1,
     xCell: 0,
     outdegree: 1,
     forwardEdge: [ 'actionOne' ],
     backEdge: [],
     parent: null 
	},
  actionOne: {
     depth: 2,
     xCell: 0,
     outdegree: 1,
     forwardEdge: [ 'ifThenOne' ],
     backEdge: [],
     parent: 'triggerOne' 
  },
  ifThenOne: {
     depth: 3,
     xCell: 0,
     outdegree: 2,
     forwardEdge: [ 'filterOne', 'actionTwo' ],
     backEdge: [],
     parent: 'actionOne' 
  },
  filterOne: {
     depth: 4,
     xCell: -1,
     outdegree: 1,
     forwardEdge: [ 'actionThree' ],
     backEdge: [ 'actionOne' ],
     parent: 'ifThenOne'
  },
  actionTwo: {
     depth: 4,
     xCell: 1,
     outdegree: 0,
     forwardEdge: [],
     backEdge: [],
     parent: 'ifThenOne' 
  },
  actionThree: {
     depth: 5,
     xCell: -1,
     outdegree: 0,
     forwardEdge: [],
     backEdge: [],
     parent: 'filterOne' 
  }
}
