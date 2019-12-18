var LCA = {};

LCA.setup = function setup (adjacencyLists, rootName) {
  this.adjacencyLists = adjacencyLists;

  this.size = 101;
 
  /* In Eulerian tour every edge is visited twice.
   * Depth First Search preorder traversal.
   *
   * eulerTour array is populated with nodes as they are visited
   * but with repetitions.
   */
  this.eulerTour = [];

  // depth for each node corresponding to euler tour
  this.depthArray = [];

  // stores first appearance index of every node
  this.firstAppearanceIndex = {};

  // pointer to euler walk
  this.ptr;

  // sparse table
  this.dp = [...Array(this.size)].map(x => Array(18).fill(-1));

  // stores depth for all nodes in the tree
  this.level = {};

  // store log values
  this.logn = [...Array(this.size)];

  // store power of 2
  this.powTwo = [...Array(20)];

  // preprocessing
  this.preprocess();

  this.ptr = 0;

  this.populateEulerTour(this.adjacencyLists[rootName], null, 0);

  // create level depth array corresponding to the euler tour array
  this.createDepthArray();

  // build sparse table
  this.buildSparseTable(this.depthArray.length);

  // console.log(`LCA(actionThree, actionTwo) is ${this.findLCA('actionThree', 'actionTwo')}`);
  // console.log(`LCA(filterOne, actionTwo) is ${this.findLCA('filterOne', 'actionTwo')}`);
  // console.log(`LCA(filterOne, actionThree) is ${this.findLCA('filterOne', 'actionThree')}`);
  // console.log(`LCA(ifThenOne, actionThree) is ${this.findLCA('ifThenOne', 'actionThree')}`);
  //console.log(`LCA(D, E) is ${this.findLCA('D', 'E')}`);
  //console.log(`LCA(F, E) is ${this.findLCA('F', 'E')}`);
  //console.log(`LCA(K, E) is ${this.findLCA('K', 'E')}`);
  //console.log(`LCA(J, H) is ${this.findLCA('J', 'H')}`);
}

LCA.preprocess = function preprocess () {
  // memorize powers of 2
  this.powTwo[0] = 1;
  for (let i = 1; i < 18; i++) {
	this.powTwo[i] = this.powTwo[i - 1] * 2;
  }

  // memorize log(n) values
  let val = 1, ptr = 0;
  for (let i = 1; i < this.size; i++) {
	this.logn[i] = ptr - 1;

	if (val === i) {
	  val *= 2;
	  this.logn[i] = ptr;
	  ptr++;
	}
  }
}

LCA.buildSparseTable = function buildSparseTable (size) {
  // fill base case values
  for (let i = 1; i < size; i++) {
	this.dp[i-1][0] = (this.depthArray[i] > this.depthArray[i - 1]) ? i - 1 : i;
  }

  // dynamic programming to fill sparse table
  for (let i = 1; i < 15; i++) {
	for (let j = 0; j < size; j++) {
	  if (this.dp[j][i - 1] !== -1 && this.dp[j + this.powTwo[i - 1]][i - 1] !== -1) {
		this.dp[j][i] =
		  (this.depthArray[this.dp[j][i - 1]] > this.depthArray[this.dp[j + this.powTwo[i - 1]][i - 1]]) ?
		  this.dp[j + this.powTwo[i - 1]][i - 1] : this.dp[j][i - 1];
	  } else {
		break;
	  }
	}
  }
}


LCA.findLCA = function findLCA (u, v) {
  if (u === v) {
	return u;
  }

  if (this.firstAppearanceIndex[u] > this.firstAppearanceIndex[v]) {
	let temp = v;
	v = u;
	u = temp;
  }

  // range minimum query
  return this.eulerTour[this.query(this.firstAppearanceIndex[u], this.firstAppearanceIndex[v])];
}

LCA.query = function query (l, r) {
  let d = r - l;
  let dx = this.logn[d];

  if (l === r) return l;

  if (this.depthArray[this.dp[l][dx]] > this.depthArray[this.dp[r - this.powTwo[dx]][dx]]) {
	return this.dp[r - this.powTwo[dx]][dx];
  } else {
	return this.dp[l][dx];
  };
}

LCA.populateEulerTour = function populateEulerTour (cur, prev, dep) { 
  const { id } = cur;

  // record first appearance index for cur node
  if (!Object.prototype.hasOwnProperty.call(this.firstAppearanceIndex, id)) {
	this.firstAppearanceIndex[id] = this.ptr;
  }

  this.level[id] = dep;

  // push root to euler tour
  this.eulerTour.push(id);
  
  // increment euler tour pointer
  this.ptr++;

  this.adjacencyLists[id].forwardEdges.forEach(function (nodeName) {
	if (nodeName !== prev) {
	  this.populateEulerTour(nodeName, id, dep + 1);
	}

	// push cur again in backtrack if euler tour
	this.eulerTour.push(id);

	// increment euler tour pointer
	this.ptr++;
  }.bind(this))
}

LCA.createDepthArray = function createDepthArray () { 
  this.eulerTour.forEach(function populateDepthArray (eulerTourNodeName) {
	this.depthArray.push(this.level[eulerTourNodeName])
  }.bind(this))
}

LCA.resolveCollision = function resolveCollision (occupantNode, newNode) {
  this.findLCA(occupantNode, newNode);
}

module.exports = LCA;
