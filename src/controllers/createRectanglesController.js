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

		var realTopLeft = teiFighterController.view.getRealPoint(topLeft);
		var realBottomright = teiFighterController.view.getRealPoint(bottomRight);

		teiFighterController.createArea(realTopLeft, realBottomright);
        teiFighterController.update();
		currentRect.remove();
		currentRect = null;

	};
	
	return this;
};
