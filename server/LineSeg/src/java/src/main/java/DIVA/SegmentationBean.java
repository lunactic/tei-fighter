package src.main.java.DIVA;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * Created by Marcel Würsch on 24.06.2014.
 */
@XmlRootElement
public class SegmentationBean {

    public SegmentationBean(){}

    @XmlElement
    public String url;
    @XmlElement
    public String top;
    @XmlElement
    public String bottom;
    @XmlElement
    public String left;
    @XmlElement
    public String right;
    @XmlElement
    public String mode;

}
