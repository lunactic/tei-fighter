teifighterController = function ($scope) {
	$scope.hello = 'It works';
	$scope.more = "yes it is";
	
	// This is the view controller. It can be used for scrolling,
	// zooming and transforming coordinates. I think it should be
	// visible to the whole project, but in a cleaner way than using
	// global variables.
	var view;
	
	// This object manages the inputs of the user. It is changed when
	// the context changes (moving the view, drawing rectangles).
	var inputManager;
	
	// Initialization of the canvas, mainly creates different observers
	$scope.initializeCanvas = function($scope) {
		
		// Getting the canva, setting paper
		var canvas = document.getElementById('canvas');
		paper.setup(canvas);
		paper.view.draw();
		
		// loading the image
		raster = new paper.Raster('image');
		
		// By default, the center of the image is on the left-top corner
		// of the canvas, it has to be offseted.
		paper.project.activeLayer.position = [raster.width/2, raster.height/2];
		
		// Create a view controller for the canvas.
		view = createViewController(
			paper.project.view,
			paper.project.activeLayer
		);
		
		// creating the default input manager (moving the image)
		inputManager = viewOffsetController(this, view, canvas);
		
		// Ugly code, it will have to be cleaned ! These variables store
		// the state of the mouse at some moments.
		// This indicates if the mouse button is being hold down ; it is
		// used to discriminate mouse move from mouse drag
		var isMouseDown = false;
		// Position at the moment isMouseDown becomes true
		var mouseDownPos = new paper.Point(0,0);
		// Position at the moment isMouseUp becomes false
		var mouseUpPos   = new paper.Point(0,0);
		// Position of the mouse during drag - updated at the end of the
		// function call.
		var prevDragPos  = new paper.Point(0,0);
		
		// Mouseup, there has been a click
		canvas.onmouseup = function(event) {
			// Getting the coordinates of the mouse
			mouseUpPos.x = event.clientX - canvas.getBoundingClientRect().left;
			mouseUpPos.y = event.clientY - canvas.getBoundingClientRect().top;
			
			// if the coordinates have not changed while the mouse button was
			// down, it is a click
			if (mouseUpPos.x==mouseDownPos.x && mouseUpPos.y==mouseDownPos.y) {
				// Dispatch the info to the input manager
				inputManager.click(mouseUpPos.x, mouseUpPos.y);
			} else {
				// Else the button has been released after a mouse drag
				inputManager.dragStopped();
			}
			
			// Not down anymore.
			isMouseDown = false;
		}
		
		// If the mouse leaves the canvas, we considere it a bit like an
		// eventless mouse click.
		canvas.onmouseleave = function(event) {
			mouseUpPos.x = event.clientX - canvas.getBoundingClientRect().left;
			mouseUpPos.y = event.clientY - canvas.getBoundingClientRect().top;
			isMouseDown = false;
		}
		
		// The mouse was pressed on the canvas - reset mouseDownPos
		// and also prevDragPos.
		canvas.onmousedown = function(event) {
			prevDragPos.x = mouseDownPos.x = event.clientX - canvas.getBoundingClientRect().left;
			prevDragPos.y = mouseDownPos.y = event.clientY - canvas.getBoundingClientRect().top;
			isMouseDown = true;
			
		}

		// The mouse was moved... was it dragged ?
		canvas.onmousemove = function(event)  {
			// If not dragged...
			if (!isMouseDown) return;
			
			// Get coordinates of the click
			x = event.clientX - canvas.getBoundingClientRect().left;
			y = event.clientY - canvas.getBoundingClientRect().top;
			pos = new paper.Point(x,y);
			
			// Compute by how much it moved since last such event
			dx = x - prevDragPos.x;
			dy = y - prevDragPos.y;
			
			// Tell the input manager that there was a drag
			inputManager.drag(mouseDownPos, pos, dx, dy);
			
			// Update data
			prevDragPos.x = x;
			prevDragPos.y = y;
		}
		
		// Zoom-scroll - due to Firefox & Chrome incompatibilities,
		// it has to be coded twice. Crap.
		canvas.addEventListener("mousewheel", function (e) {
			// It's supposed to prevent from scrolling the page - does
			// not really work. Maybe in a next browser version ?
			e.preventDefault();
			var direction = e.deltaY;
			var viewP = new paper.Point(e.offsetX, e.offsetY);
			var realP   = getRealPoint(viewP);
			// Zoom or unzoom
			if (direction<0) {
				view.zoomIn();
			} else {
				view.zoomOut();
			}
			// Then replace the correct point under the mouse 
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
		});
		

	};
	
	// Zooms in toward the center of the view
	$scope.centerZoomIn = function($scope) {
		var p = view.getCenter();
		view.zoomIn();
		view.setCenter(p);
	};
	
	// Zooms out from the center of the view
	$scope.centerZoomOut = function($scope) {
		var p = view.getCenter();
		view.zoomOut();
		view.setCenter(p);
	};
	
	// Indicates to teifighterController that we want now to
	// move the document around
	$scope.selectOffsetController = function($scope) {
		inputManager = viewOffsetController(this, view, canvas);
	};
	
	// Indicates to teifighterController that we want now to
	// draw rectangles on the document
	$scope.selectRectanglesController = function($scope) {
		inputManager = createRectanglesController(this, view, canvas);
	};
	
	
	// View manager - manages zoom, offset and coordinates
	// transformations. Maybe having it inside of
	// teifighterController.js is not the best option...
	createViewController = function(pView, pLayer) {
		// Ref to the view and the layer
		this.view   = pView;
		this.layer  = pLayer;
		
		// The layer does not know its zoom, it has to be
		// stored somewhere.
		var zoom    = 1;
		
		// The center of the layer seems to have the coordinates (0,0),
		// we can solve it by knowing the dimensions of the raster and
		// subtracting or adding them when coordinates are being
		// transformed
		var baseOffsetX = Math.floor(raster.width/2);
		var baseOffsetY = Math.floor(raster.height/2);
		
		// Zooms in, reaches funny new coordinates
		zoomIn = function() {
			this.layer.scale(1.5);
			zoom *= 1.5;
			this.view.update();
		}
		
		// Zooms out, reaches unusual new coordinates
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
			offsetView(dx, dy);
		}

		return this;
	}


}

 
