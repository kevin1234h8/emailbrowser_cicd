import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
const { Config } = require("../components/common/AppConfig");
const config = Config();

const useStyles = makeStyles((theme) => ({
  card: {
    textAlign: "center",
    flexWrap: "wrap",
    maxWidth: "50%",
    display: "inline-block",
    justifyContent: "center",
    padding: "5%",
  },
}));

export default function ErrorPage(props) {
  const classes = useStyles();
  const hashError = window.location.hash;
  return (
    <>
      <div style={{ textAlign: "center", paddingTop: "5%" }}>
        {hashError === "#config-default-folder-error" ? (
          <Paper className={classes.card}>
            <p>
              There is an error in configuration first folder. Please contact
              Administrator.
            </p>
          </Paper>
        ) : (
          <Paper className={classes.card}>
            <h2>You are not Authorized</h2>
            <p>
              {hashError === "#session"
                ? "There is another session currently active, Please contact Administrator."
                : "Your current session has expired, please login to continue."}
            </p>
            <Button
              variant="outlined"
              href={config.REACT_APP_OAUTH_URL}
              onClick={() => {
                localStorage.setItem("pervNodeID", "2000");
                sessionStorage.removeItem("listNodeID");
              }}
              className="emails_section flex"
            >
              {" "}
              login{" "}
            </Button>
          </Paper>
        )}
      </div>
    </>
  );
}
