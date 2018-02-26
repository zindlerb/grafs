var {
	Graph,
	GraphPersistance
} = require('../graph_lib.js');

const _ = require('lodash')

const smallGraph = new Graph();
const node1 = smallGraph.addNode()
const node2 = smallGraph.addNode()
const node3 = smallGraph.addNode()

const edge1 = smallGraph.addEdge(node1.id, node2.id)
const edge2 = smallGraph.addEdge(node1.id, node3.id)

describe('Graph', () => {
	it('inserts nodes and edges', () => {
		expect(_.differenceBy(smallGraph.allNodes(), [node1, node2, node3], 'id')).toEqual([])
		expect(_.differenceBy(smallGraph.allEdges(), [edge1, edge2], 'id')).toEqual([])
	});

	it('serializes', () => {
		const serializedGraph = JSON.parse(GraphPersistance.serialize(smallGraph))
		expect(serializedGraph.nodes.length).toEqual(3)
		expect(serializedGraph.links.length).toEqual(2)
	})

	it('deserializes', () => {
		const deserialized = GraphPersistance.deserialize(GraphPersistance.serialize(smallGraph))
		expect(deserialized.getNode(node1.id)).toEqual(node1.id)
		expect(deserialized.getEdge(edge1.id)).toEqual(edge1.id)
	})
});
