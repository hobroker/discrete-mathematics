var app = angular.module('beacon', ['ngMaterial']);
app.config(($mdThemingProvider) => {
	$mdThemingProvider.theme('default')
		.dark()
		.primaryPalette('yellow')
		.accentPalette('red');
});

app.controller('DeskCtrl', ($scope) => {
	$scope.input_types = {
		list: [
			{
				name: 'Matricea de incidență',
				src: '/parts/incidence_matrix.html',
			}, {
				name: 'Matricea de adiacență',
				src: '/parts/adjacency_matrix.html',
			}, {
				name: 'Lista de adiacență',
				src: '/parts/adjacency_list.html'
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

	$scope.generate = () => {
		$scope.data.i_matrix = [
			[0, 2, 0],
			[0, 1, -1],
			[-1, 1, 0],
			[1, -1, 0],
		];
		let list = [];
		for (let i = 0; i < $scope.points.count; i++)
			list[i] = [];
		$scope.data.i_matrix.forEach((row, r) => {
			let from, to;
			row.forEach((item, col) => {
				let c = col;
				if (!item)
					return;
				if (item == 2)
					list[c].push(c);
				else if (item == -1)
					if (typeof to == 'undefined')
						from = c;
					else
						list[c].push(to);
				else if (item == 1)
					if (typeof from == 'undefined')
						to = c;
					else
						list[from].push(c)
			})
		});
		$scope.data.a_matrix = [];
		list.forEach((row, key) => {
			$scope.data.a_list[key] = row;
			let f = [];
			for (let i = 0; i < $scope.points.count; i++)
				f.push(row.indexOf(i) != -1 ? 1 : 0)
			$scope.data.a_matrix.push(f);
		});
	};

	$scope.$watch('points.count', (n, o) => {
		$scope.points.array = Array.apply(null, new Array(n)).map(() => 0);
		$scope.generate();
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

	};

	$scope.a_matrix_add = () => {
		$scope.data.i_matrix.push(Array.apply(null, new Array($scope.points.count)).map(() => 0))
	};

	$scope.missingInList = (row, item) => {
		return $scope.data.a_list[row].indexOf(item) == -1;
	};

	$scope.humanAList = (row) => {
		let a = $scope.data.a_list[row].slice();
		a = a.sort().map((i) => i + 1);
		a.push(0);
		return a.join('_');
	}
});

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);