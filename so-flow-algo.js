var adjacencyLists = {
    root: 'A',
    nodes: {
        A: {
            id: 'A',
            connectedNodes: ['B', 'C']
        },
        B: {
            id: 'B',
            connectedNodes: ['D', 'E']
        },
        C: {
            id: 'C',
            connectedNodes: ['F', 'G', 'H', 'Q', 'R']
        },
        D: {
            id: 'D',
            connectedNodes: []
        },
        E: {
            id: 'E',
            connectedNodes: ['K']
        },
        F: {
            id: 'F',
            connectedNodes: ['I']
        },
        G: {
            id: 'G',
            connectedNodes: ['J', 'L', 'N', 'P']
        },
        H: {
            id: 'H',
            connectedNodes: ['M', 'O']
        },
        K: {
            id: 'K',
            connectedNodes: []
        },
        I: {
            id: 'I',
            connectedNodes: []
        },
        J: {
            id: 'J',
            connectedNodes: []
        },
        L: {
            id: 'L',
            connectedNodes: []
        },
        M: {
            id: 'M',
            connectedNodes: []
        },
        N: {
            id: 'N',
            connectedNodes: []
        },
        O: {
            id: 'O',
            connectedNodes: []
        },
        P: {
            id: 'P',
            connectedNodes: []
        },
        Q: {
            id: 'Q',
            connectedNodes: []
        },
        R: {
            id: 'R',
            connectedNodes: []
        },
    }
}

var count = 0;

function inorderTraversalNumbering(cur) {
    if (adjacencyLists.nodes[cur].connectedNodes.length) {
        // recurse left half subtrees
        for (let i = 0; i < Math.ceil(adjacencyLists.nodes[cur].connectedNodes.length / 2); i++) {
            inorderTraversalNumbering(adjacencyLists.nodes[cur].connectedNodes[i]);
        }
        // recurse right half subtrees
        for (let i = Math.ceil(adjacencyLists.nodes[cur].connectedNodes.length / 2); i < adjacencyLists.nodes[cur].connectedNodes.length; i++) {
            inorderTraversalNumbering(adjacencyLists.nodes[cur].connectedNodes[i]);
        }
        count++;
        adjacencyLists.nodes[cur].key = count;
    } else {
        count++;
        adjacencyLists.nodes[cur].key = count;
    }
}

inorderTraversalNumbering(adjacencyLists.root);
console.log(adjacencyLists)