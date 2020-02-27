var adjacencyLists = { root: 'A', nodes: { A: { id: 'A', connectedNodes: ['B', 'C'] }, B: { id: 'B', connectedNodes: ['D', 'E'] }, C: { id: 'C', connectedNodes: ['F', 'G', 'H', 'Q', 'R'] }, D: { id: 'D', connectedNodes: [] }, E: { id: 'E', connectedNodes: ['K'] }, F: { id: 'F', connectedNodes: ['I'] }, G: { id: 'G', connectedNodes: ['J', 'L', 'N', 'P'] }, H: { id: 'H', connectedNodes: ['M', 'O'] }, K: { id: 'K', connectedNodes: [] }, I: { id: 'I', connectedNodes: [] }, J: { id: 'J', connectedNodes: [] }, L: { id: 'L', connectedNodes: [] }, M: { id: 'M', connectedNodes: [] }, N: { id: 'N', connectedNodes: [] }, O: { id: 'O', connectedNodes: [] }, P: { id: 'P', connectedNodes: [] }, Q: { id: 'Q', connectedNodes: [] }, R: { id: 'R', connectedNodes: [] } } },
    index = 0,
    getOrder = parent => value => {
        const { [value]: cur } = adjacencyLists.nodes;
        if (!cur.connectedNodes.length) {
            adjacencyLists.nodes[value].index = cur.index || ++index;
        }
        cur.connectedNodes.forEach(getOrder(value));
        adjacencyLists.nodes[parent].index = adjacencyLists.nodes[parent].index || ++index;
    },
    query = (a, b) => a === b
        ? 'middle'
        : adjacencyLists.nodes[a].index < adjacencyLists.nodes[b].index
            ? 'left'
            : 'right';

getOrder('A')('A');

console.log(query('A', 'D'));
console.log(query('A', 'M'));
console.log(query('C', 'H'));
console.log(query('H', 'C'));
console.log(query('H', 'H'));
console.log(adjacencyLists);
