Rectangle = function(topLeft, bottomRight)	{
	this.top = topLeft.y;
	this.left = topLeft.x;
	this.right = bottomRight.x;
	this.bottom = bottomRight.y;


}
Rectangle.prototype.topLeft = function() {
		return {x:this.left, y:this.top};
	};

Rectangle.prototype.bottomRight = function() {
		return {x: this.right, y: this.bottom};
	};
Rectangle.prototype.height  = function() {
		return (this.bottom - this.top);
	};
Rectangle.prototype.width  = function() {
		return (this.right - this.left);
	};

Area = function(topLeft, bottomRight) {

	Rectangle.call(this,topLeft, bottomRight);
	this.rect          = null;
	this.transcription = '';
	this.lines         = [];



	this.addRect = function(rect) {
		if (this.rect) {
			this.rect.remove();
		}
		this.rect = rect;
	};


	this.addLine = function(topLeft, bottomRight) {
		var line  = new Line(topLeft, bottomRight);
		this.lines.push(line);
	};

	this.linesFromList = function(lines) {
		this.lines = [];
		var self = this;
		lines.forEach(function(line) {
			var topLeft = {x:line.left, y:line.top};
			var bottomRight = {x:line.right, y:line.bottom};
			self.addLine(topLeft, bottomRight);

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
	Rectangle.call(this,topLeft, bottomRight);

	return this;
}
Area.prototype = Rectangle.prototype;
Line.prototype = Rectangle.prototype;

