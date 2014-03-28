Area = function(topLeft, bottomRight)	{
		this.top = topLeft.y;
		this.left = topLeft.x;
		this.right = bottomRight.y;
		this.bottom = bottomRight.x;
		this.rect = null;
		this.transcription = '';

		this.addRect = function(rect) {
		this.rect = rect;

		};

		return this;

}