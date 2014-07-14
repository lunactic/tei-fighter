package src.main.java.DIVA;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import javax.imageio.ImageIO;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

/**
 * Created by Marcel Würsch on 24.06.2014.
 */
@Path("/word")
public class WordSegmentation {

    @POST
    @Path("/segment")
    @Consumes("application/json")
    @Produces("application/json")
    public String segmentImage(SegmentationBean data) throws IOException, JSONException {

        URL url = new URL(data.url);
        
        JSONArray array = new JSONArray();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("top", 0);
        jsonObject.put("bottom", 0);
        jsonObject.put("left", 0);
        jsonObject.put("right", 0);
        array.put(jsonObject);
        return array.toString();
    }



}
