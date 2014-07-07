lineService = function($http,$q) {


	settings = {
		server_url: "http://134.21.140.44",
		port: 8080
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
				console.log("Marcel is Gay", data, status);
			});

		return d.promise;

	};

	return {
		getAreaLines: getAreaLines,
		getWords: getWords
	}

}

teiService = function() {


	  var teiModel = {
            listOfPages: [],
            teiInfo: null,

            };
	  var currentPage = null;
    // Stores the teiModel
    return {
        teiModel: teiModel,
			  currentPage: currentPage

		}


}



