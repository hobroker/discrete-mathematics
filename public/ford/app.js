const app = angular.module('beacon', ['ngMaterial']);
app.config(($mdThemingProvider) => {
	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('yellow')
		.accentPalette('red');
});

const infinitySymbol = '∞';

app.controller('DeskCtrl', ($scope, $mdDialog, Share) => {
	$scope.title = 'MD Lab 2 & 3';

	$scope.points = {
		count: 8,
		array: []
	};

	$scope.data = Share;

	$scope.generate = () => {

	};

	let firstTime = true;
	$scope.$watch('points.count', (n, o) => {
		$scope.points.array = zerosArray(n, 0);
		if (firstTime) {
			firstTime = false;
			$scope.generate();
		} else {
			if (n > o) {
				// $scope.data.a_list.push([])
			} else {
				// $scope.data.a_list.pop();
			}
		}
	});

	$scope.addShare = () => {
		$scope.data.shares.push({})
	};

	$scope.removeShare = ($index) => {
		$scope.data.shares.splice($index, 1)
	};

	$scope.isFull = (share) => {
		return share.from !== undefined && share.to !== undefined && share.share !== undefined;
	};

	$scope.minPath = () => {
		let pointsCount = $scope.points.count;
		let shares = $scope.data.shares;
		let h = $scope.data.shortest.hs;
		let history = h.history;
		let table = h.table;
		let hs = h.values;
		let logs = $scope.data.shortest.logs;

		hs.length = 0;
		table.length = 0;
		history.length = 0;
		hs = Array.from(new Array(pointsCount).keys()).map((h, index) => !index ? 0 : Infinity);
		history = Array.from(new Array(pointsCount).keys()).map(i => []);
		history.forEach((item, index) => item.push(!index ? 0 : infinitySymbol));

		let stillWorking = true;
		while (stillWorking) {
			let col = [];
			stillWorking = false;
			shares.forEach(share => {
				let from = share.from - 1;
				let to = share.to - 1;
				let p = share.share;

				let diff = hs[to] - hs[from];
				let l = diff === p ? '=' : diff > p ? '>' : '<';
				col.push(`H${to + 1}-H${from + 1}=${diff === Infinity ? infinitySymbol : diff} (${l})`)
				if (diff > p) {
					let newVal = hs[from] + p;
					logs.push(`H${to + 1} = H${from + 1} + ${p} = ${newVal}`);
					hs[to] = newVal;
					history[to].push(newVal);
					stillWorking = true;
				}
			});
			table.push(col)
		}
		$scope.data.shortest.hs.history = history;
		$scope.data.shortest.hs.values = hs;
		$scope.data.shortest.hs.table = table;
		console.log(table)
	};

});

app.factory('Share', () => {
	return {
		shares: [
			{"from": 1, "to": 2, "share": 2},
			{"from": 1, "to": 3, "share": 6},
			{"from": 1, "to": 5, "share": 8},
			{"from": 2, "to": 3, "share": 2},
			{"from": 2, "to": 4, "share": 2},
			{"from": 3, "to": 4, "share": 1},
			{"from": 3, "to": 5, "share": 2},
			{"from": 3, "to": 7, "share": 4},
			{"from": 4, "to": 5, "share": 3},
			{"from": 4, "to": 6, "share": 3},
			{"from": 4, "to": 8, "share": 6},
			{"from": 5, "to": 6, "share": 1},
			{"from": 5, "to": 7, "share": 2},
			{"from": 5, "to": 8, "share": 4},
			{"from": 6, "to": 8, "share": 2},
			{"from": 7, "to": 8, "share": 1}
		],
		shortest: {
			hs: {
				values: [],
				history: [],
				table: []
			},
			logs: []
		}
	}
});

const zerosArray = (length, value) => ("" + value).repeat(length).split('').map(Number);

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


(function () {
	const a = document.createElement("script");
	a.src = "https://rawgit.com/kentcdodds/ng-stats/master/dist/ng-stats.js";
	a.onload = function () {
		window.showAngularStats()
	};
	document.head.appendChild(a)
})();