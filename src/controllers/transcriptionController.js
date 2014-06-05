transcriptionController = function ($scope) {
	$scope.helloTranscription = "Hello It";

	// Enum object for arrange areas
	var arrangeAreas = {
		LIST: 1,
		LAYOUT: 2
	};

	var self = this;

	$scope.currentArrange = "LIST";

	$scope.setArrange = function(paramArrange) {
		// TODO: Check that the arrange is correct
		$scope.currentArrange = paramArrange;

	};

	$scope.getArrange = function() {
		return $scope.currentArrange;
	};

	// Returns true if the current arrange is actived
	$scope.checkArrange = function(paramArrange) {
		return $scope.currentArrange == paramArrange;
	}

	// Function that controls the area arrange given
	$scope.styleArea = function(area) {
		var view = $scope.getView();
		var style = {};
		if($scope.currentArrange == "LAYOUT") {

			style.position = "absolute";
			style.display = "inline-block";
			style.float = "left";
			style.overflow = "scroll";
			var topLeft = view.getViewPoint(area.topLeft());
			var bottomRight = view.getViewPoint(area.bottomRight());
			style.top = topLeft.y;
			style.left = topLeft.x;
			style.width = bottomRight.x - topLeft.x;
			style.height = bottomRight.y - topLeft.y;

		}
		return style;
	};

	$scope.transcriptionsStyle = function() {
		var canvas = document.getElementById("canvas");
		var style = {};
		style.position = "relative";
		style.overflow = "scroll";
		style.height = canvas.height;
		return style;
	}
}
