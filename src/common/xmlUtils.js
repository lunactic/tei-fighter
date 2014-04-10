String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

var addCoordElement = function(node, xmlId, ulx, uly, lrx, lry) {
    node.setAttribute("xmld:id", xmlId);
    node.setAttribute("ulx", ulx);
    node.setAttribute("uly", uly);
    node.setAttribute("lrx", lrx);
    node.setAttribute("lry", lry);

}

// Gets the page info object and the list of areas
// and generates the facsimile tas
generateFacsimile = function(pageInfo, listAreas) {

    //
    var parser = new DOMParser();

    var root = parser.parseFromString("<TEI/>", "text/xml");

    var facsimile = root.createElement("facsimile");
    root.firstChild.appendChild(facsimile);
    //surface
    var surface = root.createElement("surface");

    addCoordElement(surface, pageInfo.idSurface, 0, 0, pageInfo.width, pageInfo.height);
    facsimile.appendChild(surface)
    // Graphic ur
    var graphic = root.createElement(graphic);
    // Adding the zone element
    listAreas.forEach(function(area) {
        var zone = document.createElement("zone");
        addCoordElement(zone, area.id,
                        area.left,area.top,
                        area.right, area.bottom);
        surface.appendChild(zone)
    });

    // now generate the text Area
    var textTag  = root.createElement("text");
    var bodyTag  = root.createElement("body");
    textTag.appendChild(bodyTag);
    var facs  = root.createElement("div");
    var title = root.createElement("title");
    title.textContent = pageInfo.title;
    facs.setAttribute("facs", pageInfo.idSurface);

    var titleWrapper = root.createElement("p")
    titleWrapper.appendChild(root.createElement("s")
                         .appendChild(title).parentElement);

    // The transcription
    // div
    // -> pb facs=url
    // -> p facs=textId
    var transDiv = root.createElement("div");
    var pb = root.createElement("pb")
    pb.setAttribute("facs", pageInfo.url);

    // Add one p for each zi=one
    listAreas.forEach(function(area) {
        var transFac = root.createElement("p");
        transFac.setAttribute("facs",area.id);

        // FIXME: Parse the content as xml
        transFac.textContent = area.transcription;
        transDiv.appendChild(transFac);
    });
    facs.appendChild(transDiv);
    bodyTag.appendChild(facs);

    root.firstChild.appendChild(textTag);
    return root.firstChild;

}

// Gets the page info object
// and generates the facsimile tas
// The mother of the lamb
generateTEI = function(teiModel) {

    //
    var parser = new DOMParser();

    var root = parser.parseFromString("<TEI/>", "text/xml");

    var sHeader = generateHeader(teiModel.teiInfo);
    var teiHeader = $(sHeader)[0];
    root.firstChild.appendChild(teiHeader);
    var facsimile = root.createElement("facsimile");
    root.firstChild.appendChild(facsimile);
    // For each page
    teiModel.listOfPages.forEach(function(currentPage) {
        //surface
        var surface = root.createElement("surface");
        addCoordElement(surface, currentPage.idSurface, 0, 0, currentPage.width, currentPage.height);
       facsimile.appendChild(surface);
//    // Graphic ur
      var graphic = root.createElement("graphic");
      graphic.setAttribute("url",currentPage.url);
      surface.appendChild(graphic);
//    // Adding the zone element
      currentPage.areas.forEach(function(area) {
          var zone = root.createElement("zone");
        addCoordElement(zone, area.id,
                        area.left,area.top,
                        area.right, area.bottom);
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
         transFac.setAttribute("facs",area.id);
//
        // FIXME: Parse the content as xml
        transFac.textContent = area.transcription;
        transDiv.appendChild(transFac);
      }); // areas
      facs.appendChild(transDiv);
     bodyTag.appendChild(facs);
    }); // pages

    root.firstChild.appendChild(textTag);
    return root.firstChild;

}

generateHeader = function (teiInfo){

    return "<teiHeader>\
    <fileDesc><titleStmt><title>{0}</title></titleStmt>\
        <publicationStmt><p>{1}</p></publicationStmt>\
            <sourceDesc><p>{2}</p></sourceDesc>\
    </fileDesc>\
    </teiHeader>".format(teiInfo.title,teiInfo.publicationInformation,teiInfo.sourceDesc);


}


