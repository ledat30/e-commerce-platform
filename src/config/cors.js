//fix bug CORS
//Add headers before the routes are defined
const configCors = (app) => {
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS,PATCH"
    );

    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type ,Authorization"
    );

    res.setHeader("Access-Control-Allow-Credentials", true);

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  });
};
export default configCors;
