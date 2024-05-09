import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Typography from "@mui/material/Typography";
import { TreeItem, useTreeItem } from "@mui/x-tree-view/TreeItem";
const useTreeItemStyles = makeStyles((theme) => ({
  root: {},
  content: {},
  group: {},
  expanded: {},
  label: {
    fontWeight: "inherit",
    color: "inherit",
    paddingLeft: "4px",
    paddingTop: "4px",
    paddingBottom: "4px",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "8px",
    paddingBottom: "8px",
  },
  //for some reason these does not apply to the icon we specified
  labelIcon: {
    // marginRight: theme.spacing(1),
    verticalAlign: "middle",
    color: "#fcba03",
  },
  labelText: {
    marginTop: "2px",
    marginLeft: "4px",
    fontSize: "12px",
    fontWeight: "inherit",
    flexGrow: 1,
    // overflowWrap: "break-word",
    // overflow: "hidden"
  },
}));
const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;
  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}>
        {label}
      </Typography>
    </div>
  );
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  return <TreeItem ContentComponent={CustomContent} {...props} ref={ref} />;
});

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    nodeId,
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  return (
    <CustomTreeItem
      nodeId={nodeId}
      label={
        // ORIGINAL CODE
        // <div className={classes.labelRoot}>
        //   <LabelIcon color="inherit" className={classes.labelIcon} />
        //   <div className={classes.labelText}>{labelText}</div>
        //   <span>{labelInfo}</span>
        // </div>
        // NEW CODE
        <div className="d-flex align-items-center">
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <div className={classes.labelText} style={{ whiteSpace: "nowrap" }}>
            {labelText}
          </div>
        </div>
      }
      title={labelText}
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
        whiteSpace: "nowrap",
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

export default StyledTreeItem;
