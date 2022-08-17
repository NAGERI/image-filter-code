import express from "express";
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

  app.get("/filteredimage", async (req, res) => {
    let { image_url } = req.query;

    if (!image_url) {
      return res.status(StatusCodes.BAD_REQUEST).send("Image URL is required");
    }

    const img = await filterImageFromURL(image_url);
    // res.send(`Image received ${image_url}`);

    if (!img) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send("Image Not Exist");
    }
    res.status(StatusCodes.OK).sendFile(img);
    deleteLocalFiles([__dirname + "\\util\\tmp"]);
  });
  /**************************************************************************** */
  //! END @TODO1

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
