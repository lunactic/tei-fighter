teiInfoController = function($scope, teiService) {

    console.log(teiService);
    $scope.teiInfo = teiService.teiModel.teiInfo;

    $scope.update = function() {
        $scope.teiHeader = formatXml(generateHeader($scope.teiInfo));
    };

    // Generate the header
    //$scope.teiHeader = generateHeader($scope.teiInfo);
}
