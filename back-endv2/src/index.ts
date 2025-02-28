import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "./data-source";
import { errorHandler } from "./middlewares/error.middleware";
import { Routes } from "./routes";
AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(errorHandler);
    Routes.forEach((route) => {
      const controllerInstance = new (route.controller as any)();
      const middlewares = route.middlewares || [];
      (app as any)[route.method](
        route.route,
        ...middlewares,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const result = await controllerInstance[route.action](
              req,
              res,
              next
            );
            if (result !== null && result !== undefined) {
              res.json(result);
            }
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        }
      );
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000 to see results"
    );
  })
  .catch((error) => console.log(error));
