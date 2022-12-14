import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { StatusCodes } from "http-status-codes";
const logger = require("morgan");
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import { cast } from "bluebird";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8082");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  });

  app.use(logger("dev"));
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url }: { image_url: string } = req.query;

    if (!image_url) {
      return res.status(StatusCodes.BAD_REQUEST).send("Image URL is required");
    }

    const img = await filterImageFromURL(image_url);
    // res.send(`Image received ${image_url}`);

    if (!img) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Image filtering failed");
    }
    timeout(60000);
    // deleteLocalFiles([__dirname + "/util/tmp"]);
    res.status(StatusCodes.OK).sendFile(img);
  });
  /**************************************************************************** */
  //! END @TODO1
  function timeout(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
