"use strict";

/* Package System */
const jwt = require("jsonwebtoken");
const { compareToken, trimSlash } = require("@utils/Helper");
const Function = require("../models/user");
// const Function = new Controller("accounts");

module.exports = async (req, res, next) => {
  try {
    let _authorization = req.headers.authorization;
    if (!_authorization)
      return res
        .status(401)
        .json({ status: "error", errors: { msg: "Authorization required" } });

    let [_authType, _token] = _authorization.trim().split(" ");
    if (_authType !== "Bearer" && _authType !== "Token")
      return res
        .status(401)
        .json({ status: "error", errors: { msg: "Incorrect Authorization" } });
    if (_authType == "Bearer") {
      let _decoded = jwt.verify(_token, process.env.SECRET_KEY);
      req.access_token = _token;
      req.account = _decoded;
    }
    if (_authType == "Bearer") {
      let _ignore = ["me"];
      let _decoded = jwt.verify(_token, process.env.SECRET_KEY);
      req.access_token = _token;
      req.account = _decoded;
      if (_ignore.includes(trimSlash(req.route.path)) == false) {
        req.headers["x-aio-module"] = trimSlash(req.route.path);
        let _checkRole = await Function.checkRole(req, req.account.role_id);
        if (_checkRole == true) {
          return res
            .status(403)
            .json({ status: "error", errors: { msg: "Permission Denied" } });
        } else {
          let _checkDBFilter = await Function.checkDBFilter(
            req,
            req.account.role_id
          );
          Object.keys(_checkDBFilter).forEach((key) => {
            if (/event_id:(\d*)/.test(_checkDBFilter[key])) {
              req.headers["x-event-id"] =
                _checkDBFilter[key].match(/event_id:(\d*)/i)[1];
            }
            req.query = {
              ...req.query,
              [key]: req.query?.[key]
                ? req.query[key] + "," + _checkDBFilter[key]
                : _checkDBFilter[key],
            };
          });
        }
      }
      global.userInfo = { access_token: _token, account: _decoded };
    }
    if (_authType == "Token") {
      if (compareToken(_token) == false)
        return res
          .status(400)
          .json({ status: "error", errors: { msg: "Invalid token" } });
    }
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError")
      return res.status(401).json({
        status: "error",
        code: error.name,
        errors: { msg: error.message },
      });
    else
      return res
        .status(400)
        .json({ status: "error", errors: { msg: "Invalid token" } });
  }
};
