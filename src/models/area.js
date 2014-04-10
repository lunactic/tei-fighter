Area = function(topLeft, bottomRight)	{
		this.top = topLeft.y;
		this.left = topLeft.x;
		this.right = bottomRight.x;
		this.bottom = bottomRight.y;
		this.rect = null;
		this.transcription = '';

		this.addRect = function(rect) {
            this.rect = rect;
		};

		return this;

}
