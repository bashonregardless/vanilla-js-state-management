//export default {
//  items: [
//	'I made this',
//	'Another thing'
//  ]
//};

//module.exports = {
//  adjL: {
//	root: 'triggerOne',
//	nodes: {
//	  triggerOne: {
//		id: 'triggerOne',
//		type: 'trigger',
//		text: 'Patient with no visit in last 12 months & no visit scheduled in next 2 months',
//		outdegree: 1,
//		indegree: 0,
//		connectedNodes: [
//		  'actionOne', 
//		]
//	  },
//	  actionOne: {
//		id: 'actionOne',
//		type: 'action',
//		text: 'Text Confirmation and Appointment',
//		outdegree: 3,
//		indegree: 1,
//		connectedNodes: [
//		  'actionFour',
//		  'rescheduled', 
//		  'actionTwo'
//		]
//	  },
//	  actionFour: {
//		id: 'actionFour',
//		type: 'action',
//		text: 'Text Reminder before 1 day',
//		outdegree: 1,
//		indegree: 3,
//		connectedNodes: [
//		  'ifThenOne'
//		]
//	  },
//	  rescheduled: {
//		id: 're',
//		type: 'label',
//		text: 'RESCHEDULED',
//		outdegree: 0,
//		indegree: 1,
//		connectedNodes: []
//	  },
//	  actionTwo: {
//		id: 'actionTwo',
//		type: 'action',
//		text: 'Automated Call Confirmation before 3 days',
//		outdegree: 2,
//		indegree: 1,
//		connectedNodes: [
//		  'actionFour', 
//		  'actionThree'
//		]
//	  },
//	  actionThree: {
//		id: 'actionThree',
//		type: 'action',
//		text: 'Email Confirmation before 1 day',
//		outdegree: 1,
//		indegree: 1,
//		connectedNodes: [
//		  'actionFour',
//		]
//	  },
//	  ifThenOne: {
//		id: 'ifThenOne',
//		type: 'ifThen',
//		text: 'Patient visits after receiving Text Message',
//		outdegree: 1,
//		indegree: 1,
//		connectedNodes: [
//		  'actionFive'
//		]
//	  },
//	  actionFive: {
//		id: 'actionFive',
//		type: 'action',
//		text: 'Call from Care Coordinator',
//		outdegree: 0,
//		indegree: 1,
//		connectedNodes: []
//	  },
//	}
//  }
//}


module.exports = {
  adjL: {
	root: 'triggerOne',
	nodes: {
	  triggerOne: {
		id: 'triggerOne',
		type: 'trigger',
		text: 'Patient with no visit in last 12 months & no visit scheduled in next 2 months',
		outdegree: 1,
		indegree: 0,
		connectedNodes: [
		  { id: 'actionOne', icon: '' }
		]
	  },
	  actionOne: {
		id: 'actionOne',
		type: 'action',
		text: 'Text Confirmation and Appointment',
		outdegree: 1,
		indegree: 2,
		connectedNodes: [
		  { id: 'ifThenOne', icon: '' }
		]
	  },
	  actionTwo: {
		id: 'actionTwo',
		type: 'action',
		text: 'Automated Call Confirmation before 3 days',
		outdegree: 0,
		indegree: 1,
		connectedNodes: []
	  },
	  actionThree: {
		id: 'actionThree',
		type: 'action',
		text: 'Email Confirmation before 1 day',
		outdegree: 0,
		indegree: 1,
		connectedNodes: []
	  },
	  ifThenOne: {
		id: 'ifThenOne',
		type: 'ifThen',
		text: 'Patient visits after receiving Text Message',
		outdegree: 2,
		indegree: 1,
		connectedNodes: [
		  { id: 'filterOne', icon: '', label: 'Not Responded' },
		  { id: 'actionTwo', icon: '', label: 'Responded' }
		]
	  },
	  filterOne: {
		id: 'filterOne',
		type: 'filter',
		text: 'Call from Care Coordinator',
		outdegree: 1,
		indegree: 1,
		connectedNodes: [
		  { id: 'actionThree', icon: '' },
		  { id: 'actionOne', icon: 'wait'}
		]
	  },
	}
  }
}
