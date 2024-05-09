import React, { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Loader from "./common/Loader";
import {jwtDecode} from "jwt-decode";
import Cookies from "universal-cookie";
import AGOApi from "../api/AGOApi";
const { Config } = require("../components/common/AppConfig");
const config = Config();

const useStyles = makeStyles((theme) => ({
  card: {
    textAlign: "center",
    flexWrap: "wrap",
    maxWidth: "50%",
    display: "inline-block",
    justifyContent: "center",
    padding: "3%",
  },
}));

export default function RedirectPage(props) {
  const classes = useStyles();
  const [userInfo, setUserInfo] = React.useState({ uid: null });
  const [isAuthRedirect, setIsAuthRedirect] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const cookies = new Cookies();

  const displayEmailHtml = async (nodeID, username) => {
    try {
      let redirectUrl = "data:text/html;charset=utf-8";
      let apiUrl = "".concat(
        config.REACT_APP_FRAME_URL_1,
        nodeID.toString(),
        config.REACT_APP_FRAME_URL_2
      );
      const response = await fetch(apiUrl);

      if (response.status === 200) {
        redirectUrl = `${config.REACT_APP_API_URL}/view/email?id=${nodeID}&userName=${username}`;
      } else if (response.status === 500) {
        let htmlString = `
            <div style='display: flex; justify-content: center; align-items: center; height: 100%'>
              <h1 style='text-align: center;'>You do not have read permission to view contents</h1>
            </div>`;

        redirectUrl = "data:text/html;charset=utf-8," + encodeURI(htmlString);
      }

      window.location.replace(redirectUrl);
    } catch (err) {
      console.log("err", err);
    }
  };

  const getUserGroup = async () => {
    const userGroups = await AGOApi.getCurrentUserGroups(cookies.get("uid"));

    if (userGroups.status == 200) {
      window.location.replace("/otcsemails/browser");
    }
  };

  useEffect(() => {
    const hashQuery = window.location.hash;

    if (hashQuery) {
      if (hashQuery.match(/\#(?:access_token)\=([\S\s]*?)\&/)) {
        setLoading(() => false);
        setIsAuthRedirect(() => true);
        cookies.remove("uid", { path: "/" });
        cookies.remove("ebid", { path: "/" });

        const token = hashQuery.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
        const decodeToken = jwtDecode(token);

        setUserInfo(decodeToken);
        cookies.set("otsession", token, { path: "/" });
        cookies.set("uid", decodeToken.unm, { path: "/" });

        if (cookies.get("uid") && isAuthRedirect) {
          getUserGroup();
        }
      } else if (hashQuery.match(/\#(?:data)\=([\S]*)/)) {
        setIsAuthRedirect(() => false);
        setLoading(() => true);

        const paramStr = hashQuery.match(/\#(?:data)\=([\S]*)/)[1];
        const splitParam = paramStr.toString().split(";");
        const redirectType = splitParam[0];

        if (redirectType === "viewEmailContent") {
          displayEmailHtml(splitParam[1], splitParam[2]);
        }
      } else {
        setLoading(() => false);
        setIsAuthRedirect(() => false);
      }
    }
  }, [isAuthRedirect]);

  return loading ? (
    <div
      style={{
        position: "absolute",
        left: "0",
        width: `100%`,
        height: `${window.innerHeight}px`,
        backgroundColor: "#FFF",
      }}
    >
      <Loader />
    </div>
  ) : isAuthRedirect ? (
    <>
      <div style={{ textAlign: "center", paddingTop: "5%" }}>
        <Paper className={classes.card}>
          <h2>Redirecting ...</h2>
          <p>Please wait.</p>
          <h5 style={{ paddingTop: "10%" }}>
            Authenticated as <b>{userInfo.uid}</b>
          </h5>
        </Paper>
      </div>
    </>
  ) : (
    <div
      style={{
        position: "absolute",
        left: "0",
        width: `100%`,
        height: `${window.innerHeight}px`,
        backgroundColor: "#FFF",
      }}
    ></div>
  );
}
