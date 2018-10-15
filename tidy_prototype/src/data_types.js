import { genId } from './utilities/general.js'
import { Graph } from './graph_lib.js'
import { EMPTY_RANK_HEIGHT } from './constants.js'

export class Pos {
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	distanceTo(point) {
		const a = this.x - point.x
		const b = this.y - point.y

		return Math.sqrt(a * a + b * b)
	}

	add(p) {
		return new Pos(this.x + p.x, this.y + p.y)
	}
}

export class GraphContainer {
	constructor(pos) {
		this.id = genId()
		this.nodeMatrix = []
		this.graph = new Graph()
		this.pos = pos

		this.addNodeToMatrix(0, 0, 'Edit Text Here')
	}

	prependNodeToMatrix(text) {
		const node = this.graph.addNode({ text })
		this.nodeMatrix.unshift([node.id])

		this.pos.y -= EMPTY_RANK_HEIGHT
	}

	addNodeToMatrix(rank, order, text) {
		const node = this.graph.addNode({ text })
		if (!this.nodeMatrix[rank]) {
			this.nodeMatrix[rank] = []
		}

		this.nodeMatrix[rank].splice(order, 0, node.id)
	}
}

export class Rect {
	constructor(pos, width, height) {
		this.pos = pos
		this.width = width
		this.height = height
	}

	// Setters
	expand(amount) {
		return new Rect(
			new Pos(this.pos.x - amount, this.pos.y - amount),
			this.width + amount * 2,
			this.height + amount * 2
		)
	}

	shrink(amount) {
		return new Rect(
			new Pos(this.pos.x + amount, this.pos.y + amount),
			this.width - amount * 2,
			this.height - amount * 2
		)
	}

	// Getters
	glompPoint(pos) {
		const corners = this.corners()

		const leftWallDistance = Math.abs(corners.topLeft.x - pos.x)
		const topWallDistance = Math.abs(corners.topLeft.y - pos.y)
		const rightWallDistance = Math.abs(corners.bottomRight.x - pos.x)
		const bottomWallDistance = Math.abs(corners.bottomRight.y - pos.y)
	}

	corners() {
		return {
			topLeft: new Pos(this.x, this.y),
			topRight: new Pos(this.x + this.width, this.y),
			bottomLeft: new Pos(this.x, this.y + this.height),
			bottomRight: new Pos(this.x + this.width, this.y + this.height),
			center: new Pos(this.x + this.width / 2, this.y + this.height / 2),
		}
	}

	lineSegments() {
		const { topLeft, topRight, bottomLeft, bottomRight } = this.corners()
		return [
			new Line(topLeft, topRight),
			new Line(topRight, bottomRight),
			new Line(bottomLeft, bottomRight),
			new Line(topLeft, bottomLeft),
		]
	}

	doesIntersectLine(testLine) {
		return _.some(this.lineSegments(), line => line.intersects(testLine))
	}

	centerPoint() {
		this.corners().center
	}

	// Private
	_nearestSide(pos) {
		if (pos.x < this.x) {
		}
	}
}

export class Line {
	constructor(posA, posB) {
		this.posA = posA
		this.posB = posB
	}

	intersects(line1, line2) {
		this._intersects(
			line1.posA.x,
			line1.posA.y,
			line1.posB.x,
			line1.posB.y,
			line2.posA.x,
			line2.posA.y,
			line2.posB.x,
			line2.posB.y
		)
	}

	_intersects(a, b, c, d, p, q, r, s) {
		var det, gamma, lambda
		det = (c - a) * (s - q) - (r - p) * (d - b)
		if (det === 0) {
			return false
		} else {
			lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
			gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
			return 0 < lambda && lambda < 1 && (0 < gamma && gamma < 1)
		}
	}

	closestPointOnLine() {}

	get slope() {
		;(this.posB.y - this.posA.y) / (this.posB.x - this.posA.x)
	}
}

export class GraphContainerModel {
	constructor(pos) {
		this.graph = new Graph()
		this.pos = pos
	}
}
