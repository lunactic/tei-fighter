String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

var addCoordElement = function(node, xmlId, ulx, uly, lrx, lry) {
    node.setAttribute("xml:id", xmlId);
    node.setAttribute("ulx", ulx.toFixed());
    node.setAttribute("uly", uly.toFixed());
    node.setAttribute("lrx", lrx.toFixed());
    node.setAttribute("lry", lry.toFixed());
}

// Gets the page info object
// and generates the facsimile tas
// The mother of the lamb
generateTEI = function(teiModel) {

    var parser = new DOMParser();

    var root = parser.parseFromString('<TEI/>', "text/xml");

    var teiHeader = generateHeader(teiModel.teiInfo);
    root.firstChild.appendChild(teiHeader);
    var facsimile = root.createElement("facsimile");
    root.firstChild.appendChild(facsimile);
    // For each page
    teiModel.listOfPages.forEach(function(currentPage) {
        //surface
        var surface = root.createElement("surface");
        addCoordElement(surface, currentPage.idSurface, 0, 0, currentPage.width, currentPage.height);
       facsimile.appendChild(surface);
    // Graphic url
      var graphic = root.createElement("graphic");
      graphic.setAttribute("url",currentPage.url);
      surface.appendChild(graphic);
//    // Adding the zone element
      currentPage.areas.forEach(function(area) {
          var zone = root.createElement("zone");
        addCoordElement(zone, area.id,
                        area.left,area.top,
                        area.right, area.bottom);

				// Add the lines, spaghetti code
				var l = 0;
				area.lines.forEach(function(line) {
					var lineZone = root.createElement("line");
					var lineId   = line.id;
					addCoordElement(lineZone, lineId, line.left, line.top, line.right, line.bottom);
					zone.appendChild(lineZone);
					l++;
				});
        surface.appendChild(zone)
     }); //areas
    });//pages

    // now generate the text Area
     var textTag  = root.createElement("text");
    var bodyTag  = root.createElement("body");
    textTag.appendChild(bodyTag);

    teiModel.listOfPages.forEach(function(currentPage) {
        var facs  = root.createElement("div");
        var title = root.createElement("title");
        title.textContent = currentPage.title;
        facs.setAttribute("facs", currentPage.idSurface);
        var titleWrapper = root.createElement("p")
        titleWrapper.appendChild(root.createElement("s")
                         .appendChild(title).parentElement);

        facs.appendChild(titleWrapper);
        // The transcription
        // div
        // -> pb facs=url
        // -> p facs=textId

        var transDiv = root.createElement("div");
        var pb = root.createElement("pb")

        pb.setAttribute("facs", currentPage.url);
        transDiv.appendChild(pb);
        // Add one p for each zi=one
        currentPage.areas.forEach(function(area) {
        var transFac = root.createElement("p");
         transFac.setAttribute("facs","#"+area.id);

        // FIXME: Parse the content as xml
        transFac.textContent = area.transcription;
        transDiv.appendChild(transFac);

				// lines
				var l = 0;
				area.lines.forEach(function(line) {
					var lineNode = root.createElement("l");
					var lineId = "l"+l;
					var facsId   = "#"+area.id+"l"+l;
					lineNode.setAttribute("xml:id",lineId);
					lineNode.setAttribute("facs",facsId);
					lineNode.textContent = line.transcription;
					transFac.appendChild(lineNode);
					l++;
				});
      }); // areas
      facs.appendChild(transDiv);
     bodyTag.appendChild(facs);
    }); // pages

    root.firstChild.appendChild(textTag);


    return root.firstChild;

}

// Given the teiInfo file generates the header
generateHeader = function (teiInfo){

    var parser = new DOMParser();
    var root = parser.parseFromString('<teiHeader/>', "text/xml");

    var fileDesc = root.createElement("fileDesc");
    var titleStmt = root.createElement("titleStmt");
    var titleTag = root.createElement("title");
    titleTag.textContent = teiInfo.title;
    titleStmt.appendChild(titleTag);
    var publicationStmt = root.createElement("publicationStmt");
    publicationStmt.textContent = teiInfo.publicationInformation;
    var sourceDesc = root.createElement("sourceDesc");
    sourceDesc.textContent = teiInfo.sourceDesc;


    root.firstChild.appendChild(fileDesc);
    fileDesc.appendChild(titleStmt);
    fileDesc.appendChild(publicationStmt);
    fileDesc.appendChild(sourceDesc);

    return root.firstChild;



}


