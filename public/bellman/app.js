const app = angular.module('beacon', ['ngMaterial']);
app.config(($mdThemingProvider) => {
	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('yellow')
		.accentPalette('red');
});

const plusMinusSymbol = '±';

app.controller('DeskCtrl', ($scope, $timeout, Share) => {
	$scope.title = 'MD Lab 5';

	$scope.points = {
		count: 8,
		array: []
	};

	$scope.data = Share;

	$scope.addShare = () => {
		$scope.data.shares.push({})
	};

	$scope.removeShare = ($index) => {
		$scope.data.shares.splice($index, 1)
	};

	const setTable = () => {
		let pointsCount = $scope.points.count;
		let shares = $scope.data.shares;
		let matrix = [];
		for (let i = 0; i < pointsCount; i++) {
			let f = [];
			for (let i = 0; i < pointsCount; i++) {
				f.push(Infinity)
			}
			matrix.push(f)
		}
		shares.forEach(share => {
			let i = share.from - 1;
			let j = share.to - 1;
			matrix[i][j] = share.share;
		});
		matrix = matrix.map((row, i) => row.map((item, j) => {
			if (i === j)
				return 0;
			return item === Infinity ? plusMinusSymbol : item;
		}));
		$scope.data.matrix = matrix;
	};

	$scope.minPath = () => {
		let pointsCount = $scope.points.count;
		let matrix = $scope.data.matrix;

		const s = (k) => isNaN(k) ? Infinity : k;

		let v = [];
		v.push([]);
		for (let i = 0; i < pointsCount; i++) {
			v[0].push(matrix[i][pointsCount - 1])
		}
		let end = false;
		let counter = 0;
		while (!end) {
			counter++;
			v.push([]);
			for (let i = 0; i < pointsCount; i++) {
				let sums = [];
				for (let j = i + 1; j <= pointsCount; j++) {
					let sum = s(matrix[i][j - 1]) + s(v[counter - 1][j - 1]);
					if (sum !== Infinity)
						sums.push(sum);
				}
				v[counter].push(Math.min(...sums))
			}
			if (v[counter].equals(v[counter - 1]))
				end = true;
		}
		let g = v[counter];
		let list = [];
		for (let i = 0; i < g.length - 1; i++) {
			list[i] = [];
			let index = i === (g.length - 1) ? i : i + 1;
			for (let j = index; j < g.length; j++)
				if (s(matrix[i][j]) + g[j] === g[i])
					list[i].push(j)
		}
		$scope.data.vs.min = v;
		$scope.data.shortest.length = v[counter][0];
		$scope.data.shortest.result = getPaths(v[counter][0], list);
	};

	$scope.maxPath = () => {
		let pointsCount = $scope.points.count;
		let matrix = $scope.data.matrix;
		let v = [];
		const s = (k) => isNaN(k) ? -Infinity : k;
		v.push([]);
		for (let i = 0; i < pointsCount; i++) {
			v[0].push(matrix[i][pointsCount - 1])
		}
		let end = false;
		let counter = 0;
		while (!end) {
			counter++;
			v.push([]);
			for (let i = 0; i < pointsCount; i++) {
				let sums = [];
				for (let j = i + 1; j <= pointsCount; j++) {
					let sum = s(matrix[i][j - 1]) + s(v[counter - 1][j - 1]);
					if (sum !== Infinity)
						sums.push(sum);
				}
				v[counter].push(Math.max(...sums))
			}
			if (v[counter].equals(v[counter - 1]))
				end = true;
		}
		let g = v[counter];
		let list = [];
		for (let i = 0; i < g.length - 1; i++) {
			list[i] = [];
			let index = i === (g.length - 1) ? i : i + 1;
			for (let j = index; j < g.length; j++)
				if (s(matrix[i][j]) + g[j] === g[i])
					list[i].push(j)
		}
		$scope.data.vs.max = v;
		$scope.data.longest.length = v[counter][0];
		$scope.data.longest.result = getPaths(v[counter][0], list);
	};
	$scope.humanList = (row = []) => {
		let a = row;
		a = a.sort().map((i) => parseInt(i) + 1);
		a.push(0);
		return a.join('_');
	};
	$scope.humanPath = (row = []) => {
		return row.map(i => i + 1).join(', ');
	};
	$scope.finish = false;
	$scope.start = () => {
		setTable();
		$scope.minPath();
		$scope.maxPath();
		$scope.finish = true;
	};

	const getPaths = (r, list) => {
		let count = $scope.points.count - 1;
		let graph = $scope.data.shares;
		let g = {};
		graph.forEach(item => g[(item.from - 1) + '' + (item.to - 1)] = item.share);
		let path = [];
		let paths = [];
		let onPath = [];
		const enumerate = (list, v, t) => {
			path.push(v);
			onPath.push(v);
			if (v === t) {
				let sum = 0;
				for (let i = 0; i < path.length - 1; i++)
					sum += g[`${path[i]}${path[i + 1]}`]
				if (sum === r)
					paths.push(path.slice())
			}
			else
				list[v].forEach(w => {
					if (!onPath.includes(w))
						enumerate(list, w, t)
				});
			path.pop();
			onPath.splice(onPath.indexOf(v), 1);
		};
		enumerate(list, 0, count);
		return paths;
	};
});

app.factory('Share', () => {
	return {
		shares: [
			{from: 1, to: 2, share: 6},
			{from: 1, to: 3, share: 10},
			{from: 1, to: 5, share: 12},
			{from: 2, to: 3, share: 6},
			{from: 2, to: 4, share: 4},
			{from: 2, to: 7, share: 8},
			{from: 3, to: 4, share: 5},
			{from: 3, to: 5, share: 6},
			{from: 4, to: 5, share: 7},
			{from: 4, to: 6, share: 6},
			{from: 4, to: 8, share: 10},
			{from: 5, to: 6, share: 5},
			{from: 5, to: 7, share: 6},
			{from: 5, to: 8, share: 8},
			{from: 6, to: 8, share: 4},
			{from: 7, to: 8, share: 6}
		],
		vs: {
			min: [],
			max: []
		},
		matrix: [],
		shortest: {
			result: []
		},
		longest: {
			result: []
		}
	}
});

Array.prototype.equals = function (array) {
	return JSON.stringify(this) === JSON.stringify(array)
};