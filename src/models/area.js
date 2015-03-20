Polygon = function(points) {
  this.points = points;
}

Rectangle = function(topLeft, bottomRight) {
  this.top = topLeft.y;
  this.left = topLeft.x;
  this.right = bottomRight.x;
  this.bottom = bottomRight.y;
}

Rectangle.prototype.topLeft = function() {
  return {
    x: this.left,
    y: this.top
  };
};

Rectangle.prototype.bottomRight = function() {
  return {
    x: this.right,
    y: this.bottom
  };
};
Rectangle.prototype.height = function() {
  return (this.bottom - this.top);
};
Rectangle.prototype.width = function() {
  return (this.right - this.left);
};

Area = function(topLeft, bottomRight) {

  Rectangle.call(this, topLeft, bottomRight);
  this.rect = null;
  this.transcription = '';

  //lines, can contain simple lines or polygons
  this.lines = [];



  this.addRect = function(rect) {
    if (this.rect) {
      this.rect.remove();
    }
    this.rect = rect;
  };


  this.addRectangularLine = function(topLeft, bottomRight) {
    var line = new Line(topLeft, bottomRight);
    var idLine = this.id + "l" + this.numLines();
    line.id = idLine;
    this.lines.push(line);
  };

  this.addPolygonLine = function(points) {
    var polygon = new PolyLine(points);
    var idPolygon = this.id + "p" + this.numLines();
    polygon.id = idPolygon;
    this.lines.push(polygon);
  }

  this.linesFromRectangularList = function(lines) {
    this.lines = [];
    var self = this;
    lines.textlines.forEach(function(line) {
      var topLeft = {
        x: line.left,
        y: line.top
      };
      var bottomRight = {
        x: line.right,
        y: line.bottom
      };
      self.addRectangularLine(topLeft, bottomRight);
    });
  };

  this.linesFromPolygonList = function(lines) {
    this.lines = [];
    var points = [];
    var self = this;
    lines.textLines.forEach(function(line) {
      for (var i = 0; i < line.length; i++) {
        var point = {
          x: line[i][0],
          y: line[i][1]
        };
        points.push(point);
      }
      self.addPolygonLine(points);
    });
  };

  this.numLines = function() {

    return this.lines.length;

  };
  this.hasLines = function() {

    return this.lines.length > 0;

  };


  return this;
}


Line = function(topLeft, bottomRight) {
  this.transcription = '';
  this.rect = null;
  Rectangle.call(this, topLeft, bottomRight);

  this.copy = function(other) {
    Rectangle.copy.call(this, other);

  }
  return this;

}

PolyLine = function(points){
	this.transcription = '';
	this.poly = null;
	Polygon.call(this, points);
}


Area.prototype = Rectangle.prototype;
Line.prototype = Rectangle.prototype;
PolyLine.prototype = Polygon.prototype;
