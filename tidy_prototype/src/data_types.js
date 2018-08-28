export class Pos {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export class GraphContainerModel {
	constructor(pos) {
		this.graph = new Graph()
		this.pos = pos
	}
}
