import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.File;
import java.io.FileInputStream;

import static j2html.TagCreator.body;
import static j2html.TagCreator.h1;
import static org.eclipse.jetty.http.HttpParser.LOG;
import static spark.Spark.*;

public class Main {

    private static JSONArray catalog = new JSONArray();

    public static void main(String[] args) {

        port( 4567 );
        String projectDir = System.getProperty("user.dir");
        String staticDir = "\\src\\main\\resources\\public";
        staticFiles.externalLocation(projectDir + staticDir);
        //staticFiles.location("/public" );

        // load star catalog
        try {
            File file = new File( projectDir + staticDir + "/stars.json" );
            assert( file.exists() );
            FileInputStream stream = new FileInputStream( file );
            JSONTokener tokenizer = new JSONTokener( stream );
            catalog = new JSONArray( tokenizer );

//            for( Object object : catalog ) {
//                System.out.println( object.toString() );
////                if(object instanceof JSONObject) {
////                    JSONObject json = (JSONObject) object;
////                }
//            }

        } catch ( Exception exception ) {
            exception.printStackTrace();
            System.err.println( "Failed to load catalog." );
        } // TODO figure out a better method for error handling
        // TODO use a real database for this...

        // add get service path for retrieving catalog entries
        // add path for serving star browsing application...
        // Add get path for retrieving zenith position which employs native libraries

        get("/hello", (request, response) -> {

            String accept = request.headers("Accept");
            if( accept == null ) {
                LOG.warn("missing Accept headers");
                return "error.";
            }

            else if( accept.contains("text/html") ) {
                response.status(200);
                response.type("text/html");
                return body().with(
                        h1("Test Accept Headers")
                ).render();
            }

            else if( accept.contains("application/json") ) {
                response.status(200);
                //return "{\"message\":\"Hello World\"}";
                return catalog.toString();
            }

            return "error";
        } );

    }

}