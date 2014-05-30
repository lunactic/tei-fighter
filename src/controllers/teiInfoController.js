teiInfoController = function($scope, teiService) {
	var teiModel = teiService.teiModel
	//Codemirror
	$scope.editorOptions = {
		lineWrapping : true,
		lineNumbers: true,
		//readOnly: 'nocursor',
		mode: 'xml',

	};
	$scope.isSomething = true;
	// DEBUG generates a new teiModel
	if (!teiModel || !teiModel.teiInfo) {
		//create teiModel
		teiModel.teiInfo = new TeiInfo("Title","Publication", "Source Description");
		teiModel.listOfPages = [];

		//Add a new page
		//Add the url
		var testUrl = "http://digi.ub.uni-heidelberg.de/diglitData/image/cpg148/4/007v.jpg";
	}

	console.log(teiService);
	$scope.teiInfo = teiService.teiModel.teiInfo;

	$scope.update = function() {
		console.log($scope.teiHeader);
		$scope.teiHeader = vkbeautify.xml(generateHeader($scope.teiInfo).outerHTML);

		$scope.isSomething = true;
		var teiNode = generateTEI(teiModel);
		console.log(teiNode);
		$scope.teiXml = vkbeautify.xml(teiNode.outerHTML);
	};

	$scope.update();

	var content = 'file content';
	var blob = new Blob([ $scope.teiXml ], { type : 'text/plain' });
	$scope.xmlUrl = (window.URL || window.webkitURL).createObjectURL( blob );

}
