var app = angular.module('beacon', ['ngMaterial']);
app.config(($mdThemingProvider) => {
	//noinspection JSUnresolvedFunction
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
				src: '/parts/i_matrix.html',
			}, {
				name: 'Matricea de adiacență',
				src: '/parts/a_matrix.html',
			}, {
				name: 'Lista de adiacență',
				src: '/parts/a_list.html'
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

	$scope.i_matrix_error = false;

	$scope.generate = () => {
		$scope.data.i_matrix = [Array.apply(null, new Array($scope.points.count)).map(() => 0)];
		helper.iMatrix2All();
	};

	let firstTime = true;
	$scope.$watch('points.count', (n, o) => {
		$scope.points.array = Array.apply(null, new Array(n)).map(() => 0);
		if (firstTime) {
			firstTime = false;
			$scope.generate();
		} else {
			if (n > o) {
				$scope.data.i_matrix.forEach((row) => {
					row.push(0)
				});
				$scope.data.a_matrix.forEach((row) => {
					row.push(0)
				});
				while ($scope.data.a_matrix.length < n)
					$scope.data.a_matrix.push(Array.apply(null, new Array(n)).map(() => 0));
				$scope.data.a_list.push([])
			} else {
				$scope.data.a_matrix = $scope.data.a_matrix.filter((item, index) => {
					return index < n;
				});
				$scope.data.a_matrix.forEach((row) => {
					row.pop();
				});
				$scope.data.i_matrix.forEach((row) => {
					row.pop();
				});
				$scope.data.a_list.pop();
			}
		}
	});

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
		i_matrix: {
			change: () => {
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
					$scope.i_matrix_error = true;
				else {
					$scope.i_matrix_error = false;
					helper.iMatrix2All();
				}
			},
			add: () => {
				$scope.data.i_matrix.push(Array.apply(null, new Array($scope.points.count)).map(() => 0))
			},
			remove: (u) => {
				$scope.data.i_matrix.splice(u, 1);
				$scope.event.i_matrix.change();
			}
		},
		a_list: {
			add: (row, item) => {
				$scope.data.a_list[row].push(item);
				$scope.data.a_list[row].sort();
				helper.aList2All();
			},
			remove: (row, item) => {
				let a = $scope.data.a_list[row];
				let index = a.indexOf(item);
				if (index > -1)
					a.splice(index, 1);
			}
		},
		a_matrix: {
			change: () => {
				helper.aMatrix2All();
			}
		}
	};

	const helper = {
		aMatrix2All: () => {
			$scope.data.a_list = [];
			$scope.data.a_matrix.forEach((row) => {
				let f = [];
				row.forEach((item, col) => {
					if (item == 1)
						f.push(col)
				});
				$scope.data.a_list.push(f)
			});
			helper.aList2All();
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
			$scope.data.a_matrix = [];
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
				let f = [],
					from = arc[0],
					to = arc[1];
				for (let i = 0; i < $scope.points.count; i++)
					if (from == to && from == i)
						f.push(2);
					else if (from == i)
						f.push(-1);
					else if (to == i)
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
