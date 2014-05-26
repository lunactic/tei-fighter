// This controller receives events from teifighterController and
// draws rectangles according to them.
// Maybe it should indicate to teifighterController to create areas
// for these rectangles.
createRectanglesController = function(pTeifighterController,
									  pView,
									  pCanvas) {
	// Refs to the controller, view and canvas.
	var teiFighterController = pTeifighterController;
	var view                 = pView;
	var canvas               = pCanvas;
	
	// The rectangle being drawn
	var currentRect = null;
	
	// Select mouse pointer
	document.getElementById('canvas').style.cursor = "crosshair"
	
	this.click = function(x, y) {
		// Nothing to do
	};
	
	this.drag  = function(downPoint, curPoint, dx, dy) {
		// If it is not null, then we are currently drawing a rectangle
		// so we remove this one and make a new one with updated 
		// coordinates.
		if (currentRect!=null) {
			currentRect.remove();
		}
		currentRect = new paper.Path.Rectangle({
			from: downPoint,
			to: curPoint,
			fillColor: 'red',
			strokeColor: 'black',
			opacity: '0.25'
		});
	}
	
	// When the drag stops, then the area corresponding to the rectangle
	// should be created.
	this.dragStopped = function() {
		// extract areas indexes
		var topPos = currentRect.bounds.y;
		var leftPos = currentRect.bounds.x;
		var bottomPos = currentRect.bounds.y + currentRect.bounds.height;
		var rightPos = currentRect.bounds.x + currentRect.bounds.width;

		var topLeft = {'x': leftPos, 'y':topPos};
		var bottomRight = {'x': rightPos, 'y':bottomPos};

		var realTopLeft = view.getRealPoint(topLeft);
		var realBottomright = view.getRealPoint(bottomRight);

		teiFighterController.createArea(realTopLeft, realBottomright);
		teiFighterController.update();
		currentRect.remove();
		currentRect = null;

	};
	
	return this;
};

ResizeCircles = function(pTeifighterController, pPaper, pView) {
	var paper         = pPaper;
	this.view         = pView;
	var area          = null;
	var previousZoom  = 1;
	var teifighter    = pTeifighterController;
	var prevInManager = null;
	
	// Creates a green half-transparent circle
	this.createCircle = function(top, left) {
		var c = new paper.Path.Circle({
			center: [0, 0],
			radius: 6,
			fillColor: 'green',
			visible: false
		});
		c.isForTop  = top;
		c.isForLeft = left;
		return c;
	};
	
	this.placeCircleOnArea = function(circle, area) {
		var position = new paper.Point(0,0);
		if (circle.isForTop) {
			position.y = area.top;
		} else {
			position.y = area.bottom;
		}
		if (circle.isForLeft) {
			position.x = area.left;
		} else {
			position.x = area.right;
		}
		circle.position = this.view.getViewPoint(position);
		
		circle.bringToFront();
	};
    
    // Assuming that targ is a Rectangle as defined in
    // area.js
    this.placeCircleOn = function(circle, targ) {
		var position = new paper.Point(0,0);
		if (circle.isForTop) {
			position.y = targ.top;
		} else {
			position.y = targ.bottom;
		}
		if (circle.isForLeft) {
			position.x = targ.left;
		} else {
			position.x = targ.right;
		}
		circle.position = this.view.getViewPoint(position);
		
		circle.bringToFront();
	};
	
	// Create the circles
	this.topLeft     = this.createCircle(true,  true);
	this.topRight    = this.createCircle(true,  false);
	this.bottomLeft  = this.createCircle(false, true);
	this.bottomRight = this.createCircle(false, false);
    
    // Object which has to be resized
    this.targ = null;
	
	/*this.topLeft.fillColor = 'red';
	this.topRight.fillColor = 'green';
	this.bottomLeft.fillColor = 'blue';
	this.bottomRight.fillColor = 'black';*/
	
	this.circles = new Array();
	this.circles[0] = this.topLeft;
	this.circles[1] = this.topRight;
	this.circles[2] = this.bottomLeft;
	this.circles[3] = this.bottomRight;
	
	for (var i=0; i<4; i++) {
		this.circles[i].onMouseDown = function() {
			this.prevInManager = teifighter.getInputManager();
			teifighter.selectResizeController(area, this, this.isForTop, this.isForLeft);
		};
		this.circles[i].onMouseUp = function() {
			teifighter.setInputManager(this.prevInManager);
		};
	}
	
	aCircle = this.topLeft;
	
	this.assignToArea = function(pArea) {
		area = pArea;
		
		for (var i=0; i<4; i++) {
			this.placeCircleOnArea(this.circles[i], area);
			this.circles[i].visible = true;
		}
	};
	
    // Makes the circles keep the same size after zooming
	this.updateCircleSize = function() {
		// Get the difference of zoom
		var ratio = previousZoom / this.view.getZoomRatio();
		
		// Resize circles
		for (var i=0; i<4; i++) {
			this.circles[i].scale(ratio, ratio);
		}
		
		previousZoom = this.view.getZoomRatio();
	};
	
    // Hides the circles
	this.hideCircles = function() {
		for (var i=0; i<4; i++) {
			this.circles[i].visible = false;
		}
	};
    
    // Tells the circles which object they are supposed to
    // resize
    this.assignTo = function(target) {
        console.log("The circles will resize ", target);
        this.targ = target;
        for (var i=0; i<4; i++) {
			this.placeCircleOn(this.circles[i], target);
			this.circles[i].visible = true;
		}
    }
	
	return this;
};

createResizeController = function(pTeifighterController,
									  pView,
									  pCanvas,
									  pArea,
									  pCircles,
									  pMoveTop,
									  pMoveLeft) {
	// Refs to the controller, view and canvas.
	var teifighterController = pTeifighterController;
	var view                 = pView;
	var canvas               = pCanvas;
	var area                 = pArea;
	var moveTop              = pMoveTop;
	var moveLeft             = pMoveLeft;
	var circles              = pCircles;
	
	this.click = function(x, y) {
		// Nothing to do
	};
	
	this.drag  = function(downPoint, curPoint, dx, dy) {
		var pt = view.getRealPoint(curPoint);
		if (moveTop) {
			// Updating the target
			circles.targ.top = pt.y;
			
			// Updating the graphics
			var newHeight = (circles.targ.bottom-circles.targ.top) * view.getZoomRatio();
			var ratio     = newHeight / circles.targ.rect.bounds.height;
			circles.targ.rect.scale(1, ratio);
			circles.targ.rect.position.y += dy / 2.0;
			circles.topLeft.position.y += dy;
			circles.topRight.position.y += dy;
		} else {
			// Updating the target
			circles.targ.bottom  = pt.y;
			
			// Updating the graphics
			var newHeight = (circles.targ.bottom-circles.targ.top) * view.getZoomRatio();
			var ratio     = newHeight / circles.targ.rect.bounds.height;
			circles.targ.rect.scale(1, ratio);
			circles.targ.rect.position.y += dy / 2.0;
			circles.bottomLeft.position.y += dy;
			circles.bottomRight.position.y += dy;
		}
		
		if (moveLeft) {
			circles.targ.left = pt.x;
			var newWidth = (circles.targ.right - circles.targ.left) * view.getZoomRatio();
			var ratio    = newWidth / circles.targ.rect.bounds.width;
			circles.targ.rect.scale(ratio, 1);
			circles.targ.rect.position.x          += dx / 2.0;
			circles.topLeft.position.x    += dx;
			circles.bottomLeft.position.x += dx;
		} else {
			circles.targ.right = pt.x;
			var newWidth = (circles.targ.right - circles.targ.left) * view.getZoomRatio();
			var ratio    = newWidth / circles.targ.rect.bounds.width;
			circles.targ.rect.scale(ratio, 1);
			circles.targ.rect.position.x           += dx / 2.0;
			circles.topRight.position.x    += dx;
			circles.bottomRight.position.x += dx;
		}
		teifighterController.update();
	}
	
	this.dragStopped = function() {
	   // nothing to do 
	};
	
	return this;
};


// This controller receives events from teifighterController and
// draws LINES according to them.
createLinesController = function(pTeifighterController,
									  pView,
									  pCanvas) {
	// Refs to the controller, view and canvas.
	var teiFighterController = pTeifighterController;
	var view                 = pView;
	var canvas               = pCanvas;
	
	// The rectangle being drawn
	var currentRect = null;
	
	// Select mouse pointer
	document.getElementById('canvas').style.cursor = "crosshair"
	
	this.click = function(x, y) {
		// Nothing to do
	};
	
	this.drag  = function(downPoint, curPoint, dx, dy) {
		// If it is not null, then we are currently drawing a rectangle
		// so we remove this one and make a new one with updated 
		// coordinates.
		if (currentRect!=null) {
			currentRect.remove();
		}
		currentRect = new paper.Path.Rectangle({
			from: downPoint,
			to: curPoint,
			fillColor: 'purple',
			strokeColor: 'white',
			opacity: '0.5'
		});
	}
	
	// When the drag stops, then the area corresponding to the rectangle
	// should be created.
	this.dragStopped = function() {
		// extract areas indexes
		var topPos = currentRect.bounds.y;
		var leftPos = currentRect.bounds.x;
		var bottomPos = currentRect.bounds.y + currentRect.bounds.height;
		var rightPos = currentRect.bounds.x + currentRect.bounds.width;

		var topLeft = {'x': leftPos, 'y':topPos};
		var bottomRight = {'x': rightPos, 'y':bottomPos};

		var realTopLeft = view.getRealPoint(topLeft);
		var realBottomright = view.getRealPoint(bottomRight);

		teiFighterController.createLine(realTopLeft, realBottomright);
		teiFighterController.update();
		currentRect.remove();
		currentRect = null;

	};
	
	return this;
};
