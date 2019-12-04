//export default {
//  adjL: {
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
//		text: 'Call Patient',
//		outdegree: 1,
//		indegree: 1,
//		connectedNodes: [
//		  'ifThenOne', 
//		]
//	  },
//	  ifThenOne: {
//		id: 'ifThenOne',
//		type: 'ifThen',
//		outdegree: 2,
//		indegree: 1,
//		connectedNodes: [
//		  'filterOne', 
//		  'actionRight',
//		]
//	  },
//	  filterOne: {
//		id: 'filterOne',
//		type: 'filter',
//		text: 'No. of reattemps <= 3',
//		outdegree: 1,
//		indegree: 1,
//		connectedNodes: [
//		  'actionOne', 
//		  'actionLeft',
//		]
//	  },
//	  actionLeft: {
//		id: 'actionLeft',
//		type: 'action',
//		text: 'Send Voicemail',
//		outdegree: 0,
//		indegree: 1,
//		connectedNodes: []
//	  },
//	  actionRight: {
//		id: 'actionRight',
//		type: 'action',
//		text: 'Play voice message & record the response',
//		outdegree: 0,
//		indegree: 1,
//		connectedNodes: []
//	  }
//	}
//  },
//  items: [
//	'I made this',
//	'Another thing'
//  ]
//};

module.exports = {
  root: 'triggerOne',
  nodes: {
	triggerOne: {
	  id: 'triggerOne',
	  type: 'trigger',
	  text: 'Patient with no visit in last 12 months & no visit scheduled in next 2 months',
	  outdegree: 1,
	  indegree: 0,
	  connectedNodes: [
		'actionOne', 
	  ]
	},
	actionOne: {
	  id: 'actionOne',
	  type: 'action',
	  text: 'Text Confirmation and Appointment',
	  outdegree: 3,
	  indegree: 1,
	  connectedNodes: [
		'actionFour',
		'rescheduled', 
		'actionTwo'
	  ]
	},
	actionFour: {
	  id: 'actionFour',
	  type: 'action',
	  text: 'Text Reminder before 1 day',
	  outdegree: 1,
	  indegree: 3,
	  connectedNodes: [
		'ifThenOne'
	  ]
	},
	rescheduled: {
	  id: 're',
	  type: 'label',
	  text: 'RESCHEDULED',
	  outdegree: 0,
	  indegree: 1,
	  connectedNodes: []
	},
	actionTwo: {
	  id: 'actionTwo',
	  type: 'action',
	  text: 'Automated Call Confirmation before 3 days',
	  outdegree: 1,
	  indegree: 1,
	  connectedNodes: [
		'actionFour', 
		'actionThree'
	  ]
	},
	actionThree: {
	  id: 'actionThree',
	  type: 'action',
	  text: 'Email Confirmation before 1 day',
	  outdegree: 1,
	  indegree: 1,
	  connectedNodes: [
		'actionFour',
	  ]
	},
	ifThenOne: {
	  id: 'ifThenOne',
	  type: 'ifThen',
	  text: 'Patient visits after receiving Text Message',
	  outdegree: 1,
	  indegree: 1,
	  connectedNodes: [
		'actionFive'
	  ]
	},
	actionFive: {
	  id: 'actionFive',
	  type: 'action',
	  text: 'Call from Care Coordinator',
	  outdegree: 0,
	  indegree: 1,
	  connectedNodes: []
	},
  }
}
