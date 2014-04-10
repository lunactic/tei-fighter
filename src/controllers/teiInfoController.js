teiInfoController = function($scope, teiService) {
    var teiModel = teiService.teiModel

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
        $scope.teiHeader = formatXml(generateHeader($scope.teiInfo));

        var teiNode = generateTEI(teiModel);
        console.log(teiNode);
        $scope.teiXml = formatXml(teiNode.outerHTML);
    };

    // Generate the header
    //$scope.teiHeader = generateHeader($scope.teiInfo);
}
