// This controller receives events from teifighterController and
// offsets the view accordingly to them.
viewOffsetController = function(pTeifighterController, pView, pCanvas) {
	var teiFighterController = pTeifighterController;
	var view                 = pView;
	var canvas               = pCanvas;
	
	// Select mouse pointer
	document.getElementById('canvas').style.cursor = "move"
	
	this.click = function(x, y) {
		// Nothing to do
	};
	
	this.drag  = function(downPoint, curPoint, dx, dy) {
		view.offsetView(dx, dy);
	}
	
	this.dragStopped = function() {
		// nothing to do
	};
	
	return this;
}
