teifighterController = function ($scope) {
	$scope.hello = 'It works';
	$scope.more = "yes it is";
	
		
	$scope.initializeCanvas = function($scope) {
		// Getting the canva, setting paper
		var canvas = document.getElementById('canvas');
		paper.setup(canvas);
		paper.view.draw();
		
		// loading the image
		var raster = new paper.Raster('image');
		
		// Setting correct position
		raster.position = [raster.width/2, raster.height/2];
		console.log(raster.position.x+" "+raster.position.y);
		
	};


}

 
