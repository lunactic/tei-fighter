Area = function(topLeft, bottomRight)	{
		this.top = topLeft.y;
		this.left = topLeft.x;
		this.right = bottomRight.x;
		this.bottom = bottomRight.y;
		this.rect = null;
		this.transcription = '';

		this.addRect = function(rect) {
            if (this.rect) {
                this.rect.remove();
            }
            this.rect = rect;

		};

        this.topLeft = function() {
         return {x:this.left, y:this.top};

        };

        this.bottomRight = function() {
         return {x: this.right, y: this.bottom};

        }
		return this;

}
