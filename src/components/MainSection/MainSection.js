import React, { useState, useEffect, useRef } from "react";
import "./MainSection.scss";
// import { motion } from "framer-motion";
import FolderTreeSection from "../FolderTreeSection/FolderTreeSection";
import EmailsSection from "../EmailsSection/EmailsSection";
import ContentSection from "../ContentSection/ContentSection";
import SplitPane from "react-split-pane";
import queryString from "query-string";
import SearchIcon from "../assets/icons/search_header_white.svg";
import SearchDropdown from "../assets/icons/caret_down_white.svg";
import LogoutIcon from "../assets/icons/logout.svg";
import ClearInput from "../assets/icons/formfield_clear24.svg";
import HomeButton from "../assets/icons/home.svg";
import Breadcrumb from "../assets/icons/breadcrumb_arrow.svg";
// import {  useNavigate } from "react-router-dom";
// import { withRouter, useHistory } from "react-router-dom";
import { withRouter } from "../WithRouter";
import { useHistory } from "../../hooks/useHistory";

import { Navigate, NavLink, useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";
import { isIE } from "react-device-detect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { set, isObject } from "lodash";
import moment from "moment";
import Axios from "axios";
import AGOApi, { getOTCSTicket } from "../../api/AGOApi";
import { jwtDecode } from "jwt-decode";
import AutocompleteSearch from "./AutocompleteSearch";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@mui/material";
import Loader from "../common/Loader";
import axios from "axios";
import AppJpeg from "../../components/assets/appjpeg.gif";
import AppPng from "../../components/assets/doc.gif";
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
import { Toc } from "@mui/icons-material";
// import { withRouter } from "react-router-dom";
const { Config } = require("../common/AppConfig");
const config = Config();

const cookies = new Cookies();

// Advance Search Default
// let initialFromDate = `${new Date().getFullYear()}-${(
//   "0" +
//   (new Date().getMonth() )
// ).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;
// let initialToDate = `${new Date().getFullYear()}-${(
//   "0" +
//   (new Date().getMonth() )
// ).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;
let initialFromDate = new Date(moment().subtract(1, "months"));
let initialToDate = new Date(moment());
let searchIn = "All";
let Containattachment = "UNDEFINED";
let advancesearchstart = false;
//let folderfullpathlist = [];
let foldermaxwidth = 0;
let emailminwidth = 0;

function MainSection(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showSearchListFolderLocation, setShowSearchListFolderLocation] =
    useState(false);
  // const showSearchListFolderLocation = config.SHOW_SEARCH_LIST_FOLDER_LOCATION;
  const [userInfos, setUserInfos] = useState([]);
  const [openProfile, setOpenProfile] = useState(false);
  const [showEmailSummaryContent, setShowEmailSummaryContent] = useState(false);
  const [emailSummary, setEmailSummary] = useState("");
  const [emailAttachments, setEmailAttachments] = useState([]);
  const [showEmailAttactments, setShowEmailAttactments] = useState(false);
  const [
    listConversationEmailAttachments,
    setlistConversationEmailAttachments,
  ] = useState([]);
  const [
    showListConversartionEmailAttactments,
    setShowListConversartionEmailAttactments,
  ] = useState(false);
  const [emailName, setEmailName] = useState("");

  const [count, setCount] = useState(0);
  const [BreadcrumbId, setBreadcrumbId] = useState("");
  const [renderPurose, setRenderPurose] = useState(false);
  const [ReceivedFrom, setReceivedFrom] = useState(initialFromDate);
  const [ReceivedTo, setReceivedTo] = useState(initialToDate);
  const [advanceSearchIn, setSearchIn] = useState(searchIn);
  const [useAdvanceSearch, setUseAdvanceSearch] = useState(false);
  const [advanceContainattachment, setadvanceContainattachment] =
    useState(Containattachment);
  const [attachmentFileName, setattachmentFileName] = useState("");
  const [advanceSearchFrom, setadvanceSearchFrom] = useState("");
  const [advanceSearchSubject, setadvanceSearchSubject] = useState("");
  const [advanceSearchTo, setadvanceSearchTo] = useState("");
  const [advanceSearchEnable, setadvanceSearchEnable] = useState(false);
  const [showAdvanceSearchForm, setshowAdvanceSearchForm] = useState(false);
  const [previousKeyword, setPreviouskeyword] = useState("");
  const [firstRefresh, setFirstRefresh] = useState(false);
  const [previousSearchtype, setprevioussearchtype] = useState("");

  // End Search
  const [goBacklink, setgoBacklink] = useState("");
  const [Previouslink, setPreviouslink] = useState("");
  const [ConversationId, setConversationId] = useState(false);

  // const [folderIDSelected, setFolderIDSelected] = useState("969344");
  const [folderIDSelected, setFolderIDSelected] = useState(
    localStorage.getItem("pervNodeID")
  );
  // const [folderIDSelected, setFolderIDSelected] = useState("2000");
  const [contentIDSelected, setContentIDSelected] = useState(-1);
  const [emailSelected, setEmailSelected] = useState({});
  const [SearchType, setSearchType] = useState("All");
  const [previousContentIDSelected, setPreviousContentIDSelected] =
    useState(-1);
  const [positionBeforeEmails, setPositionBeforeEmails] = useState("");
  const [positionAfterEmails, setPositionAfterEmails] = useState("");
  const [panelHidden, setPannelHidden] = useState(true);
  const [ShowFolderID, setShowFolderID] = useState("");
  const [Searchbarshow, setSearchbarshow] = useState(false);
  const [ConversationView, setConversationView] = useState(false); // know the currentview purpose
  const [FolderView, setFolderView] = useState(false);
  const [FolderClick, setFolderClick] = useState(false);
  const [SearchContent, setSearchContent] = useState("");
  const [SearchKeyword, setSearchKeyword] = useState("");
  const [Email, setEmail] = useState({});
  const [IsSearchState, setIsSearchState] = useState(false);
  const [Search, setSearch] = useState(false);
  const [searchEmails, setSearchEmails] = useState(true);
  const [searchArchive, setSearchArchive] = useState(true);
  const [searchLocation1, setSearchLocation1] = useState(null);
  const [searchLocation2, setSearchLocation2] = useState(null);
  const [searchLocation3, setSearchLocation3] = useState(null);
  const [searchLocation4, setSearchLocation4] = useState(null);
  const [clearSearchLocation, setClearSearchLocation] = useState(false);
  const [defualtFolder, setDefaultFolder] = useState([
    { Name: "-", NodeID: "-" },
    { Name: "-", NodeID: "-" },
  ]);
  const [permissions, setPermissions] = useState({});
  let [folderfullpathlist, setFolderfullpathlist] = useState([]);
  const [folderLoading, setFolderLoading] = useState(false);
  const [userInfo, setUsetUserInfo] = useState();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [previewWidth, setPreviewWidth] = useState(0);

  const [canSeeContent, setCanSeeContent] = useState(true);

  const loading = open && options.length === 0;

  const [showAsConversation, setShowAsConversation] = React.useState(true);
  const textInput = useRef(null);
  const emailBrowserContent = useRef(null);
  const [isEmailContentExists, setIsEmailContentExists] = useState(false);
  const [isPaneOneOpen, setIsPaneOneOpen] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [isListCoversationOpen, setIsListConversationOpen] = useState(false);
  const [treeViewDefaultExpandedFolders, setTreeViewDefaultExpandedFolders] =
    useState([]);
  const [recentAccesses, setRecentAccesses] = useState([]);
  const [favoriteFolders, setFavoriteFolders] = useState([]);
  const [selected, setSelected] = useState(localStorage.getItem("pervNodeID"));
  const emailAttachmentTableHeaders = ["Type", "Name", "Size", "Functions"];
  const [openAttachmentNodeIDs, setOpenAttachmentNodeIDs] = useState({});
  const [userPhoto, setUserPhoto] = useState(null);
  const ticket = getOTCSTicket();
  let userNodeId = cookies.get("OTUID");
  if (userNodeId == -1) {
    userNodeId = 1000;
  }

  useEffect(() => {
    const getEmailBrowserSummarizerApiBaseUri = async () => {
      try {
        const res = await axios.get(
          `${window.location.origin}/emailbrowserapi/api/v1/emails/GetEmailBrowserSummarizerApiBaseUri`
        );
        console.log("getEmailBrowserSummarizerApiBaseUri res", res);
        sessionStorage.setItem("summarizer-base-uri", res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getEmailBrowserSummarizerApiBaseUri();
  }, []);

  useEffect(() => {
    const getCustomConfig = async () => {
      try {
        const res = await axios.get(
          `${window.location.origin}/img/customconfig.json`
        );
        console.log("getCustomConfig res", res);
        sessionStorage.setItem("custom-config", JSON.stringify(res.data));
      } catch (err) {
        console.log(err);
      }
    };
    getCustomConfig();
  }, []);

  useEffect(() => {
    const getShowSearchListFolderLocation = async () => {
      try {
        const res = await axios.get(
          `${config.REACT_APP_API_URL}/folders/GetShowSearchListFolderLocation`
        );
        if (res.status === 200) {
          setShowSearchListFolderLocation(res.data);
        }
      } catch (err) {
        setShowSearchListFolderLocation(false);
      }
    };
    getShowSearchListFolderLocation();
  }, []);

  useEffect(() => {
    const getUserInfos = async () => {
      try {
        const res = await axios
          .create({
            baseURL: config.OTCS_API_URL,
            withCredentials: false,
            headers: {
              Authorization: `Bearer ${cookies.get("otsession")}`,
            },
          })
          .get(`v1/members/${userNodeId}`);
        // const res = await axios.get(
        //   `${config.OTCS_API_URL}/v1/members/${userNodeId}`,
        //   {
        //     headers: { otcsticket: ticket },
        //   }
        // );
        setUserInfos(res.data.data);
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    getUserInfos();
  }, [ticket, userNodeId]);

  useEffect(() => {
    const getUserPhoto = async () => {
      if (!userInfos.photo_url) {
        setUserPhoto(userInfos.initials);
      } else {
        try {
          const res = await axios.get(
            `${config.OTCS_API_URL}/v1/members/${userNodeId}/photo`,
            { headers: { otcsticket: ticket }, responseType: "blob" }
          );

          const data = res.data;
          const reader = new FileReader();
          reader.onloadend = () => {
            setUserPhoto(reader.result);
          };
          reader.readAsDataURL(data);
        } catch (error) {
          console.error("Error fetching user photo:", error);
        }
      }
    };

    getUserPhoto();
  }, [userInfos, ticket, userNodeId]);

  const colorConfig = {
    colors: [
      "#414979",
      "#2e3d98",
      "#4f3690",
      "#e00051",
      "#006353",
      "#007599",
      "#147bbc",
      "#a0006b",
      "#ba004C",
    ],
  };

  const LetterAvatarColor = {
    getLetterAvatarColor: function (initials) {
      if (!initials) {
        return "";
      }

      var charIndex = 0,
        colourIndex = 0,
        initialsLen = initials.length;

      initials = initials?.toUpperCase();

      for (var i = 0; i < initialsLen; i++) {
        charIndex += initials.charCodeAt(i);
      }
      colourIndex = parseInt(charIndex.toString().split("").pop());
      colourIndex = colourIndex === 9 ? colourIndex - 1 : colourIndex;

      return colorConfig.colors[colourIndex];
    },
  };

  const initials = cookies.get("uid")?.charAt(0);
  const colorForInitials = LetterAvatarColor.getLetterAvatarColor(
    cookies.get("uid").substring(0, 2)
  );

  const getEmailAttachments = async (nodeId) => {
    const ticket = getOTCSTicket();
    const username = cookies.get("uid");
    try {
      const res = await axios.get(
        `${config.REACT_APP_API_URL}/attachments?id=${nodeId}&username=${username}`,
        { headers: { otcsticket: ticket } }
      );
      // if (res.status === 200) {
      //   setEmailAttachments(res.data);
      // }
      if (res.status === 200) {
        setEmailAttachments((prevAttachments) => [
          ...prevAttachments,
          { nodeId, attachments: res.data },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getEmailName = async (nodeId) => {
    const ticket = getOTCSTicket();
    try {
      const res = await axios.get(
        `${config.REACT_APP_API_URL_VERSION_TWO}/nodes/${nodeId}`,
        { headers: { otcsticket: ticket } }
      );
      if (res.status === 200) {
        setEmailName(res.data.results.data.properties.name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseEmailAttachments = () => {
    setShowEmailAttactments(false);
    setEmailAttachments([]);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const useStyles = makeStyles((theme) => ({
    splitPane: {
      "&>div.Pane.vertical.Pane2": {
        width: 0,
      },
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      if (cookies.get("otsession")) {
        const token = cookies.get("otsession");
        const decodeToken = jwtDecode(token);
        setUsetUserInfo(decodeToken);
      } else {
        // props.navigate("/error");
      }
      // if (!cookies.get("OTUID")) {
      const username = cookies.get("uid");
      const userID = await AGOApi.getUserId(username);

      cookies.set("OTUID", userID?.data, { secure: false });
      // }

      //validate session Cookies
      // if(cookies.get("CSingleSessionCookie")){
      //   const cookieValue = cookies.get("CSingleSessionCookie")
      //   const userID = cookies.get("OTUID")
      //   await Axios.get(config.REACT_APP_PERMMANAGER_URL+`/singlesession/validate?userID=${userID}&cookieVal=${cookieValue}`)
      //   .then(res =>{
      //     if(res !== null){
      //       res.data ? props.navigate("/browser") : props.navigate("/error#session")
      //     }
      //   })
      // }else{
      //   generateCookieSession();
      // }
      //getDefault folder for Serach
      if (cookies.get("uid")) {
        const defaultAllowedFolder = await AGOApi.getDefaultFolder(
          cookies.get("uid")
        );
        // const defaultAllowedFolder = await AGOApi.getDefaultFolder("wilson");
        defaultAllowedFolder !== null
          ? setDefaultFolder(defaultAllowedFolder.data)
          : props.navigate("/error#config-default-folder-error");
      }
      if (cookies.get("emailwidth")) {
        setPositionAfterEmails(cookies.get("emailwidth"));
      } else {
        // setPositionAfterEmails(window.innerWidth * (70/100))
      }
      if (cookies.get("folderwidth")) {
        setPositionBeforeEmails(cookies.get("folderwidth"));
      } else {
        // setPositionBeforeEmails(window.innerWidth * (15/100));
      }

      setIsLoading(false);
    };
    fetchData();
  }, [cookies]);

  useEffect(() => {
    if (emailBrowserContent.current) {
      setPreviewWidth(emailBrowserContent.current.splitPane.offsetWidth / 2);
    }
  }, [emailBrowserContent.current]);

  const generateCookieSession = () => {
    const guid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => {
      return (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16);
    });
    const value = guid + new Date().getTime();
    const userID = cookies.get("OTUID");
    Axios.get(
      config.REACT_APP_PERMMANAGER_URL +
        `/singlesession/validate?userID=${userID}&cookieVal=${value}`
    ).then((res) => {
      if (res !== null) {
        res.data
          ? cookies.set("CSingleSessionCookie", value, { path: "/" })
          : props.navigate("/error#session");
      }
    });
  };
  const logoutSession = async () => {
    // const cookieValue = cookies.get("CSingleSessionCookie");
    const userID = cookies.get("OTUID");
    Axios.get(
      config.REACT_APP_PERMMANAGER_URL +
        `/singlesession/endsession?userID=${userID}`
    ).then((res) => {
      cookies.remove("CSingleSessionCookie", { path: "/" });
      cookies.remove("uid", { path: "/" });
      cookies.remove("OTUID");
      cookies.remove("otsession");
      props.navigate("/logout");
    });
  };
  // const logoutSession = async () => {
  //   const cookieValue = cookies.get("CSingleSessionCookie");
  //   const userID = cookies.get("OTUID");
  //   // Axios.get(
  //   //   config.REACT_APP_PERMMANAGER_URL +
  //   //     `/singlesession/endsession?userID=${userID}&cookieVal=${cookieValue}`
  //   // ).then((res) => {
  //   //   cookies.remove("CSingleSessionCookie", { path: "/" });
  //   //   cookies.remove("uid", { path: "/" });
  //   //   cookies.remove("OTUID");
  //   //   cookies.remove("otsession");
  //   //   props.navigate("/logout");
  //   // });
  //   // cookies.remove("CSingleSessionCookie", { path: "/" });
  //   // props.navigate("/logout");
  //   navigate("/logout");
  //   cookies.remove("uid", { path: "/" });
  //   cookies.remove("OTUID");
  //   cookies.remove("otsession");
  // };

  function FolderIDChanged(id) {
    if (folderIDSelected === id) {
      setFolderClick(!FolderClick);
    }
    setPreviouslink(goBacklink !== "folder" ? goBacklink : "");
    setFolderIDSelected(id);
    if (id === "2000") {
      setSearchIn("All");
    } else {
      setSearchIn("Current");
    }
    setPannelHidden(true);
    ContentIDChanged(-1, {});
    setFolderView(true);
    setIsSearchState(false);
    setadvanceSearchEnable(false);
    setshowAdvanceSearchForm(false);
    setPreviouskeyword(SearchContent);
    if (SearchContent === "") {
      setSearchbarshow(false);
      setSearchContent("");
    } else {
      setSearchbarshow(true);
      setSearchContent(SearchContent);
    }
    setConversationView(false);
    setgoBacklink("folder");
  }
  function ContentIDChanged(id, email = {}) {
    setContentIDSelected(id);
    setEmailSelected(email);
  }
  function HideContentSection() {
    setPreviousContentIDSelected(contentIDSelected);
    setContentIDSelected(-1); //-1 will force ContentSection to not render
  }
  function ShowContentSection() {
    setContentIDSelected(previousContentIDSelected);
  }
  function SizeChangedAfterEmails(size) {
    setPositionAfterEmails(parseInt(Math.round(size)));
    foldermaxwidth = "";
    if (size - positionBeforeEmails < window.innerWidth * (60 / 100)) {
      emailminwidth = size;
    }
    cookies.set("emailwidth", size);
    setPreviewWidth(emailBrowserContent.current.splitPane.offsetWidth - size);
  }
  function SizeChangedBeforeEmails(size) {
    setPositionBeforeEmails(parseInt(Math.round(size)));
    emailminwidth = "";
    if (positionAfterEmails - size < window.innerWidth * (50 / 100)) {
      foldermaxwidth = size;
    }
    cookies.set("folderwidth", size);
  }

  function UpdateSearch() {
    setSearch(false);
    advancesearchstart = false;
  }

  function UpdateConversationView(value) {
    setFolderView(false);
    setConversationId(value);
    setPreviouslink(goBacklink);
    setConversationView(true);
    setgoBacklink("conversation");
    setIsSearchState(false);
    setadvanceSearchEnable(false);
    setSearchbarshow(false);
    setPreviouskeyword(SearchContent);
    setSearchContent("");
    setshowAdvanceSearchForm(false);
    if (window.location.search !== "") props.navigate("/browser");
  }

  useEffect(() => {
    if (Searchbarshow) {
      textInput.current.focus();
    }
  }, [Searchbarshow]);

  function clearInput() {
    setSearchContent("");
  }

  function showEmailFolder(value) {
    setShowFolderID(value);
    setIsSearchState(false);
    // setConversationView(false);
  }

  function SearchBar(type, keyword, from) {
    setprevioussearchtype(type);
    if (!Searchbarshow && from !== "previous") {
      setSearchbarshow(true);
    } else if (
      keyword !== "" ||
      (advancesearchstart && type === "advanceSearch")
    ) {
      setPreviouslink(goBacklink);
      setIsSearchState(true);
      setSearch(true);
      setSearchKeyword(keyword);
      setConversationView(false);
      setFolderView(false);
      setgoBacklink("search");
      if (window.location.search !== "") props.navigate("/browser");
    }
  }

  function SelectOptionforSearch(e) {
    if (e.target.id === "myadvancesearchattach") {
      var y = document.getElementById("myadvancesearchattach").value;
      setadvanceContainattachment(y);
    }
    if (e.target.id === "myadvancesearchin") {
      var z = document.getElementById("myadvancesearchin").value;
      setSearchIn(z);
    }
  }

  function advanceSearchFormReset() {
    setReceivedFrom(initialFromDate);
    setReceivedTo(initialToDate);
    setSearchIn(folderIDSelected === "2000" ? "All" : "Current");
    setadvanceContainattachment(Containattachment);
    setattachmentFileName("");
    setadvanceSearchFrom("");
    setadvanceSearchSubject("");
    setadvanceSearchTo("");
    setClearSearchLocation(true);
    setSearchEmails(true);
    setSearchArchive(true);
    // advanceSearchEnable
    //   ? (advancesearchstart = true)
    //   : (advancesearchstart = false);
    //SearchBar("advanceSearch", SearchContent);
  }

  function handleSearchBar(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      setUseAdvanceSearch(false);
      SearchBar("search", SearchContent);

      //Remove Search Cache ID from localstorage to reset the cache id
      sessionStorage.removeItem("searchCacheId");
      sessionStorage.setItem("resetSearch", "true");
    }
  }

  function showEmailFolderIDUpdate() {
    setShowFolderID("");
  }

  function OnHandleSubmit(e) {
    setadvanceSearchEnable(true);
    e.preventDefault();
    setshowAdvanceSearchForm(false);
    advancesearchstart = true;
    SearchBar("advanceSearch", SearchContent);

    //Remove Search Cache ID from localstorage to reset the cache id
    sessionStorage.removeItem("searchCacheId");
  }

  function advancesearchDate(e) {
    if (e.target.id === "todate") {
      setReceivedTo(e.target.value);
    }
    if (e.target.id === "fromdate") {
      setReceivedFrom(e.target.value);
    }
  }

  function folderFullpath(value) {
    setFolderfullpathlist = value;
    setRenderPurose(!renderPurose);
  }

  function outsideclick(event) {
    if (
      // Internet Explorer 11 cannot detect the target id, that's why when "Show as conversation" button is clicked, the page become blank
      event.target.id !== "search" &&
      event.target.id !== "advancesearch" &&
      event.target.id !== "clear" &&
      event.target.id !== "myinput" &&
      event.target.id !== "myselect" &&
      event.target.id !== "myadvancesearchin" &&
      event.target.id !== "myadvancesearchattach" &&
      event.target.id !== "formlabel" &&
      event.target.id !== "todate" &&
      event.target.id !== "searchdefault1" &&
      event.target.id !== "searchdefault2" &&
      event.target.id !== "search1" &&
      event.target.id !== "search2" &&
      event.target.id !== "search3" &&
      event.target.id !== "search4" &&
      //for IE11, as for some reason, it can't detect the target id
      event.target.parentElement?.id !== "search" &&
      event.target.parentElement?.id !== "advancesearch" &&
      event.target.parentElement?.id !== "clear" &&
      event.target.parentElement?.id !== "myinput" &&
      event.target.parentElement?.id !== "myselect" &&
      event.target.parentElement?.id !== "myadvancesearchin" &&
      event.target.parentElement?.id !== "myadvancesearchattach" &&
      event.target.parentElement?.id !== "formlabel" &&
      event.target.parentElement?.id !== "todate" &&
      event.target.parentElement?.id !== "fromdate"
    ) {
      if (
        event.target.className &&
        typeof event.target.className.includes !== "undefined" &&
        event.target.className.includes("datepicker") === false
      ) {
        if (!showAdvanceSearchForm) {
          if (SearchContent === "") {
            setSearchbarshow(false);
            // setshowAdvanceSearchForm(true);
            //setClearSearchLocation(true);
          } else {
            setSearchbarshow(true);
            //setClearSearchLocation(true);
          }
        }
      }
    }
  }

  function homeClick() {
    window.open(config.REACT_APP_HOME_URL, "_self");
  }

  const Breadcrumbclick = async (id) => {
    const username = cookies.get("uid");
    try {
      const res = await axios.get(
        `${config.REACT_APP_API_URL}/folders/navigationpath/${id}?userName=${username}`
      );
      const nodeIDs = res.data.map((item) => item.NodeID);
      nodeIDs.reverse();
      const result = nodeIDs.join(",");
      sessionStorage.setItem("listNodeID", result);
    } catch (err) {
      console.log(err);
    }
    setBreadcrumbId(id);
  };

  function isSearchLocationFilled() {
    return (
      isObject(searchLocation1) ||
      isObject(searchLocation2) ||
      isObject(searchLocation3) ||
      isObject(searchLocation4)
    );
  }
  const [hasExecuted, setHasExecuted] = useState(false);
  const [searchBreadcrumb, setSearchBreadcrumb] = useState([]);

  function Breadcrump() {
    let length = folderfullpathlist.length;
    if (length > 0) {
      const selectedProperties = folderfullpathlist.map((item) => item.Name);
      const nodeIDs = folderfullpathlist.map((node) => String(node.NodeID));
      const joinedString = selectedProperties.join("/");
      sessionStorage.setItem("navigationPath", joinedString);
    }

    if (searchBreadcrumb.length > 0) {
      const selectedProperties = searchBreadcrumb.map((item) => item.Name);
      const nodeIDs = searchBreadcrumb.map((node) => String(node.NodeID));
      const joinedString = selectedProperties.join("/");
      sessionStorage.setItem("navigationPath", joinedString);
      return searchBreadcrumb && searchBreadcrumb.length ? (
        searchBreadcrumb.map((item, i) => {
          if (i === length - 1) {
            return i === 0 ? (
              <span style={{ color: "#c3e5f6" }} key={i}>
                {item.Name}
                {folderLoading ? " Loading.." : ""}
              </span>
            ) : (
              <span className="ml-2 breadcrumb-container" key={i}>
                {/* <img src={Breadcrumb} alt=""></img> */}
                <div className="breadcrumb-divider">/</div>
                <span
                  className={`ml-2  sub-bread-crumb`}
                  style={{ color: "#c3e5f6" }}
                  key={i}
                >
                  {" "}
                  {item.Name}
                </span>
                {folderLoading ? " Loading.." : ""}
              </span>
            );
          } else {
            return i === 0 ? (
              <span
                onClick={() => Breadcrumbclick(item.NodeID)}
                className="breadcrumbstyle "
                key={i}
              >
                {item.Name}
              </span>
            ) : (
              <span
                className="ml-2 sub-bread-crumb breadcrumb-container"
                key={i}
              >
                {/* <img src={Breadcrumb} alt=""></img> */}
                <div className="breadcrumb-divider">/</div>
                <span
                  className="ml-2  breadcrumbstyle sub-bread-crumb"
                  key={i}
                  onClick={() => Breadcrumbclick(item.NodeID)}
                >
                  {" "}
                  {item.Name}
                </span>
              </span>
            );
          }
        })
      ) : FolderView ? (
        <span style={{ color: "#c3e5f6" }}>Email in folder </span>
      ) : (
        <span style={{ color: "rgba(0,0,0,.25)" }}>Email in folder </span>
      );
    }

    return folderfullpathlist && folderfullpathlist.length ? (
      folderfullpathlist.map((item, i) => {
        if (i === length - 1) {
          return i === 0 ? (
            <span style={{ color: "#c3e5f6" }} key={i}>
              {item.Name}
              {folderLoading ? " Loading.." : ""}
            </span>
          ) : (
            <span className="ml-2  breadcrumb-container" key={i}>
              {/* <img src={Breadcrumb} alt=""></img> */}
              <div className="breadcrumb-divider">/</div>
              <span
                className={`ml-2  sub-bread-crumb`}
                style={{ color: "#c3e5f6" }}
                key={i}
              >
                {" "}
                {item.Name}
              </span>
              {folderLoading ? " Loading.." : ""}
            </span>
          );
        } else {
          return i === 0 ? (
            <span
              onClick={() => Breadcrumbclick(item.NodeID)}
              className="breadcrumbstyle"
              key={i}
            >
              {item.Name}
            </span>
          ) : (
            <span className="ml-2 sub-bread-crumb breadcrumb-container" key={i}>
              {/* <img src={Breadcrumb} alt=""></img> */}
              <div className="breadcrumb-divider">/</div>
              <span
                className="ml-2  breadcrumbstyle sub-bread-crumb"
                key={i}
                onClick={() => Breadcrumbclick(item.NodeID)}
              >
                {" "}
                {item.Name}
              </span>
            </span>
          );
        }
      })
    ) : FolderView ? (
      <span style={{ color: "#c3e5f6" }}>Email in folder </span>
    ) : (
      <span style={{ color: "rgba(0,0,0,.25)" }}>Email in folder </span>
    );
  }

  function previousgo() {
    if (Previouslink === "search") {
      setSearchContent(previousKeyword);
      if (previousSearchtype === "advanceSearch") {
        advancesearchstart = true;
        setadvanceSearchEnable(true);
      }
      SearchBar(previousSearchtype, previousKeyword, "previous");
    } else {
      setConversationView(true);
      setgoBacklink("conversation");
    }

    if (goBacklink === "conversation") {
      setConversationView(false);
      setgoBacklink(Previouslink);
      if (Previouslink === "search") {
        setSearchContent(previousKeyword);
        if (previousSearchtype === "advanceSearch") {
          advancesearchstart = true;
          setadvanceSearchEnable(true);
        }
        SearchBar(previousSearchtype, previousKeyword, "previous");
      }
    } else if (goBacklink === "folder") {
      setFolderView(false);
      if (Previouslink === "search") {
        setSearchContent(previousKeyword);
        if (previousSearchtype === "advanceSearch") {
          advancesearchstart = true;
          setadvanceSearchEnable(true);
        }
        SearchBar(previousSearchtype, previousKeyword, "previous");
      } else {
        setConversationView(true);
        setgoBacklink("conversation");
      }
    }
    setPreviouslink("");
  }

  let userId = 0;

  try {
    let params = queryString.parse(window.location.search);
    let userIdFromQuery = params.userid;
    if (userIdFromQuery > 0) {
      userId = userIdFromQuery;
    }
  } catch (error) {
    //expected, no user id
  }

  //console.log("size", positionBeforeEmails, positionAfterEmails);

  const [htmlContent, setHtmlContent] = useState("");
  const [htmlContentLoading, setHtmlContentLoading] = useState(false);
  const [isContentSectionLoading, setIsContentSectionLoading] = useState(false);

  const previewContent = async (row, nodeid) => {
    setHtmlContentLoading(true);
    setIsContentSectionLoading(true);

    // const canSeeContent = true;
    // const canSeeContent = row.PermSeeContents;
    // setCanSeeContent(canSeeContent);
    setCanSeeContent(true);
    const username = cookies.get("uid");
    const res = await AGOApi.getEmailHtmlPreview(nodeid, username);
    try {
      if (res.status === 200) {
        setHtmlContent(res.data);
        setPannelHidden(false);
        setCanSeeContent(true);
        setHtmlContentLoading(false);
        setIsEmailContentExists(true);
        setIsContentSectionLoading(false);
      } else {
        setIsEmailContentExists(false);
        setIsContentSectionLoading(false);
        setCanSeeContent(false);
      }
    } catch (err) {
      // setIsEmailContentExists(false);
      setIsContentSectionLoading(false);
      setCanSeeContent(false);
    }
  };
  const emailPreviewRef = useRef(null);
  const [searchEmailDatas, setSearchEmailDatas] = useState([]);

  const [emailPreviewWidth, setEmailPreviewWidth] = useState(0);
  useEffect(() => {
    if (emailPreviewRef.current) {
      const elementWidth = emailPreviewRef.current.offsetWidth;
      setEmailPreviewWidth(elementWidth);
    }
  }, [emailPreviewRef]);
  const pane1Style = {
    // maxWidth: `${!panelHidden ? "66%" : "100%"}`,
    // width: "100%",
    width: !panelHidden ? "calc(100% - 400px)" : "100%",
  };

  const paneTwoContentSection = {
    width: "100%",
    overflow: "auto",
  };

  const emailSectionPane2Style = {
    // overflow: "auto",
  };

  useEffect(() => {
    if (window.performance) {
      // console.info("window.performance works fine on this browser");
    }
    const pageAccessedByReload =
      (window.performance.navigation &&
        window.performance.navigation.type === 1) ||
      window.performance
        .getEntriesByType("navigation")
        .map((nav) => nav.type)
        .includes("reload");

    if (!pageAccessedByReload) {
    } else {
      sessionStorage.setItem("clickFromCSUI", "false");
      sessionStorage.removeItem("listNodeID");

      localStorage.setItem("pervNodeID", "2000");
    }
  }, []);

  // useEffect(() => {
  //   window.onpopstate = () => {
  //     alert("123");
  //   };
  //   console.log("window", window);
  //   console.log("type window", typeof window);

  //   const handlePopstate = () => {
  //     console.log("Back or Forward");
  //     sessionStorage.setItem("clickFromCSUI", "false");
  //     sessionStorage.removeItem("listNodeID");
  //     localStorage.setItem("pervNodeID", "2000");
  //   };
  //   // Add event listener for popstate when the component mounts
  //   window.addEventListener("popstate", handlePopstate);

  //   // Remove event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener("popstate", handlePopstate);
  //   };
  // }, []);

  // window.onpopstate = () => {
  //   console.log("123");
  //   alert("123");
  // };
  // console.log("window", window);
  // console.log("type window", typeof window);

  const handlePopstate = () => {
    sessionStorage.setItem("clickFromCSUI", "false");
    sessionStorage.removeItem("listNodeID");
    localStorage.setItem("pervNodeID", "2000");
  };
  // Add event listener for popstate when the component mounts
  window.addEventListener("popstate", handlePopstate);

  useEffect(() => {
    const handleHashChange = () => {
      // This function will be called when the hash portion of the URL changes
    };

    // Attach the event listener
    window.addEventListener("hashchange", handleHashChange);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []); // Empty dependency array ensures that this effect runs only once during component mount

  // useEffect(() => {
  //   console.log(
  //     `sessionStorage.getItem("listNodeID")`,
  //     sessionStorage.getItem("listNodeID")
  //   );

  //   if (sessionStorage.getItem("listNodeID") !== null) {
  //     console.log(
  //       `sessionStorage.getItem("listNodeID").split(",")[0]`,
  //       sessionStorage.getItem("listNodeID").split(",")[0]
  //     );
  //     localStorage.setItem(
  //       "pervNodeID",
  //       sessionStorage.getItem("listNodeID").split(",")[0]
  //     );
  //   } else {
  //     localStorage.setItem("pervNodeID", "2000");
  //   }
  // }, [sessionStorage.getItem("listNodeID")]);

  useEffect(() => {
    // try {
    //   const ticket = getOTCSTicket();
    //   const getRecentAccesses = async () => {
    //     const res = await axios.get(
    //       `${config.OTCS_API_URL}/v2/members/accessed`,
    //       { headers: { otcsticket: ticket } }
    //     );
    //     // setRecentAccesses(res.data.results);
    //     const results = res.data.results.map((result) => {
    //       const emailproperties = result.data.emailproperties;
    //       return {
    //         conversationId: emailproperties.conversationid,
    //         from: emailproperties.from,
    //         hasAttachment: emailproperties.hasattachments,
    //         nodeId: result.data.nicknames,
    //         parentNodeId: result.parentNodeId,
    //         permSeeContents: false,
    //         sent: emailproperties.sentdate,
    //         subject: emailproperties.subject,
    //         to: emailproperties.to,
    //       };
    //     });
    //     setRecentAccesses(results);
    //   };
    //   getRecentAccesses();
    // } catch (err) {
    //   console.log(err);
    // }
  }, []);
  const profileContainerRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(event.target)
      ) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [openProfile]);

  useEffect(() => {
    try {
      const ticket = getOTCSTicket();
      const getFavoritesFolder = async () => {
        const res = await axios
          .create({
            baseURL: config.OTCS_API_URL,
            withCredentials: false,
            headers: {
              Authorization: `Bearer ${cookies.get("otsession")}`,
            },
          })
          .get(`v2/members/favorites`);
        // const res = await axios.get(
        //   `${config.OTCS_API_URL}/v2/members/favorites`,
        //   {
        //     headers: {
        //       otcsticket: ticket,
        //     },
        //   }
        // );

        setFavoriteFolders(res.data.results);
        // setFavID(res.data.results.nicknames.nickname);
        //setFavID(res.data.results.map(result => result.nicknames.nickname));
      };
      getFavoritesFolder();
    } catch {
      console.log("ERROR 401");
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div onClick={(e) => outsideclick(e)}>
          <nav
            //  className="navbar-container navbar navbar-expand-lg navbar-light justify-content-between"
            className="navbar-container navbar"
            style={{ flexWrap: "nowrap", gap: "20px" }}
          >
            <div className="d-flex align-items-center gap-1">
              {/* <img
                src={HomeButton}
                title="Home"
                height="45px"
                style={{ cursor: "pointer", zIndex: "9999" }}
                alt=""
                onClick={() => homeClick()}
              /> */}
              <div style={{ width: "50px" }}>
                {screenWidth < 912 ? null : (
                  <img src={config.BCA_ICON_URL} alt="bca-icon" />
                )}
              </div>
              {/* <h3
                style={{
                  color: "white",
                  marginBottom: "0",
                  fontSize: "1.25rem",
                }}
              >
                Email & Record Management System Portal
              </h3> */}
            </div>
            <div
              style={{
                //marginLeft: "5%",
                paddingTop: "1%",
                color: "white",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              // className="navbar-brand mx-auto d-block text-center order-0 order-md-1"
              hidden={Searchbarshow}
            >
              {/* <img src={Logo} height="30px" alt="" hidden={Searchbarshow} /> */}
              {/* <h3 hidden={Searchbarshow}>
                Email & Record Management System Portal
              </h3> */}
            </div>

            <div className="searchposition ">
              <div className="d-flex  align-items-center justify-content-end">
                <div
                  ref={searchContainerRef}
                  className="d-flex gap-2 align-items-center"
                  style={{ gap: "16px" }}
                >
                  <div className="relative">
                    <form
                      className={`align-items-center  my-2 my-lg-0 ${
                        !Searchbarshow ? "d-none" : "d-flex"
                      }`}
                      hidden={!Searchbarshow}
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <div
                        style={{ zIndex: "99" }}
                        id="advancesearch"
                        onClick={() =>
                          setshowAdvanceSearchForm(!showAdvanceSearchForm)
                        }
                      >
                        {!showAdvanceSearchForm ? (
                          <img
                            src={SearchDropdown}
                            title="Advance Search"
                            id="advancesearch"
                            height="40px"
                            alt=""
                          />
                        ) : (
                          <img
                            src={SearchDropdown}
                            title="Advance Search"
                            id="advancesearch"
                            className="arrow-up-icon"
                            height="40px"
                            alt=""
                          />
                        )}
                      </div>
                      {/* <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "500px" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        style={{ transformOrigin: "right" }}> */}
                      <input
                        ref={textInput}
                        id="myinput"
                        value={SearchContent}
                        onKeyUp={(e) => handleSearchBar(e)}
                        onChange={(e) => setSearchContent(e.target.value)}
                        type="text"
                        className={`Search_Bar ${
                          animationPlayed ? " animation-played" : ""
                        }`}
                        placeholder="Search"
                        title="Enter your search term"
                        aria-label="Enter your search term"
                      ></input>
                      {/* </motion.div> */}

                      {isIE === false ? (
                        <div
                          style={{ marginLeft: "-25px", zIndex: "999" }}
                          id="clear"
                          hidden={SearchContent === "" ? true : false}
                          onClick={() => clearInput()}
                        >
                          <img
                            src={ClearInput}
                            title="Clear Search Input"
                            className="responsive"
                            height="20px"
                            alt=""
                            id="clear"
                          />
                        </div>
                      ) : null}
                    </form>
                    <div
                      id="myinput"
                      className="card container mt-2"
                      style={
                        screenWidth < 912
                          ? {
                              zIndex: "3",
                              width: "500px",
                              position: "absolute",
                              marginLeft: "1%",
                              overflow: "auto",
                              left: "170px",
                              top: "93%",
                            }
                          : {
                              zIndex: "3",
                              width: "650px",
                              // width: "650px",
                              position: "absolute",
                              // marginLeft: "1%",
                              overflow: "auto",
                              // left: "330px",
                              top: "93%",
                            }
                      }
                      hidden={!showAdvanceSearchForm}
                    >
                      <form
                        id="myinput"
                        className="form mt-3 fullwidth"
                        onSubmit={(e) => OnHandleSubmit(e)}
                        style={{
                          height: "72vh",
                        }}
                      >
                        <div className="form-group row mt-1">
                          <label
                            id="formlabel"
                            className="col-sm-3 col-form-label text-dark"
                          >
                            Contains Attachment
                          </label>
                          <div className="col-sm-9">
                            <select
                              id="myadvancesearchattach"
                              className="form-control"
                              value={advanceContainattachment}
                              onChange={(e) => SelectOptionforSearch(e)}
                            >
                              <option value="UNDEFINED">Specify</option>
                              <option value="YES">Yes</option>
                              <option value="NO">No</option>
                            </select>
                          </div>
                        </div>
                        <div className="form-group row mt-1">
                          <label
                            id="formlabel"
                            className="col-sm-3 col-form-label text-dark"
                          >
                            Attachment/ File Name
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              id="myinput"
                              value={attachmentFileName}
                              onChange={(e) => {
                                if (e.target.value) {
                                  setadvanceContainattachment("YES");
                                } else {
                                  setadvanceContainattachment("UNDEFINED");
                                }
                                setattachmentFileName(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group row mt-1">
                          <label
                            id="formlabel"
                            className="col-sm-3 col-form-label text-dark"
                          >
                            From
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              id="myinput"
                              value={advanceSearchFrom}
                              onChange={(e) =>
                                setadvanceSearchFrom(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="form-group row mt-1">
                          <label
                            id="formlabel"
                            className="col-sm-3 col-form-label text-dark"
                          >
                            Sent From
                          </label>
                          <div className="col-sm-4">
                            <DatePicker
                              width="100%"
                              id="fromdate"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              onSelect={() => setshowAdvanceSearchForm(true)}
                              selected={ReceivedFrom}
                              onChange={(date) => {
                                setReceivedFrom(date);
                                setshowAdvanceSearchForm(true);
                              }}
                            />
                          </div>
                          <div className="col-sm-1">
                            <label
                              id="formlabel"
                              className="col-form-label text-dark"
                            >
                              To
                            </label>
                          </div>
                          <div className="col-sm-4">
                            <DatePicker
                              width="100%"
                              id="todate"
                              dateFormat="dd/MM/yyyy"
                              className="form-control"
                              onSelect={() => setshowAdvanceSearchForm(true)}
                              onChange={(date) => {
                                setReceivedTo(date);
                                setshowAdvanceSearchForm(true);
                              }}
                              selected={ReceivedTo}
                              popperPlacement="bottom-start"
                              popperModifiers={[
                                {
                                  name: "offset",
                                  options: {
                                    offset: [0, 8],
                                  },
                                },
                              ]}
                            />
                          </div>
                        </div>
                        <div className="form-group row mt-1">
                          <label
                            id="formlabel"
                            className="col-sm-3 col-form-label text-dark"
                          >
                            Subject
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              id="myinput"
                              value={advanceSearchSubject}
                              onChange={(e) =>
                                setadvanceSearchSubject(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="form-group row mt-1">
                          <label
                            id="formlabel"
                            className="col-sm-3 col-form-label text-dark"
                          >
                            To
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              id="myinput"
                              value={advanceSearchTo}
                              onChange={(e) =>
                                setadvanceSearchTo(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        {showSearchListFolderLocation ? (
                          <>
                            <div className="form-group row mt-1">
                              <label
                                id="formlabel"
                                className="col-sm-3 col-form-label text-dark"
                              >
                                Location
                              </label>
                              <div className="col-sm-9">
                                <select
                                  id="searchEmails"
                                  className="form-control"
                                  defaultValue={"-"}
                                  // value={
                                  //   searchEmails && defualtFolder.length > 0
                                  //     ? defualtFolder[0]["Name"]
                                  //     : "-"
                                  // }
                                  onChange={(e) =>
                                    setSearchEmails(
                                      e.target.value === "-" ? false : true
                                    )
                                  }
                                  disabled={isSearchLocationFilled()}
                                >
                                  <option value="-">-</option>
                                  {defualtFolder.length > 0 ? (
                                    <option value={defualtFolder[0]["Name"]}>
                                      {defualtFolder[0]["Name"]}
                                    </option>
                                  ) : null}
                                </select>
                              </div>
                            </div>
                            <div className="form-group row mt-1">
                              <div className="col-sm-3 col-form-label"></div>
                              <div className="col-sm-9">
                                <select
                                  id="searchArchive"
                                  className="form-control"
                                  defaultValue={"-"}
                                  // value={
                                  //   searchArchive && defualtFolder.length > 1
                                  //     ? defualtFolder[1]["Name"]
                                  //     : "-"
                                  // }
                                  onChange={(e) =>
                                    setSearchArchive(
                                      e.target.value === "-" ? false : true
                                    )
                                  }
                                  disabled={isSearchLocationFilled()}
                                >
                                  <option value="-">-</option>
                                  {defualtFolder.length > 1 ? (
                                    <option value={defualtFolder[1]["Name"]}>
                                      {defualtFolder[1]["Name"]}
                                    </option>
                                  ) : null}
                                </select>
                              </div>
                            </div>
                          </>
                        ) : null}

                        {showSearchListFolderLocation ? (
                          <>
                            <div className="form-group row mt-1">
                              <div className="col-sm-3 col-form-label" />
                              <div className="col-sm-9 no-gutters">
                                <AutocompleteSearch
                                  elementID={"search1"}
                                  selectedOption={searchLocation1}
                                  handleMenuItemClick={setSearchLocation1}
                                  setClearSearchLocation={
                                    setClearSearchLocation
                                  }
                                  clearSearchLocation={clearSearchLocation}
                                />
                              </div>
                            </div>
                            <div className="form-group row mt-1">
                              <div className="col-sm-3 col-form-label text-dark" />
                              <div className="col-sm-9 no-gutters">
                                <AutocompleteSearch
                                  elementID={"search2"}
                                  selectedOption={searchLocation2}
                                  handleMenuItemClick={setSearchLocation2}
                                  setClearSearchLocation={
                                    setClearSearchLocation
                                  }
                                  clearSearchLocation={clearSearchLocation}
                                />
                              </div>
                            </div>
                            <div className="form-group row mt-1">
                              <div className="col-sm-3 col-form-label text-dark" />
                              <div className="col-sm-9 no-gutters">
                                <AutocompleteSearch
                                  elementID={"search3"}
                                  selectedOption={searchLocation3}
                                  handleMenuItemClick={setSearchLocation3}
                                  setClearSearchLocation={
                                    setClearSearchLocation
                                  }
                                  clearSearchLocation={clearSearchLocation}
                                />
                              </div>
                            </div>
                            <div className="form-group row mt-1">
                              <div className="col-sm-3 col-form-label text-dark" />
                              <div className="col-sm-9 no-gutters">
                                <AutocompleteSearch
                                  elementID={"search4"}
                                  selectedOption={searchLocation4}
                                  handleMenuItemClick={setSearchLocation4}
                                  setClearSearchLocation={
                                    setClearSearchLocation
                                  }
                                  clearSearchLocation={clearSearchLocation}
                                />
                              </div>
                            </div>
                          </>
                        ) : null}
                        <div className="mb-3" style={{ float: "right" }}>
                          <Button
                            variant="contained"
                            type="submit"
                            sx={{
                              backgroundColor: "#232E72",
                              border: "1px solid #2e6da4",
                              borderRadius: "999px",
                            }}
                            onClick={() => setUseAdvanceSearch(true)}
                          >
                            Search
                          </Button>
                          <Button
                            variant="outlined"
                            sx={{
                              borderColor: "#232E72",
                              borderRadius: "999px",
                              color: "#232E72",
                              marginLeft: "8px",
                            }}
                            onClick={() => advanceSearchFormReset()}
                          >
                            Clear Filter
                          </Button>
                        </div>
                        <div className="search-input-container">
                          <div
                          // className="mb-3"
                          // style={{ float: "right", position: "absolute" }}
                          >
                            {/* <button
                        id="formlabel"
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => {
                          sessionStorage.setItem("resetSearch", "true");
                          setUseAdvanceSearch(true);
                        }}>
                        Search
                      </button>
                      <button
                        id="formlabel"
                        type="button"
                        className="btn btn-primary ml-2"
                        onClick={() => advanceSearchFormReset()}>
                        Clear Filter
                      </button> */}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div
                    className="brightness nav justify-content-end"
                    style={{
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                    id="search"
                  >
                    {Searchbarshow ? (
                      <img
                        src={`${window.location.origin}/img/csui/themes/carbonfiber/image/icons/search_header_close.svg`}
                        title="Search"
                        className="responsive"
                        height="45px"
                        width={isIE ? "65px" : "45px"}
                        alt=""
                        id="search"
                        onClick={() => {
                          setSearchbarshow(false);
                          setshowAdvanceSearchForm(false);
                        }}
                      />
                    ) : (
                      <img
                        src={SearchIcon}
                        title="Search"
                        className="responsive"
                        height="45px"
                        width={isIE ? "65px" : "45px"}
                        alt=""
                        id="search"
                        onClick={() => {
                          SearchBar("search", SearchContent);
                          //setUseAdvanceSearch(false)
                          // setshowAdvanceSearchForm(false);
                        }}
                      />
                    )}
                    {/* <img
                      src={SearchIcon}
                      title="Search"
                      className="responsive"
                      height="45px"
                      width={isIE ? "65px" : "45px"}
                      alt=""
                      id="search"
                      onClick={() => {
                        SearchBar("search", SearchContent);
                        //setUseAdvanceSearch(false)
                      }}
                    /> */}
                  </div>
                </div>

                <div
                  title="Profile Menu"
                  ref={profileContainerRef}
                  onClick={() => setOpenProfile(!openProfile)}
                  className={`profile-container ${openProfile ? "show" : ""}`}
                  style={{
                    position: "relative",
                  }}
                >
                  <div
                    className="profile"
                    style={{ background: colorForInitials }}
                  >
                    {!userInfos.photo_url ? (
                      <div className="profile-name">
                        {/* {cookies.get("uid").charAt(0).toUpperCase()} */}
                        {userInfos.initials?.toUpperCase()}
                      </div>
                    ) : (
                      <img src={userPhoto} className="user-photo" />
                    )}
                  </div>
                  {openProfile ? (
                    <NavLink to="/logout" className="profile-details">
                      <div>
                        <div
                          className="signout-link"
                          style={{ color: "black" }}
                        >
                          Sign out
                        </div>
                      </div>
                    </NavLink>
                  ) : null}
                </div>
                {/* <NavLink to="/logout">
                  <div
                    className="justify-content-end"
                    style={{
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                    id="logout">
                    <img
                      src={LogoutIcon}
                      title="Logout"
                      width="30px"
                      alt="logout"
                      id="logout"
                      // onClick={logoutSession}
                    />
                  </div>
                </NavLink> */}
              </div>
            </div>
          </nav>

          <span className="information_bar">
            <div className="d-flex align-items-center gap-2">
              <img
                src={HomeButton}
                title="Home"
                height="25px"
                style={{
                  cursor: "pointer",
                  zIndex: "9999",
                  marginBottom: "2px",
                }}
                alt=""
                onClick={() => homeClick()}
              />
              <div className="breadcrumb-divider">/</div>
            </div>
            {ConversationView
              ? "Items in Email Conversation"
              : IsSearchState
              ? "Search Results"
              : Breadcrump()}
            {Previouslink !== "" && !IsSearchState ? (
              <span
                className="ml-5"
                style={{ cursor: "pointer" }}
                onClick={() => previousgo()}
              >
                <u>Previous</u>
              </span>
            ) : null}
          </span>

          <SplitPane
            split="vertical"
            size={
              positionAfterEmails !== "" && !panelHidden
                ? positionAfterEmails + "px"
                : panelHidden
                ? "100%"
                : "50%"
            }
            ref={emailBrowserContent}
            onDragStarted={HideContentSection}
            //we want to show and hide because during resizing the split spane by the user, if the cursor lands in an iframe, the dragging will fail
            onDragFinished={ShowContentSection}
            onChange={(size) => SizeChangedAfterEmails(size)}
            // pane1Style={pane1Style}
            pane2Style={paneTwoContentSection}
            className="main_section"
          >
            <SplitPane
              split="vertical"
              // size={
              //   // positionBeforeEmails !== ""
              //   //   ? positionBeforeEmails + "px"
              //   //   :
              //   screenWidth < 781 ? "3px" : `33%`
              // }
              size={
                positionBeforeEmails !== ""
                  ? positionBeforeEmails + "px"
                  : `250px`
              }
              className={classes.splitPane}
              pane2Style={emailSectionPane2Style}
              // style={!panelHidden ? { maxWidth: "66%" } : { width: "0" }}
              onChange={(size) => SizeChangedBeforeEmails(size)}
            >
              <div className="folderview_section">
                <FolderTreeSection
                  setRecentAccesses={setRecentAccesses}
                  setOpenAttachmentNodeIDs={setOpenAttachmentNodeIDs}
                  setSearchEmailDatas={setSearchEmailDatas}
                  setSearchBreadcrumb={setSearchBreadcrumb}
                  selected={selected}
                  setSelected={setSelected}
                  favoriteFolders={favoriteFolders}
                  recentAccesses={recentAccesses}
                  setIsListConversationOpen={setIsListConversationOpen}
                  FolderIDChanged={FolderIDChanged}
                  userId={userId}
                  ShowEmailFolderID={ShowFolderID}
                  showEmailFolderIDUpdate={() => showEmailFolderIDUpdate()}
                  folderFullpath={folderfullpathlist}
                  setFolderFullpath={setFolderfullpathlist}
                  BreadcrumbId={BreadcrumbId}
                  setFolderLoading={setFolderLoading}
                  folderloading={folderLoading}
                  setPreviouslink={setPreviouslink}
                  treeViewDefaultExpandedFolders={
                    treeViewDefaultExpandedFolders
                  }
                />
              </div>
              <div className="emails_section flex">
                <EmailsSection
                  recentAccesses={recentAccesses}
                  openAttachmentNodeIDs={openAttachmentNodeIDs}
                  setOpenAttachmentNodeIDs={setOpenAttachmentNodeIDs}
                  searchEmailDatas={searchEmailDatas}
                  setSearchEmailDatas={setSearchEmailDatas}
                  setSearchBreadcrumb={setSearchBreadcrumb}
                  selected={selected}
                  setSelected={setSelected}
                  setEmailAttachments={setEmailAttachments}
                  emailName={emailName}
                  emailAttachmentTableHeaders={emailAttachmentTableHeaders}
                  showEmailAttactments={showEmailAttactments}
                  emailAttachments={emailAttachments}
                  getEmailName={getEmailName}
                  setShowEmailAttactments={setShowEmailAttactments}
                  getEmailAttachments={getEmailAttachments}
                  setEmailSummary={setEmailSummary}
                  setShowEmailSummaryContent={setShowEmailSummaryContent}
                  count={count}
                  isListCoversationOpen={isListCoversationOpen}
                  setIsListConversationOpen={setIsListConversationOpen}
                  previewContent={previewContent}
                  FolderIDSelected={folderIDSelected?.toString()}
                  setFolderFullpath={setFolderfullpathlist}
                  ContentIDChanged={ContentIDChanged}
                  showAsConversation={showAsConversation}
                  userId={userId}
                  showEmailFolder={(value) => showEmailFolder(value)}
                  Searchbarshow={Searchbarshow}
                  IsSearchState={IsSearchState}
                  SearchKeyword={encodeURI(SearchKeyword)} // exclude special characters
                  FolderView={FolderView}
                  UpdateSearch={UpdateSearch}
                  UpdateConversationView={UpdateConversationView}
                  ConversationView={ConversationView}
                  ConversationId={ConversationId}
                  Search={Search}
                  SearchType={SearchType}
                  FolderClick={FolderClick}
                  advanceSearchEnable={advanceSearchEnable}
                  advanceSearchIn={advanceSearchIn}
                  folderNodeID={
                    isSearchLocationFilled()
                      ? isObject(searchLocation1) && searchLocation1.NodeID
                      : searchEmails && defualtFolder.length > 0
                      ? defualtFolder[0]["NodeID"]
                      : searchArchive && defualtFolder.length > 0
                      ? defualtFolder[1]["NodeID"]
                      : "2000"
                  }
                  folderNodeID2={
                    isSearchLocationFilled()
                      ? isObject(searchLocation2) && searchLocation2.NodeID
                      : searchArchive &&
                        defualtFolder.length > 0 &&
                        defualtFolder[1]["NodeID"]
                  }
                  folderNodeID3={
                    isObject(searchLocation3) && searchLocation3.NodeID
                  }
                  folderNodeID4={
                    isObject(searchLocation4) && searchLocation4.NodeID
                  }
                  advanceContainattachment={advanceContainattachment}
                  advanceSearchFrom={advanceSearchFrom.replace(
                    /[`!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/gi,
                    ""
                  )} // exclude special characters
                  advanceSearchTo={advanceSearchTo.replace(
                    /[`!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/gi,
                    ""
                  )} // exclude special characters
                  advanceSearchSubject={encodeURI(advanceSearchSubject)} // exclude special characters
                  ReceivedFrom={ReceivedFrom}
                  ReceivedTo={ReceivedTo}
                  useAdvanceSearch={useAdvanceSearch}
                  attachmentFileName={attachmentFileName.replace(
                    /[`!@#$%^&*+\={};':"\\|,<>\/?~]/gi,
                    ""
                  )} // exclude special characters
                  generalSearchInArchive={
                    defualtFolder.length > 0 ? defualtFolder[1]["NodeID"] : ""
                  }
                  setPreviewPaneHidden={setPannelHidden}
                />
                {/* <TableView /> */}
              </div>
              <div>
                <div className="vl" style={{ float: "left" }}></div>
              </div>
            </SplitPane>
            <div
              ref={emailPreviewRef}
              className="content_section"
              // style={{ width: `${previewWidth}px` }}
              style={!panelHidden ? { width: `100%` } : {}}
              id="content_div"
            >
              {!panelHidden && (
                <ContentSection
                  setEmailSummary={setEmailSummary}
                  emailSummary={emailSummary}
                  showEmailSummaryContent={showEmailSummaryContent}
                  setShowEmailSummaryContent={setShowEmailSummaryContent}
                  setIsContentSectionLoading={setIsContentSectionLoading}
                  isContentSectionLoading={isContentSectionLoading}
                  isEmailContentExists={isEmailContentExists}
                  canSeeContent={canSeeContent}
                  htmlContent={htmlContent}
                  previewContent={previewContent}
                  ContentIDSelected={contentIDSelected}
                  EmailSelected={emailSelected}
                  setPreviewPaneHidden={setPannelHidden}
                />
              )}
            </div>
          </SplitPane>
        </div>
      )}
    </>
  );
}

// export default withRouter(MainSection);
export default withRouter(MainSection);
