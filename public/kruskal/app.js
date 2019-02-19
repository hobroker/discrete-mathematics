const app = angular.module('beacon', ['ngMaterial']);
app.config(($mdThemingProvider) => {
	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('yellow')
		.accentPalette('red');
});

app.controller('DeskCtrl', ($scope, $timeout, Share) => {
	$scope.title = 'MD Lab 6';

	$scope.points = {
		count: 7,
		array: []
	};

	$scope.data = Share;

	$scope.addShare = () => {
		$scope.data.shares.push({})
	};

	$scope.removeShare = ($index) => {
		$scope.data.shares.splice($index, 1)
	};

	$scope.humanList = (row = []) => {
		let a = row;
		a = a.sort().map((i) => parseInt(i) + 1);
		a.push(0);
		return a.join('_');
	};

	$scope.kruskal = () => {
		let pointsCount = $scope.points.count;
		let edges = $scope.data.shares.map(edge => [edge[0] - 1, edge[1] - 1]);

		let g = new Graph(pointsCount);
		edges.forEach(item => g.addEdge(item));

		$scope.data.result = g.kruskal();

	};

	$scope.finish = false;
	$scope.start = () => {
		$scope.kruskal();
		$scope.finish = true;
	};

	// $scope.start()
});

app.factory('Share', () => {
	return {
		shares: [
			[1, 2],
			[2, 3],
			[3, 4],
			[4, 5],
			[5, 6],
			[6, 7],
			[7, 1],

			[1, 3],
			[7, 3],
			[7, 4],
			[6, 3],
			[5, 2],
		]
	}
});

Array.prototype.equal = function (array) {
	for (let i = 0; i < this.length; i++) {
		if (!array.includes(this[i]))
			return {equal: false, point: this[i]};
	}
	for (let i = 0; i < array.length; i++) {
		if (!this.includes(array[i]))
			return {equal: false, point: array[i]};
	}
	return {equal: true};
};

class Graph {
	constructor(vertices) {
		this.V = vertices;
		this.graph = [];
	}

	addEdge(item) {
		this.graph.push([item[0], item[1], 1]);
	}

	find(parent, i) {
		return parent[i] === i ? i : this.find(parent, parent[i])
	}

	union(parent, rank, x, y) {
		let xroot = this.find(parent, x);
		let yroot = this.find(parent, y);
		if (rank[xroot] < rank[yroot])
			parent[xroot] = yroot;
		else if (rank[xroot] > rank[yroot])
			parent[yroot] = xroot;
		else {
			parent[yroot] = xroot;
			rank[xroot] += 1;
		}
	}

	kruskal() {
		let self = this;
		let [i, e] = [0, 0];
		let [result, parent, rank] = [[], [], []];

		for (let node = 0; node < self.V; node++) {
			parent.push(node);
			rank.push(0);
		}
		while (e < self.V - 1) {
			let [u, v, w] = self.graph[i++];
			let x = self.find(parent, u);
			let y = self.find(parent, v);
			if (x !== y) {
				e++;
				result.push([u, v, w]);
				self.union(parent, rank, x, y);
			}
		}
		let list = Array.from(new Array(self.V).keys()).map(i => []);
		result.forEach(item => list[item[0]].push(item[1]));
		return list;
	}
}
