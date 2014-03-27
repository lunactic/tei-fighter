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
		raster = new paper.Raster('image');
		
		// Setting correct position
		R = raster;
		paper.project.activeLayer.position = [raster.width/2, raster.height/2];
		
		// Get the view of the canva
		view = createViewController(paper.project.view, paper.project.activeLayer);
		
		// creating the default input manager
		inputManager = viewOffsetController(this, view, canvas);
		
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
				var q = view.getRealPoint(mouseDownPos);
				alert(q.x+' '+q.y);
			} else {
				inputManager.dragStopped();
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
			pos = new paper.Point(x,y);
			console.log(pos);
			
			// Should dx,dy be divided by the zoom here, or later ?
			dx = x - prevDragPos.x;
			dy = y - prevDragPos.y;
			
			inputManager.drag(mouseDownPos, pos, dx, dy);
			
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
		inputManager = viewOffsetController(this, view, canvas);
	};
	
	$scope.selectRectanglesController = function($scope) {
		inputManager = createRectanglesController(this, view, canvas);
	};
	
	
	// View manager
	createViewController = function(pView, pLayer) {
		this.view   = pView;
		this.layer  = pLayer;
		var zoom    = 1;
		
		var baseOffsetX = Math.floor(raster.width/2);
		var baseOffsetY = Math.floor(raster.height/2);
		
		zoomIn = function(cx, cy) {
			//this.view.zoom *= 1.5;
			this.layer.scale(1.5);
			zoom *= 1.5;
			this.view.update();
		}
		
		zoomOut = function() {
			//this.view.zoom /= 1.5;
			this.layer.scale(1/1.5);
			zoom /= 1.5;
			this.view.update();
		}
		
		getRealPoint = function(p) {
			q = new paper.Point(
				(p.x + baseOffsetX*zoom - this.layer.position.x) / zoom,
				(p.y + baseOffsetY*zoom - this.layer.position.y) / zoom
			);
			return q;
		};
		
		getLayerPoint = function(p) {
			
		};
		
		offsetView = function(dx, dy) {
			var z = this.view.zoom;
			var p = new paper.Point(dx/z, dy/z);
			//this.view.scrollBy(p);
			this.layer.position.x += p.x;
			this.layer.position.y += p.y;
			this.view.update();
		}

		return this;
	}


}

 
