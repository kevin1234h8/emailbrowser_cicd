import React, { useEffect } from "react";
import PropTypes from "prop-types";
import FolderTreeView from "./FolderTreeView";

function FolderTreeSection(props) {
  function FolderIDChanged(id) {
    props.FolderIDChanged(id);
  }

  function showEmailFolderIDUpdate() {
    props.showEmailFolderIDUpdate();
  }

  function folderFullpath(value) {
    props.folderFullpath(value);
  }
  //use effect is like on load

  return (
    <React.Fragment>
      <FolderTreeView
        setRecentAccesses={props.setRecentAccesses}
        setOpenAttachmentNodeIDs={props.setOpenAttachmentNodeIDs}
        setSearchEmailDatas={props.setSearchEmailDatas}
        setSearchBreadcrumb={props.setSearchBreadcrumb}
        selected={props.selected}
        setSelected={props.setSelected}
        favoriteFolders={props.favoriteFolders}
        recentAccesses={props.recentAccesses}
        treeViewDefaultExpandedFolders={props.treeViewDefaultExpandedFolders}
        setIsListConversationOpen={props.setIsListConversationOpen}
        FolderNodeID={2000} //2000 is content server enterprise workspace node ID
        FolderNodeName={"Enterprise"}
        NodeSelected={FolderIDChanged}
        ShowEmailFolderID={props.ShowEmailFolderID}
        showEmailFolderIDUpdate={() => showEmailFolderIDUpdate()}
        folderFullpath={props.folderFullpath}
        setFolderFullpath={props.setFolderFullpath}
        BreadcrumbId={props.BreadcrumbId}
        setFolderLoading={props.setFolderLoading}
        folderLoading={props.folderLoading}
        setPreviouslink={props.setPreviouslink}
        positionBeforeEmails={props.positionBeforeEmails}
      />
    </React.Fragment>
  );
}
FolderTreeSection.propTypes = {
  FolderIDChanged: PropTypes.func.isRequired,
};
export default FolderTreeSection;
