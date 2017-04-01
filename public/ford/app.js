const app = angular.module('beacon', ['ngMaterial']);
app.config(($mdThemingProvider) => {
	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('yellow')
		.accentPalette('red');
});

const infinitySymbol = '∞';

app.controller('DeskCtrl', ($scope, $mdDialog, Share) => {
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

	$scope.isFull = (share) => {
		return share.from !== undefined && share.to !== undefined && share.share !== undefined;
	};

	$scope.minPath = () => {
		let pointsCount = $scope.points.count;
		let shares = $scope.data.shares;
		let history = [];
		let table = [];
		let hs = [];
		let logs = [];

		hs = Array.from(new Array(pointsCount).keys()).map((h, index) => !index ? 0 : Infinity);
		history = Array.from(new Array(pointsCount).keys()).map(i => []);
		history.forEach((item, index) => item.push(!index ? 0 : infinitySymbol));

		let stillWorking = true;
		let list = [];
		while (stillWorking) {
			list = [];
			let tableCol = [];
			stillWorking = false;
			shares.forEach(share => {
				let from = share.from - 1;
				let to = share.to - 1;
				let p = share.share;

				let diff = hs[to] - hs[from];
				let symbol = diff === p ? '=' : diff > p ? '>' : '<';
				tableCol.push(`H${to + 1}-H${from + 1}=${diff === Infinity ? infinitySymbol : diff} (${symbol})`);
				if (symbol === '=') {
					if (!list[from])
						list[from] = [];
					list[from].push(to)
				}
				if (diff > p) {
					let newVal = hs[from] + p;
					logs.push(`H${to + 1} = H${from + 1} + ${p} = ${newVal}`);
					hs[to] = newVal;
					history[to].push(newVal);
					stillWorking = true;
				}
			});
			table.push(tableCol);
		}
		$scope.data.shortest.hs.history = history;
		$scope.data.shortest.hs.values = hs;
		$scope.data.shortest.hs.table = table;
		$scope.data.shortest.result = list;
		$scope.data.shortest.logs = logs;
	};

	$scope.maxPath = () => {
		let pointsCount = $scope.points.count;
		let shares = $scope.data.shares;
		let history = [];
		let table = [];
		let hs = [];
		let logs = [];

		hs = Array.from(new Array(pointsCount).keys()).map((h, index) => !index ? 0 : -Infinity);
		history = Array.from(new Array(pointsCount).keys()).map(i => []);
		history.forEach((item, index) => item.push(!index ? 0 : "-" + infinitySymbol));

		let stillWorking = true;
		let list = [];
		while (stillWorking) {
			list = [];
			let tableCol = [];
			stillWorking = false;
			shares.forEach(share => {
				let from = share.from - 1;
				let to = share.to - 1;
				let p = share.share;

				let diff = hs[to] - hs[from];
				let symbol = diff === p ? '=' : diff > p ? '>' : '<';
				tableCol.push(`H${to + 1}-H${from + 1}=${diff === -Infinity ? "-" + infinitySymbol : diff} (${symbol})`);
				if (symbol === '=') {
					if (!list[from])
						list[from] = [];
					list[from].push(to)
				}
				if (diff < p) {
					let newVal = hs[from] + p;
					logs.push(`H${to + 1} = H${from + 1} + ${p} = ${newVal}`);
					hs[to] = newVal;
					history[to].push(newVal);
					stillWorking = true;
				}
			});
			table.push(tableCol);
		}
		$scope.data.longest.hs.history = history;
		$scope.data.longest.hs.values = hs;
		$scope.data.longest.hs.table = table;
		$scope.data.longest.result = list;
		$scope.data.longest.logs = logs;
	};

	$scope.humanList = (row = []) => {
		let a = row;
		a = a.sort().map((i) => parseInt(i) + 1);
		a.push(0);
		return a.join('_');
	};

});

app.factory('Share', () => {
	return {
		shares: [
			{"from": 1, "to": 2, "share": 6},
			{"from": 1, "to": 3, "share": 10},
			{"from": 1, "to": 5, "share": 12},
			{"from": 2, "to": 3, "share": 6},
			{"from": 2, "to": 4, "share": 4},
			{"from": 2, "to": 7, "share": 8},
			{"from": 3, "to": 4, "share": 5},
			{"from": 3, "to": 5, "share": 6},
			{"from": 4, "to": 5, "share": 7},
			{"from": 4, "to": 6, "share": 6},
			{"from": 4, "to": 8, "share": 10},
			{"from": 5, "to": 6, "share": 5},
			{"from": 5, "to": 7, "share": 6},
			{"from": 5, "to": 8, "share": 8},
			{"from": 6, "to": 8, "share": 4},
			{"from": 7, "to": 8, "share": 6}
		],
		shortest: {
			hs: {
				values: [],
				history: [],
				table: []
			},
			logs: [],
			result: []
		},
		longest: {
			hs: {
				values: [],
				history: [],
				table: []
			},
			logs: [],
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