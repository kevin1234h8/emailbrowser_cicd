import React, { useRef, useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import { FaPaperclip } from "react-icons/fa";
import Collapse from "@material-ui/core/Collapse";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import AGOApi from "../../api/AGOApi";
import moment from "moment";
import TablePagination from "@material-ui/core/TablePagination";
import { makeStyles } from "@material-ui/core/styles";
import Cookies from "universal-cookie";
import { LinearProgress } from "@mui/material";
import { GrStatusWarning } from "react-icons/gr";

const { Config } = require("../common/AppConfig");
const config = Config();

const headCells = [
  {
    id: "hasAttachment",
    numeric: false,
    disablePadding: true,
    label: "hasAttachment",
    sortedColumn: "OTEmailHasAttachments",
  },
  {
    id: "from",
    numeric: false,
    disablePadding: true,
    label: "From",
    sortedColumn: "OTEmailFrom",
  },
  {
    id: "subject",
    numeric: false,
    disablePadding: true,
    label: "Subject",
    sortedColumn: "OTEmailSubject",
  },
  {
    id: "to",
    numeric: false,
    disablePadding: true,
    label: "To",
    sortedColumn: "OTEmailTo",
  },
  {
    id: "sent",
    numeric: false,
    disablePadding: true,
    label: "Sent",
    sortedColumn: "OTEmailSentDate",
  },
];

const cookies = new Cookies();

export default function BasicTable(props) {
  const [htmlContent, setHtmlContent] = useState("");
  const [htmlContentLoading, setHtmlContentLoading] = useState(false);
  const [convData, setConvData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [canSeeContent, setCanSeeContent] = useState(true);
  const [columnWidth, setColumnWidth] = useState({
    from: 216,
    subject: 264,
    to: 160,
    sent: 200,
  });
  const tableRef = useRef(null);

  const useStyles = makeStyles({
    iconCloseButton: {
      color: "white",
    },
    root: {
      width: "100%",
    },
    contentHeader: {
      "&>h2": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      background:
        "linear-gradient(61deg, #090e2c 0, #122c69 59%, #078db3 100%)",
      backgroundColor: "#111b58",
      backgroundAttachment: "fixed",
      color: "white",
    },
    container: {
      height: "100%",
    },
    head: {
      backgroundColor: "#DFDFDF",
    },
    row: {
      "& > *": {
        borderBottom: "unset",
      },
      fontSize: "15px",
    },
    buttons: {
      fontWeight: "bold",
      width: "105px",
      whiteSpace: "nowrap",
      "& > button": {
        padding: "6px",
        backgroundColor: "rgb(25, 118, 210)",
        color: "white",
        margin: "2px",
      },
    },
    headingSort: {
      fontWeight: "bold",
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
    tableFooter: {
      position: "sticky",
      bottom: 0,
      background: "white",
      border: "1px solid rgba(224, 224, 224, 1)",
    },
  });

  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      const response = await AGOApi.getConversation(
        props.nodeID,
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
        setConvData(data);
        setTableData(
          data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        );
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let data = convData;
    setTableData(
      data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [page, rowsPerPage]);

  const setCollapsed = (value, index) => {
    // Close all previously opened preview
    for (const prop in open) {
      if (prop != index) {
        open[prop] = false;
      }
    }

    setOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const previewContent = async (row) => {
    setHtmlContentLoading(true);

    const canSeeContent = true;
    // const canSeeContent = row.PermSeeContents;
    // setCanSeeContent(canSeeContent);

    if (canSeeContent) {
      const username = cookies.get("uid");
      const res = await AGOApi.getEmailHtmlPreview(row.NodeID, username);
      setHtmlContent(res.data);
    }

    setHtmlContentLoading(false);
  };

  const AttachmentClicked = (e, row) => {
    e.stopPropagation();
    //AttachmentSectionToggle(row);
    let nodeId = row.NodeID;
    window.open(
      config.REACT_APP_FRAME_ATTACHMENT + nodeId + "&noClose=false",
      "Attachments_" + nodeId,
      "width=800,height=600,resizable=yes,scrollbars=yes,menubar=no"
    );
  };

  const downloademail = (e, row) => {
    if (row.NodeID > 0) {
      let url = "".concat(
        config.REACT_APP_DOWNLOAD_URL_1,
        row.NodeID.toString(),
        config.REACT_APP_DOWNLOAD_URL_2
      );
      window.open(url, "_blank");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerpage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const username = cookies.get("uid");

  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth={"xl"}
      scroll={"body"}
      onClose={props.closeDialog}>
      <DialogTitle className={classes.contentHeader}>
        <h4>List Conversations</h4>
        <IconButton aria-label="close" onClick={props.closeDialog}>
          <CloseIcon className={classes.iconCloseButton} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} className={classes.container}>
          {isLoading ? <LinearProgress /> : null}
          <Table aria-label="conversation" ref={tableRef} stickyHeader>
            <TableHead>
              <TableRow className={classes.table}>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={
                      headCell.id == "hasAttachment"
                        ? "center"
                        : headCell.numeric
                        ? "right"
                        : "left"
                    }
                    padding={headCell.disablePadding ? "none" : "normal"}
                    style={
                      headCell.id == "hasAttachment" ? { width: "85px" } : null
                    }
                    className={classes.headingSort}
                    id={headCell.id}>
                    {headCell.id == "hasAttachment" ? (
                      <FaPaperclip size={12} />
                    ) : (
                      <>{headCell.label}</>
                    )}
                  </TableCell>
                ))}
                <TableCell
                  align="left"
                  padding="none"
                  className={classes.buttons}>
                  <>Actions</>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {convData.length > 0 &&
                tableData.map((row, index) => (
                  <>
                    <TableRow
                      hover
                      className={classes.row}
                      key={row.name + row.NodeID}
                      onClick={(e) => {
                        setCollapsed(!row.open, index);
                        previewContent(row);
                      }}>
                      <TableCell align="center" padding="none">
                        <IconButton aria-label="expand email" size="small">
                          {open[index] ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                        &emsp;
                        {row.HasAttachments > 0 && (
                          <IconButton
                            size="small"
                            onClick={(e) => AttachmentClicked(e, row)}>
                            <FaPaperclip className="clickable" size={12} />
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell align="left" padding="none">
                        {row.EmailFrom}
                      </TableCell>
                      <TableCell align="left" padding="none">
                        {row.EmailSubject}
                      </TableCell>
                      <TableCell align="left" padding="none">
                        {row.EmailTo}
                      </TableCell>
                      <TableCell align="left" padding="none">
                        {moment(row.SentDate).format("ddd DD-MMM-YYYY hh:mm A")}
                      </TableCell>
                      <TableCell align="left" padding="none">
                        <IconButton
                          aria-label="download email"
                          size="small"
                          onClick={(e) => {
                            setCollapsed(!row.open, index);
                            downloademail(e, row);
                          }}>
                          <GetAppRoundedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          paddingBottom: 0,
                          paddingTop: 0,
                          height: "100%",
                        }}
                        colSpan={6}>
                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                          <Box
                            margin={1}
                            style={{ height: "80vh", overflow: "auto" }}>
                            {htmlContentLoading ? <LinearProgress /> : null}
                            {
                              canSeeContent && !htmlContentLoading ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: htmlContent,
                                  }}
                                />
                              ) : null
                              // <div style={{display: "flex", justifyContent: "center",
                              // alignItems: "center", height: "100%"}}>
                              //   <GrStatusWarning size={24} />&nbsp;&nbsp;
                              //   <b>You don't have the permission to see the content</b>
                              // </div>
                            }
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={convData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerpage}
        />
      </DialogContent>
    </Dialog>
  );
}
