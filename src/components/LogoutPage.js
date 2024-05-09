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

export default function LogoutPage() {
  const classes = useStyles();
  return (
    <>
      <div style={{ textAlign: "center", paddingTop: "5%" }}>
        <Paper className={classes.card}>
          <h2>Successfully logged out</h2>
          <p>session ended.</p>
          <Button
            onClick={() => {
              localStorage.setItem("pervNodeID", "2000");
              sessionStorage.removeItem("listNodeID");
            }}
            variant="outlined"
            href={config.REACT_APP_OAUTH_URL}
            className="emails_section flex">
            {" "}
            login{" "}
          </Button>
        </Paper>
      </div>
    </>
  );
}
