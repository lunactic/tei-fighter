mainController = function ($scope, $location,  $modal, teiService, questionService) {

	$scope.version = "0.0.2";

	$scope.drawingOptions = {
		area_color : "blue",
		selected_area_color: "red",
		line_color : "green",
		selected_line_color: "purple",
		opacity: 0.4

	};


	  $scope.sliderConfig = {
        min: 0,
        max: 1,
        step: 0.1
    }

		$scope.show_info = false;

	$scope.showInfo = function(value) {
		$scope.show_info = value;
	}
	// scope variables empty initialization
	$scope.currentUrl = ""; // Current url of the page (for canvas)
	//teiModel   = null; // reference to teiModel (service)
	$scope.listAreas  = []; //list of areas of current Page

	$scope.pageNumber = 0; // Number of the curren page
	$scope.menubar = "views/menubar.html";

	// Setting the current page variable for retrieve the page while editing
	$scope.data = {};
	$scope.data.canvasUrl = "#";
	$scope.data.changes = false;

	$scope.listOfPages = teiService.teiModel.listOfPages;

	// Returns true if there is some model loaded
	$scope.isModelLoaded = function() {
		return teiService.teiModel.teiInfo != null;
	};

	$scope.newModel = function() {
		teiService.teiModel.teiInfo = new TeiInfo("Title","Publication", "Source Description");
		$scope.teiInfo = teiService.teiModel.teiInfo;

		// TODO: ask confirmation of saving the old one
		teiService.teiModel.listOfPages.length = 0;
		$scope.data.changes = true;

	};

	$scope.numPages = function() {
		return teiService.teiModel.listOfPages.length;
	};

	$scope.havePages = function() {
		return teiService.teiModel.listOfPages.length > 0;
	};

	$scope.newPage = function(purl) {
		var ppage = new PageInfo(purl);
		$scope.listOfPages.push(ppage);
		$scope.currentUrl = ppage.url;
		$scope.pageInfo = ppage;
		$scope.listAreas = ppage.areas;
		$scope.pageNumber = teiModel.listOfPages.length;
		$scope.data.canvasUrl = "#?page="+($scope.pageNumber-1);

	};

	// It clean drawing and other not useful information
	var cleanModel = function(teiModel) {
		var newModel = jQuery.extend(newModel, teiModel);

		// Remove drawing stuff
		newModel.listOfPages.forEach(function(page) {

			page.areas.forEach(function(area) {
				area.rect = null;
				area.lines.forEach(function(line) {
					line.rect = null;
				});
			});
		});

		return newModel;

	};

	// exporting xml
	$scope.generateXMLUrl = function() {

		if (!teiService.teiModel) return;
		var content = 'file content';

		var teiContent = generateTEI(teiService.teiModel);
		teiContent = vkbeautify.xml(teiContent.outerHTML);
		var blob = new Blob([ teiContent ], { type : 'text/plain' });
		$scope.xmlUrl = (window.URL || window.webkitURL).createObjectURL( blob );
		$scope.xmlName = teiService.teiModel.teiInfo.title;

	};

	$scope.exportModel = function() {
		$scope.generateXMLUrl();
		$scope.generateJSONUrl();
	}



	//snippets htmls
	$scope.snippets = {
		notTei: "snippets/notTei.html",
		newPage: "snippets/newPage.html",
		exportModel: "snippets/exportModel.html",
		importModel: "snippets/importModel.html"
	};

	// exporting json
	$scope.generateJSONUrl = function() {

		if (!teiService.teiModel) return;
		var content = 'file content';
		var clean_model = cleanModel(teiModel)
		var teiContent = JSON.stringify(clean_model);
		teiContent = vkbeautify.json(teiContent);
		var blob = new Blob([ teiContent ], { type : 'text/plain' });
		$scope.jsonUrl = (window.URL || window.webkitURL).createObjectURL( blob );
		$scope.jsonName = teiService.teiModel.teiInfo.title;

	};

	$scope.demo1_url = "samples/demo1.json";
	$scope.demo2_url = "samples/demo2.json";

	parseJSONModel = function(data) {
			// TODO: Check that the model is correct

			// removing the list elements
			teiService.teiModel.listOfPages.length = 0;
			teiService.teiModel.teiInfo = data.teiInfo;

			for (var p = 0; p < data.listOfPages.length; p++) {
				var page = data.listOfPages[p];
				var modelPage = new PageInfo(page.url);
			 $scope.teiInfo = teiService.teiModel.teiInfo;

				for (var a = 0; a < page.areas.length; a++) {
					var area = page.areas[a];
					var topLeft = {x:area.left, y:area.top};
					var bottomRight = {x:area.right, y:area.bottom};
					var modelArea = new Area(topLeft, bottomRight);

					modelArea.transcription = area.transcription;
					modelArea.id = area.id;
					for (var l = 0; l < area.lines.length; l++) {

						var line = area.lines[l];
						var topLeft = {x:line.left, y:line.top};
						var bottomRight = {x:line.right, y:line.bottom};
						var modelLine = new Line(topLeft, bottomRight);

						if (!line.id)
							modelLine.id = area.id + "l"+l;
						else
							modelLine.id = line.id;
						modelLine.transcription = line.transcription;
						modelArea.lines.push(modelLine);
					}
					modelPage.areas.push(modelArea);
				}
				teiService.teiModel.listOfPages.push(modelPage);
			}
			$scope.data.changes = true;
			$location.url($location.path());
	};

	$scope.loadJSONModel = function(model_url) {
		teiService.loadJSONModel(model_url).then(parseJSONModel
		); // ending of the promise request
	};


  $scope.inputJSON = function($fileContent,$fileName){
		try {
		    var data = JSON.parse($fileContent);
        parseJSONModel(data);
				$scope.importInfo = "Model Loaded succesfully!";
		}
		catch(err) {
				$scope.importInfo = "Seems that something is not going well: "+err;
		}
  };

	$scope.closeImport = function($fileContent,$fileName){
			$scope.importInfo = "";

  };

	// Sort the list given the Y components
	$scope.sortByY = function(listOfLines) {
		listOfLines.sort(function(lineA, lineB) {
			return lineA.top > lineB.top;
		});

	}

	// Sort the list given the Y components
	$scope.sortByID = function(listOfLines) {
		listOfLines.sort(function(lineA, lineB) {
			return lineA.id > lineB.id;
		});

	}
	$scope.showAbout = function() {

		var version = $scope.version;
		var modalInstance = $modal.open({
			templateUrl: 'snippets/about.html',
			controller: function($scope, $modalInstance, version) {
				$scope.version = version;
				$scope.close = function() {
					$modalInstance.close();
				}
			},
			resolve: {
				version: function() { return version; }

			}
		});

	}

  $scope.testModal = function() {

		questionService.confirm("Warning!", "The current area have already lines with transcription on them. \
		This lines will be removed, are you sure you want to continue?").then(function() {
			alert("alerta");
		});

	}
};
