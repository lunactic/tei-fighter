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
			console.log(dx+" "+dy);
			offsetView(dx, dy);
		}

		return this;
	}
