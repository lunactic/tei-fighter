teiInfoController = function($scope, $rootScope, teiService) {
	$scope.teiModel = teiService.teiModel
	//Codemirror
	$scope.editorOptions = {
		lineWrapping : true,
		lineNumbers: true,
		//readOnly: 'nocursor',
		mode: 'xml',

	};


	$scope.isSomething = true;
	// DEBUG generates a new teiModel
	/*if (!teiModel || !teiModel.teiInfo) {
		//create teiModel
		teiModel.teiInfo = new TeiInfo("Title","Publication", "Source Description");
		teiModel.listOfPages = [];

		//Add a new page
		//Add the url
		var testUrl = "http://digi.ub.uni-heidelberg.de/diglitData/image/cpg148/4/007v.jpg";
	}
*/
	console.log(teiService);
	
	
	$scope.update = function() {
		console.log($scope.teiHeader);
		
		if(!$scope.teiModel.teiInfo) return;
		$scope.teiHeader = vkbeautify.xml(generateHeader($scope.teiModel.teiInfo).outerHTML);

		$scope.isSomething = true;
		var teiNode = generateTEI($scope.teiModel);
		console.log(teiNode);
		$scope.teiXml = vkbeautify.xml(teiNode.outerHTML);
		generateXMLUrl();
	};

	$scope.update();

	if($scope.teiModel.teiInfo)
		generateXMLUrl();
	/*var content = 'file content';
	var blob = new Blob([ $scope.teiXml ], { type : 'text/plain' });
	$scope.xmlUrl = (window.URL || window.webkitURL).createObjectURL( blob );
*/
}
