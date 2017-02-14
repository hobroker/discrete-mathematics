var app = angular.module('beacon', ['ngMaterial']);
app.config(($mdThemingProvider) => {
	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('yellow')
		.accentPalette('green');
});

app.controller('DeskCtrl', ($scope) => {
	let working = false;
	$scope.input_types = {
		list: [
			{
				name: 'Matricea de incidență',
				src: '/parts/adjacency_matrix.html',
				watch: (n, o) => {
					if (working) return;
					working = true;
					// $scope.data.i_matrix = [];
					n.forEach((row) => {
						// console.log(row)
					});

					working = false;
				}
			}, {
				name: 'Matricea de adiacență',
				src: '/parts/incidence_matrix.html',
				generate: () => {
					let val = $scope.points.count;
					$scope.data.i_matrix = Array.apply(null, new Array(val)).map(() => Array.apply(null, new Array(val)).map(() => rand(0, 1)));
				},
				watch: (n, o) => {
					if (working) return;
					working = true;
					$scope.data.a_list = [];
					n.forEach((row) => {
						let f = [];
						row.forEach((item, j) => {
							if (item == 1)
								f.push(j + 1)
						});
						f.sort();
						$scope.data.a_list.push(f);
					});

					$scope.data.a_matrix = [];
					$scope.data.a_list.forEach((row, rowIndex) => {
						let f = [];
						let add = false;

						for (var i = 1; i <= $scope.points.count; i++) {
							let v = row.indexOf(i) != -1 ? 1 : 0;
							let g = v;
							if (v) add = true;
							f.push(g)
						}
						$scope.data.a_matrix.push(f)
					});

					working = false;
				}
			}, {
				name: 'Lista de adiacență',
				src: '/parts/adjacency_list.html',
				watch: (n, o) => {
					if (working) return;
					working = true;

					$scope.data.i_matrix = [];
					n.forEach((row) => {
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
		count: 3,
		array: []
	};
	$scope.data = {
		i_matrix: [],
		a_matrix: [],
		a_list: []
	};

	let first_time = true;
	$scope.$watch('points.count', (n, o) => {
		if (first_time) {
			first_time = false;
			$scope.input_types.list[1].generate();
		} else {
			if (n > o) {
				$scope.data.i_matrix.push(Array.apply(null, new Array(n)).map(() => 0))
			} else {
				$scope.data.i_matrix.pop();
			}
		}
		$scope.points.array = Array.apply(null, new Array(n)).map(() => 0);
	});
	['data.a_matrix', 'data.i_matrix', 'data.a_list'].forEach((item, index) => {
		$scope.$watch(item, $scope.input_types.list[index].watch, true);
	});
	$scope.a_list_add = (row, item) => {
		$scope.data.a_list[row].push(item);
		$scope.data.a_list[row].sort();
	};

	$scope.a_list_remove = (row, item) => {
		let a = $scope.data.a_list[row];
		let index = a.indexOf(item);
		if (index > -1)
			a.splice(index, 1);
	};

	$scope.a_matrix_remove = (u) => {
		let x = JSON.stringify($scope.data.a_matrix[u].map((i) => i ? 1 : 0));
		let foundIt = false;
		$scope.data.i_matrix.forEach((item, index) => {
			if (foundIt) return;
			if (JSON.stringify(item) == x) {
				$scope.data.i_matrix[index].forEach((i, j) => {
					$scope.data.i_matrix[index][j] = 0;
				});
				foundIt = true;
			}
		})
	};

	$scope.a_matrix_add = () => {
		$scope.data.i_matrix.push(Array.apply(null, new Array($scope.points.count)).map(() => 0))
	};

	$scope.missingInList = (row, item) => {
		return $scope.data.a_list[row].indexOf(item) == -1;
	};
});

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);