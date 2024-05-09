import React, { useRef, useState, useEffect } from "react";
import ErrMSG from "../common/ErrorMSG";
import { useMemo } from "react";
import PropTypes from "prop-types";
import _, { words } from "lodash";
import ShowConversation from "./ShowConversation";
import ShowPath from "./ShowPath";
import Cookies from "universal-cookie";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import AppJpeg from "../../components/assets/file.svg";
import AppPng from "../../components/assets/file.svg";
import WordIcon from "../../components/assets/word.svg";
import OutlookIcon from "../../components/assets/outlook.svg";
import PdfIcon from "../../components/assets/pdf.svg";
import PowerpointIcon from "../../components/assets/powerpoint.svg";
import ExcelIcon from "../../components/assets/excel.svg";
import {
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@material-ui/core";
import MaterialUiTooltip from "@mui/material/Tooltip";
import { TablePagination, TableFooter } from "@mui/material";
import { BsDownload } from "react-icons/bs";
import { FaPaperclip } from "react-icons/fa";
import { PiPath } from "react-icons/pi";
import { BiConversation } from "react-icons/bi";
import { FaRegFolderOpen } from "react-icons/fa";
import "./react-contextmenu.scss";
import AGOApi from "../../api/AGOApi";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import classNames from "classnames";
import moment from "moment";
import { createRef } from "react";
import axios from "axios";
import { CompressOutlined } from "@mui/icons-material";
import zIndex from "@material-ui/core/styles/zIndex";
const { Config } = require("../common/AppConfig");
const config = Config();
function downloademail(row, setAlertOpenDialog) {
  if (row.nodeId > 0) {
    let url = "".concat(
      config.REACT_APP_DOWNLOAD_URL_1,
      row.nodeId.toString(),
      config.REACT_APP_DOWNLOAD_URL_2
    );
    window.open(url, "_blank");
  }
}

function downloadEmailListConversation(row, setAlertOpenDialog) {
  console.log("downloadEmailListConversation", row);
  if (row.nodeId > 0) {
    let url = "".concat(
      config.REACT_APP_DOWNLOAD_URL_1,
      row.nodeId.toString(),
      config.REACT_APP_DOWNLOAD_URL_2
    );
    window.open(url, "_blank");
  }
}

var ErrorMessage = "";

function CustomTable({
  data,
  EmailIDChanged,
  AttachmentSectionToggle,
  AttachmentSelection,
  SortingUpdate,
  ConversationSet,
  isSearchView,
  normalSortingUpdate,
  Keyword,
  showEmailFolder,
  relatedConversation,
  ConversationView,
  setAttachmentloading,
  setPopUpDialog,
  setAlertOpenDialog,
}) {
  // Use the state and functions returned from useTable to build your UI
  const [selectedEmailID, setSelectedEmailID] = useState(-1);
  const [selectedAttachmentID, setSelectedAttachmentID] = useState(-1);
  const [SortFields, setSortFields] = useState("Sent");
  const [FinalSortColumn, setFinalSortColumn] = useState("Received");
  const [FinalSortingAPIColumn, setFinalSortingAPIColumn] = useState(
    "OTEmailReceivedDate"
  );
  const [SortingArray, setSortingArray] = useState([]);
  const [conversation, setconversation] = useState(false);
  const [SortType, setSortingType] = useState("Desc");

  // const [columns] = useState([
  //   // expand grouping conversation
  //   // {
  //   //   id: "expander",
  //   //   Header: "",
  //   //   Rowname: "ShowasConversation",
  //   //   width: "4%",
  //   //   HeaderSpace: "",
  //   //   RowSpace: "",
  //   //   Cell: ({ row, rows, toggleRowExpanded }) =>
  //   //     // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
  //   //     // to build the toggle for expanding a row

  //   //     row.canExpand
  //   //       ? (row.depth === -2 ? row.toggleRowExpanded() : null,
  //   //         (row.depth = row.depth === -2 ? 0 : row.depth),
  //   //         (
  //   //           <span
  //   //             {...row.getToggleRowExpandedProps({
  //   //               style: {
  //   //                 // We can even use the row.depth property
  //   //                 // and paddingLeft to indicate the depth
  //   //                 // of the row
  //   //                 //////alvin: styles doesn't seem to be reflected on the expanded rows, seem to only apply to expansion icon
  //   //                 //paddingLeft: `${row.depth * 2}rem`
  //   //               },
  //   //               onClick: () => {
  //   //                 ///////////////////alvin: this is from an example where they contract all other rows after expanding on a row///////////////
  //   //                 //const expandedRow = rows.find(row => row.isExpanded);

  //   //                 // if (expandedRow) {
  //   //                 //   const isSubItemOfRow = Boolean(
  //   //                 //     expandedRow && row.id.split(".")[0] === expandedRow.id
  //   //                 //   );

  //   //                 //   if (isSubItemOfRow) {
  //   //                 //     const expandedSubItem = expandedRow.subRows.find(
  //   //                 //       subRow => subRow.isExpanded
  //   //                 //     );

  //   //                 //     if (expandedSubItem) {
  //   //                 //       const isClickedOnExpandedSubItem =
  //   //                 //         expandedSubItem.id === row.id;
  //   //                 //       if (!isClickedOnExpandedSubItem) {
  //   //                 //         toggleRowExpanded(expandedSubItem.id, false);
  //   //                 //       }
  //   //                 //     }
  //   //                 //   } else {
  //   //                 //     toggleRowExpanded(expandedRow.id, false);
  //   //                 //   }
  //   //                 // }
  //   //                 ////////////////////////////////alvin:end/////////////////////
  //   //                 row.toggleRowExpanded();
  //   //               },
  //   //             })}
  //   //           >
  //   //             {/* {console.log(row)} */}
  //   //             {row.isExpanded ? (
  //   //               <div
  //   //                 style={{ cursor: "pointer" }}
  //   //                 title={row.subRows.length + 1 + " emails in thread"}
  //   //               >
  //   //                 <ExpandMoreIcon />
  //   //               </div>
  //   //             ) : (
  //   //               <div
  //   //                 style={{ cursor: "pointer" }}
  //   //                 title={row.subRows.length + 1 + " emails in thread"}
  //   //               >
  //   //                 <ChevronRightIcon />
  //   //               </div>
  //   //             )}
  //   //           </span>
  //   //         ))
  //   //       : null,
  //   // },
  //   {
  //     Header: <FontAwesomeIcon icon={faPaperclip} size="sm" />,
  //     id: "attachmentHeader",
  //     accessor: "hasAttachments",
  //     Rowname: "HasAttachments",
  //     width: "3%",
  //     textAlign: "center",
  //     HeaderSpace: "",
  //     RowSpace: "5px",
  //     Cell: (props) => {
  //       return (
  //         <span>
  //           {props.row.original.HasAttachments === 1 ? (
  //             <FontAwesomeIcon
  //               className="clickable"
  //               icon={faPaperclip}
  //               size="sm"
  //               onClick={(e) => _AttachmentClicked(e, props.row)}
  //             />
  //           ) : null}
  //         </span>
  //       );
  //     },
  //   },
  //   {
  //     Header: "From",
  //     accessor: "emailFrom",
  //     Rowname: "EmailFrom",
  //     SortColumn: "OTEmailFrom",
  //     width: "21%",
  //     HeaderSpace: "8px",
  //     RowSpace: "",
  //     Cell: (props) => {
  //       return (
  //         <span
  //           className="draggable-header"
  //           style={{ marginLeft: "10px" }}
  //           title={props.row.original.EmailFrom}
  //         >
  //           {props.row.original.EmailFrom}
  //         </span>
  //       );
  //     },
  //     FieldSorted: false,
  //     isSortedAsc: false,
  //     isResizing: true,
  //   },
  //   {
  //     Header: "Subject",
  //     Rowname: "EmailSubject",
  //     accessor: "emailSubject",
  //     SortColumn: "OTEmailSubject",
  //     width: "28%",
  //     HeaderSpace: "8px",
  //     RowSpace: "",
  //     isResizing: true,
  //     Cell: (props) => {
  //       return (
  //         <span
  //           style={{ marginLeft: "10px" }}
  //           title={props.row.original.EmailSubject}
  //         >
  //           {props.row.original.EmailSubject}
  //         </span>
  //       );
  //     },
  //     FieldSorted: false,
  //     isSortedAsc: false,
  //   },
  //   {
  //     id: "receivedDate",
  //     Header: "Received",
  //     accessor: "receivedDate",
  //     Rowname: "ReceivedDate",
  //     SortColumn: "OTEmailReceivedDate",
  //     width: "15%", // 15%
  //     HeaderSpace: "8px",
  //     RowSpace: "",
  //     Cell: (props) => {
  //       const custom_date = props.row.original.ReceivedDate
  //         ? moment(props.row.original.ReceivedDate).format(
  //             "ddd DD-MMM-YYYY hh:mm A"
  //           )
  //         : "";
  //       return (
  //         <span style={{ marginLeft: "10px" }} title={custom_date}>
  //           {custom_date}
  //         </span>
  //       );
  //     },
  //     FieldSorted: false,
  //     isSortedAsc: false,
  //   },
  //   {
  //     Header: "To",
  //     accessor: "emailTo",
  //     Rowname: "EmailTo",
  //     SortColumn: "OTEmailTo",
  //     width: "24%",
  //     HeaderSpace: "8px",
  //     RowSpace: "",
  //     Cell: (props) => {
  //       let addresses =
  //         props.row.original.EmailTo &&
  //         props.row.original.EmailTo.split(";").join(";\n").toString();
  //       return (
  //         <span style={{ marginLeft: "10px" }} title={addresses}>
  //           {addresses}
  //         </span>
  //       );
  //     },
  //     FieldSorted: false,
  //     isSortedAsc: false,
  //   },
  //   {
  //     Header: "Sent",
  //     accessor: "sentDate",
  //     Rowname: "SentDate",
  //     SortColumn: "OTEmailSentDate",
  //     width: "20%",
  //     HeaderSpace: "8px",
  //     RowSpace: "",
  //     Cell: (props) => {
  //       const custom_date = props.row.original.SentDate
  //         ? moment(props.row.original.SentDate).format(
  //             "ddd DD-MMM-YYYY hh:mm A"
  //           )
  //         : "";
  //       return (
  //         <span
  //           style={{ marginLeft: "10px" }}
  //           title={custom_date === "Invalid date" ? "" : custom_date}
  //         >
  //           {custom_date === "Invalid date" ? "" : custom_date}
  //         </span>
  //       );
  //     },
  //     FieldSorted: true,
  //     isSortedAsc: true,
  //   },
  // ]);

  const _EmailIDChanged = (e) => {
    EmailIDChanged(e.original.NodeID);
    setSelectedEmailID(e.original.NodeID);
    setSelectedAttachmentID("");
  };

  const showFolderOption = (value) => {
    showEmailFolder(value);
  };

  const relatedConversationOption = (value) => {
    relatedConversation(value);
  };

  const _AttachmentIDChanged = (AttachmentID) => {
    EmailIDChanged(AttachmentID);
    setSelectedAttachmentID(AttachmentID);
    setSelectedEmailID("");
  };
  const _AttachmentClicked = (e, row) => {
    e.stopPropagation();
    //AttachmentSectionToggle(row);
    let nodeId = row.original.NodeID;
    window.open(
      config.REACT_APP_FRAME_ATTACHMENT + nodeId + "&noClose=false",
      "Attachments_" + nodeId,
      "width=800,height=600,resizable=yes,scrollbars=yes,menubar=no"
    );
  };

  const defaultColumn =
    (() => ({
      minWidth: 10,
      width: 80,
    }),
    []);
}

function showPathDialog(row, setPopUpDialog) {
  if (row.nodeId > 0) {
    setPopUpDialog("ShowPath", row.nodeId);
  }
}

var ErrorMessage = "";

function createDataTable(
  nodeId,
  parentNodeId,
  conversationId,
  hasAttachment,
  from,
  subject,
  to,
  sent,
  permSeeContents
) {
  // if (permSeeContents == null) permSeeContents = false;
  //update default permSeeContents
  if (permSeeContents == null) permSeeContents = true;

  if (from == null) from = "Email sender is null";

  if (subject == null) subject = "Subject is null";

  if (to == null) to = "Recipient is null";

  if (sent == null) sent = "Sent date is null";

  return {
    nodeId,
    conversationId,
    parentNodeId,
    hasAttachment,
    from,
    subject,
    to,
    sent,
    permSeeContents,
  };
}

const listConversationHeadCells = [
  {
    id: "hasAttachment",
    numeric: false,
    disablePadding: true,
    label: "hasAttachment",
    sortedColumn: "OTEmailHasAttachments",
  },
  {
    id: "emailFrom",
    numeric: false,
    disablePadding: true,
    label: "Email From",
    sortedColumn: "EmailFrom",
  },
  {
    id: "emailSubject",
    numeric: false,
    disablePadding: true,
    label: "Email Subject",
    sortedColumn: "EmailSubject",
  },
  {
    id: "emailTo",
    numeric: false,
    disablePadding: true,
    label: "Email To",
    sortedColumn: "EmailTo",
  },
  {
    id: "location",
    numeric: false,
    disablePadding: true,
    label: "Location",
    sortedColumn: "Location",
  },
  {
    id: "emailSent",
    numeric: false,
    disablePadding: true,
    label: "Email Sent",
    sortedColumn: "EmailSent",
  },
];

const getConversationHeaderLabel = (originalLabel) => {
  const labelMap = {
    hasAttachment: "",
    from: "Email From",
    to: "Email To",
    subject: "Email Subject",
    sent: "Email Sent",
    location: "Location",
    action: "Action",
    // Add other mappings as needed
  };

  return labelMap[originalLabel] || originalLabel;
};

const headCells = [
  {
    id: "hasAttachment",
    numeric: false,
    disablePadding: true,
    label: "hasAttachment",
    sortedColumn: "OTEmailHasAttachments",
    key: "hasAttachment",
  },
  {
    id: "from",
    numeric: false,
    disablePadding: true,
    label: "From",
    sortedColumn: "OTEmailFrom",
    key: "from",
  },
  {
    id: "subject",
    numeric: false,
    disablePadding: true,
    label: "Subject",
    sortedColumn: "OTEmailSubject",
    key: "subject",
  },
  {
    id: "to",
    numeric: false,
    disablePadding: true,
    label: "To",
    sortedColumn: "OTEmailTo",
    key: "to",
  },
  {
    id: "sent",
    numeric: false,
    disablePadding: true,
    label: "Sent",
    sortedColumn: "OTEmailSentDate",
    key: "sent",
  },
  {
    id: "location",
    numeric: false,
    disablePadding: true,
    label: "Location",
    sortedColumn: "OTEmailLocation",
    key: "location",
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function setConversationPopUpDialog(row, setPopUpDialog) {
  if (row.nodeId > 0) {
    setPopUpDialog("ShowConversation", row.nodeId);
  }
}

// const testRows = [
//   {
//     conversationId: 373358,
//     emailFrom: "OpenText Customer Service",
//     hasAttachment: true,
//     NodeID: 376149,
//     parentNodeId: "0101C0BF927FBA7F217E47AB0F99F70D24F15F1B8305",
//     permSeeContents: true,
//     emailSent: "2023-12-08T22:14:17",
//     emailSubject: "KB0801652 has been revised",
//     emailTo: "joe.tan@swiftx.co",
//   },
//   {
//     conversationId: 373358,
//     emailFrom: "jasmine.chia@swiftx.co",
//     hasAttachment: false,
//     NodeID: 375359,
//     parentNodeId: "01DA282017B703E4AAE69BCC4FFDB9DC49B4C725BE79",
//     permSeeContents: true,
//     emailSent: "2023-12-06T16:43:22",
//     emailSubject: "Test Email 1642pm",
//     emailTo: "Jasmine Chia",
//   },
//   {
//     conversationId: 373358,
//     emailFrom: "Joe Tan",
//     hasAttachment: false,
//     NodeID: 375358,
//     parentNodeId: "01DA2813EB7999B8C09A82604BAE95825871D6D8F12D",
//     permSeeContents: true,
//     emailSent: "2023-12-06T16:40:46",
//     emailSubject: "RE: cecily",
//     emailTo: "Jasmine Chia",
//   },
//   // ... (continue adding other objects)
// ];

//update for list conversation page
const DEFAULT_MIN_WIDTH_CELL = 40;
const DEFAULT_MAX_WIDTH_CELL = 800;

const listConversationColumns = [
  {
    field: "hasAttachment",
    headerName: "",
    width: 40,
    sortedColumn: "HasAttachments",
    key: "HasAttachments",
  },
  {
    field: "emailFrom",
    headerName: "Email From",
    width: 250,
    minWidth: 150,
    maxWidth: 300,
    sortedColumn: "EmailFrom",
    key: "EmailFrom",
  },
  {
    field: "emailSubject",
    headerName: "EmailSubject",
    minWidth: 350,
    maxWidth: 500,
    width: 264,
    sortedColumn: "EmailSubject",
    key: "EmailSubject",
  },
  {
    field: "emailTo",
    headerName: "Email To",
    type: "number",
    width: 250,
    minWidth: 150,
    maxWidth: 500,
    sortedColumn: "EmailTo",
    key: "EmailTo",
  },
  {
    field: "emailSent",
    headerName: "Email Sent",
    width: 250,
    minWidth: 150,
    maxWidth: 500,
    sortedColumn: "EmailSent",
    key: "SentDate",
  },
];

const columns = [
  {
    field: "hasAttachment",
    headerName: "",
    width: 40,
    sortedColumn: "hasAttachments",
    key: "hasAttachments",
  },
  {
    field: "from",
    headerName: "From",
    width: 250,
    minWidth: 150,
    maxWidth: 300,
    sortedColumn: "from",
    key: "from",
  },
  {
    field: "subject",
    headerName: "Subject",
    minWidth: 350,
    maxWidth: 500,
    width: 264,
    sortedColumn: "subject",
    key: "subject",
  },
  {
    field: "to",
    headerName: "To",
    type: "number",
    width: 250,
    minWidth: 150,
    maxWidth: 500,
    sortedColumn: "to",
    key: "to",
  },
  {
    field: "sent",
    headerName: "Sent",
    width: 250,
    minWidth: 150,
    maxWidth: 500,
    sortedColumn: "sent",
    key: "sent",
  },
  {
    field: "location",
    headerName: "Location",
    width: 250,
    minWidth: 150,
    maxWidth: 500,
    sortedColumn: "location",
    key: "location",
  },
];

const convertContentServerDateFormat = (inputDateString) => {
  var parsedDate = moment(inputDateString);
  var outputDateString = parsedDate.format("DD-MM-YYYY HH:mm");
  // const formattedDate = `${inputDateString?.getDate()}-${
  //   inputDateString?.getMonth() + 1
  // }-${inputDateString?.getFullYear()} ${inputDateString.getHours()}:${inputDateString.getMinutes()}`;
  // console.log("convertContentServerDateFormat formattedDate", formattedDate);
  // const date = new Date(inputDateString);

  // // Format the date as "dd-MM-yyyy HH:mm"
  // const formattedDate = date.toLocaleString("en-GB", {
  //   day: "2-digit",
  //   month: "2-digit",
  //   year: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });

  return outputDateString;
};
function EmailsSection(props) {
  //update for list conversation page resizer
  const columnRefs = Array.from({ length: columns.length }, () => createRef());
  const isResizing = useRef(-1);
  const [convData, setConvData] = useState([]);

  const showListConversation = convData.length > 1;
  // useEffect(() => {
  //   console.log("props.isListCoversationOpen", props.isListCoversationOpen);
  //   if (props.isListCoversationOpen) {
  //     document.onmousemove = handleOnMouseMove;
  //     document.onmouseup = handleOnMouseUp;
  //     loadColumnInfoLocalStorage();
  //     return () => {
  //       document.onmousemove = null;
  //       document.onmouseup = null;
  //     };
  //   }
  // }, [props.isListCoversationOpen, columnRefs]);

  // function loadColumnInfoLocalStorage() {
  //   let columnsInfo = localStorage.getItem("columnsInfo");
  //   if (columnsInfo) {
  //     columnsInfo = JSON.parse(columnsInfo);
  //     Object.keys(columnsInfo).forEach((colField, index) => {
  //       columnRefs[index].current.parentElement.style.width =
  //         columnsInfo[colField];
  //     });
  //   }
  // }

  // const saveColumnInfoLocalStorage = () => {
  //   let columnsInfo = {};
  //   columns.forEach((col, index) => {
  //     console.log("col", col);
  //     columnsInfo[col.field] = {};
  //     console.log(columnRefs);
  //     if (columnRefs[index].current) {
  //       columnsInfo[col.field] =
  //         columnRefs[index].current.parentElement.style.width;
  //     }
  //   });
  //   localStorage.setItem("columnsInfo", JSON.stringify(columnsInfo));
  // };

  // const adjustWidthColumn = (index, width) => {
  //   const minWidth = columns[index]?.minWidth ?? DEFAULT_MIN_WIDTH_CELL;
  //   const maxWidth = columnRefs[index]?.maxWidth ?? DEFAULT_MAX_WIDTH_CELL;
  //   const newWidth =
  //     width > maxWidth ? maxWidth : width < minWidth ? minWidth : width;

  //   columnRefs[index].current.parentElement.style.width = newWidth + "px";
  // };
  // const [hoveredHeader, setHoveredHeader] = useState(null);
  // const setCursorDocument = (isResizing) => {
  //   document.body.style.cursor = isResizing ? "col-resize" : "auto";
  // };

  // const handleOnMouseMove = (e) => {
  //   if (isResizing.current >= 0 && columnRefs[isResizing.current]?.current) {
  //     // Check if the current column index matches the hovered header index
  //     if (isResizing.current === hoveredHeader) {
  //       const fixedOffset = -100; // Adjust this value as needed
  //       const newWidth =
  //         e.clientX -
  //         columnRefs[
  //           isResizing.current
  //         ].current.parentElement?.getBoundingClientRect().left -
  //         fixedOffset;
  //       adjustWidthColumn(isResizing.current, newWidth);
  //     }
  //   }
  // };

  // const handleOnMouseUp = () => {
  //   console.log("end resize");
  //   isResizing.current = -1;
  //   saveColumnInfoLocalStorage();
  //   setCursorDocument(false);
  // };

  // const onClickResizeColumn = (index) => {
  //   console.log("start resize");
  //   isResizing.current = index;
  //   setCursorDocument(true);
  // };
  const [sendDateRes, setSendDateRes] = useState([]);
  const [emails, setEmails] = useState([]);
  const [SortDirect, setSortDirect] = useState("asc");
  const [SortSortColumn, setSortColumn] = useState("OTEmailFrom");
  const [PrevSortcolumn, setPrevSortcolumn] = useState("OTEmailSentDate");
  const [PrevSortdirc, setPrevSortdirc] = useState("desc");
  const [conversation, setconversation] = useState(false);
  const [conversationID, setconversationID] = useState(""); // conversationview
  const [Loading, setLoading] = useState(false);
  const [ErrMSGShow, setErrMsgShow] = useState(false);
  const [Folderview, setFolderview] = useState(false);
  const [Totalcount, setTotalcount] = useState(0); //pagination
  const [Recordfrom, setRecordfrom] = useState(1); //pagination
  const [Paginationpagecount, setPaginationpagecount] = useState(0); //pagination
  const [Pagelimit, setPagelimit] = useState(30); //pagination
  const [PageNumber, setPageNumber] = useState(1); //pagination
  const [MaxcountReach, setMaxcountReach] = useState(false);
  const [Maxcount, setMaxcount] = useState(0);
  const [AttachmentSelection, setAttachmentSelection] = useState(false);
  const [isEmailsListingOverflowed, setIsEmailsListingOverflowed] =
    useState(false);
  const [conversationPopUp, setConversationPopUp] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [dataTableRows, setDataTableRows] = useState([]);
  const [selectedEmailID, setSelectedEmailID] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState({});
  const [orderBy, setOrderBy] = useState("from");
  const [refs, setRefs] = useState({
    hasAttachment: useRef(null),
    from: useRef(null),
    subject: useRef(null),
    to: useRef(null),
    sent: useRef(null),
    location: useRef(null),
  });
  const [listConversationRefs, setListConversationRefs] = useState({
    hasAttachment: useRef(null),
    emailFrom: useRef(null),
    emailSubject: useRef(null),
    emailTo: useRef(null),
    emailSent: useRef(null),
  });

  const [emailOrder, setEmailOrder] = useState("asc"); // Initial sorting order
  const [emailOrderBy, setEmailOrderBy] = useState("emailFrom");
  const [listPaginationOrder, setListPaginationOrder] = useState("asc"); // Initial sorting order
  const [listPaginationOrderBy, setListPaginationOrderBy] =
    useState("emailFrom"); // Initial sorting column
  // const [isListCoversationOpen, setIsListConversationOpen] = useState(false);

  const handleEmailRequestSort = (property) => {
    const isAsc = emailOrderBy === property && emailOrder === "asc";
    setEmailOrder(isAsc ? "desc" : "asc");
    setEmailOrderBy(property);
  };

  const handleListPaginationRequestSort = (property) => {
    const isAsc =
      listPaginationOrderBy === property && listPaginationOrder === "asc";
    setListPaginationOrder(isAsc ? "desc" : "asc");
    setListPaginationOrderBy(property);
  };
  // const getListPaginationComparator = (order, orderBy) => {
  //   return (a, b) => {
  //     if (listPaginationOrder === "asc") {
  //       if (a[listPaginationOrderBy] < b[listPaginationOrderBy]) return -1;
  //       if (a[listPaginationOrderBy] > b[listPaginationOrderBy]) return 1;
  //       return 0;
  //     } else if (orderBy === "attachments") {

  //     } else {
  //       if (a[listPaginationOrderBy] < b[orderBy]) return 1;
  //       if (a[listPaginationOrderBy] > b[listPaginationOrderBy]) return -1;
  //       return 0;
  //     }
  //   };
  // };

  const getEmailComparator = (order, orderBy) => {
    return (a, b) => {
      if (orderBy === "location") {
        const locationA = a?.location?.Location?.toUpperCase();
        const locationB = b?.location?.Location?.toUpperCase();

        if (order === "asc") {
          if (locationA < locationB) return -1;
          if (locationA > locationB) return 1;
          return 0;
        } else {
          if (locationA < locationB) return 1;
          if (locationA > locationB) return -1;
          return 0;
        }
      } else if (orderBy === "OTEmailHasAttachments") {
        // Handle sorting by email attachment
        const aValue = a[orderBy] ? 1 : 0;
        const bValue = b[orderBy] ? 1 : 0;
        return order === "asc" ? aValue - bValue : bValue - aValue;
      } else {
        // Default sorting
        if (order === "asc") {
          if (a[orderBy] < b[orderBy]) return -1;
          if (a[orderBy] > b[orderBy]) return 1;
          return 0;
        } else {
          if (a[orderBy] < b[orderBy]) return 1;
          if (a[orderBy] > b[orderBy]) return -1;
          return 0;
        }
      }
    };
  };

  const getListPaginationComparator = (order, orderBy) => {
    return (a, b) => {
      if (orderBy === "OTEmailHasAttachments") {
        const aValue = a[orderBy] ? 1 : 0;
        const bValue = b[orderBy] ? 1 : 0;

        // If order is 'asc', sort in ascending order, else sort in descending order
        return order === "asc" ? true : false;
      } else {
        // Handle sorting for other columns
        if (order === "asc") {
          if (a[orderBy] < b[orderBy]) return -1;
          if (a[orderBy] > b[orderBy]) return 1;
          return 0;
        } else {
          if (a[orderBy] < b[orderBy]) return 1;
          if (a[orderBy] > b[orderBy]) return -1;
          return 0;
        }
      }
    };
  };

  const sortedEmailsData = dataTableRows.sort(
    getEmailComparator(emailOrder, emailOrderBy)
  );
  useEffect(() => {
    if (sortedEmailsData.length > 0) {
      setTotalcount(sortedEmailsData.length);
    }
  }, [sortedEmailsData]);

  const sortedSearchEmailsData = props.searchEmailDatas.sort(
    getEmailComparator(emailOrder, emailOrderBy)
  );

  useEffect(() => {
    if (sortedSearchEmailsData.length > 0) {
      setTotalcount(sortedSearchEmailsData.length);
    }
  }, [sortedSearchEmailsData]);

  const sortedRecentlyAccessedDatas = props.recentAccesses.sort(
    getEmailComparator(emailOrder, emailOrderBy)
  );

  useEffect(() => {
    if (sortedRecentlyAccessedDatas.length > 0) {
      setTotalcount(sortedRecentlyAccessedDatas.length);
    }
    // const username = cookies.get("uid");
    // const nodeIds = sortedRecentlyAccessedDatas.map((x) => x.nodeId).join(",");
    // AGOApi.getEmailSentDates(username, nodeIds ? nodeIds : "")
    //   .then((response) => {
    //     if (response.data) {
    //       for (var i = 0; i < response.data.length; i++) {
    //         const emailInfoIndex = sortedRecentlyAccessedDatas.findIndex(
    //           (x) => x.nodeId == response.data[i].NodeID
    //         );

    //         if (emailInfoIndex >= 0)
    //           sortedRecentlyAccessedDatas[emailInfoIndex].sent =
    //             response.data[i].SentDate;
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, [sortedRecentlyAccessedDatas]);

  const sortedConversationDatas = convData.sort(
    getEmailComparator(emailOrder, emailOrderBy)
  );

  useEffect(() => {
    if (sortedConversationDatas.length > 0) {
      setTotalcount(sortedConversationDatas.length);
    }
    // const username = cookies.get("uid");
    // const nodeIds = sortedConversationDatas.map((x) => x.nodeId).join(",");
    // AGOApi.getEmailSentDates(username, nodeIds ? nodeIds : "")
    //   .then((response) => {
    //     if (response.data) {
    //       setSendDateRes(response.data);
    //       for (var i = 0; i < response.data.length; i++) {
    //         const emailInfoIndex = sortedConversationDatas.findIndex(
    //           (x) => x.nodeId == response.data[i].NodeID
    //         );

    //         if (emailInfoIndex >= 0)
    //           sortedConversationDatas[emailInfoIndex].sent =
    //             response.data[i].SentDate;
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, [sortedConversationDatas]);

  const [columnWidth, setColumnWidth] = useState({
    from: 216,
    subject: 264,
    to: 160,
    sent: 250,
    location: 100,
  });
  // const [columnWidth, setColumnWidth] = useState({
  //   from: 25,
  //   subject: 30,
  //   to: 18,
  //   sent: 22,
  // });
  const [listConversationColumnWidth, setListConversationColumnWidth] =
    useState({
      emailFrom: 216,
      emailSubject: 264,
      emailTo: 160,
      emailSent: 200,
    });
  const tableRef = useRef(null);
  const listConversationTableRef = useRef(null);
  const [conversationPage, setConversationPage] = React.useState(0);
  const [conversationRowsPerPage, setConversationRowsPerPage] =
    React.useState(5);
  const handleConversationChangePage = (event, newPage) => {
    setConversationPage(newPage);
  };

  const handleConversationChangeRowsPerPage = (event) => {
    setConversationRowsPerPage(parseInt(event.target.value, 10));
    setConversationPage(0);
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await AGOApi.getConversation(
  //       row.nodeId,
  //       "OTEmailSentDate",
  //       "dec"
  //     );

  //     if (response !== null) {
  //       let data = response.data.EmailInfos.filter(
  //         (v, i, a) =>
  //           a.findLastIndex((v2) =>
  //             ["ReceivedDate", "Name"].every((k) => v2[k] === v[k])
  //           ) === i
  //       );
  //       setConvData(data);

  //       setIsLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  const getConversationData = async (nodeId) => {
    props.setEmailAttachments([]);
    props.setOpenAttachmentNodeIDs({});
    props.setShowEmailAttactments(false);
    setConversationPage(0);
    setConversationRowsPerPage(5);
    setLoading(true);
    const response = await AGOApi.getConversation(
      nodeId,
      "OTEmailSentDate",
      "dec"
    );
    if (response !== null) {
      let data = response.data.EmailInfos.filter(
        (v, i, a) =>
          a.findLastIndex((v2) =>
            ["ReceivedDate", "Name"].every((k) => v2[k] === v[k])
          ) === i
      );
      setTotalcount(data.length);
      setLoading(false);
      props.setIsListConversationOpen(true);
      // setConvData(data);
      const transformedListConversation = data.map((originalData) => ({
        conversationId: originalData.ParentNodeID,
        from: originalData.EmailFrom,
        hasAttachment: originalData.HasAttachments === 1,
        nodeId: originalData.NodeID,
        parentNodeId: originalData.ConversationId,
        permSeeContents: originalData.PermSeeContents,
        sent: originalData.SentDate,
        subject: originalData.EmailSubject,
        to: originalData.EmailTo,
      }));
      setConvData(transformedListConversation);
    }
  };
  useEffect(() => {
    props.ContentIDChanged(selectedEmailID, selectedEmail);
  }, [selectedEmailID]);

  const showEmailFolder = async (value) => {
    sessionStorage.setItem("showEmailFolder", "true");
    sessionStorage.setItem("showExpandedFolders", "true");
    const username = cookies.get("uid");

    setDataTableRows(
      emails.map((row) =>
        createDataTable(
          row.NodeID,
          row.ConversationId,
          row.ParentNodeID,
          row.HasAttachments > 0,
          row.EmailFrom,
          row.EmailSubject,
          row.EmailTo,
          row.SentDate,
          row.PermSeeContents,
          row.Location,
          row.Path
        )
      )
    );

    const res = await axios.get(
      `${config.REACT_APP_API_URL}/folders/navigationpath/${value.nodeId}?userName=${username}`
    );
    const folderBreadcrumbName = res.data.map((item) => item.Name);
    // props.setFolderFullpath(res.data);
    props.setSearchBreadcrumb(res.data);
    const latestNodeId = res.data.reduce((maxNodeId, currentItem) => {
      return Math.max(maxNodeId, currentItem.NodeID);
    }, -1);
    const emailsInfoRes = await axios.get(
      `${config.REACT_APP_API_URL}/emails/list/paginated?id=${latestNodeId}`
    );
    const transformedData = emailsInfoRes.data.EmailInfos.map((item) => {
      return {
        conversationId: item.ConversationId,
        from: item.EmailFrom,
        hasAttachment: item.HasAttachments > 0,
        nodeId: item.NodeID,
        parentNodeId: item.ParentNodeID,
        permSeeContents: item.PermSeeContents,
        sent: item.SentDate,
        subject: item.EmailSubject,
        to: item.EmailTo,
        location: item.Location,
        path: item.Path,
      };
    });

    const transformedSearchData = emails.map((item) => {
      return {
        conversationId: item.ConversationId,
        from: item.EmailFrom,
        hasAttachment: item.HasAttachments > 0,
        nodeId: item.NodeID,
        parentNodeId: item.ParentNodeID,
        permSeeContents: item.PermSeeContents,
        sent: item.SentDate,
        subject: item.EmailSubject,
        to: item.EmailTo,
        location: item.Location,
        path: item.Path,
      };
    });

    props.setSearchEmailDatas(transformedData);
    props.setSelected(latestNodeId.toString());
    localStorage.setItem("pervNodeID", latestNodeId.toString());
    const reversedNodeIds = res.data
      .map((item) => item.NodeID)
      .reverse()
      .join(",");
    sessionStorage.setItem("listNodeID", reversedNodeIds);
    props.showEmailFolder(value);
    setFolderview(true);
  };

  function relatedConversation(value) {
    setconversationID(value);
    props.UpdateConversationView(value);
    setFolderview(false);
  }

  function setPopUpDialog(option, value) {
    option === "ShowPath"
      ? setConversationPopUp(
          <ShowPath
            closeDialog={() => setConversationPopUp(null)}
            nodeID={value}
          />
        )
      : setConversationPopUp(
          <ShowConversation
            closeDialog={() => setConversationPopUp(null)}
            nodeID={value}
          />
        );
  }

  function setAlertOpenDialog(value) {
    setAlertOpen(value);
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        marginTop: theme.spacing(2),
      },
    },
    table: {
      height: "40px",

      "& > td": {
        padding: "0 4px",
        verticalAlign: "middle!important",
      },
      "& > th": {
        padding: "4px",
        position: "sticky",
        zIndex: 2,
        backgroundColor: "#fafafa",
        top: 0,
        verticalAlign: "middle!important",
      },
      "& > th > span": {
        fontWeight: 600,
        fontSize: "12px!important",
      },
    },
    buttons: {
      width: "105px",
      whiteSpace: "nowrap",
      "& > button": {
        padding: "6px",
        backgroundColor: "rgb(25, 118, 210)",
        color: "white",
        margin: "2px",
      },
      "& > span > button": {
        padding: "6px",
        backgroundColor: "rgb(25, 118, 210)",
        color: "white",
        margin: "2px",
      },
    },
    headingSort: {
      "& .resizable-header": {
        height: "100%",
        cursor: "col-resize",
        padding: "0 4px",
        position: "absolute",
        top: 0,
        right: "0",
      },
      "& .resizable-header>span": {
        display: "inline-block",
        border: "1px solid gray",
        height: "calc(100% - 8px)",
        margin: "4px 0",
        visibility: "hidden",
      },
      "&:hover .resizable-header>span": {
        visibility: "visible",
      },
    },
    contentWidth: {
      display: "block",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "11px!important",
    },
    fromContentWidth: {
      width: `${columnWidth.from}px`,
    },
    subjectContentWidth: {
      width: `${columnWidth.subject}px`,
    },
    toContentWidth: {
      width: `${columnWidth.to}px`,
    },
    sentContentWidth: {
      width: `${columnWidth.sent}px`,
    },
    tableHeader: {
      top: 0,
      position: "sticky",
      zIndex: 2,
      backgroundColor: "#fafafa",
    },
    tableFooter: {
      position: "sticky",
      bottom: "-20px",
      background: "white",
      border: "1px solid rgba(224, 224, 224, 1)",
      width: "100000px",
    },
  }));

  const classes = useStyles();

  function SortingUpdate(sortcolumn, sortdirc) {
    setSortDirect(sortdirc);
    setSortColumn(sortcolumn);
    setPrevSortcolumn(sortcolumn);
    setPrevSortdirc(sortdirc);
    setRecordfrom(1);
    setPageNumber(1);
  }

  function normalSortingUpdate(sortcolumn, sortdirc) {
    setPrevSortcolumn(sortcolumn);
    setPrevSortdirc(sortdirc);
  }

  function ConversationSet(value) {
    setconversation(value);
    setIsEmailsListingOverflowed(value);
  }

  function SelectOptionforSearch() {
    var x = document.getElementById("pagelimit").value;
    setPagelimit(x);
    setRecordfrom(1);
    setPageNumber(1);
  }

  function disableDownloadButton(row) {
    if (!row.permSeeContents) {
      return true;
    }
    return false;
  }
  // function disableListConversationDownloadButton(row) {
  //   if (!row.PermSeeContents) {
  //     return true;
  //   }
  //   return false;
  // }

  function disableListConversationDownloadButton(row) {
    if (!row.PermSeeContents) {
      return true;
    }
    return false;
  }

  const getNextColumnId = (currentColumnId) => {
    const columnIds = Object.keys(columnWidth);
    const currentIndex = columnIds.indexOf(currentColumnId);
    return columnIds[currentIndex + 1];
  };

  let resizing = false;
  useEffect(() => {
    const initialColumnWidths = {};
    headCells.forEach((headCell) => {
      initialColumnWidths[headCell.id] = "216px";
    });
    setColumnWidth(initialColumnWidths);
  }, [headCells]);

  let xcord = 0;

  const onMouseMoveResize = (event, id) => {
    if (resizing) {
      const parentNode = refs[id]?.current?.parentNode;

      if (!parentNode) return;

      const dx = event.clientX - xcord;
      const currentWidth = parentNode.offsetWidth;

      parentNode.style.width = `${currentWidth + dx}px`;

      setColumnWidth(function (prev) {
        return {
          ...prev,
          [id]: `${currentWidth + dx - 8}px`,
        };
      });
      // const nextColumnId = getNextColumnId(id);
      // const nextColumn = refs[nextColumnId].current.parentNode;
      // const nextColumnCurrentWidth = nextColumn.offsetWidth;
      // nextColumn.style.width = `${nextColumnCurrentWidth - dx}px`;

      // Update xcord for the next iteration
      xcord = event.clientX;

      // Update the table width
      const tableWidth = tableRef.current?.offsetWidth;
      if (tableWidth !== undefined) {
        tableRef.current.style.width = `${tableWidth + dx}px`;
      }
    }
  };

  const onMouseUpResize = () => {
    resizing = false;
    document.removeEventListener("mousemove", onMouseMoveResize);
    document.removeEventListener("mouseup", onMouseUpResize);
  };

  const onMouseDownResize = (event, id) => {
    xcord = event.clientX;
    resizing = true;
    document.addEventListener("mousemove", (e) => onMouseMoveResize(e, id));
    document.addEventListener("mouseup", onMouseUpResize);
  };

  useEffect(() => {
    setRecordfrom(1);
    setPageNumber(1);
  }, [props.SearchType]);

  useEffect(() => {
    setDataTableRows([]);
    setRecordfrom(1);
    setPageNumber(1);
  }, [props.FolderIDSelected]);

  useEffect(() => {
    setSortDirect(PrevSortdirc);
    setSortColumn(PrevSortcolumn);
    if (props.Search) setFolderview(false);
  }, [props.Search]);

  useEffect(() => {
    setFolderview(props.FolderView);
  }, [props.FolderView]);

  //use effect is like on load
  useEffect(() => {
    try {
      setAttachmentSelection(false);
      const fetchData = async () => {
        setLoading(true);
        setErrMsgShow(false);
        let emailsInThisPage = -1;
        const res = await AGOApi.getEmails(
          props.FolderIDSelected,
          Recordfrom, // initialpoint
          Pagelimit, // perpagecount
          SortSortColumn,
          SortDirect.toLowerCase(),
          conversation
        );

        let fetchedData = null;
        const breadcrumbRes = await AGOApi.getFoldersPath(
          parseInt(props.FolderIDSelected)
        );
        if (breadcrumbRes !== null) {
          let Fullpath = [];
          for (var i = 0; breadcrumbRes.data.length > i; i++) {
            var item = breadcrumbRes.data[i];
            Fullpath.push(item);
          }
          props.setFolderFullpath(Fullpath);
        }

        if (res !== null) {
          fetchedData = res.data;
        }
        if (fetchedData?.EmailInfos?.length > 0) {
          //find duplicate emails
          fetchedData.EmailInfos = fetchedData.EmailInfos.reduce(
            (acc, current) => {
              const duplicate = acc.find(
                (item) => item.NodeID === current.NodeID
              );
              return !duplicate ? acc.concat([current]) : acc;
            },
            []
          );

          if (conversation) {
            let grouped = _(fetchedData.EmailInfos)
              // Group the elements of Array based on `color` property
              .groupBy("ConversationId")
              // `key` is group's name (color), `value` is the array of objects
              .map((value, key) => {
                let conv = value[0];
                let emails = value.slice(1, value.length);
                conv.subRows = emails; //alvin: it has to be subrows for the expansion to work
                return conv;
              })
              .value();

            let emailConversation = fetchedData.EmailInfos.map(
              (data, index) => {
                let email = data;
                email.subRows = data.Conversations;
                return email;
              }
            );

            fetchedData.EmailInfos = emailConversation;

            // with pagination
            let numberOfPages = fetchedData.EmailInfos.length / Pagelimit;
            setPaginationpagecount(fetchedData.NumberOfPages);
            setTotalcount(fetchedData.TotalCount);
            setMaxcountReach(false);
            setMaxcount(0);

            emailsInThisPage = fetchedData.EmailInfos.length;
          } else {
            setPaginationpagecount(fetchedData.NumberOfPages);
            setTotalcount(fetchedData.TotalCount);
            setMaxcountReach(false);
            setMaxcount(0);

            emailsInThisPage = fetchedData.EmailInfos.length;
          }
          // if (sessionStorage.getItem("showEmailFolder") === "true") {
          setEmails(fetchedData.EmailInfos);
          // }
        } else {
          setEmails([]);
          setTotalcount(0);
          setPaginationpagecount(0);
        }

        if (emailsInThisPage === 0) {
          document.querySelector('[aria-label="Go to page 1"]').click();
        }
        setLoading(false);
      };
      if (props.Search) {
        setRecordfrom(1);
        setPageNumber(1);
      } else if (
        Folderview &&
        props.FolderView &&
        !props.Search &&
        !props.ConversationView
      ) {
        // fetchData();
      }
      if (
        props.ConversationView &&
        !props.Searchbarshow &&
        !props.FolderView &&
        !Folderview
      ) {
        setIsEmailsListingOverflowed(true);
        // conversationViewData();
      } else if (props.IsSearchState && !props.ConversationView) {
        setIsEmailsListingOverflowed(false);
        //SearchData();
      } else if (
        props.FolderIDSelected &&
        !props.IsSearchState &&
        !props.Searchbarshow &&
        !props.ConversationView
      ) {
        //is a number
        fetchData();
      } else if (
        props.FolderIDSelected &&
        !props.IsSearchState &&
        props.Searchbarshow &&
        !props.ConversationView
      ) {
        //is a number
        fetchData();
      } else if (!props.IsSearchState && !props.Searchbarshow) {
        setEmails([]);
      }
    } catch (e) {
      alert(e);
    }
  }, [
    props.FolderIDSelected,
    Pagelimit,
    Recordfrom,
    props.Search,
    props.SearchType,
    SortSortColumn,
    SortDirect,
    props.FolderClick,
    Folderview,
    sessionStorage.getItem("showEmailFolder"),
  ]);

  //for search
  useEffect(() => {
    try {
      const SearchData = async () => {
        setLoading(true);
        setErrMsgShow(false);
        let initialpoint = Recordfrom;
        const isNewSearch = sessionStorage.getItem("resetSearch");
        const searchCacheId = sessionStorage.getItem("searchCacheId");

        if (isNewSearch === "true") {
          initialpoint = 1;
        }

        try {
          const res = await AGOApi.searchEmail(
            // Use conditional operator for props.SearchKeyword
            props.SearchKeyword === ""
              ? props.attachmentFileName
              : props.SearchKeyword,
            props.useAdvanceSearch
              ? props.folderNodeID
              : props.FolderIDSelected,
            props.useAdvanceSearch ? props.folderNodeID2 : "0000",
            props.folderNodeID3,
            props.folderNodeID4,
            initialpoint,
            Pagelimit,
            SortSortColumn,
            SortDirect.toLowerCase(),
            props.advanceSearchIn,
            props.advanceContainattachment,
            props.advanceSearchFrom,
            props.advanceSearchTo,
            props.advanceSearchSubject,
            props.ReceivedFrom,
            props.ReceivedTo,
            props.advanceSearchEnable,
            props.useAdvanceSearch,
            props.attachmentFileName,
            searchCacheId !== null ? searchCacheId : ""
          );

          props.UpdateSearch();
          let fetchedData = [];

          if (res !== null) {
            if (res === "No Search Result Found") {
              setEmails([]);
              setTotalcount(0);
              setPaginationpagecount(0);
              fetchedData = null;
              setLoading(false);
              setErrMsgShow(true);
            } else {
              fetchedData = res.data;
            }
          } else {
            fetchedData = res;
          }

          if (fetchedData !== null) {
            // Store the Cache_Id value returned from the v2 CS Search REST API
            sessionStorage.setItem("searchCacheId", fetchedData.CacheID);
            // Reset the search state to false
            sessionStorage.setItem("resetSearch", "false");

            // Find duplicate emails
            let filtered = fetchedData.EmailInfos;
            filtered = filtered.reduce((acc, current) => {
              const duplicate = acc.find(
                (item) =>
                  item.ClientLocalEmailID === current.ClientLocalEmailID &&
                  item.ClientLocalEmailID > 0
              );
              return !duplicate ? acc.concat([current]) : acc;
            }, []);

            // Sorting emails
            let sorted = _(filtered).orderBy(["SentDate"], ["desc"]).value();

            let grouped = _(sorted)
              .groupBy("ConversationId")
              .map((value, key) => {
                let conv = value[0];
                let emails = value.slice(1, value.length);

                // Add subRows property and store the conversation emails in it except the first one
                if (emails.length > 0) {
                  conv.subRows = emails;
                }
                return conv;
              })
              .value();

            fetchedData.EmailInfos = filtered;

            fetchedData.EmailInfos.map((item) => {
              let dateTime = new Date(item.SentDate);
              let date = dateTime.toLocaleDateString();
              let time = dateTime.toLocaleTimeString();
              const columnElement = date + "" + time;
              const [datePart, timePart] = item.SentDate.split("T");
              const combinedDateTime = `${datePart} ${timePart}`;
            });

            // const transformedDataforloop = fetchedData.EmailInfos.forEach(
            //   (item) => {
            //     console.log("item.SentDate for loop ", item.SentDate);
            //   }
            // );

            // const transformedData = fetchedData.EmailInfos.map((item) => ({
            //   conversationId: item.ConversationId,
            //   from: item.EmailFrom,
            //   hasAttachment: Boolean(item.HasAttachments),
            //   nodeId: item.NodeID,
            //   parentNodeId: item.ParentNodeID,
            //   permSeeContents: true,
            //   sent: moment(item.SentDate).format("YYYY-MM-DDTHH:mm:ss"),
            //   subject: item.EmailSubject,
            //   to: item.EmailTo,
            // }));
            const username = cookies.get("uid");

            setSearchResult(fetchedData.EmailInfos);

            // With pagination
            let numberOfPages = fetchedData.ActualCount / Pagelimit;
            setPaginationpagecount(Math.ceil(numberOfPages));
            setTotalcount(fetchedData.ActualCount);
            setMaxcountReach(false);
            setMaxcount(0);
            setEmails(fetchedData.EmailInfos);
          } else {
            setErrMsgShow(true);
            setEmails([]);
            setTotalcount(0);
            setPaginationpagecount(0);
          }

          // Scroll to the top (reset scroll bar position)
          // document.querySelector(".emails_section.flex").scrollTo(0, 0);

          setLoading(false); // Use setLoading(false) instead of setLoading(() => false)
        } catch (err) {
          console.log(err); // Fix the variable name from "first" to "err"
        }
      };

      if (props.Search) {
        setRecordfrom(1);
        setPageNumber(1);
      } else if (
        Folderview &&
        props.FolderView &&
        !props.Search &&
        !props.ConversationView
      ) {
        // fetchData();
      }

      // Scroll to the top (reset scroll bar position)
      // document.querySelector(".emails_section.flex").scrollTo(0, 0);

      if (props.Search) {
        setRecordfrom(1);
        setPageNumber(1);
      } else if (
        Folderview &&
        props.FolderView &&
        !props.Search &&
        !props.ConversationView
      ) {
        // fetchData();
      }

      if (
        props.ConversationView &&
        !props.Searchbarshow &&
        !props.FolderView &&
        !Folderview
      ) {
        setIsEmailsListingOverflowed(true);
        // conversationViewData();
      } else if (props.IsSearchState && !props.ConversationView && !Loading) {
        setIsEmailsListingOverflowed(false);
        SearchData();
      }
    } catch (e) {
      alert(e);
    }
  }, [props.Search, SortSortColumn, SortDirect, Pagelimit, Recordfrom]);

  useEffect(() => {
    const clickFromCSUI = sessionStorage.getItem("clickFromCSUI");

    if (clickFromCSUI === "true") {
      const username = cookies.get("uid");

      setDataTableRows(
        emails.map((row) =>
          createDataTable(
            row.NodeID,
            row.ConversationId,
            row.ParentNodeID,
            row.HasAttachments > 0,
            row.EmailFrom,
            row.EmailSubject,
            row.EmailTo,
            row.SentDate,
            row.PermSeeContents,
            row.Location,
            row.Path
          )
        )
      );
      // sessionStorage.setItem("clickFromCSUI", "false");
      const nodeIds = dataTableRows.map((x) => x.nodeId).join(",");
      AGOApi.getEmailSentDates(username, nodeIds ? nodeIds : "")
        .then((response) => {
          setSendDateRes(response.data);
          if (response.data) {
            for (var i = 0; i < response.data.length; i++) {
              const emailInfoIndex = dataTableRows.findIndex(
                (x) => x.nodeId == response.data[i].NodeID
              );

              if (emailInfoIndex >= 0)
                dataTableRows[emailInfoIndex].sent = response.data[i].SentDate;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });

      // Update sessionStorage to mark the first refresh as completed
    } else {
      // Second refresh and onwards logic
      setDataTableRows([]);
    }
  }, [emails, sessionStorage.getItem("listNodeID")]);

  useEffect(() => {
    const transformedData = emails.map((item) => {
      return {
        conversationId: item.ConversationId,
        from: item.EmailFrom,
        hasAttachment: item.HasAttachments > 0,
        nodeId: item.NodeID,
        parentNodeId: item.ParentNodeID,
        permSeeContents: item.PermSeeContents || true,
        sent: item.SentDate,
        subject: item.EmailSubject,
        to: item.EmailTo,
        // path: item.Path,
        location: item,
        // folder: item.Location,
      };
    });
    props.setSearchEmailDatas(transformedData);
  }, [emails]);

  const getLastPage = async (initPoint, pagePoint) => {
    setLoading(true);
    const searchCacheId = sessionStorage.getItem("searchCacheId");
    const res = await AGOApi.searchEmail(
      props.SearchKeyword,
      props.useAdvanceSearch ? props.folderNodeID : props.FolderIDSelected,
      props.useAdvanceSearch ? props.folderNodeID2 : "0000",
      props.folderNodeID3,
      props.folderNodeID4,
      initPoint, // initialpoint
      Pagelimit,
      //Recordfrom === 1 ? Pagelimit : (Recordfrom + Pagelimit - 1), // perpagecount
      SortSortColumn,
      SortDirect.toLowerCase(),
      props.advanceSearchIn,
      props.advanceContainattachment,
      props.advanceSearchFrom,
      props.advanceSearchTo,
      props.advanceSearchSubject,
      props.ReceivedFrom,
      props.ReceivedTo,
      props.advanceSearchEnable,
      props.useAdvanceSearch,
      props.attachmentFileName,
      searchCacheId !== null ? searchCacheId : ""
    );
    let fetchedData = res.data;
    if (fetchedData !== null) {
      // Store the Cache_Id value returned from the v2 CS Search REST API
      sessionStorage.setItem("searchCacheId", fetchedData.CacheID);

      let filtered = fetchedData.EmailInfos;
      filtered = filtered.reduce((acc, current) => {
        const duplicate = acc.find(
          (item) =>
            item.ClientLocalEmailID === current.ClientLocalEmailID &&
            item.ClientLocalEmailID > 0
        );
        return !duplicate ? acc.concat([current]) : acc;
      }, []);
      fetchedData.EmailInfos = filtered;
      setSearchResult(fetchedData.EmailInfos);

      // with pagination
      let numberOfPages = Math.ceil(fetchedData.ActualCount / Pagelimit);
      //pagePoint === numberOfPages ? setRecordfrom(initPoint) : getLastPage(fetchedData.ActualCount - Pagelimit +1, pagePoint +1)
      setRecordfrom(initPoint);
      setPageNumber(pagePoint);
      setPaginationpagecount(numberOfPages);
      setTotalcount(fetchedData.ActualCount);
      setMaxcountReach(false);
      setMaxcount(0);
      setEmails(fetchedData.EmailInfos);
      setLoading(false);
    } else {
      //setPageNumber(pagePoint)
      getLastPage(initPoint - Pagelimit + 1, pagePoint - 1);
    }
  };

  const dataRowClick = (row) => {
    props.previewContent(row, row.nodeId);
    setSelectedEmailID(row.nodeId);
    setSelectedEmail(row);
    props.setEmailSummary("");
    props.setShowEmailSummaryContent(false);
    props.setPreviewPaneHidden(false);
  };

  const listPaginationDataRowClick = (row) => {
    setSelectedEmailID(row.NodeID);
    setSelectedEmail(row);
    props.setEmailSummary("");
    props.setShowEmailSummaryContent(false);
    props.setPreviewPaneHidden(false);
  };
  const [currentAttachmentNodeID, setCurrentAttachmentNodeID] = useState(0);

  const _AttachmentClicked = (e, row) => {
    e.stopPropagation();
    let nodeId = row.nodeId;
    setCurrentAttachmentNodeID(nodeId);
    props.setShowEmailAttactments(true);

    props.setOpenAttachmentNodeIDs((prevOpenAttachments) => ({
      ...prevOpenAttachments,
      [nodeId]: !prevOpenAttachments[nodeId],
    }));
    if (!props.emailAttachments.some((item) => item.nodeId === nodeId)) {
      props.getEmailAttachments(nodeId);
    }
    props.getEmailName(nodeId);
  };

  const _ListConversationAttachmentClicked = (e, row) => {
    e.stopPropagation();
    //AttachmentSectionToggle(row);
    let nodeId = row.nodeId;
    setCurrentAttachmentNodeID(nodeId);
    // props.getEmailAttachments(nodeId);
    props.setOpenAttachmentNodeIDs((prevOpenAttachments) => ({
      ...prevOpenAttachments,
      [nodeId]: !prevOpenAttachments[nodeId],
    }));
    if (!props.emailAttachments.some((item) => item.nodeId === nodeId)) {
      props.getEmailAttachments(nodeId);
    }
    props.setShowEmailAttactments(true);
    // props.getEmailAttachments(nodeId);
  };

  const handlePageChange = (event, value) => {
    let recordfrom = 1;
    if (props.IsSearchState && value >= Paginationpagecount) {
      value === 1
        ? setRecordfrom(1)
        : getLastPage(Pagelimit * (value - 1) + 1, value);
    } else {
      if (props.IsSearchState) {
        recordfrom = Pagelimit * (value - 1) + 1;
      } else {
        recordfrom = value;
      }
      value === 1 ? setRecordfrom(1) : setRecordfrom(recordfrom);
      setPageNumber(value); // this will trigger rerendering
    }
  };

  const createSortHandler = (property) => (event) => {
    if (property !== SortSortColumn) {
      SortingUpdate(property, "asc");
    } else {
      SortingUpdate(property, SortDirect === "asc" ? "desc" : "asc");
    }
  };

  const goBack = () => {
    props.setOpenAttachmentNodeIDs({});
    props.setEmailAttachments([]);
    props.setIsListConversationOpen(false);
  };

  // const [htmlContent, setHtmlContent] = useState("");
  // const [htmlContentLoading, setHtmlContentLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const cookies = new Cookies();
  const setCollapsed = (value, index) => {
    // Close all previously opened preview
    for (const prop in open) {
      if (prop != index) {
        open[prop] = false;
      }
    }

    setOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const fileTypeIcons = {
    "image/png": AppPng,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      WordIcon,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      ExcelIcon,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      PowerpointIcon,
    "image/jpeg": AppJpeg,
  };
  const defaultIcon = AppJpeg;

  const renderTableRow = (row, index, isListCoversationOpen, sendDateRes) => {
    let filteredSendDate = "";
    if (sendDateRes.length > 0) {
      const sendDate = sendDateRes.find((x) => x.NodeID === row.nodeId);
      filteredSendDate = sendDate?.SentDate;
      if (sendDate?.SentDate === undefined || "") {
        filteredSendDate = row.sent;
      }
    } else {
      filteredSendDate = row.sent;
    }
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <>
        <TableRow
          key={row.id}
          className={classes.table}
          aria-checked={selectedEmailID == row.nodeId}
          hover
          selected={selectedEmailID == row.nodeId}
        >
          {/* Update rendering logic for the first column */}
          <TableCell align="start" className={"tableCell"}>
            {row.hasAttachment ? (
              <>
                <FaPaperclip
                  onClick={(e) => _AttachmentClicked(e, row)}
                  size={12}
                />
              </>
            ) : (
              ""
            )}
          </TableCell>

          <TableCell
            component="td"
            scope="row"
            id={labelId}
            style={columnWidth.from ? { width: `${columnWidth.from}px` } : null}
            // onClick={() => dataRowClick(row)}
            onClick={() => {
              dataRowClick(row);
              // props.previewContent(row, row.nodeId);
            }}
          >
            <span
              className={classNames(
                classes.contentWidth,
                classes.fromContentWidth
              )}
            >
              {row.from}
            </span>
          </TableCell>
          <TableCell
            component="td"
            id={labelId}
            scope="row"
            style={
              columnWidth.subject ? { width: `${columnWidth.subject}px` } : null
            }
            // onClick={() => dataRowClick(row)}
            onClick={() => {
              dataRowClick(row);
              // props.previewContent(row, row.nodeId);
            }}
          >
            <span
              className={classNames(
                classes.contentWidth,
                classes.subjectContentWidth
              )}
            >
              {row.subject}
            </span>
          </TableCell>
          <TableCell
            component="td"
            id={labelId}
            scope="row"
            style={columnWidth.to ? { width: `${columnWidth.to}px` } : null}
            onClick={() => {
              dataRowClick(row);
              // props.previewContent(row, row.nodeId);
            }}
          >
            <span
              className={classNames(
                classes.contentWidth,
                classes.toContentWidth
              )}
            >
              {row.to}
            </span>
          </TableCell>
          <TableCell
            component="td"
            id={labelId}
            scope="row"
            style={columnWidth.sent ? { width: `${columnWidth.sent}px` } : null}
            onClick={() => {
              dataRowClick(row);
            }}
          >
            <span
              className={classNames(
                classes.contentWidth,
                classes.sentContentWidth
              )}
            >
              {convertContentServerDateFormat(filteredSendDate)}
            </span>
          </TableCell>
          {/* location change */}
          {props.ConversationView ||
          (props.IsSearchState && !isListCoversationOpen) ? (
            <TableCell
              component="td"
              id={labelId}
              scope="row"
              style={
                columnWidth.location
                  ? { width: `${columnWidth.location}px` }
                  : null
              }
              onClick={() => {
                dataRowClick(row);
              }}
            >
              <MaterialUiTooltip
                sx={{ cursor: "pointer" }}
                title={row?.location?.Path}
                placement="bottom-start"
              >
                <span
                  className={classNames(
                    classes.contentWidth,
                    classes.sentContentWidth
                  )}
                >
                  {row?.location?.Location}
                </span>
              </MaterialUiTooltip>
            </TableCell>
          ) : null}

          {/* location change */}

          <TableCell className={`${classes.buttons} tableCell `}>
            {isListCoversationOpen ? (
              <>
                <Tooltip title="Download email">
                  <span>
                    <IconButton
                      disabled={false}
                      onClick={() =>
                        downloadEmailListConversation(row, setAlertOpenDialog)
                      }
                      aria-label="download"
                    >
                      <BsDownload />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Open a conversation pop-up">
                  <IconButton
                    aria-label="conversation-popup"
                    // onClick={() =>
                    //   setConversationPopUpDialog(row, setPopUpDialog)
                    // }
                    onClick={() => getConversationData(row.nodeId)}
                  >
                    <BiConversation />
                  </IconButton>
                </Tooltip>
                {/* {props.IsSearchState || props.ConversationView ? (
                  <Tooltip title="Show email folder">
                    <IconButton
                      onClick={() => showEmailFolder(row)}
                      aria-label="show-folder"
                    >
                      <FaRegFolderOpen />
                    </IconButton>
                  </Tooltip>
                ) : null} */}
                <Tooltip title="Download email">
                  <span>
                    <IconButton
                      disabled={false}
                      onClick={() => downloademail(row, setAlertOpenDialog)}
                      aria-label="download"
                    >
                      <BsDownload />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Show path dialog" style={{ display: "none" }}>
                  <IconButton
                    onClick={() => showPathDialog(row, setPopUpDialog)}
                    aria-label="show-path"
                  >
                    <PiPath />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </TableCell>
        </TableRow>
        {/* place */}
        {row.nodeId && props.openAttachmentNodeIDs[row.nodeId] ? (
          <TableRow className={classes.table}>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell style={{ padding: "0" }}>
              {/* <div>Attachments for {props.emailName}</div> */}
              <div className="email-attachment-list-container">
                {props.emailAttachments?.map((emailAttachment, index) => {
                  return (
                    <React.Fragment key={index}>
                      {emailAttachment.nodeId === row.nodeId &&
                        emailAttachment.attachments.map(
                          (attachment, attachmentIndex) => {
                            const downloadLink = `/otcs/cs.exe/${
                              attachment.CSEmailID
                            }/${encodeURIComponent(
                              attachment.FileName
                            )}?func=otemail.fetchAttachment&objid=${
                              attachment.CSEmailID
                            }&version=1&attachmentID=${attachment.No}`;
                            const iconSrc =
                              fileTypeIcons[attachment.FileType] || defaultIcon;

                            return (
                              <button
                                className="email-attachments-button"
                                key={attachmentIndex}
                              >
                                <a
                                  className="email-attachments-list-content"
                                  href={downloadLink}
                                >
                                  <div>
                                    <img
                                      className="attachments-icon"
                                      src={iconSrc}
                                      alt={`${attachment.FileType}-icon`}
                                    />
                                  </div>
                                  <div
                                    className={`link-black ${classNames(
                                      classes.contentWidth,
                                      classes.fromContentWidth
                                    )}`}
                                  >
                                    {attachment.FileName}
                                  </div>
                                </a>
                              </button>
                            );
                          }
                        )}
                    </React.Fragment>
                  );
                })}
              </div>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        ) : null}
      </>
    );
  };

  return (
    <React.Fragment>
      {props.isListCoversationOpen ? (
        <div style={{ overflow: "auto" }}>
          <div className="d-flex align-items-center gap-3 list-conversation-container">
            <div onClick={goBack} className="back-icon-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </div>
            <h4 className="h4-text">List Conversations</h4>
          </div>
        </div>
      ) : null}
      <div className="email-section-container">
        {Loading ? <LinearProgress /> : null}
        {props.searchEmailDatas.length === 0 && ErrMSGShow ? <ErrMSG /> : null}
        {/* {props.searchEmailDatas.length === 0 ? <ErrMSG /> : null} */}
        <TableContainer className="material-ui-table-container">
          <Table
            sx={{
              minWidth: 650,
              "& .MuiTableRow-root:hover": {
                backgroundColor: "rgba(0,0,0,0.08)",
              },
            }}
            style={{
              minWidth: "100%",
            }}
            className={classes.tableHeader}
            size="small"
            aria-label="email table"
            ref={tableRef}
          >
            <TableHead>
              <TableRow className={classes.table}>
                {headCells.map((headCell) => (
                  <>
                    {headCell.id !== "location" ? (
                      <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        style={
                          headCell.id === "hasAttachment"
                            ? { width: "30px" }
                            : columnWidth[headCell.id] > 0
                            ? { width: `${columnWidth[headCell.id]}px` }
                            : null
                        }
                        className={classes.headingSort}
                        data-id="from"
                        id={headCell.id}
                      >
                        <TableSortLabel
                          active={emailOrder === headCell.key}
                          direction={
                            emailOrderBy === headCell.key ? emailOrder : "asc"
                          }
                          onClick={() => handleEmailRequestSort(headCell.key)}
                        >
                          {headCell.id === "hasAttachment" ? (
                            <FaPaperclip size={12} />
                          ) : (
                            <>
                              {props.isListCoversationOpen
                                ? getConversationHeaderLabel(headCell.id)
                                : !props.IsSearchState ||
                                  !props.ConversationView ||
                                  props.searchEmailDatas.length < 1
                                ? headCell.label
                                : "this is null"}
                            </>
                          )}
                        </TableSortLabel>

                        <div
                          className="resizable-header"
                          ref={refs[headCell.id]}
                          onMouseDown={(event) =>
                            onMouseDownResize(event, headCell.id)
                          }
                        >
                          <span></span>
                        </div>
                      </TableCell>
                    ) : null}
                  </>
                ))}

                {props.ConversationView ||
                (props.IsSearchState && !props.isListCoversationOpen) ? (
                  <TableCell
                    align="left"
                    padding="none"
                    className={classes.headingSort}
                    data-id="from"
                    id="location"
                  >
                    <TableSortLabel
                      active={emailOrder === "location"}
                      direction={
                        emailOrderBy === "location" ? emailOrder : "asc"
                      }
                      onClick={() => handleEmailRequestSort("location")}
                    >
                      {getConversationHeaderLabel("location")}
                    </TableSortLabel>
                    <div
                      className="resizable-header"
                      ref={refs["location"]}
                      onMouseDown={(event) =>
                        onMouseDownResize(event, "location")
                      }
                    >
                      <span></span>
                    </div>
                  </TableCell>
                ) : null}

                <TableCell
                  align="left"
                  padding="none"
                  className={classes.buttons}
                >
                  <span>Actions</span>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {props.isListCoversationOpen && convData.length > 0 ? (
                <>
                  {sortedConversationDatas
                    .slice(
                      conversationPage * conversationRowsPerPage,
                      conversationPage * conversationRowsPerPage +
                        conversationRowsPerPage
                    )
                    .map((row, index) => {
                      return renderTableRow(
                        row,
                        index,
                        props.isListCoversationOpen,
                        sendDateRes
                      );
                    })}
                </>
              ) : props.isListCoversationOpen && convData.length === 0 ? (
                <>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell style={{ fontSize: "11px" }}>
                    No List Conversation
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </>
              ) : props.searchEmailDatas.length > 0 ? (
                <>
                  {sortedSearchEmailsData
                    // .slice(
                    //   conversationPage * conversationRowsPerPage,
                    //   conversationPage * conversationRowsPerPage +
                    //     conversationRowsPerPage
                    // )
                    .map((row, index) => {
                      return renderTableRow(
                        row,
                        index,
                        props.isListCoversationOpen,
                        sendDateRes
                      );
                    })}
                </>
              ) : props.recentAccesses.length > 0 ? (
                <>
                  {sortedRecentlyAccessedDatas
                    // .slice(
                    //   conversationPage * conversationRowsPerPage,
                    //   conversationPage * conversationRowsPerPage +
                    //     conversationRowsPerPage
                    // )
                    .map((row, index) => {
                      return renderTableRow(
                        row,
                        index,
                        props.isListCoversationOpen,
                        sendDateRes
                      );
                    })}
                </>
              ) : sortedEmailsData.length > 0 ? (
                <>
                  {sortedEmailsData
                    // .slice(
                    //   conversationPage * conversationRowsPerPage,
                    //   conversationPage * conversationRowsPerPage +
                    //     conversationRowsPerPage
                    // )
                    .map((row, index) => {
                      return renderTableRow(
                        row,
                        index,
                        props.isListCoversationOpen,
                        sendDateRes
                      );
                    })}
                </>
              ) : (
                <TableRow style={{ height: "100%" }}>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>No Emails was found</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {Totalcount > 0 && (
          <TableFooter className={classes.tableFooter}>
            <TableRow>
              <TablePagination
                className={`material-ui-table-pagination ${classes.tableFooter} `}
                rowsPerPageOptions={[5, 30, 50, 100]}
                count={Totalcount}
                onPageChange={(event, tablePage) => {
                  setRecordfrom(tablePage + 1);
                  setPageNumber(tablePage + 1);
                }}
                page={PageNumber - 1}
                rowsPerPage={Pagelimit}
                onRowsPerPageChange={(event) => {
                  setPagelimit(event.target.value);
                  setRecordfrom(1);
                  setPageNumber(1);
                }}
                showFirstButton
                showLastButton
              />
            </TableRow>
          </TableFooter>
        )}
        {isEmailsListingOverflowed && MaxcountReach ? (
          <div
            className="card pagination_card font-weight-bold"
            style={{ height: "40px" }}
          >
            <span className="mt-2">
              {" "}
              Showing the top {Maxcount} emails in this folder
            </span>
          </div>
        ) : null}
        {conversationPopUp}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={alertOpen}
          autoHideDuration={7500}
          onClose={() => setAlertOpen(false)}
          key={"top center"}
        >
          <Alert
            severity="error"
            elevation={6}
            onClose={() => setAlertOpen(false)}
          >
            {ErrorMessage}
          </Alert>
        </Snackbar>
      </div>
    </React.Fragment>
  );
}
EmailsSection.propTypes = {
  FolderIDSelected: PropTypes.string.isRequired,
  ContentIDChanged: PropTypes.func.isRequired,
  showAsConversation: PropTypes.bool.isRequired,
};
export default EmailsSection;
