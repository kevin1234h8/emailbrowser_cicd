import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import Cookies from "universal-cookie";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FolderIcon from "@material-ui/icons/Folder";
import Popover from "@material-ui/core/Popover";
import LinearProgress from "@material-ui/core/LinearProgress";
import PageviewIcon from "@material-ui/icons/Pageview";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import { isObject } from "lodash";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
const { Config } = require("../common/AppConfig");
const config = Config();
const cookies = new Cookies();

const AutocompleteSearch = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [chip, setChip] = useState(true);

  useEffect(() => {
    if (props.clearSearchLocation) {
      setInputValue("");
      props.handleMenuItemClick("");
      props.setClearSearchLocation(false);
    }
  }, [props.clearSearchLocation]);

  const fetchOptions = () => {
    const userID = cookies.get("uid");
    if (inputValue.length > 0) {
      setIsLoading(true);
      axios
        .get(
          config.REACT_APP_API_URL +
            `/folders/getFolderListByName?userName=${userID}&folderName=${inputValue}`
        )
        .then((response) => {
          if (response.data.length === 0) {
            notFoundFolder();
          } else {
            setOptions(response.data);
          }
          setIsLoading(false);
          setOpen(true);
        });
    } else {
      notFoundFolder();
      setIsLoading(false);
    }
  };

  const handleClick = (value, folderInfo) => {
    setInputValue(value);
    props.handleMenuItemClick(folderInfo);
    setOpen(false);
    setSelected(true);
  };

  const handleChange = (value) => {
    if (value === "") {
      setInputValue(value);
      props.handleMenuItemClick("");
    } else {
      setInputValue(value);
    }
  };

  const notFoundFolder = () => {
    setOptions([
      {
        NodeID: 0,
        Name: "Not Found",
        ParentNodeID: 0,
        ChildCount: 0,
        FullPath: "-",
      },
    ]);
  };

  return (
    <Grid container>
      {!isObject(props.selectedOption) ? (
        <Grid container spacing={1} item xs={12}>
          <Grid
            item
            xs={11}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <input
              type="search"
              className="form-control"
              id={props.elementID}
              value={inputValue}
              placeholder="Indicate the Folder to Search in"
              onChange={(e) => handleChange(e.target.value)}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            />
            {isLoading ? (
              <LinearProgress />
            ) : (
              <Popover
                id={"select option"}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setOpen(false)}
                PaperProps={{
                  style: {
                    width: anchorEl ? anchorEl.clientWidth : null,
                    maxHeight: "25em",
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}>
                <List dense={true}>
                  {options.length > 0 &&
                    options.map((option) => (
                      <ListItem
                        button
                        disabled={option.FullPath === "-"}
                        key={option.NodeID}
                        selected={option.Name === inputValue}
                        onClick={() => handleClick(option.Name, option)}>
                        <ListItemIcon>
                          <FolderIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={option.Name}
                          secondary={option.FullPath}
                        />
                      </ListItem>
                    ))}
                </List>
              </Popover>
            )}
          </Grid>
          <Grid item xs={1}>
            <IconButton
              color="primary"
              onClick={fetchOptions}
              style={{ border: "1px solid #ced4da" }}>
              <PageviewIcon />
            </IconButton>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Chip
            style={{
              overflow: "hidden",
              width: "100%",
              height: "4em",
              borderRadius: "5px",
              placeContent: "start",
            }}
            label={
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  padding: "5px",
                }}>
                <Tooltip
                  title={props.selectedOption.Name}
                  arrow
                  placement="top-start">
                  <Typography
                    component="span"
                    display="block"
                    style={{
                      borderBottom: "groove 1px",
                      fontSize: "larger",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {props.selectedOption.Name}
                  </Typography>
                </Tooltip>
                <Tooltip
                  title={props.selectedOption.FullPath}
                  arrow
                  placement="bottom-start">
                  <Typography component="span" variant="body2">
                    {props.selectedOption.FullPath}
                  </Typography>
                </Tooltip>
              </div>
            }
            variant="outlined"
            onDelete={() => handleChange("")}
            icon={
              <span style={{ marginLeft: "10px" }}>
                <FolderIcon />
              </span>
            }
            component="div"
          />
        </Grid>
      )}
    </Grid>
  );
};

export default AutocompleteSearch;
