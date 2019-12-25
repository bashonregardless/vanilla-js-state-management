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
//		  { id: 'actionOne', icon: '' }
//		]
//	  },
//	  actionOne: {
//		id: 'actionOne',
//		type: 'action',
//		text: 'Text Confirmation and Appointment',
//		outdegree: 1,
//		indegree: 2,
//		connectedNodes: [
//		  { id: 'ifThenOne', icon: '' }
//		]
//	  },
//	  actionTwo: {
//		id: 'actionTwo',
//		type: 'action',
//		text: 'Automated Call Confirmation before 3 days',
//		outdegree: 0,
//		indegree: 1,
//		connectedNodes: []
//	  },
//	  actionThree: {
//		id: 'actionThree',
//		type: 'action',
//		text: 'Email Confirmation before 1 day',
//		outdegree: 0,
//		indegree: 1,
//		connectedNodes: []
//	  },
//	  ifThenOne: {
//		id: 'ifThenOne',
//		type: 'ifThen',
//		text: 'Patient visits after receiving Text Message',
//		outdegree: 2,
//		indegree: 1,
//		connectedNodes: [
//		  { id: 'filterOne', icon: '', label: 'Not Responded' },
//		  { id: 'actionTwo', icon: '', label: 'Responded' }
//		]
//	  },
//	  filterOne: {
//		id: 'filterOne',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		outdegree: 1,
//		indegree: 1,
//		connectedNodes: [
//		  { id: 'actionThree', icon: '' },
//		  { id: 'actionOne', icon: 'wait'}
//		]
//	  },
//	}
//  }
//}

//module.exports = {
//  adjL: {
//	root: 'A',
//	nodes: {
//	  A: {
//		id: 'A',
//		type: 'trigger',
//		text: 'Patient with no visit in last 12 months & no visit scheduled in next 2 months',
//		connectedNodes: [
//		  { id: 'B', icon: '' },
//		  { id: 'C', icon: '' }
//		]
//	  },
//	  B: {
//		id: 'B',
//		type: 'action',
//		text: 'Text Confirmation and Appointment',
//		connectedNodes: [
//		  { id: 'D', icon: '' },
//		  { id: 'E', icon: '' }
//		]
//	  },
//	  C: {
//		id: 'C',
//		type: 'action',
//		text: 'Automated Call Confirmation before 3 days',
//		connectedNodes: [
//		  { id: 'F', icon: '' },
//		  { id: 'G', icon: '' },
//		  { id: 'H', icon: '' }
//		]
//	  },
//	  D: {
//		id: 'D',
//		type: 'action',
//		text: 'Email Confirmation before 1 day',
//		connectedNodes: []
//	  },
//	  E: {
//		id: 'E',
//		type: 'ifThen',
//		text: 'Patient visits after receiving Text Message',
//		connectedNodes: [
//		  { id: 'K', icon: '', label: 'Not Responded' },
//		]
//	  },
//	  F: {
//		id: 'F',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		connectedNodes: [
//		  { id: 'I', icon: '' },
//		]
//	  },
//	  G: {
//		id: 'G',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		connectedNodes: [
//		  { id: 'J', icon: '' },
//		  { id: 'L', icon: '' },
//		  { id: 'N', icon: '' },
//		]
//	  },
//	  H: {
//		id: 'H',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		connectedNodes: [
//		  { id: 'M', icon: '' },
//		  { id: 'O', icon: '' },
//		]
//	  },
//	  K: {
//		id: 'K',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		connectedNodes: []
//	  },
//	  I: {
//		id: 'I',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		connectedNodes: []
//	  },
//	  J: {
//		id: 'J',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		connectedNodes: []
//	  },
//	  L: {
//		id: 'L',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		connectedNodes: []
//	  },
//	  M: {
//		id: 'M',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		connectedNodes: []
//	  },
//	  N: {
//		id: 'N',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		connectedNodes: []
//	  },
//	  O: {
//		id: 'O',
//		type: 'filter',
//		text: 'Call from Care Coordinator',
//		connectedNodes: []
//	  },
//	}
//  }
//}

module.exports = {
  adjL: {
	root: 'A',
	nodes: {
	  A: {
		id: 'A',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'B' },
		  { id: 'C' }
		]
	  },
	  B: {
		id: 'B',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'D' },
		  { id: 'E' }
		]
	  },
	  C: {
		id: 'C',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'F' }
		]
	  },
	  D: {
		id: 'D',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'G' },
		  { id: 'H' },
		]
	  },
	  E: {
		id: 'E',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  F: {
		id: 'F',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  G: {
		id: 'G',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'I' },
		  { id: 'J' },
		  { id: 'K' },
		  { id: 'L' },
		  { id: 'M' },
		  { id: 'N' },
		  { id: 'O' }
		]
	  },
	  H: {
		id: 'H',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  I: {
		id: 'I',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'P' }
		]
	  },
	  J: {
		id: 'J',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'Q' }
		]
	  },
	  K: {
		id: 'K',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  L: {
		id: 'L',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'R' },
		  { id: 'S' },
		]
	  },
	  M: {
		id: 'M',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  N: {
		id: 'N',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  O: {
		id: 'O',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  P: {
		id: 'P',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'U' }
		]
	  },
	  Q: {
		id: 'Q',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  R: {
		id: 'R',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'V' },
		  { id: 'W' },
		  { id: 'X' }
		]
	  },
	  S: {
		id: 'S',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'Y' }
		]
	  },
	  T: {
		id: 'T',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  U: {
		id: 'U',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  V: {
		id: 'V',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'Z' }
		]
	  },
	  W: {
		id: 'W',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  X: {
		id: 'X',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'AA' }
		]
	  },
	  Y: {
		id: 'Y',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'BB' },
		  { id: 'CC' }
		]
	  },
	  Z: {
		id: 'Z',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'DD' },
		  { id: 'EE' },
		  { id: 'FF' }
		]
	  },
	  AA: {
		id: 'AA',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: [
		  { id: 'GG' },
		  { id: 'HH' },
		  { id: 'II' },
		  { id: 'JJ' },
		  { id: 'KK' },
		  { id: 'LL' },
		  { id: 'MM' },
		  { id: 'NN' },
		  { id: 'OO' }
		]
	  },
	  BB: {
		id: 'BB',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  CC: {
		id: 'CC',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  DD: {
		id: 'DD',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  EE: {
		id: 'EE',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  FF: {
		id: 'FF',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  GG: {
		id: 'GG',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  HH: {
		id: 'HH',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  II: {
		id: 'II',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  JJ: {
		id: 'JJ',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  KK: {
		id: 'KK',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  LL: {
		id: 'LL',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  MM: {
		id: 'MM',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  NN: {
		id: 'NN',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	  OO: {
		id: 'OO',
		type: 'filter',
		text: 'Call from Care Coordinator',
		connectedNodes: []
	  },
	}
  }
}
