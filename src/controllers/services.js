lineService = function($http,$q, $modal) {


	settings = {
		server_url: "http://diufpc49",
		port: 8088
	}

	var trolled = function(top, left, bottom, right) {
		var height = bottom - top;
		var N = 10;
		var step = height/N;
		var ctop = top;

		var lines = [];

		for (i = 0; i < N; ++i) {
			lines.push({"top":ctop,
									"bottom":ctop+step,
									"left":left,
									"right":right
								 });
			ctop += step;
		}

		return lines;
	}

	var getAreaLines = function(urlImage, top, left, bottom, right) {

		/*	var data_send =
					{
						"url":urlImage,
						"top":top,
						"bottom": bottom,
						"left":left,
						"right":right,
						"mode":"trolled"
					}

		  $http({
				method: 'POST',
				data: data_send,
			}).success(data) {
				console.log("The lines are successful", data);

			}
		*/
		var lines = trolled(top,left,bottom, right);
		var d = $q.defer();
		d.resolve(lines);

		return d.promise;



	};

	var getWords = function(urlImage, top, left, bottom, right) {

		var data_send =
				{
					"url":urlImage,
					"top":top,
					"bottom": bottom,
					"left":left,
					"right":right,
					"mode":"trolled"
				};


		var d = $q.defer();
		var service_url = settings.server_url + ":" + settings.port +"/webapi/word/segment";
		console.log("Sending request", service_url, data_send);
		$http({
			method: 'POST',
			url: service_url,
			data: data_send,
		}).success(function(data) {
			console.log("The words are successful", data);
			d.resolve(data);
		}).error(function(data, status) {
			console.log("Something is wrong", data, status);
		});

		return d.promise;

	};

	var getLines = function(urlImage, top, left, bottom, right) {

		var data_send =
				{
					"url":urlImage,
					"top":top,
					"bottom": bottom,
					"left":left,
					"right":right,
					"mode":"trolled"
				};

		var d = $q.defer();
		var service_url = settings.server_url + ":" + settings.port +"/LineSeg/LineSeg";
		console.log("Sending request", service_url, data_send);
		$http({
			method: 'POST',
			url: service_url,
			data: data_send,
		}).success(function(data) {
			console.log("The words are successful", data);
			d.resolve(data);
		}).error(function(data, status) {
			console.log("Something is wrong", data, status);
		});

		return d.promise;

	};

	return {
		getAreaLines: getAreaLines,
		getWords: getWords,
		getLines: getLines
	}


}

teiService = function($http, $q) {


	var teiModel = {
		listOfPages: [],
		teiInfo: null,

	};
	var currentPage = null;

	var loadJSONModel = function(model_url) {
		var d = $q.defer();
		$http({
			method: 'GET',
			url: model_url,

		}).success(function(data) {
			console.log("Loading the model", data);
			d.resolve(data);
		}).error(function(data, status) {
			console.log("Error when loading the model", data, status);
		});

		return d.promise;
	}
	// Stores the teiModel
	return {
		teiModel: teiModel,
		currentPage: currentPage,
		loadJSONModel: loadJSONModel

	}


}

// This service is used for open a model window asking for something

questionService = function($modal) {

	confirm = function(title, message) {
		var modalInstance = $modal.open({
			templateUrl: 'snippets/modalTemplate.html',
			controller: function($scope, $modalInstance, title, message) {
				$scope.message = message;
				$scope.title = title;
				$scope.ok = function() {
					$modalInstance.close();
				};
				$scope.cancel = function() {
					$modalInstance.dismiss('cancel');
				};
			},
			//size: size,
			resolve: {
				message: function() { return message; },
				title: function() { return title; }
			}
		});

		return modalInstance.result;
	};

	return {
		confirm: confirm
	}
}



