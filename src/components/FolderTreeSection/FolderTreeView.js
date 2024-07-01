import React, { useState, useEffect } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { GoChevronRight, GoChevronDown } from "react-icons/go";
import PropTypes from "prop-types";
import FolderTreeItem from "./FolderTreeItem";
import AGOApi from "../../api/AGOApi";
import _, { result } from "lodash";
import { TreeView } from "@mui/x-tree-view/TreeView";
// import { withRouter } from "react-router-dom";
import { withRouter } from "../WithRouter";
import axios from "axios";
import recentAccessedIcon from "../../components/assets/title_recentlyaccessed.svg";
import { TreeItem, useTreeItem } from "@mui/x-tree-view/TreeItem";
import MailFileIcon from "../../components/assets/mime_mail.svg";
import { makeStyles } from "@material-ui/core/styles";
import { FcFolder } from "react-icons/fc";
import clsx from "clsx";
import Typography from "@mui/material/Typography";
import { Config } from "../common/AppConfig";
import Cookies from "universal-cookie";
let Fullpath = [];
const config = Config();
const cookies = new Cookies();
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
      ref={ref}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        onClick={handleSelectionClick}
        component="div"
        className={classes.label}
      >
        {label}
      </Typography>
    </div>
  );
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  return <TreeItem ContentComponent={CustomContent} {...props} ref={ref} />;
});

function FolderTreeView(props) {
  const [expanded, setExpanded] = useState([]);
  const [defaultExpandedFolders, setDefaultExpandedFolders] = useState([]);
  const [folderPath, setFolderPath] = useState([]);
  // const [selected, setSelected] = useState([]);
  const [favoriteSelected, setFavoriteSelected] = useState([]);

  let [NeedtoExpand, setNeedtoExpand] = useState([]);
  let [favoriteNeedtoExpand, setFavoriteNeedtoExpand] = useState([]);
  const [NodeID, setNodeID] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({});
  const [data, setData] = useState([]);

  // const [Fullpath, setFullpath] = useState([]);
  // useEffect(() => {
  //   setNodeID(treeViewDefaultExpandedFolders);
  // }, []);

  useEffect(() => {
    const pervNodeID = localStorage.getItem("pervNodeID");
    if (pervNodeID) {
      props.setSelected(localStorage.getItem("pervNodeID"));
    }
    props.setSelected("pervNodeID");
  }, []);

  let FolderIconCSUI = () => {
    return <img className="ago-csui-icon" alt="" src={""} />;
  };
  const fetchSubfolders = async (nodeId) => {
    const res = await AGOApi.getFolders(nodeId);
    return res?.data ?? [];
  };
  let FavoriteIcons = () => {
    return <img className="ago-csui-icon" alt="" src={""} />;
  };
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
  const classes = useTreeItemStyles();

  // const handleSelectfav = async (event, nodeIds) => {
  //   console.log("handleSelectfav", nodeIds);

  //   if (event.target.id !== "expand") {
  //     setSelected(nodeIds);
  //     props.NodeSelected(nodeIds);
  //     props.setPreviouslink("");
  //   }
  // };
  const handleToggleFav = async (nodeId, isExpanded) => {
    try {
      if (!isExpanded) {
        const subFolders = await fetchSubfolders(nodeId);
        setExpandedFolders((prev) => ({ ...prev, [nodeId]: subFolders }));
      } else {
        setExpandedFolders((prev) => {
          const newExpanded = { ...prev };
          delete newExpanded[nodeId];
          return newExpanded;
        });
      }
    } catch (error) {
      // Handle error
      console.error("Error toggling folder:", error);
    }
  };

  const handleToggle = async (event, nodeIds) => {
    props.setSearchBreadcrumb([]);
    sessionStorage.setItem("clickFromCSUI", "true");
    props.setIsListConversationOpen(false);
    const nodeIdArray = nodeIds.join(",");
    sessionStorage.setItem("listNodeID", nodeIdArray);
    if (nodeIds[0] === "2000") {
      nodeIds.reverse();
    }
    Fullpath = [];

    setNeedtoExpand(nodeIds);
    if (nodeIds && nodeIds.length) {
      nodeIds.map((id) => {});
      setNodeID(parseInt(nodeIds[0]));
    }
  };

  const handleFavoriteToggle = async (event, nodeIds) => {
    sessionStorage.setItem("clickFromCSUI", "true");
    // console.log("handleToggle", nodeIds);
    props.setIsListConversationOpen(false);
    const nodeIdArray = nodeIds.join(",");
    sessionStorage.setItem("listNodeID", nodeIdArray);
    if (nodeIds[0] === "2000") {
      nodeIds.reverse();
    }
    Fullpath = [];

    setFavoriteNeedtoExpand(nodeIds);
    if (nodeIds && nodeIds.length) {
      nodeIds.map((id) => {});
      setNodeID(parseInt(nodeIds[0]));
    }
  };

  function Exceptiontime(value) {
    setNodeID("");

    var ExpandArray =
      NeedtoExpand && NeedtoExpand.length
        ? NeedtoExpand.filter((r) => {
            return r !== value;
          })
        : [];

    setNeedtoExpand(ExpandArray);
  }

  useEffect(() => {
    let url = document.referrer;

    let spliturl = _.split(url, "/nodes/", 2);
    let id = _.split(spliturl[1], "?", 1);

    var testID = parseInt(localStorage.getItem("pervNodeID"));
    let url1 = decodeURIComponent(window.location.search);

    let spliturl1 = _.split(url1, "/nodes/", 2);
    let id1 = _.split(spliturl1[1], "?", 1);
    let emailFolderId = -1;

    const fetchpathData = async () => {
      if (id[0] === "" && id1[0] === "") {
        const res = await AGOApi.getFolders(2000);
        if (res !== null) {
          let subFolders = res.data;
          const selectedNodesId =
            localStorage.getItem("pervNodeID") !== "" || undefined
              ? localStorage.getItem("pervNodeID")
              : "2000";
          let filteredSubFolders = subFolders.filter(
            (folder) =>
              folder.NodeID == parseInt(localStorage.getItem("pervNodeID"))
          );

          // let filteredSubFolders = subFolders.filter(
          //   (folder) => folder.Name === "Email Before 24 Aug 2022"
          // );
          emailFolderId = filteredSubFolders[0]?.NodeID;
          id[0] = emailFolderId; // 'Email' folder id
        }
      }

      if (id[0] || id1[0]) {
        const response = await AGOApi.getFoldersPath(
          parseInt(id[0] ? id[0] : id1[0])
        );
        setFolderPath(response.data);
        if (response !== null) {
          Fullpath = [];
          for (var i = 0; response.data.length > i; i++) {
            var item = response.data[i];
            NeedtoExpand.unshift(item.NodeID.toString());
            Fullpath.push(item);
            //setNeedtoExpand(NeedtoExpand);
            props.setSelected(item.NodeID.toString());

            props.setFolderFullpath(Fullpath);

            sessionStorage.setItem("navigationPath", Fullpath);

            // if (i === response.data.length - 1) {
            //   props.NodeSelected(item.NodeID.toString());
            // }
          }
        }
      }
    };
    if (url || url1 || url === "") {
      fetchpathData();
    }
  }, []);

  useEffect(() => {
    const fetchpathData = async () => {
      // Retrieve the ID from localStorage
      var pervNodeID = localStorage.getItem("pervNodeID");

      if (props.ShowEmailFolderID || pervNodeID) {
        const response = await AGOApi.getFoldersPath(
          parseInt(pervNodeID ? pervNodeID : props.ShowEmailFolderID)
        );
        if (response !== null) {
          NeedtoExpand = [];
          Fullpath = [];
          for (var i = 0; response.data.length > i; i++) {
            var item = response.data[i];
            props.setSelected(item.NodeID.toString());
            NeedtoExpand.unshift(item.NodeID.toString());
            Fullpath.push(item);
            // if(i === (response.data.length -1)) {
            //   props.NodeSelected(item.NodeID.toString());
            // }
          }
          props.setFolderFullpath(Fullpath);
          setNeedtoExpand(NeedtoExpand);
        }
      }
    };
    // const fetchpathData = async () => {
    //   if (props.ShowEmailFolderID) {
    //     const response = await AGOApi.getFoldersPath(
    //       parseInt(props.ShowEmailFolderID)
    //     );
    //     if (response !== null) {
    //       NeedtoExpand = [];
    //       Fullpath = [];
    //       for (var i = 0; response.data.length > i; i++) {
    //         var item = response.data[i];
    //         setSelected(item.NodeID.toString());
    //         NeedtoExpand.unshift(item.NodeID.toString());
    //         Fullpath.push(item);
    //         // if(i === (response.data.length -1)) {
    //         //   props.NodeSelected(item.NodeID.toString());
    //         // }
    //       }
    //       props.setFolderFullpath(Fullpath);
    //       setNeedtoExpand(NeedtoExpand);
    //     }
    //   }
    // };
    if (props.ShowEmailFolderID) {
      fetchpathData();
    }
  }, [props.ShowEmailFolderID]);

  function ExpandItem() {
    setExpanded(NeedtoExpand);
  }

  function showEmailFolderIDUpdate() {
    props.showEmailFolderIDUpdate();
  }

  function UpdateExpandNodeId(value) {
    var ExpandArray =
      NeedtoExpand && NeedtoExpand.length
        ? NeedtoExpand.filter(function (e) {
            return this.indexOf(e) < 0;
          }, value)
        : [];
    setNeedtoExpand(ExpandArray);
  }

  function FolderIDChanged(value) {
    props.NodeSelected(value.toString());
  }

  useEffect(() => {
    const fetchpathData = async () => {
      props.setSelected(props.BreadcrumbId.toString());

      props.NodeSelected(props.BreadcrumbId);
      Fullpath = [];
      setNodeID(props.BreadcrumbId);
      const response = await AGOApi.getFoldersPath(
        parseInt(props.BreadcrumbId)
      );
      if (response !== null) {
        for (var i = 0; response.data.length > i; i++) {
          var item = response.data[i];
          Fullpath.push(item);
        }
        props.setFolderFullpath(Fullpath);
      }
    };
    if (props.BreadcrumbId) {
      fetchpathData();
    }
  }, [props.BreadcrumbId]);

  const handleSelect = async (event, nodeIds) => {
    props.setRecentAccesses([]);
    props.setOpenAttachmentNodeIDs({});
    props.setSearchEmailDatas([]);
    props.setSearchBreadcrumb([]);
    sessionStorage.setItem("clickFromCSUI", "true");
    props.setIsListConversationOpen(false);
    if (event.target.id !== "expand") {
      props.setSelected(nodeIds);

      props.NodeSelected(nodeIds);
      props.setPreviouslink("");
    }
  };

  // nodes.map((node) => (
  //   <TreeItem key={node.NodeID} nodeId={node.NodeID} label={node.Name}>
  //     {node.ChildCount > 0 && renderTreeItems(node.children)}
  //   </TreeItem>
  // ));
  const [favoriteFolderSelected, setFavoriteFolderSelected] = useState("");
  const handleFavoriteSelect = async (event, nodeIds) => {
    props.setRecentAccesses([]);
    setFavoriteFolderSelected(nodeIds?.toString());
    props.setPreviouslink("");
    sessionStorage.setItem("clickFromCSUI", "true");
    props.setIsListConversationOpen(false);
    if (event.target.id !== "expand") {
      props.setSelected(nodeIds);

      props.NodeSelected(nodeIds);
      props.setPreviouslink("");
    }
  };
  const [listFolder, setListFolder] = useState([]);
  const [parentFolderNodeID, setParentFolderNodeID] = useState("");
  const [listFavoriteFolder, setListFavoriteFolder] = useState([]);
  const [favoriteParentFolderNodeID, setFavoriteParentFolderNodeID] =
    useState("");

  function findNodeById(data, targetNodeId) {
    for (const item of data) {
      if (item.NodeID === targetNodeId) {
        return item; // Found the target node
      }

      if (item.Children && item.Children.length > 0) {
        const result = findNodeById(item.Children, targetNodeId);
        if (result) {
          return result; // Target node found in a child, propagate the result
        }
      }
    }

    return null; // Target node not found
  }

  // Function to find the parent NodeID
  function findParentNodeId(data, targetNodeId, parentNodeId = null) {
    for (const item of data) {
      if (item.NodeID === targetNodeId) {
        return parentNodeId; // Found the target node, return its parent NodeID
      }

      if (item.Children && item.Children.length > 0) {
        const result = findParentNodeId(
          item.Children,
          targetNodeId,
          item.NodeID
        );
        if (result !== null) {
          return result; // Target node found in a child, propagate the result
        }
      }
    }

    return null; // Target node not found
  }
  function hasAtLeastTwoSteps(nodeList, targetNodeId, currentStep = 0) {
    for (const node of nodeList) {
      if (node.NodeID === targetNodeId) {
        const children = node.Children || [];
        if (currentStep >= 1) {
          return true;
        } else {
          for (const child of children) {
            if (
              hasAtLeastTwoSteps(
                child.Children || [],
                targetNodeId,
                currentStep + 1
              )
            ) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  function findParentFolderId(data, targetFolderId, parentFolderId = null) {
    for (const item of data) {
      if (item.NodeID === targetFolderId) {
        return parentFolderId; // Found the target folder, return its parent ID
      }

      if (item.Children && item.Children.length > 0) {
        const result = findParentFolderId(
          item.Children,
          targetFolderId,
          item.NodeID
        );
        if (result !== null) {
          return result; // Target folder found in a child, propagate the result
        }
      }
    }

    return null;
  }

  const [treeViewDefaultExpandedFolders, setTreeViewDefaultExpandedFolders] =
    useState([]);

  useEffect(() => {
    const jsonString = sessionStorage.getItem("listNodeID");
    const expandedFolders = jsonString ? jsonString.split(",").reverse() : [];
    setTreeViewDefaultExpandedFolders(expandedFolders);

    if (
      sessionStorage.getItem("showExpandedFolders") === "true" &&
      expandedFolders.length > 0
    ) {
      const setNodeIDSequentially = async () => {
        for (const folderID of expandedFolders) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setNodeID(parseInt(folderID));
        }

        sessionStorage.removeItem("showExpandedFolders");
      };

      setNodeIDSequentially();
    }
  }, [
    sessionStorage.getItem("listNodeID"),
    sessionStorage.getItem("showExpandedFolders") === "true",
  ]);

  const favorites = props.favoriteFolders?.map((favoriteFolder) => {
    const defaultChild = {
      NodeID: "",
      Name: "Loading...",
      IconUri: null,
      ParentNodeID: "",
      NodeType: null,
      ChildCount: 0,
    };

    return {
      NodeID: favoriteFolder?.data?.nicknames?.nickname,
      Name: favoriteFolder?.data?.favorites?.name,
      children: [Object.assign({}, defaultChild)],
    };
  });
  const [favoriteTreeDatas, setFavoriteTreeDatas] = useState(
    props.favoriteFolders?.map((favoriteFolder) => {
      const defaultChild = {
        NodeID: "",
        Name: "Loading...",
        IconUri: null,
        ParentNodeID: "",
        NodeType: null,
        ChildCount: 0,
      };

      return {
        NodeID: favoriteFolder?.data?.nicknames?.nickname,
        Name: favoriteFolder?.data?.favorites?.name,
        children: [Object.assign({}, defaultChild)],
      };
    }) || []
  );

  useEffect(() => {
    if (props.favoriteFolders) {
      const updatedFavoriteTreeDatas = props.favoriteFolders.map(
        (favoriteFolder) => {
          const defaultChild = {
            NodeID: "",
            Name: "Loading...",
            IconUri: null,
            ParentNodeID: "",
            NodeType: null,
            ChildCount: 0,
          };

          return {
            NodeID: favoriteFolder?.data?.nicknames?.nickname,
            Name: favoriteFolder?.data?.favorites?.name,
            children: [Object.assign({}, defaultChild)],
          };
        }
      );

      setFavoriteTreeDatas(updatedFavoriteTreeDatas);
    }
  }, [props.favoriteFolders]);
  const fetchChildrenFromAPI = async (nodeId) => {
    // const ticket = getOTCSTicket();
    const res = await AGOApi.getFolderChildrens(nodeId);
    return res.data;
  };

  const fetchChildrenForNode = async (node) => {
    const childrenNodeIds = node.children.map((child) => child.NodeID);
    const childrenPromises = childrenNodeIds.map((childNodeId) =>
      fetchChildrenFromAPI(childNodeId)
    );

    const childrenData = await Promise.all(childrenPromises);

    const updatedChildren = await Promise.all(
      childrenData.map(async (childData, index) => {
        const recursiveChildren = await fetchChildrenForNode(
          node.children[index]
        );
        return {
          ...node.children[index],
          children: recursiveChildren,
        };
      })
    );

    return updatedChildren;
  };

  const handleNodeToggle = async (event, nodeId) => {
    props.setRecentAccesses([]);
    const selectedNodeId = parseInt(nodeId[0]);

    // Recursive function to find a node by its NodeID within the tree
    const findNodeById = (nodes, targetNodeId) => {
      for (const node of nodes) {
        if (node.NodeID === targetNodeId) {
          return node;
        }
        if (node.children) {
          const foundInChildren = findNodeById(node.children, targetNodeId);
          if (foundInChildren) {
            return foundInChildren;
          }
        }
      }
      return null;
    };

    const targetNode = findNodeById(favoriteTreeDatas, nodeId[0]);

    try {
      if (!targetNode) {
        console.error("Node not found with NodeID:", nodeId[0]);
        return;
      }

      const hasEmptyNodeId = targetNode.children.some(
        (child) => child.NodeID === ""
      );

      // const newChildren = hasEmptyNodeId
      //   ? await fetchChildrenFromAPI(selectedNodeId)
      //   : await fetchChildrenForNode(targetNode);
      const newChildren = await fetchChildrenFromAPI(selectedNodeId);

      // Update the targetNode and its children with the new children
      const updateTree = (nodes, targetNodeId, updatedChildren) => {
        return nodes.map((node) => {
          if (node.NodeID === targetNodeId) {
            return { ...node, children: updatedChildren };
          }
          if (node.children) {
            return {
              ...node,
              children: updateTree(
                node.children,
                targetNodeId,
                updatedChildren
              ),
            };
          }
          return node;
        });
      };
      setFavoriteTreeDatas((prevTreeDatas) =>
        updateTree(prevTreeDatas, nodeId[0], newChildren)
      );
    } catch (error) {
      console.error("Error fetching or updating children:", error);
    }
  };
  const renderTree = (nodes) => (
    <CustomTreeItem
      key={nodes?.NodeID}
      nodeId={nodes?.NodeID}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      label={
        <div className="d-flex align-items-center">
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <div className={classes.labelText} style={{ whiteSpace: "nowrap" }}>
            {nodes.Name}
          </div>
        </div>
      }
    >
      {Array.isArray(nodes?.children) && nodes.children.length > 0
        ? nodes.children.map((child) => renderTree(child))
        : null}
    </CustomTreeItem>
  );

  let LabelIcon = () => {
    return <FcFolder style={{ fontSize: "18px", flexShrink: 0 }} />;
  };

  const handleRecentlyAccessToggle = async (event, nodeIds) => {
    try {
      // const ticket = getOTCSTicket();
      const res = await axios
        .create({
          baseURL: config.OTCS_API_URL,
          withCredentials: false,
          headers: {
            Authorization: `Bearer ${cookies.get("otsession")}`,
          },
        })
        .get(`v2/members/accessed`);
      // const res = await axios.get(
      //   `${config.OTCS_API_URL}/v2/members/accessed`,
      //   { headers: { otcsticket: ticket } }
      // );

      // setRecentAccesses(res.data.results);
      const results = res.data.results.map((result) => {
        const emailproperties = result.data.emailproperties;
        return {
          conversationId: emailproperties.conversationid,
          from: emailproperties.from,
          hasAttachment: emailproperties.hasattachments,
          nodeId: result.data.nicknames,
          parentNodeId: result.parentNodeId,
          permSeeContents: false,
          sent: emailproperties.sentdate,
          subject: emailproperties.subject,
          to: emailproperties.to,
        };
      });
      const filteredResults = results.filter(
        (result) => result.conversationId !== undefined
      );

      // Now filteredResults contains only the objects with defined conversationId
      props.setRecentAccesses(filteredResults);
    } catch (err) {
      console.log(err);
    }
  };

  const isUserAllowed = (permissions, userId) => {
    return permissions?.every((permission) => {
      if (permission.right_id === null) {
        // For 'public' type, consider it true
        return true;
      } else if (permission.permissions.includes(userId)) {
        // If user ID is in permissions array, check if length > 1
        return permission.permissions.length > 1;
      } else {
        // Check if the user ID is not equal to the right_id
        return true;
      }
    });
  };

  const handleRecentlyAccessSelect = async (event, nodeIds) => {
    const cookie = new Cookies();
    const userNodeId = cookie.get("OTUID");
    try {
      // const ticket = getOTCSTicket();
      const res = await axios.get(
        `${config.OTCS_API_URL}/v2/members/accessed`,
        { headers: { Authorization: `Bearer ${cookies.get("otsession")}` } }
      );

      const results = res.data.results.map((result) => {
        const emailproperties = result?.data.emailproperties;
        return {
          conversationId: emailproperties?.conversationid,
          from: emailproperties?.from,
          hasAttachment: emailproperties?.hasattachments,
          nodeId: parseInt(result?.data.nicknames.nickname),
          parentNodeId: result?.parentNodeId,
          permSeeContents: isUserAllowed(result?.data.permissions, userNodeId),
          sent: emailproperties?.sentdate,
          subject: emailproperties?.subject,
          to: emailproperties?.to,
        };
      });

      const filteredResults = results.filter(
        (result) => result.conversationId !== undefined
      );

      // Now filteredResults contains only the objects with defined conversationId
      props.setRecentAccesses(filteredResults);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* recently access */}
      <TreeView
        aria-label="recent-accesses"
        defaultExpanded={["Recently Accessed"]}
        defaultCollapseIcon={<GoChevronDown color="#555" />}
        defaultExpandIcon={<GoChevronRight color="#555" />}
        onNodeToggle={handleRecentlyAccessToggle}
        onNodeSelect={handleRecentlyAccessSelect}
      >
        <TreeItem
          nodeId="RecentlyAccessed"
          classes={{
            root: classes.root,
            content: classes.content,
            expanded: classes.expanded,
            group: classes.group,
            label: classes.label,
          }}
          className="recently-access-name"
          label={
            <div className="d-flex align-items-center">
              {/* <LabelIcon color="inherit" className={classes.labelIcon} /> */}
              <img
                src={recentAccessedIcon}
                className={`${classes.labelIcon} recent-accessed-icon`}
                alt="recent-accessed-icon"
              />
              <div
                className={`${classes.labelText}`}
                style={{ whiteSpace: "nowrap" }}
              >
                Recently Accessed
              </div>
            </div>
          }
        ></TreeItem>
      </TreeView>
      <TreeView
        aria-label="icon expansion"
        defaultCollapseIcon={<GoChevronDown color="#555" />}
        defaultExpandIcon={<GoChevronRight color="#555" />}
        // expanded={expanded}
        defaultExpanded={["1"]}
        selected={favoriteFolderSelected}
        onNodeToggle={handleNodeToggle}
        onNodeSelect={handleFavoriteSelect}
      >
        <CustomTreeItem
          nodeId={"1"}
          label={
            <div className="d-flex align-items-center">
              <LabelIcon color="inherit" className={classes.labelIcon} />
              <div
                className={classes.labelText}
                style={{ whiteSpace: "nowrap" }}
              >
                Favorites
              </div>
            </div>
          }
          classes={{
            root: classes.root,
            content: classes.content,
            expanded: classes.expanded,
            group: classes.group,
            label: classes.label,
          }}
        >
          {favoriteTreeDatas?.map((node) => {
            return renderTree(node);
          })}
        </CustomTreeItem>
      </TreeView>
      <TreeView
        aria-label="icon expansion"
        defaultCollapseIcon={<GoChevronDown color="#555" />}
        defaultExpandIcon={<GoChevronRight color="#555" />}
        expanded={treeViewDefaultExpandedFolders}
        defaultExpanded={treeViewDefaultExpandedFolders}
        selected={props.selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        <FolderTreeItem
          // setTreeViewDefaultExpandedFolders={setTreeViewDefaultExpandedFolders}
          setListFolder={setListFolder}
          setParentFolderNodeID={setParentFolderNodeID}
          setNeedtoExpand={setNeedtoExpand}
          setExpanded={setExpanded}
          setDefaultExpandedFolders={setDefaultExpandedFolders}
          FolderNodeID={props.FolderNodeID}
          FolderNodeName={props.FolderNodeName}
          ShowEmailFolderID={props.ShowEmailFolderID}
          NodeID={NodeID}
          ExpandItems={() => ExpandItem()}
          showEmailFolderIDUpdate={() => showEmailFolderIDUpdate()}
          UpdateExpandNodeId={(value) => UpdateExpandNodeId(value)}
          FolderIDChanged={(value) => FolderIDChanged(value)}
          Exceptiontime={(value) => Exceptiontime(value)}
          positionBeforeEmails={props.positionBeforeEmails}
        ></FolderTreeItem>
      </TreeView>
    </div>
  );
}
FolderTreeView.propTypes = {
  NodeSelected: PropTypes.func.isRequired,
  FolderNodeID: PropTypes.number.isRequired,
  FolderNodeName: PropTypes.string.isRequired,
};
// export default withRouter(FolderTreeView);
export default FolderTreeView;
