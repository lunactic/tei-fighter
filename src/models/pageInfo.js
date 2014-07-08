
PageInfo = function (pUrl) {

    this.width  = 0;
    this.height = 0;

    this.title = "New Page";
    this.idSurface = "surface1";
    this.url = pUrl;
    this.areas = [];

    this.setSize = function (width, height) {
        this.width = width;
        this.height = height;
    };

		this.addPage = function(page) {
			this.areas.push(page);
		}
    return this;
}

