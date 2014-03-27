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
				var p = view.getViewPoint(q);
				console.log('Clicked on '+mouseDownPos.x+','+mouseDownPos.y);
				console.log('Real point '+q.x+','+q.y);
				console.log('View point '+p.x+','+p.y);
				
				setCenter(q);
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
			
			// Should dx,dy be divided by the zoom here, or later ?
			dx = x - prevDragPos.x;
			dy = y - prevDragPos.y;
			
			inputManager.drag(mouseDownPos, pos, dx, dy);
			
			prevDragPos.x = x;
			prevDragPos.y = y;
		}
		
		// Zoom-scroll - due to Firefox & Chrome incompatibilities,
		// it has to be coded twice. Crap.
		canvas.addEventListener("mousewheel", function (e) {
			e.preventDefault();
			var direction = e.deltaY;
			var viewP = new paper.Point(e.offsetX, e.offsetY);
			var realP   = getRealPoint(viewP);
			
			if (direction<0) {
				view.zoomIn();
			} else {
				view.zoomOut();
			}
			view.placePointAt(realP, viewP);
		});
		canvas.addEventListener("DOMMouseScroll", function (e) {
			e.preventDefault();
			var direction = e.detail;
			var viewP = new paper.Point(e.layerX, e.layerY);
			var realP   = getRealPoint(viewP);
			
			if (direction<0) {
				view.zoomIn();
			} else {
				view.zoomOut();
			}
			view.placePointAt(realP, viewP);
			console.log(e);
		}) ;
		

	};
	
	$scope.test = function($scope) {
		alert("Don't");
	};
	
	$scope.buttonZoomIn = function($scope) {
		var p = view.getCenter();
		view.zoomIn();
		view.setCenter(p);
	};
	
	$scope.buttonZoomOut = function($scope) {
		var p = view.getCenter();
		view.zoomOut();
		view.setCenter(p);
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
		
		// Zooms in
		zoomIn = function() {
			this.layer.scale(1.5);
			zoom *= 1.5;
			this.view.update();
		}
		
		// Zooms out without changing the position of the pixel (cx,cy)
		// of the view
		zoomOut = function() {
			this.layer.scale(1/1.5);
			zoom /= 1.5;
			this.view.update();
		}
		
		// Transform coordinates on the view into coordinates
		// on the document image
		getRealPoint = function(p) {
			var q = new paper.Point(
				(p.x + baseOffsetX*zoom - this.layer.position.x) / zoom,
				(p.y + baseOffsetY*zoom - this.layer.position.y) / zoom
			);
			return q;
		};
		
		// Transforms coordinates from the document image into
		// coordinates on the view
		getViewPoint = function(q) {
			var p = new paper.Point(
				q.x*zoom + this.layer.position.x - baseOffsetX*zoom,
				q.y*zoom + this.layer.position.y - baseOffsetY*zoom
			);
			return p;
		};
		
		// Centers the view on the given real coordinates
		setCenter = function(p) {
			var q = getViewPoint(p);
			var dw = paper.view.bounds.width  / 2;
			var dh = paper.view.bounds.height / 2;
			
			var dx = dw-q.x;
			var dy = dh-q.y;
			offsetView(dx,dy);
		};
		
		// Returns the real coordinates of the central pixel of the view
		getCenter = function() {
			var p = getRealPoint(new paper.Point(
				paper.view.bounds.width/2,
				paper.view.bounds.height/2
			));
			return p;
		}
		
		// Offset the view by the given offset in view coordinates
		offsetView = function(dx, dy) {
			var z = this.view.zoom;
			this.layer.position.x += dx/z;
			this.layer.position.y += dy/z;
			this.view.update();
		}
		
		// Offsets the view so that the point reapP is at the
		// position screenP on the screen.
		placePointAt = function(realP, viewP) {
			var q  = getViewPoint(realP);
			var dx = viewP.x - q.x;
			var dy = viewP.y - q.y;
			console.log(dx+" "+dy);
			offsetView(dx, dy);
		}

		return this;
	}


}

 
