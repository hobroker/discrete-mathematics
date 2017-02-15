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
		 helper.iMatrix2All();

		$scope.data.a_list = [
			[1, 2],
			[0, 1],
			[1]
		];
		helper.aList2All();
	};

	$scope.$watch('points.count', (n) => {
		$scope.points.array = Array.apply(null, new Array(n)).map(() => 0);
		$scope.generate();
	});

	$scope.a_list_add = (row, item) => {
		$scope.data.a_list[row].push(item);
		$scope.data.a_list[row].sort();
		helper.aList2All();
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
	};

	$scope.event = {
		change: {
			i_matrix: () => {
				let invalidRows = [];
				$scope.data.i_matrix.forEach((row, key) => {
					let count = 0;
					row.forEach((item) => {
						if (!item)
							return;
						if (item == 2) count += 2;
						else if (item == -1 || item == 1) count++;
					});
					if (count != 2)
						invalidRows.push(key);
				});
				if (invalidRows.length)
					console.log(invalidRows);
				else {
					helper.iMatrix2All();
				}
			}
		},
		random: {
			i_matrix_add_row: () => {
				$scope.data.i_matrix.push(Array.apply(null, new Array($scope.points.count)).map(() => 0))
			},
			i_matrix_remove_row: (u) => {
				$scope.data.i_matrix.splice(u, 1);
				$scope.event.change.i_matrix();
			}
		}
	};

	const helper = {
		aMatrix2All: () => {

		},
		iMatrix2All: () => {
			let list = iMatrix2List($scope.data.i_matrix, $scope.points.count);
			$scope.data.a_matrix = [];
			list.forEach((row, key) => {
				$scope.data.a_list[key] = row;
				let f = [];
				for (let i = 0; i < $scope.points.count; i++)
					f.push(+(row.indexOf(i) != -1))
				$scope.data.a_matrix.push(f);
			});
		},
		aList2All: () => {
			let arcs = [];
			$scope.data.a_list.forEach((row, key) => {
				let f = [];
				for (let i = 0; i < $scope.points.count; i++)
					f.push(+(row.indexOf(i) != -1))
				$scope.data.a_matrix.push(f);

				row.forEach((item) => {
					arcs.push([key, item])
				})
			});
			$scope.data.i_matrix = [];
			arcs.forEach((arc) => {
				let f = [];
				for (let i = 0; i < $scope.points.count; i++)
					if (arc[0] == arc[1] && arc[0] == i)
						f.push(2);
					else if (arc[0] == i)
						f.push(-1);
					else if (arc[1] == i)
						f.push(1);
					else
						f.push(0);
				$scope.data.i_matrix.push(f);
			})
		},
	}
});

const iMatrix2List = (data, points) => {
	let list = [];
	for (let i = 0; i < points; i++)
		list[i] = [];
	data.forEach((row) => {
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
	list = list.map((row) => Array.from(new Set(row)));
	return list;
};