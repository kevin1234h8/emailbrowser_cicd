import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing(1)
  },
  input: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  }
}));

function ControlSection(props) {
  const classes = useStyles();

  const showAsConversationCheckbox_changed = event => {
    props.showAsConversationChanged(event.target.checked);
  };

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormGroup>
          {/* <FormControlLabel
            control={
              <Checkbox
                onChange={showAsConversationCheckbox_changed}
                name="gilad"
                style={{
                  color: "grey"
                }}
                defaultChecked={true}
              />
            }
            label="Show as Conversations"
          /> */}
          <Paper component="form" className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Search for Emails"
              inputProps={{ "aria-label": "Search" }}
            />
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </FormGroup>
      </FormControl>
    </div>
  );
}
ControlSection.propTypes = {
  showAsConversation: PropTypes.bool.isRequired,
  showAsConversationChanged: PropTypes.func.isRequired
};
export default ControlSection;
