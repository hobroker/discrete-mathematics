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
	$scope.dft = new DFT();
	$scope.bft = new BFT();

	$scope.generate = () => {
		$scope.data.a_list = [
			[1],
			[2],
			[4],
			[3],
			[]
		];
		$scope.playDFT();
		$scope.playBFT();
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

	$scope.playDFT = () => {
		$scope.dft.play($scope.data.a_list)
	};

	$scope.playBFT = () => {
		$scope.bft.play($scope.data.a_list)
	};
});

app.factory('Graph', () => {
	return {
		a_list: []
	}
});

app.factory('DFT', () => {
	return function () {
		this.root = 1;
		this.list = [];
		this.play = (data) => {
			let root = this.root - 1;
			let full = [];
			for (let i = 0; i < data.length; i++)
				full.push(i)
			function dft(v, list = []) {
				list.push(v);
				data[v].forEach(i => {
					if (!list.includes(i))
						dft(i, list)
				});
				return list;
			}

			let list = dft(root);
			while (!(q = list.equal(full)).equal)
				dft(q.point, list);
			this.list = list;
		};
	}
});

app.factory('BFT', () => {
	return function () {
		this.root = 1;
		this.list = [];
		this.play = (data) => {
			let root = this.root - 1;
			let queue = [];
			let list = [];
			let full = Array.from(new Array(data.length).keys());
			while (1) {
				queue.push(root);
				list.push(root);
				while (queue.length > 0) {
					u = queue.splice(0, 1)[0];
					for (let i = 0; i < data[u].length; i++) {
						v = data[u][i];
						if (!list.includes(v)) {
							list.push(v);
							queue.push(v);
						}
					}
				}
				let q = list.equal(full);
				if (q.equal)
					break;
				root = q.point;
			}
			this.list = list;
		};
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