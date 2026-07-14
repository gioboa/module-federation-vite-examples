import config from "#config";
import EmbroiderRouter from "@embroider/router";

export default class Router extends EmbroiderRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {});
