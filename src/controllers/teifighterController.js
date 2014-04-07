teifighterController = function ($scope) {
	$scope.hello = 'It works';
	$scope.more = "yes it is";
	
	// This is the view controller. It can be used for scrolling,
	// zooming and transforming coordinates. I think it should be
	// visible to the whole project, but in a cleaner way than using
	// global variables.
	var view = null;


	// This object manages the inputs of the user. It is changed when
	// the context changes (moving the view, drawing rectangles).
	var inputManager;

	// Initialization of the canvas, mainly creates different observers
	$scope.initializeCanvas = function() {
		
		// Getting the canva, setting paper
        this.canvas = document.getElementById('canvas');
		paper.setup(canvas);
		paper.view.draw();
		
		// loading the image
		raster = new paper.Raster('image');
		
		// By default, the center of the image is on the left-top corner
		// of the canvas, it has to be offseted.
		paper.project.activeLayer.position = [raster.width/2, raster.height/2];
		
        // FIXME: This code must be refactored when new pages will be created
        //$scope.pageInfo = new PageInfo(raster.width, raster.height);
        
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
	
	// Areas and model part
    $scope.pageInfo  = null;
	$scope.listAreas = [];

	$scope.areaSelected = null;

	// Selecting areas
	$scope.isAreaSelected = function(area)  {
		
		return area === $scope.areaSelected;
	};
	
	$scope.selectArea = function(area) {
		// FIXME the colors should be global variables
		// or use a method on the rectangle like activate/deactivate

		console.log('Selecting Area area');
		if ($scope.areaSelected)
			$scope.areaSelected.rect.fillColor = 'blue';


		$scope.areaSelected = area;
		$scope.areaSelected.rect.fillColor = 'red';

		// Fixme create an id to focus.
		// the id must be unique and work well with
		//$("#"+area.id).focus();
		
		paper.view.update();
	};
       // Update the angular variables on hardcode
    $scope.update = function() {
        $scope.$apply();
    };

	$scope.createArea = function (topLeft, bottomRight) {
		//First create the area

		var area = new Area(topLeft, bottomRight);

	// Create the new rectangle

		var rect = new paper.Path.Rectangle({
			from: view.getViewPoint(new paper.Point(topLeft)),
			to: view.getViewPoint(new paper.Point(bottomRight)),
			fillColor: 'blue',
			strokeColor: 'black',
			opacity: '0.5'
		});

		//bidireccional status
		rect.TranscriptionArea = area;
		//addHandler for the click
		rect.onClick = function(event) {
			$scope.selectArea(this.TranscriptionArea);
			$scope.$apply();
		};

		console.log("Added new item "+$scope.listAreas.length);
		area.id = "Text"+$scope.listAreas.length;
		area.addRect(rect);

		// With this the list it's updated. Seems a bug of angular
		// More info: http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
		$scope.listAreas.push(area);

	};

    $scope.createTestSample = function() {
        var areas = [[45, 134, 330, 1138],
                     [57,1131, 713, 1737],
                    ];
        areas.forEach(function(elem) {
                    topLeft = {'x':elem[0], 'y':elem[1]};
                    bottomRight = {'x':elem[2], 'y':elem[3]};
                    console.log(topLeft, bottomRight);
                    $scope.createArea(topLeft, bottomRight);
                    });

    };


	

}

 
