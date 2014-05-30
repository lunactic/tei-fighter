lineService = function($http,$q) {

	settings = {
		server_url: "localhost",
		port: 6969
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


	return {
		getAreaLines: getAreaLines

	}

}

teiService = function() {


	  var teiModel = {
            listOfPages: [],
            teiInfo: null,
            };
    // Stores the teiModel
    return {
        teiModel: teiModel
		}


}



