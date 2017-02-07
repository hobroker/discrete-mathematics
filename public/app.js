var app = angular.module('beacon', ['ngMaterial']);
app.config(function ($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('yellow')
		.accentPalette('green');
});

app.controller('DeskCtrl', function ($scope) {
	let working = false;
	$scope.makeList = function (num) {
		return new Array(num);
	};
	$scope.input_types = {
		list: [
			{
				name: 'Matricea de incidență',
				src: '/parts/adjacency_matrix.html',
				generate: () => {

				}
			}, {
				name: 'Matricea de adiacență',
				src: '/parts/incidence_matrix.html',
				generate: () => {
					let val = $scope.points.count;
					$scope.data.i_matrix = Array.apply(null, new Array(val)).map(() => Array.apply(null, new Array(val)).map(() => rand(0, 1)));
				},
				watch: function (n, o) {
					if (working) return;
					working = true;
					$scope.data.a_list = [];
					n.forEach(function (row) {
						let f = [];
						row.forEach(function (item, j) {
							if (item == 1)
								f.push(j + 1)
						});
						f.sort();
						$scope.data.a_list.push(f)
					});
					working = false;
				}
			}, {
				name: 'Lista de adiacență',
				src: '/parts/adjacency_list.html',
				generate: () => {
					let val = $scope.points.count;
					$scope.data.a_list = Array.apply(null, new Array(val)).map(() => [0])
				},
				watch: function (n, o) {
					if (working) return;
					working = true;
					$scope.data.i_matrix = [];
					n.forEach(function (row) {
						let f = [];
						for (var i = 1; i <= $scope.points.count; i++)
							f.push(row.indexOf(i) != -1 ? 1 : 0)
						$scope.data.i_matrix.push(f)
					});
					working = false;
				}
			}
		]
	};
	$scope.points = {
		count: 3
	};
	$scope.data = {
		i_matrix: [],
		a_matrix: [],
		a_list: []
	};

	$scope.$watch('points.count', function () {
		$scope.input_types.list.forEach((i) => i.generate())
	});
	$scope.$watch('data.i_matrix', $scope.input_types.list[1].watch, true);
	$scope.$watch('data.a_list', $scope.input_types.list[2].watch, true);
	$scope.a_list_add = function (row, item) {
		$scope.data.a_list[row].push(item);
		$scope.data.a_list[row].sort();
	};
	$scope.a_list_remove = function (row, item) {
		let a = $scope.data.a_list[row];
		let index = a.indexOf(item);
		if (index > -1)
			a.splice(index, 1);
	};
	$scope.missingInList = function (row, item) {
		return $scope.data.a_list[row].indexOf(item) == -1;
	}
});

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);