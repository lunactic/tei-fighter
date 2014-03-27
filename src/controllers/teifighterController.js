teifighterController = function ($scope) {
	$scope.hello = 'It works';
	$scope.more = "yes it is";
	
	var view;
	var inputManager;
	
	$scope.initializeCanvas = function($scope) {
		
		// Getting the canva, setting paper
		var canvas = document.getElementById('canvas');
		paper.setup(canvas);
		paper.view.draw();
		
		// loading the image
		var raster = new paper.Raster('image');
		
		// Setting correct position
		raster.position = [raster.width/2, raster.height/2];
		
		// Get the view of the canva
		view = createViewController(paper.view);
		
		// creating the input manager
		inputManager = viewOffsetController(view, canvas);
		
		// Ugly code, it will have to be cleaned !
		var isMouseDown = false;
		var mouseDownPos = new paper.Point(0,0);
		var mouseUpPos   = new paper.Point(0,0);
		var prevDragPos  = new paper.Point(0,0);
		
		
		// Mouseup, there has been a click
		canvas.onmouseup = function(event) {
			mouseUpPos.x = event.clientX - canvas.getBoundingClientRect().left;
			mouseUpPos.y = event.clientY - canvas.getBoundingClientRect().top;
			
			// Not dragged ? let's zoom
			if (mouseUpPos.x==mouseDownPos.x && mouseUpPos.y==mouseDownPos.y) {
				inputManager.click(mouseUpPos.x, mouseUpPos.y);
			}
			
			isMouseDown = false;
		}
		
		canvas.onmouseleave = function(event) {
			mouseUpPos.x = event.clientX - canvas.getBoundingClientRect().left;
			mouseUpPos.y = event.clientY - canvas.getBoundingClientRect().top;
			isMouseDown = false;
		}
		
		canvas.onmousedown = function(event) {
			prevDragPos.x = mouseDownPos.x = event.clientX - canvas.getBoundingClientRect().left;
			prevDragPos.y = mouseDownPos.y = event.clientY - canvas.getBoundingClientRect().top;
			isMouseDown = true;
			
		}

		canvas.onmousemove = function(event)  {
			if (!isMouseDown) return;
			
			x = event.clientX - canvas.getBoundingClientRect().left;
			y = event.clientY - canvas.getBoundingClientRect().top;
			
			// Should dx,dy be divided by the zoom here, or later ?
			dx = x - prevDragPos.x;
			dy = y - prevDragPos.y;
			
			inputManager.drag(x,y,dx,dy);
			
			prevDragPos.x = x;
			prevDragPos.y = y;
		}
		

	};
	
	$scope.test = function($scope) {
		alert("Don't");
	};
	
	$scope.buttonZoomIn = function($scope) {
		view.zoomIn(0,0);
	};
	
	$scope.buttonZoomOut = function($scope) {
		view.zoomOut();
	};
	
	$scope.selectOffsetController = function($scope) {
		alert('todo: create new offset controller & change mouse pointer');
	};
	
	
	// View manager
	createViewController = function(pView) {
		this.view   = pView;
		
		zoomIn = function(cx, cy) {
			this.view.zoom *= 1.5;
		}
		
		zoomOut = function() {
			this.view.zoom /= 1.5;
		}
		
		offsetView = function(dx, dy) {
			var z = this.view.zoom;
			var p = new paper.Point(-dx/z, -dy/z);
			this.view.scrollBy(p);
		}

		return this;
	}


}

 
