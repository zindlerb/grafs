

/*
	Open q's:
		- bundle data in class or funcional ops seperate from class that operate on it

*/



// create a gra

// Good ref: https://github.com/dagrejs/graphlib/wiki/API-Reference#alg-postorder
class Graph {
	constructor() {
		this._nodes = {} // { id: , attrs: {}, edges: [] }
		this._edges = {} // { id: , attrs: {}, vertices: [a, b] , directed:  }
		this.baseId = 0;
	}

	genId() {
		this.baseId += 1;
		return this.baseId;
	}

	addEdge(nodeAId, nodeBId, directed, attrs) {
		const nodeA = this._nodes[nodeAId];
		const nodeB = this._nodes[nodeBId];

		const edge = { id: this.genId(), vertices: [nodeA, nodeB], directed, attrs: attrs || {} }
		nodeA.edges.push(edge)
		nodeB.edges.push(edge)
		this._edges[edge.id] = edge
		return edge;
	}

	addNode(attrs) {
		const node = { id: this.genId(), attrs: attrs || {}, edges: [] }
		this._nodes[node.id] = node;
		return node;
	}

	removeNode(nodeId) {
		const node = this._nodes[nodeId];
		node.edges.forEach((edge) => {
			this.removeEdge(edge.id);
		})

		delete this._nodes[nodeId];
	}

	removeEdge(edgeId) {
		const edge = this._edges[edgeId];
		const [vertexA, vertexB] = edge.vertices;
		this._nodes[vertexAId].edges.filter((edge) => edge.id != edgeId)
		this._nodes[vertexBId].edges.filter((edge) => edge.id != edgeId)
		delete this._edges[edgeId];
	}

	allNodes() {
		return Object.values(this._nodes)
	}

	allEdges() {
		return Object.values(this._edges)
	}

	bfs() {

	}

	dfs() {

	}

	// min span tree?
}

class GraphPersistance {
	/*
		serialized form
		{
			nodes: [ { id: , attrs: , } ]
			links: [
				{ id: , source: , target: , blah blah blah... }
			]
		}
	*/
	static serialize(graph) {
		const serializedGraph = {
			nodes: [],
			links: []
		}

		_.forEach(graph._nodes, (node) => {
			const newNode = Object.assign({}, node, {
				edges: [node.edges.map((edge) => edge.id)]
			})

			serializedGraph.nodes.push(newNode);
		})

		_.forEach(graph._edges, (edge) => {
		})

		JSON.stringify(serializedGraph);
	}

	static fromGraphSpecToGraph() {

	}

	static deserialize() {
		// transform back
		// in default constructor have this inside the loader
	}

	static saveToFile() {

	}

	static transformToDotLang() {

	}

	static loadFromFile() {

	}
}

function dotAlgo() {
	// rank
	// order
	// position
	// make splines
}

exports.Graph = Graph
exports.GraphPersistance = GraphPersistance
