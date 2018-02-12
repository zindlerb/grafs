var {
	Graph,
	GraphPersistance
} = require('../graph_lib.js');

const _ = require('lodash')

describe('Graph', () => {
	const graph = new Graph();
	const node1 = graph.addNode()
	const node2 = graph.addNode()
	const node3 = graph.addNode()

	const edge1 = graph.addEdge(node1.id, node2.id)
	const edge2 = graph.addEdge(node1.id, node3.id)

	it('inserts nodes and edges', () => {
		expect(_.differenceBy(graph.allNodes(), [node1, node2, node3], 'id')).toEqual([])
		expect(_.differenceBy(graph.allEdges(), [edge1, edge2], 'id')).toEqual([])
	});
});
