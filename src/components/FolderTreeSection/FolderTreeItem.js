import React, { useState, useEffect } from "react";
import AGOApi from "../../api/AGOApi";
import PropTypes from "prop-types";
import StyledTreeItem from "./StyledTreeItem";
import { FcFolder } from "react-icons/fc";
import _ from "lodash";
import LinearProgress from "@material-ui/core/LinearProgress";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

const { Config } = require("../common/AppConfig");
let NeedtocollapseItems = [];
let NormalFlow = false;
let Loading = false;
let folders = [];

function FolderTreeItem(props) {
  const [DummyData] = useState([
    {
      NodeID: "",
      Name: "Loading...",
      IconUri: null,
      ParentNodeID: "",
      NodeType: null,
      ChildCount: 0,
    },
  ]);
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

    return null; // Target folder not found
  }
  // const [folders, setFolders] = useState([]);
  const [FoldersReady, setFoldersReady] = useState(true);
  const [UserId, setUserId] = useState(0);
  const [RenderingComplete, setCompleterendering] = useState(false);
  const [currentNodeId, SetcurrentNodeId] = useState("");
  const [renderprocess, Setrenderprocess] = useState(false);
  useEffect(() => {
    if (FoldersReady) {
      const fetchData = async (ProcessID) => {
        Loading = true;

        const res = await AGOApi.getFolders(ProcessID);

        // const res = await AGOApi.getFolders(
        //   parseInt(localStorage.getItem("pervNodeID"))
        // );
        if (res !== null) {
          if (ProcessID === 2000) {
            let subFolders = res.data;
            // only display Email and Records folders
            //let filteredSubFolders = subFolders.filter(folder => folder.Name === 'Email' || folder.Name === 'Records');
            res.data = subFolders;
          }
          // console.log(res.data) // view the subfolders
          Loading = false;
          await performload(res, ProcessID);
        } else {
          Loading = false;
          Setrenderprocess(!renderprocess);
          props.Exceptiontime(ProcessID);
        }
      };
      function performload(res, ProcessID) {
        setCompleterendering(false);
        SetcurrentNodeId(ProcessID);
        if (ProcessID === 2000 && folders && folders.length) {
          // if (folders && folders.length) {
          const folderloop = () => {
            let folderdata = folders;
            //update sonar
            folderdata.map((fold) => {
              if (fold.NodeID === 2000) {
                return (fold.Children = res.data);
              }
            });
            props.setListFolder(folderdata);
            // props.setParentFolderNodeID(
            //   findParentFolderId(
            //     folderdata,
            //     parseInt(localStorage.getItem("pervNodeID"))
            //   )
            // );
            // props.setTreeViewDefaultExpandedFolders([
            //   "2000",
            //   findParentFolderId(
            //     folderdata,
            //     parseInt(localStorage.getItem("pervNodeID"))
            //   ),
            //   localStorage.getItem("pervNodeID"),
            // ]);
            return folderdata;
          };
          // setFolders(folderloop())
          folders = folderloop();
        } else if (ProcessID === UserId) {
          //update sonar
          const folderloop = () => {
            let folderdata = folders;
            folderdata.map((fold) => {
              if (fold.NodeID === UserId) {
                return (fold.Children = res.data);
              }
            });
            return folderdata;
          };
          // setFolders(folderloop())
          folders = folderloop();
        }
        let setchildren = res.data;
        let set =
          setchildren && setchildren.length
            ? setchildren.map((node) => {
                if (node.ChildCount > 0) {
                  DummyData[0].NodeID = `Dummy${node.NodeID}`;
                  node.Children = DummyData;
                }
              })
            : [];
        NeedtocollapseItems = [];
        setchildren.forEach((node) => {
          NeedtocollapseItems.push(node.NodeID.toString());
        });
        props.UpdateExpandNodeId(NeedtocollapseItems);

        //update sonar
        let user =
          folders && folders.length
            ? folders.map((fold) => {
                fold.Children.forEach((node) => {
                  if (ProcessID === node.NodeID) {
                    return (node.Children = setchildren);
                  } else {
                    if (node.Children && node.Children.length) {
                      return childNodeUpdate(node.Children);
                    }
                  }
                });
              })
            : null;

        function childNodeUpdate(arraytocheck) {
          arraytocheck.forEach((node) => {
            if (ProcessID === node.NodeID) {
              node.Children = setchildren;
            } else {
              if (node.Children && node.Children.length) {
                childNodeUpdate(node.Children);
              }
            }
          });
        }

        //  user = folders && folders.length ? setFolders(folders) :null;
        //setFolders(folders);
        setCompleterendering(true);
      }
      let url = document.referrer;
      let spliturl = _.split(url, "/nodes/", 2);
      let id = _.split(spliturl[1], "?", 1);

      let url1 = decodeURIComponent(window.location.search);
      let spliturl1 = _.split(url1, "/nodes/", 2);
      let id1 = _.split(spliturl1[1], "?", 1);
      let emailFolderId = -1;

      function filterSubFolders(subFolders, targetNodeID) {
        return subFolders.filter((folder) => {
          if (folder.NodeID === targetNodeID) {
            // If the current folder matches the targetNodeID, return true
            return true;
          } else if (folder.Children && folder.Children.length > 0) {
            // If there are children, recursively call the filterSubFolders function
            // on the children and return true if any child matches the targetNodeID
            return filterSubFolders(folder.Children, targetNodeID).length > 0;
          }
          return false; // Return false if neither the folder nor its children match the targetNodeID
        });
      }
      const fetchpathData = async () => {
        if (id[0] === "" && id1[0] === "") {
          // this api is to get the full folder path loaction from 2000 to latest folder ID
          //const res = await AGOApi.getFolders(2000);
          const res = await AGOApi.getFoldersPath(
            parseInt(localStorage.getItem("pervNodeID"))
          );

          if (res !== null) {
            let subFolders = res.data;
            for (var i = 0; res.data.length > i; i++) {
              //let filteredSubFolders = subFolders; // all folder for email plane
              let filteredSubFolders = subFolders.filter(
                (folder) =>
                  folder.NodeID === parseInt(localStorage.getItem("pervNodeID"))
              );
              emailFolderId = filteredSubFolders[0].NodeID;
              id[0] = emailFolderId; // 'Email' folder id
            }
          }
        }

        if (id[0] || id1[0]) {
          Loading = true;
          const response = await AGOApi.getFoldersPath(
            parseInt(id[0] ? id[0] : id1[0])
          );
          if (response !== null) {
            for (var i = 0; response.data.length > i; i++) {
              Loading = true;
              var item = response.data[i];
              //const res = await AGOApi.getFolders(item.NodeID);
              await fetchData(item.NodeID);
              if (i === response.data.length - 1) {
                // props.FolderIDChanged(item.NodeID.toString());
              }
            }
          }

          // response.data.forEach((item) => {
          //   const res = await AGOApi.getFolders(ProcessID);
          //    performload(res , ProcessID);
          //   console.log("final",ProcessID);
          //   fetchData(item.NodeID);
          // });
          Loading = false;
          NormalFlow = true;
        }
      };
      // const fetchpathData = async () => {
      //   if (id[0] === "" && id1[0] === "") {
      //     const res = await AGOApi.getFolders(
      //       parseInt(localStorage.getItem("pervNodeID"))
      //     );
      //     if (res !== null) {
      //       let subFolders = res.data;
      //       const targetNodeID = parseInt(localStorage.getItem("pervNodeID"));
      //       // const filteredSubFolders = filterSubFolders(
      //       //   subFolders,
      //       //   targetNodeID
      //       // );
      //       let filteredSubFolders = subFolders.filter(
      //         (folder) =>
      //           folder.NodeID === parseInt(localStorage.getItem("pervNodeID"))
      //       );
      //       // let filteredSubFolders = subFolders.filter((folder) =>
      //       //   folder.Children.filter(
      //       //     (child) =>
      //       //       child.NodeId === parseInt(localStorage.getItem("pervNodeID"))
      //       //   )
      //       // );
      //       console.log("filteredSubFolders", filteredSubFolders);
      //       emailFolderId = filteredSubFolders[0]?.NodeID;
      //       id[0] = emailFolderId; // 'Email' folder id
      //     }
      //   }
      //   // if (id[0] === "" && id1[0] === "") {
      //   //   // this api is to get the full folder path loaction from 2000 to latest folder ID
      //   //   //const res = await AGOApi.getFolders(2000);
      //   //   const res = await AGOApi.getFoldersPath(
      //   //     parseInt(localStorage.getItem("pervNodeID"))
      //   //   );

      //   //   if (res !== null) {
      //   //     let subFolders = res.data;
      //   //     for (var i = 0; res.data.length > i; i++) {
      //   //       //let filteredSubFolders = subFolders; // all folder for email plane
      //   //       let filteredSubFolders = subFolders.filter(
      //   //         (folder) =>
      //   //           folder.NodeID === parseInt(localStorage.getItem("pervNodeID"))
      //   //       );
      //   //       emailFolderId = filteredSubFolders[0].NodeID;
      //   //       id[0] = emailFolderId; // 'Email' folder id
      //   //     }
      //   //     console.log("IN FOLDER TREE ITEM  ", id[0]);
      //   //   }

      //   if (id[0] || id1[0]) {
      //     // console.log('hi x2')
      //     Loading = true;
      //     const response = await AGOApi.getFoldersPath(
      //       parseInt(id[0] ? id[0] : id1[0])
      //     );
      //     if (response !== null) {
      //       for (var i = 0; response.data.length > i; i++) {
      //         Loading = true;
      //         var item = response.data[i];
      //         // const res = await AGOApi.getFolders(item.NodeID);
      //         await fetchData(item.NodeID);
      //         // if (i === response.data.length - 1) {
      //         //   props.FolderIDChanged(item.NodeID.toString());
      //         // }
      //       }
      //     }

      //     // response.data.forEach((item) => {
      //     //   const res = await AGOApi.getFolders(ProcessID);
      //     //    performload(res , ProcessID);
      //     //   console.log("final",ProcessID);
      //     //   fetchData(item.NodeID);
      //     // });
      //     Loading = false;
      //     NormalFlow = true;
      //   }
      // };

      if (url && !NormalFlow && id[0]) {
        fetchpathData();
      } else if (url1 && !NormalFlow && id1[0]) {
        fetchpathData();
      } else if (props.NodeID) {
        fetchData(props.NodeID);
      } else if (url === "") {
        fetchpathData();
      } else if (url) {
        fetchpathData();
      }
    }
  }, [props.NodeID, FoldersReady]);

  useEffect(() => {
    const fetchData = async (ProcessID) => {
      Loading = true;
      const res = await AGOApi.getFolders(ProcessID);
      Loading = false;
      if (res !== null) {
        Loading = false;
        await performload(res, ProcessID);
      }
    };
    function performload(res, ProcessID) {
      setCompleterendering(false);
      SetcurrentNodeId(ProcessID);
      //update sonar
      if (ProcessID === 2000) {
        const folderloop = () => {
          let folderdata = folders;
          folderdata.map((fold) => {
            if (fold.NodeID === 2000) {
              return (fold.Children = res.data);
            }
          });
          props.setListFolder(folderdata);
          // props.setParentFolderNodeID(
          //   findParentFolderId(
          //     folderdata,
          //     parseInt(localStorage.getItem("pervNodeID"))
          //   )
          // );
          // props.setTreeViewDefaultExpandedFolders([
          //   "2000",
          //   findParentFolderId(
          //     folderdata,
          //     parseInt(localStorage.getItem("pervNodeID"))
          //   ),
          //   localStorage.getItem("pervNodeID"),
          // ]);
          return folderdata;
        };
        // setFolders(folderloop())
        //update sonar
        folders = folderloop();
      } else if (ProcessID === UserId) {
        const folderloop = () => {
          let folderdata = folders;
          folderdata.map((fold) => {
            if (fold.NodeID === UserId) {
              return (fold.Children = res.data);
            }
          });
          return folderdata;
        };
        // setFolders(folderloop())
        folders = folderloop();
      }
      let setchildren = res.data;
      let set =
        setchildren && setchildren.length
          ? setchildren.map((node) => {
              if (node.ChildCount > 0) {
                DummyData[0].NodeID = `Dummy${node.NodeID}`;
                node.Children = DummyData;
              }
            })
          : [];

      //update sonar
      let user =
        folders && folders.length
          ? folders.map((fold) => {
              return fold.Children.forEach((node) => {
                if (ProcessID === node.NodeID) {
                  node.Children = setchildren;
                } else {
                  if (node.Children && node.Children.length) {
                    childNodeUpdate(node.Children);
                  }
                }
              });
            })
          : null;

      function childNodeUpdate(arraytocheck) {
        arraytocheck.forEach((node) => {
          if (ProcessID === node.NodeID) {
            node.Children = setchildren;
          } else {
            if (node.Children && node.Children.length) {
              childNodeUpdate(node.Children);
            }
          }
        });
      }
      // setFolders(folders);
      setCompleterendering(true);
      Loading = false;
    }
    const fetchpathData = async () => {
      if (props.ShowEmailFolderID) {
        const response = await AGOApi.getFoldersPath(
          parseInt(props.ShowEmailFolderID.nodeId)
        );
        if (response !== null) {
          for (var i = 0; response.data.length > i; i++) {
            Loading = true;
            var item = response.data[i];
            //const res = await AGOApi.getFolders(item.NodeID);
            await fetchData(item.NodeID);
            // if (i === response.data.length - 1) {
            //   props.FolderIDChanged(item.NodeID.toString());
            // }
          }
          // response.data.forEach((item) => {
          //   const res = await AGOApi.getFolders(ProcessID);
          //    performload(res , ProcessID);
          //   console.log("final",ProcessID);
          //   fetchData(item.NodeID);
          // });
          Loading = false;
          props.showEmailFolderIDUpdate();
        }
      }
    };
    if (props.ShowEmailFolderID) {
      fetchpathData();
    }
  }, [props.ShowEmailFolderID]);

  useEffect(() => {
    const fetchData = async () => {
      Loading = true;
      const res = await AGOApi.getSingleFolder(2000);
      if (res !== null) {
        res.data.Children = DummyData;
        let folder = [];
        folder.push(res.data);
        //const user = await AGOApi.getUserId("alvin");
        /* Personal Workspace
        if (user !== null) {
          setUserId(user.data);
          const response = await AGOApi.getFolders(user.data);
          if (response !== null) {
            response.data.Children = DummyData;
            folder.push(response.data);
            // setFolders(folder);
            Loading = false;
          } else {
            Loading = false;
            Setrenderprocess(!renderprocess);
          }
        } else {
          Loading = false;
          Setrenderprocess(!renderprocess);
        }
        */
        folders = folder;
        setFoldersReady(true);
      } else {
        Loading = false;
        Setrenderprocess(!renderprocess);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (RenderingComplete) {
      props.ExpandItems();
    }
  }, [RenderingComplete, props.NodeID]);

  useEffect(() => {
    if (props.NodeID === currentNodeId) {
      props.ExpandItems();
    }
  });

  let folderIconCSUI = () => {
    return (
      // <img
      //   className="ago-csui-icon"
      //   alt=""
      //   src={config.REACT_APP_URL + "/assets/mime_folder.svg"}
      // />
      <FcFolder style={{ fontSize: "18px", flexShrink: 0 }} />
    );
  };

  // const renderTree = (nodes) => (
  //   <StyledTreeItem
  //     key={nodes.NodeID}
  //     nodeId={nodes.NodeID.toString()}
  //     labelText={nodes.NodeType === "EnterpriseWS" ? "Enterprise" : nodes.Name}
  //     labelIcon={folderIconCSUI}>
  //     {Array.isArray(nodes.Children) && nodes.Children.length > 0
  //       ? nodes.Children.map((childNode) => {
  //           console.log("renderTree", childNode);
  //           console.log("renderTree name", childNode.Name);
  //           renderTree(childNode);
  //         })
  //       : null}
  //   </StyledTreeItem>
  // );

  const renderTree = (nodes) => (
    <StyledTreeItem
      key={nodes.NodeID}
      nodeId={nodes.NodeID.toString()}
      labelText={nodes.Name}
      labelIcon={folderIconCSUI}
    >
      {Array.isArray(nodes.Children) && nodes.Children.length > 0
        ? nodes.Children.map((node) => {
            return renderTree(node);
          })
        : null}
    </StyledTreeItem>
  );
  // const renderTree = (nodes) => (
  //   <StyledTreeItem
  //     key={nodes.NodeID}
  //     nodeId={nodes.NodeID.toString()}
  //     labelText={nodes.Name}
  //     labelIcon={folderIconCSUI}>
  //     {Array.isArray(nodes.Children)
  //       ? nodes.Children.map((node) => renderTree(node))
  //       : null}
  //   </StyledTreeItem>
  // );
  props.setDefaultExpandedFolders(folders);
  props.setListFolder(folders);
  // props.setParentFolderNodeID(
  //   findParentFolderId(folders, parseInt(localStorage.getItem("pervNodeID")))
  // );
  // props.setTreeViewDefaultExpandedFolders([
  //   "2000",
  //   findParentFolderId(folders, parseInt(localStorage.getItem("pervNodeID"))),
  //   localStorage.getItem("pervNodeID"),
  // ]);
  useEffect(() => {
    // if (folders.length > 0) {
    //   props.setParentFolderNodeID(
    //     findParentFolderId(
    //       folders,
    //       parseInt(localStorage.getItem("pervNodeID"))
    //     )
    //   );
    // } else {
    //   return "";
    // }
  }, [folders]);

  return (
    <div>
      {/*Loading ? <Loader /> : null */}
      <div
        style={{
          position: "fixed",
          top: "auto",
          width: props.positionBeforeEmails + "px",
          zIndex: 1000,
        }}
      >
        {Loading ? <LinearProgress /> : null}
      </div>
      {folders && folders.length
        ? folders.map((mapfold) => {
            return renderTree(mapfold);
          })
        : null}
      {/* {folders.map((mapfold) => {
        return (
          <TreeItem nodeId="1" label={}>
            <TreeItem nodeId="2" label="Calendar" />
          </TreeItem>
        );
      })}
      <TreeItem nodeId="5" label="Documents">
        <TreeItem nodeId="10" label="OSS" />
        <TreeItem nodeId="6" label="MUI">
          <TreeItem nodeId="8" label="index.js" />
        </TreeItem>
      </TreeItem> */}
    </div>
  );
}
FolderTreeItem.propTypes = {
  FolderNodeID: PropTypes.number.isRequired,
  FolderNodeName: PropTypes.string.isRequired,
};
export default FolderTreeItem;
