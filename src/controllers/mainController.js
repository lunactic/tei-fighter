mainController = function ($scope, $location,  teiService) {
	
	// scope variables empty initialization
	$scope.currentUrl = ""; // Current url of the page (for canvas)
	//teiModel   = null; // reference to teiModel (service)
	$scope.listAreas  = []; //list of areas of current Page
	
	$scope.pageNumber = 0; // Number of the curren page
	$scope.menubar = "views/menubar.html";
	
	$scope.listOfPages = teiService.teiModel.listOfPages;
	// Returns true if there is some model loaded
	$scope.isModelLoaded = function() {
		return teiService.teiModel.teiInfo != null;	
	};
	
	$scope.newModel = function() {
		teiService.teiModel.teiInfo = new TeiInfo("Title","Publication", "Source Description");
		
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


	};


    // exporting xml
   generateXMLUrl = function() {
        var content = 'file content';
        var teiContent = generateTEI(teiService.teiModel);
        var blob = new Blob([ teiContent ], { type : 'text/plain' });
        $scope.xmlUrl = (window.URL || window.webkitURL).createObjectURL( blob );
			  $scope.xmlName = teiService.teiModel.teiInfo.title;
    };
	

	
	//snippets htmls
	$scope.snippets = {
		notTei: "snippets/notTei.html",
		newPage: "snippets/newPage.html"
	};

};


