import static j2html.TagCreator.body;
import static j2html.TagCreator.h1;
import static spark.Spark.*;

public class Main {
    public static void main(String[] args) {

        // load star catalog

        // TODO use a real database for this...


        // add get service path for retrieving catalog entries
        // add path for serving star browsing application...
        // Add get path for retrieving zenith position which employs native libraries

        get("/hello", (request, response) -> {

            String accept = request.headers("Accept");
            if( accept == null ) {
                //response.status();
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
                return "{\"message\":\"Hello World\"}";
            }

            return "error";
        } );

    }

}