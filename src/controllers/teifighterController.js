teifighterController = function ($scope, $location, $timeout,  teiService, lineService, questionService) {
	$scope.hello = 'It works';
	$scope.more = "yes it is";

	teiModel = teiService.teiModel;
	console.log("Service",  teiService);

	$scope.editorOptions = {
		lineWrapping : true,
		lineNumbers: true,
		//readOnly: 'nocursor',
		mode: 'xml',

	};



	// This is the view controller. It can be used for scrolling,
	// zooming and transforming coordinates. I think it should be
	// visible to the whole project, but in a cleaner way than using
	// global variables.
	var view = null;

	// This is a reference to the teifighterController itself.
	var self = this;

	// This object manages the inputs of the user. It is changed when
	// the context changes (moving the view, drawing rectangles).
	var inputManager;

	// This object stores the circles used for resizing the currently
	// selected area.
	self.resizeCircles = null;


	// True after their initialization
	self.areListenersInitialized = false;


	//$scope.listOfPages = [];

	// Function that initializes the model variables
	$scope.init = function() {

		console.log("Initialization")

		var currentPage = 0
		if (teiModel && teiModel.teiInfo) {

			//TODO: Check that variable fits
			var paramPage = $location.search().page;

			if (paramPage) {
				currentPage = parseInt(paramPage);
			}

			if (currentPage < teiModel.listOfPages.length) {
				console.log("Setting Page: " + currentPage);
				$scope.setPage(currentPage);
			}
			else {
				//TODO: remove the image

				//if (typeof project !== 'undefined')
				//project.activeLayer.removeChildren();
				//project.clear();

			}
		}
		else {
			//create teiModel
			/*teiModel.teiInfo = new TeiInfo("Title","Publication", "Source Description");
			teiModel.listOfPages = [];
			*/
			//Add a new page
			//Add the url
			//var testUrl = "http://digi.ub.uni-heidelberg.de/diglitData/image/cpg148/4/007v.jpg";

		}
		$scope.listOfPages = teiModel.listOfPages;
		//$scope.setOpacity($scope.drawingOptions.opacity);
	}


	// Given an url generates a new page
	// initialize canvas will be called automatically
	$scope.$watch('listOfPages', function() {
		if ($scope.listOfPages == 0) return;



	});

	// Given an url generates a new page
	// initialize canvas will be called automatically
	$scope.$parent.$watch('data.changes', function(value){
		console.log("change on teiModel", $scope.data.changes);
		if (value == true) {
			$scope.pageNumber = 0;
			$scope.init();
			console.log("reinitializing");
			$scope.data.changes = false;
		}


	});

	$scope.$parent.$watch('drawingOptions.opacity', function(value){
		console.log("change on the opacity", value);
		$scope.setOpacity(value);
	}

											 );


	// Change the model to the current page
	//    $scope.setPage = function(page) {
	//
	//        teiModel.listOfpages.forEach(function(lPage) {
	//         var i = 1;
	//         if (page === lPage) {
	//           $scope.pageInfo = lPage;
	//           $scope.listAreas = lPage.areas;
	//           $scope.pageNumber = i;
	//           i++;
	//           return;
	//         }
	//        });
	//
	//    }

	// Change the visualization to the current Page
	$scope.setPage = function(indexPage) {
		// TODO: check intervals

		/*		if ($scope.isActivePage(indexPage))
			return;*/

		var cPage = teiModel.listOfPages[indexPage];


		//Set the variables to the new page
		$scope.currentUrl = cPage.url;
		$scope.listAreas = cPage.areas;
		$scope.pageInfo  = cPage;
		$scope.pageNumber = indexPage+1; // Page number starts by 1
		$scope.data.canvasUrl = "#/?page="+indexPage;
		//Remove the old rectangles
		$scope.removeRectangles();
	}

	// For the pagination buttons
	$scope.isActivePage = function(indexPage) {
		return (indexPage == $scope.pageNumber -1);

	}


	// Initialization of the canvas, mainly creates different observers
	$scope.initializeCanvas = function() {
		// For the closure
		// Getting the canva, setting paper
		this.canvas = document.getElementById('canvas');

		paper.setup(canvas);
		paper.view.draw();

		paper.view.onFrame = function(event) {
			//Log funny sutff in there :)
			//console.log(paper.project.activeLayer.position.x+" "+paper.project.activeLayer.position.y);
		};

		// loading the image
		raster = new paper.Raster('image');

		// By default, the center of the image is on the left-top corner
		// of the canvas, it has to be offseted.
		paper.project.activeLayer.position = [raster.width/2, raster.height/2];

		// Update page size
		$scope.pageInfo.setSize(raster.width, raster.height);

		// Create a view controller for the canvas.
		self.view = createViewController(
			paper.project.view,
			paper.project.activeLayer
		);

		self.view.onViewUpdate = function() {
			$scope.update();
		}

		// Creating the resize circles
		self.resizeCircles = new ResizeCircles(this, paper, self.view);

		// creating the default input manager (moving the image)
		inputManager = viewOffsetController(this, self.view, canvas);

		$scope.initializeListeners();

		// Redraw the areas
		$scope.reDrawAreas();
		this.update();

	};

	$scope.initializeListeners = function() {
		if (self.areListenersInitialized) {
			return ;
		}
		self.areListenersInitialized = true;
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

		document.getElementsByTagName("body")[0].onkeypress = function(event) {
			event = event || window.event;
			if (event.keyCode==46 || event.keyCode==127) {
				alert('Delete');
			}
		};

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
				self.view.zoomIn();
			} else {
				self.view.zoomOut();
			}
			// Then replace the correct point under the mouse 
			self.view.placePointAt(realP, viewP);
			// Updates the scaling circles
			self.resizeCircles.updateCircleSize();
			paper.view.update();
		});
		canvas.addEventListener("DOMMouseScroll", function (e) {
			e.preventDefault();
			var direction = e.detail;
			var viewP = new paper.Point(e.layerX, e.layerY);
			var realP   = getRealPoint(viewP);

			if (direction<0) {
				self.view.zoomIn();
			} else {
				self.view.zoomOut();
			}
			self.view.placePointAt(realP, viewP);
			// Updates the scaling circles
			self.resizeCircles.updateCircleSize();
			paper.view.update();
		});
	}

	// View wrapper
	$scope.getView = function() {
		return self.view;

	}


	// Zooms in toward the center of the view
	$scope.centerZoomIn = function($scope) {
		var p = self.view.getCenter();
		self.view.zoomIn();
		self.view.setCenter(p);
		// Updates the scaling circles
		self.resizeCircles.updateCircleSize();
		paper.view.update();
	};

	// Zooms out from the center of the view
	$scope.centerZoomOut = function($scope) {
		var p = self.view.getCenter();
		self.view.zoomOut();
		self.view.setCenter(p);
		// Updates the scaling circles
		self.resizeCircles.updateCircleSize();
		paper.view.update();
	};

	// Indicates to teifighterController that we want now to
	// move the document around
	$scope.selectOffsetController = function($scope) {
		inputManager = viewOffsetController(this, self.view, canvas);
	};

	// Indicates to teifighterController that we want now to
	// draw rectangles on the document
	$scope.selectRectanglesController = function($scope) {
		inputManager = createRectanglesController(this, self.view, canvas);
	};

	// Indicates to teifighterController that we want now to
	// draw lines on the document
	$scope.selectLinesController = function($scope) {
		inputManager = createLinesController(this, self.view, canvas);
	};

	// Indicates to teifighterController that we want now to
	// scale areas of the document
	$scope.selectResizeController = function(area, circle, pMoveTop, pMoveLeft) {
		inputManager = new createResizeController(this,
																							self.view,
																							canvas,
																							area,
																							self.resizeCircles,
																							pMoveTop,
																							pMoveLeft);
	};

	$scope.getInputManager = function() {
		return inputManager;
	};

	$scope.setInputManager = function(inManager) {
		inputManager = inManager;
	};

	$scope.areaSelected = null;
	$scope.lineSelected = null;
	// Selecting areas
	$scope.isAreaSelected = function(area)  {

		return area === $scope.areaSelected;
	};



	$scope.selectArea = function(area) {
		// FIXME the colors should be global variables
		// or use a method on the rectangle like activate/deactivate

		if ($scope.areaSelected && $scope.areaSelected != area) {

			// We can hide the lines
			for (var i=0; i<$scope.areaSelected.lines.length; i++) {
				if ($scope.areaSelected.lines[i].rect!=null) {
					$scope.areaSelected.lines[i].rect.visible = false;
				}
			}
			// Unselect line
			$scope.unselectCurrentArea();

		}


		$scope.areaSelected = area;
		$scope.areaSelected.rect.fillColor = $scope.drawingOptions.selected_area_color;
		$scope.areaSelected.rect.fillColor.alpha = $scope.drawingOptions.opacity;

		// Display the lines
		for (var i=0; i<area.lines.length; i++) {
			var line = area.lines[i];
			// The lines may not be created at the same time as the
			// area, so I think we could create the rectangles displaying
			// the lines end to end just in time.
			if (line.rect == null) {
				var TL = new paper.Point(line.left, line.top);
				var RB = new paper.Point(line.right, line.bottom);
				line.rect = new paper.Path.Rectangle({
					from: self.view.getViewPoint(TL),
					to: self.view.getViewPoint(RB),
					fillColor: $scope.drawingOptions.line_color,
					strokeColor: 'black'

				});
				//opacity: $scope.drawingOptions.opacity
				line.rect.fillColor.alpha = $scope.drawingOptions.opacity;
				line.rect.line    = line;
				line.rect.area    = area;
				line.rect.onClick = function() {
					$scope.selectLine(this.area, this.line);
					$scope.update();
				};
			} else {
				area.lines[i].rect.visible = true;
			}

		}


		// Put resize circles there
		self.resizeCircles.assignTo(area);

		// Fixme create an id to focus.
		// the id must be unique and work well with
		//$("#"+area.id).focus();

		paper.view.update();

		// Put resize circles there
		self.resizeCircles.assignToArea(area);
	};

	$scope.isLineSelected = function(line)  {

		return line === $scope.lineSelected;
	};

	//TODO: implement
	$scope.selectLine = function(area, line) {
		console.log("Line ", line, " selected !");

		$scope.unselectCurrentLine();

		line.rect.fillColor = $scope.drawingOptions.selected_line_color;
		line.rect.fillColor.alpha = $scope.drawingOptions.opacity;

		//$scope.areaSelected = area;
		$scope.lineSelected = line;
		self.resizeCircles.assignTo(line);


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
			from: self.view.getViewPoint(new paper.Point(topLeft)),
			to: self.view.getViewPoint(new paper.Point(bottomRight)),
			fillColor: $scope.drawingOptions,
			strokeColor: 'black',
			//opacity: $scope.drawingOptions.opacity

		});
		rect.fillColor.alpha = $scope.drawingOptions.opacity;
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
		return area;
	};

	$scope.createLine = function(topLeft, bottomRight) {
		// Some shortcuts
		var left   = topLeft.x;
		var top    = topLeft.y;
		var right  = bottomRight.x;
		var bottom = bottomRight.y;

		var optimalArea  = null;
		var optimalScore = 0;
		for (var i=0; i<$scope.listAreas.length; i++) {
			var a = $scope.listAreas[i];
			// Computing intersections
			var minX = (a.left>left)     ? a.left   : left;
			var maxX = (a.right<right)   ? a.right  : right;
			var minY = (a.top>top)       ? a.top    : top;
			var maxY = (a.bottom<bottom) ? a.bottom : bottom;
			var dx = maxX - minX;
			var dy = maxY - minY;

			// If there is an intersection
			if (dx>0 && dy>0) {
				var score = dx*dy;
				// We may assign the line to the area
				if (score>optimalScore) {
					optimalScore = score;
					optimalArea  = a;
				}
			}
		}
		if (optimalArea!=null) {
			console.log("Score ", optimalScore, " for ", optimalArea);
			optimalArea.addLine(topLeft, bottomRight);
			$scope.selectArea(optimalArea);
		}
	};

	$scope.unselectCurrentLine = function() {
		if ($scope.lineSelected) {
			$scope.lineSelected.rect.fillColor = $scope.drawingOptions.line_color;
			$scope.lineSelected.rect.fillColor.alpha = $scope.drawingOptions.opacity;
		}
		$scope.lineSelected = null;
	}
	$scope.unselectCurrentArea = function() {
		// If no current area is selected...
		if ($scope.areaSelected != null) {
			$scope.areaSelected.rect.fillColor = $scope.drawingOptions.area_color;
			$scope.areaSelected.rect.fillColor.alpha = $scope.drawingOptions.opacity;
			$scope.unselectCurrentLine();

		}
		$scope.areaSelected = null;

	};


	// Regenerates the rectangles on the list areas
	// used when the pages is changed
	// and the teiModel Service
	$scope.reDrawAreas = function() {
		$scope.listAreas.forEach(function(area) {
			// Create the new rectangle

			var rect = new paper.Path.Rectangle({
				from: self.view.getViewPoint(new paper.Point(area.topLeft())),
				to: self.view.getViewPoint(new paper.Point(area.bottomRight())),
				fillColor: $scope.drawingOptions.area_color,
				strokeColor: 'black',

			});
			rect.fillColor.alpha = $scope.drawingOptions.opacity
			//bidireccional status
			rect.TranscriptionArea = area;
			//addHandler for the click
			rect.onClick = function(event) {
				$scope.selectArea(rect.TranscriptionArea);
				$scope.$apply();
			};
			area.addRect(rect);
		});
		$scope.unselectCurrentArea();
	}

	$scope.setOpacity = function(value) {

		$scope.listAreas.forEach(function(area) {

			if(area.rect)
				area.rect.fillColor.alpha = value;
			area.lines.forEach(function(line) {
				if(line.rect)
					line.rect.fillColor.alpha = value;
			});
		});

	}

	$scope.removeRectangles = function() {
		$scope.listAreas.forEach(function(area) {
			if (area.rect) {
				area.rect.remove();
				area.rect = null;
			}
			area.lines.forEach(function(line) {
				if (line.rect)
					line.rect.remove();
				line.rect = null;
			});

		});
	}


	$scope.createTestSample = function() {

		var testUrl = "http://digi.ub.uni-heidelberg.de/diglitData/image/cpg148/4/006v.jpg";
		$scope.newPage(testUrl);

		testUrl = "http://digi.ub.uni-heidelberg.de/diglitData/image/cpg148/4/007v.jpg";
		$scope.newPage(testUrl);

		var areas = [[45, 134, 330, 1138],
								 [57,1131, 713, 1737],
								];

								 var lines = [ [ [115, 149, 269, 189],
				[115,190, 303, 217],
				[114,222, 271,247]
		],
			[ ],
				];
		$timeout(function () {
			var i = 0;
			areas.forEach(function(elem) {
				var topLeft = {'x':elem[0], 'y':elem[1]};
				var bottomRight = {'x':elem[2], 'y':elem[3]};
				console.log("Creating area", topLeft, bottomRight);
				var area = $scope.createArea(topLeft, bottomRight);

				var l = lines[i];
				l.forEach(function(line) {
					var topLeft = {'x':line[0], 'y':line[1]};
					var bottomRight = {'x':line[2], 'y':line[3]};
					console.log("Creating line", topLeft, bottomRight);
					area.addLine(topLeft, bottomRight);
				});
				++i;
			})
		},500);



	};


	// Line detection dealing
	$scope.autoDetectLines = function() {

		var hasTranscription = false;
		for (var l = 0; l < $scope.areaSelected.lines.length; l++) {
			var line = $scope.areaSelected.lines[l];
			if (line.transcription) {
				hasTranscription = true;
				break;
			}


		}

		var doStuff = function() {
			//lineService.getAreaLines(
			lineService.getLines(
				$scope.currentUrl,
				$scope.areaSelected.top,
				$scope.areaSelected.left,
				$scope.areaSelected.bottom,
				$scope.areaSelected.right
			).then(function(result) {
				console.log(result);
				$scope.unselectCurrentLine();
				$scope.areaSelected.lines.forEach(function(line) {
					if (line.rect)
						line.rect.remove();
					line.rect = null;
				});
				$scope.areaSelected.linesFromList(result);

				var area = $scope.areaSelected;

				$scope.unselectCurrentArea();
				$scope.selectArea(area);



			}
						);
		}

		if (hasTranscription) {
			var conf = questionService.confirm("Warning!", "The current area have already lines with transcription on them. \
This lines will be removed, are you sure you want to continue?").then(function() {
				doStuff();
			});
			return;
		}

		doStuff();

	}

	//Trick for select lines
	$scope.preventParent = function($event) {
		$event.stopPropagation();
	}
	$scope.init();
}


