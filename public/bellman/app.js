const app = angular.module('beacon', ['ngMaterial']);
app.config(($mdThemingProvider) => {
	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('yellow')
		.accentPalette('red');
});

const infinitySymbol = '∞';
const plusMinusSymbol = '±';

app.controller('DeskCtrl', ($scope, $timeout, Share) => {
	$scope.title = 'MD Lab 4';

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
		$scope.data.shortest.result = list;
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
		let beenThere = [1];
		list.forEach(row => row.forEach(i => beenThere[i] = 1));
		for (let i = 0; i < beenThere.length; i++)
			if (!beenThere[i])
				list[i] = [];
		$scope.data.longest.result = list;
	};
	$scope.humanList = (row = []) => {
		let a = row;
		a = a.sort().map((i) => parseInt(i) + 1);
		a.push(0);
		return a.join('_');
	};
	$scope.finish = false;
	$scope.start = () => {
		setTable();
		$scope.minPath();
		$scope.maxPath();
		$scope.finish = true;
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
		matrix: [],
		shortest: {
			result: []
		},
		longest: {
			result: []
		}
	}
});

const debug = () => {
	(function () {
		const a = document.createElement("script");
		a.src = "https://rawgit.com/kentcdodds/ng-stats/master/dist/ng-stats.js";
		a.onload = function () {
			window.showAngularStats()
		};
		document.head.appendChild(a)
	})();
};

Array.prototype.equals = function (array) {
	return JSON.stringify(this) === JSON.stringify(array)
};