const app = angular.module('beacon', ['ngMaterial']);
app.config(($mdThemingProvider) => {
	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('yellow')
		.accentPalette('red');
});

app.controller('DeskCtrl', ($scope, $mdDialog, Graph, DFT, BFT) => {
	$scope.title = 'MD Lab 2 & 3';

	$scope.points = {
		count: 5,
		array: []
	};

	$scope.data = Graph;

	$scope.generate = () => {
		$scope.data.a_list = [
			[1],
			[2],
			[4],
			[3],
			[]
		];
	};

	let firstTime = true;
	$scope.$watch('points.count', (n, o) => {
		$scope.points.array = zerosArray(n, 0);
		if (firstTime) {
			firstTime = false;
			$scope.generate();
		} else {
			if (n > o) {
				$scope.data.a_list.push([])
			} else {
				$scope.data.a_list.pop();
			}
		}
	});

	$scope.missingInList = (row, item) => {
		return !$scope.data.a_list[row].includes(item);
	};

	$scope.humanAList = (row) => {
		let a = $scope.data.a_list[row].slice();
		a = a.sort().map((i) => i + 1);
		a.push(0);
		return a.join('_');
	};

	$scope.event = {
		a_list: {
			add: (row, item) => {
				let a = $scope.data.a_list[row];
				a.push(item);
				a.sort();
			},
			remove: (row, item) => {
				let a = $scope.data.a_list[row];
				a.splice(a.indexOf(item), 1);
			}
		}
	};
});

app.factory('Graph', () => {
	return {
		a_list: []
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
