import Api from "./api";
import Logger from "js-logger";
import moment from "moment";
import Cookies from "universal-cookie";
import axios from "axios";
import { getPath } from "../utils/arrayUtils";
const { Config } = require("../components/common/AppConfig");
const config = Config();
const cookies = new Cookies();
const username = cookies.get("uid");
const folderUnderEnterprise = cookies.get("default-folder");
const isNullOrEmpty = (str) => {
  return str === null || str === "";
};

// export function getOTCSTicket() {
//   const authInfo = sessionStorage.getItem(
//     "nuc/utils/authenticators/ticket.authenticator"
//   );
//   const authJson = JSON.parse(authInfo);
//   const ticket = authJson["/otcs/cs.exe/api/v1"]
//     ? authJson["/otcs/cs.exe/api/v1"].ticket
//     : authJson["/otcs/llisapi.dll/api/v1"].ticket;

//   return ticket;
// }

// function updateOTCSTicket(ticket) {
//   const authInfo = sessionStorage.getItem(
//     "nuc/utils/authenticators/ticket.authenticator"
//   );
//   let authJson = JSON.parse(authInfo);

//   if (authJson["/otcs/cs.exe/api/v1"]) {
//     authJson["/otcs/cs.exe/api/v1"].ticket = ticket;
//   }

//   if (authJson["/otcs/llisapi.dll/api/v1"]) {
//     authJson["/otcs/llisapi.dll/api/v1"].ticket = ticket;
//   }

//   if (authJson["/otcs/cs.exe/api/v2"]) {
//     authJson["/otcs/cs.exe/api/v2"].ticket = ticket;
//   }

//   if (authJson["/otcs/llisapi.dll/api/v2"]) {
//     authJson["/otcs/llisapi.dll/api/v2"].ticket = ticket;
//   }

//   sessionStorage.setItem(
//     "nuc/utils/authenticators/ticket.authenticator",
//     JSON.stringify(authJson)
//   );
// }

function refreshOTDSTicket(otdsToken) {
  const apiClient = axios.create({
    baseURL: config.OTDS_API_URL,
  });

  let ticket = "";
  const body = {
    ticket: otdsToken,
    targetResourceId: config.OTCS_RESOURCE_ID,
  };

  apiClient
    .post("/authentication/ticketforresource", JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((resp) => {})
    .catch((err) => {
      console.log("error: ", err);
    });

  return ticket;
}

export default {
  getCurrentUserGroups(username) {
    return Api()
      .get("users/GetCurrentUserGroups?userName=" + username)
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error.toJSON());

        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },
  getFolders(id) {
    const apiClient = axios.create({
      baseURL: config.OTCS_API_URL,
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${cookies.get("otsession")}`,
      },
    });

    let url = `/v2/nodes/${id}/nodes?where_type=-1&sort=name&fields=properties&page=1&limit=100`;

    // return Api()
    //   .get("folders/" + id + `?userName=${username}`)
    //   .then((resp) => {
    //     return resp;
    //   })
    //   .catch((error) => {
    //     Logger.useDefaults();
    //     Logger.error("Logger::", error.message, error);

    //     if (error.message.includes("status code 401")) {
    //       window.location.replace(
    //         "".concat(config.REACT_APP_URL, "/error#session-expired")
    //       );
    //     }
    //     return null;
    //   });

    // const ticket = getOTCSTicket();
    return apiClient
      .get(url)
      .then((resp) => {
        // updateOTCSTicket(resp.headers.otcsticket);
        let folderInfoList = [];

        // console.log({ resp });

        // let folders =
        //   id == 2000
        //     ? resp.data.results.filter((node) =>
        //         config.FolderUnderEnterprise.includes(
        //           node.data.properties.id.toString()
        //         )
        //       )
        //     : resp.data.results;
        let folders = [];
        if (folderUnderEnterprise) {
          folders =
            id == 2000
              ? resp.data.results.filter((node) =>
                  folderUnderEnterprise
                    .replace(/%3b/g, ";")
                    ?.includes(node.data.properties.id.toString())
                )
              : resp.data.results;
        } else {
          folders = resp.data.results;
        }

        // let folders = resp.data.results;

        folderInfoList = folders.map((node) => {
          let folderInfo = {
            NodeID: node.data.properties.id,
            Name: node.data.properties.name,
            IconUri: "",
            ParentNodeID: node.data.properties.parent_id,
            NodeType: "Folder",
            ChildCount: node.data.properties.size,
          };

          return folderInfo;
        });

        return { data: folderInfoList };
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error);

        if (error.message.includes("status code 401")) {
          // window.location.replace("".concat(`${config.REACT_APP_HOME_URL}`));
          // sessionStorage.setItem("redirectToMailPage", "true");

          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },

  getFolderChildrens(id) {
    const apiClient = axios.create({
      baseURL: config.OTCS_API_URL,
    });

    let url = `/v2/nodes/${id}/nodes?where_type=-1&sort=name&fields=properties&page=1&limit=100`;

    // const ticket = getOTCSTicket();
    return apiClient
      .get(url, {
        // headers: {
        //   OTCSTicket: ticket,
        // },
      })
      .then((resp) => {
        // updateOTCSTicket(resp.headers.otcsticket);
        let folderInfoList = [];

        // let folders =
        //   id == 2000
        //     ? resp.data.results.filter((node) =>
        //         config.FolderUnderEnterprise.includes(
        //           node.data.properties.id.toString()
        //         )
        //       )
        //     : resp.data.results;

        // let folders =
        //   id == 2000
        //     ? resp.data.results.filter((node) =>
        //         folderUnderEnterprise?.includes(
        //           node.data.properties.id.toString()
        //         )
        //       )
        //     : resp.data.results;
        let folders = [];
        if (folderUnderEnterprise) {
          folders =
            id == 2000
              ? resp.data.results.filter((node) =>
                  folderUnderEnterprise
                    .replace(/%3b/g, ";")
                    ?.includes(node.data.properties.id.toString())
                )
              : resp.data.results;
        } else {
          folders = resp.data.results;
        }

        // let folders = resp.data.results;

        folderInfoList = folders.map((node) => {
          let folderInfo = {
            NodeID: node.data.properties.id,
            Name: node.data.properties.name,
            children: [
              {
                NodeID: "",
                Name: "Loading...",
                IconUri: null,
                ParentNodeID: "",
                NodeType: null,
                ChildCount: 0,
              },
            ],
            IconUri: "",
            ParentNodeID: node.data.properties.parent_id,
            NodeType: "Folder",
            ChildCount: node.data.properties.size,
          };

          return folderInfo;
        });

        return { data: folderInfoList };
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error);

        if (error.message.includes("status code 401")) {
          // window.location.replace("".concat(`${config.REACT_APP_HOME_URL}`));
          // sessionStorage.setItem("redirectToMailPage", "true");

          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },

  getUserId(name) {
    return Api()
      .get(`users/single/?userName=${name}`)
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error);

        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },

  getSingleFolder(id) {
    return Api()
      .get("folders/single?id=" + id + `&userName=${username}`)
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error);

        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },
  // getFolders(id) {
  //   return Api().get("folders/" + id + "?userName=alvin");
  // },
  getFoldersPath(id) {
    return Api()
      .get("folders/navigationpath/" + id + `?userName=${username}`)
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error);

        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },

  getEmails(id, initialpoint, perpagecount, sortBy, sortdirc, conversation) {
    const apiClient = axios.create({
      baseURL: config.OTCS_API_URL,
    });

    let url = // conversation ?
      "emails/list/paginated?id=" +
      id +
      //`&includeConversationID=true&userName=${username}&sortedBy=${sortBy}&sortDirection=${sortdirc}`
      //: "emails/list/paginated?id=" +
      //id +
      `&includeConversationID=true&userName=${username}&pageNumber=${initialpoint}&pageSize=${perpagecount}&sortedBy=${sortBy}&sortDirection=${sortdirc}`;

    // url = "v2/search";

    // const ticket = getOTCSTicket();
    // const params = {
    //   page: initialpoint,
    //   limit: perpagecount,
    //   filter: "OTSubType: {749}",
    //   select:
    //     "{'OTEmailConversationID', 'OTEmailCC','OTEmailCCAddress','OTEmailCCFullName','OTEmailFrom','OTEmailHasAttachments','OTEmailReceivedDate','OTEmailRecipientAddress','OTEmailRecipientFullName','OTEmailSenderAddress','OTEmailSenderFullName','OTEmailSentDate','OTEmailSubject','OTEmailTo','OTEmailToAddress','OTEmailToFullName'}",
    //   lookfor: "complexquery",
    //   fields: "properties",
    //   where: `OTParentID: ${id}`,
    //   sort: `${sortdirc}_${sortBy}`,
    // };

    // let paginatedResult = {
    //   NumberOfPages: 1,
    //   PageNumber: 1,
    //   PageSize: perpagecount,
    //   TotalCount: 0,
    //   EmailInfos: [],
    //   SortedBy: sortBy,
    //   SortDirection: sortdirc,
    // };

    // return apiClient
    //   .post(url, new URLSearchParams(params), {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //       OTCSTicket: ticket,
    //     },
    //   })
    //   .then((resp) => {
    //     paginatedResult.NumberOfPages = resp.data.collection.paging.page_total;
    //     paginatedResult.PageNumber = resp.data.collection.paging.page;
    //     paginatedResult.PageSize = resp.data.collection.paging.limit;
    //     paginatedResult.TotalCount = resp.data.collection.paging.total_count;
    //     paginatedResult.SortedBy = sortBy;
    //     paginatedResult.SortDirection = sortdirc;

    //     paginatedResult.EmailInfos = resp.data.results.map((node) => {
    //       const newObj = {
    //         NodeID: node.data.properties.id,
    //         Name: node.data.properties.name,
    //         IconUri: "",
    //         ParentNodeID: node.data.properties.parent_id,
    //         EmailSubject: node.data.regions.OTEmailSubject,
    //         EmailTo: node.data.regions.OTEmailTo,
    //         EmailCC: node.data.regions.OTEmailCC,
    //         EmailFrom: node.data.regions.OTEmailFrom,
    //         SentDate: node.data.regions.OTEmailSentDate_formatted,
    //         ReceivedDate: node.data.regions.OTEmailReceivedDate_formatted,
    //         ConversationId: node.data.regions.OTEmailConversationID,
    //         HasAttachments:
    //           node.data.regions.OTEmailHasAttachments === "true" ? 1 : 0,
    //         //FileSize: 0,
    //         //Summary: '',
    //         //ClientLocalEmailID: ''
    //       };

    //       return newObj;
    //     });

    //     updateOTCSTicket(resp.headers.otcsticket);
    //     console.log("paginated result:", paginatedResult);
    //     return { data: paginatedResult };
    //   })
    //   .catch((error) => {
    //     Logger.useDefaults();
    //     Logger.error("Logger::", error.message, error);

    //     if (error.message.includes("status code 401")) {
    //       refreshOTDSTicket(cookies.get("otsession"));
    //       window.location.replace(
    //         "".concat(config.REACT_APP_URL, "/error#session-expired")
    //       );
    //     }
    //     return null;
    //   });

    return Api()
      .get(url)
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error);

        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },

  //version 2
  // getEmails(id, initialpoint, perpagecount, sortBy, sortdirc, conversation){
  //   const url = 'https://customapp/emailbrowser-api-v2/api/v2/emails/list?id=' +
  //   id + `&showAsConversation=${conversation}&userName=${username}&pageNumber=${initialpoint}&pageSize=${perpagecount}&sortedBy=${sortBy}&sortDirection=${sortdirc}`

  //   return axios.get(url, {withCredentials:true})
  //     .then(response => {
  //       return response
  //     })
  //     .catch(error => {
  //       Logger.useDefaults();
  //       Logger.error("Logger::", error.message, error);
  //       return null
  //     })
  // },
  getEmailSentDates(username, nodeIds) {
    return Api()
      .get(
        "/emails/GetEmailSentDates?userName=" + username + "&nodeIds=" + nodeIds
      )
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error.toJSON());

        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },
  getPermissions(id) {
    let url = `v2/nodes/${id}/permissions/effective/${cookies.get("OTUID")}`;
    // const ticket = getOTCSTicket();

    var myHeaders = new Headers();
    // myHeaders.append("OTCSTicket", ticket);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    return fetch(`${config.OTCS_API_URL}/${url}`, requestOptions)
      .then((response) => response.json())
      .then((response) =>
        response.results.data.permissions.permissions.includes("see_contents")
      )
      .catch((error) => console.log("error", error));
  },

  getEmailAttachments(id) {
    return Api()
      .get("attachments/?id=" + id + `&userName=${username}`)
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error);

        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },

  searchEmail(
    keyword,
    folderNodeID,
    folderNodeID2,
    folderNodeID3,
    folderNodeID4,
    initialpoint,
    perpagecount,
    sortBy,
    sortdirc,
    searchIn,
    attachment,
    from,
    to,
    subject,
    fromdate,
    todate,
    advancesearch,
    useAdvanceSearch,
    attachmentFileName,
    cacheId
  ) {
    let Receivedfrom = "";
    if (fromdate) {
      Receivedfrom = moment(fromdate).format("YYYYMMDD");
    }
    let ReceivedTo = "";
    if (todate) {
      ReceivedTo = moment(todate).format("YYYYMMDD");
    }

    let emailSearchResult = {
      EmailInfos: [],
      ListHead: 0,
      IncludeCount: perpagecount,
      ActualCount: 0,
      Remarks: "",
      CacheID: "",
    };

    let searchQuery = "";
    let searchQueryFilters = [];
    let queryParams = {
      page: Math.ceil((initialpoint - 1) / perpagecount) + 1,
      limit: perpagecount,
      select:
        "{'OTEmailConversationID', 'OTEmailCC','OTEmailCCAddress','OTEmailCCFullName','OTEmailFrom','OTEmailHasAttachments','OTEmailReceivedDate','OTEmailRecipientAddress','OTEmailRecipientFullName','OTEmailSenderAddress','OTEmailSenderFullName','OTEmailSentDate','OTEmailSubject','OTEmailTo','OTEmailToAddress','OTEmailToFullName'}",
      lookfor: "complexquery",
      filter: "OTSubType: {749}",
      modifier: "relatedto",
      fields: "properties",
      where: searchQuery,
      sort: `${sortBy}_${sortdirc}`,
    };

    if (folderNodeID > 0) {
      queryParams = { ...queryParams, location_id1: folderNodeID };
    }

    if (folderNodeID2 > 0) {
      queryParams = { ...queryParams, location_id2: folderNodeID2 };
    }

    if (folderNodeID3 > 0) {
      queryParams = { ...queryParams, location_id3: folderNodeID3 };
    }

    if (folderNodeID4 > 0) {
      queryParams = { ...queryParams, location_id4: folderNodeID4 };
    }

    if (!isNullOrEmpty(keyword)) {
      let decodedKeyword = decodeURIComponent(keyword);
      if (decodedKeyword.startsWith('"') && decodedKeyword.endsWith('"')) {
        searchQueryFilters.push(decodedKeyword);
      } else {
        searchQueryFilters.push(`(${decodedKeyword})`);
      }
    }

    if (!isNullOrEmpty(subject)) {
      searchQueryFilters.push(`(OTEmailSubject: ${subject})`);
    }

    if (!isNullOrEmpty(from)) {
      searchQueryFilters.push(
        `(OTEmailFrom: ${from}* OR OTEmailSenderAddress: ${from}* OR OTEmailSenderFullName: ${from}*)`
      );
    }

    if (!isNullOrEmpty(to)) {
      var recipients = to.split(";");

      var OTEmailTo = recipients
        .map((x) => `OTEmailTo: ${x}*`)
        .Join(" & ")
        .trim();
      var OTEmailToAddress = recipients
        .map((x) => `OTEmailToAddress: ${x}*`)
        .Join(" & ")
        .trim();
      var OTEmailToFullName = recipients
        .map((x) => `OTEmailToFullName: ${x}*`)
        .Join(" & ")
        .trim();
      var OTEmailRecipientAddress = recipients
        .map((x) => `OTEmailRecipientAddress: ${x}*`)
        .Join(" & ")
        .trim();
      var OTEmailRecipientFullName = recipients
        .map((x) => `OTEmailRecipientFullName: ${x}*`)
        .Join(" & ")
        .trim();

      searchQueryFilters.push(
        `((${OTEmailTo}) OR (${OTEmailToAddress}) OR (${OTEmailToFullName}) OR (${OTEmailRecipientAddress}) OR (${OTEmailRecipientFullName}))`
      );
    }

    if (advancesearch) {
      if (!isNullOrEmpty(fromdate) && !isNullOrEmpty(todate)) {
        searchQueryFilters.push(
          `([qlregion "OTEmailSentDate"] >= ${Receivedfrom} AND [qlregion "OTEmailSentDate"] <= ${ReceivedTo})`
        );
      }
    }

    if (!isNullOrEmpty(attachmentFileName)) {
      searchQueryFilters.push(
        `((${attachmentFileName}) AND [qlregion "OTEmailHasAttachments"] = "true")`
      );
    } else if (!isNullOrEmpty(attachment) && attachment == "YES") {
      searchQueryFilters.push(`([qlregion "OTEmailHasAttachments"] = "true")`);
    } else if (!isNullOrEmpty(attachment) && attachment == "NO") {
      searchQueryFilters.push(`([qlregion "OTEmailHasAttachments"] = "false")`);
    }

    searchQuery = searchQueryFilters.join(" AND ").trim();
    queryParams.where = searchQuery;

    return axios
      .create({
        baseURL: config.OTCS_API_URL,
        withCredentials: false,
        headers: {
          Authorization: `Bearer ${cookies.get("otsession")}`,
        },
      })
      .get("v2/search", { params: queryParams })
      .then(async (resp) => {
        if (resp.data.results) {
          emailSearchResult.ListHead = resp.data.collection.paging.range_min;
          emailSearchResult.ActualCount =
            resp.data.collection.paging.total_count;
          emailSearchResult.CacheID = resp.data.collection.searching.cache_id
            ? resp.data.collection.searching.cache_id
            : "";

          const emails = resp.data.results.map((x) => {
            var emailInfo = {
              ParentNodeID: x.data.properties.parent_id,
              NodeID: x.data.properties.id,
              Name: x.data.properties.name,
              Size: x.data.properties.size,
              EmailFrom: x.data.regions.OTEmailFrom
                ? x.data.regions.OTEmailFrom
                : "",
              EmailTo: x.data.regions.OTEmailTo ? x.data.regions.OTEmailTo : "",
              EmailSubject: x.data.regions.OTEmailSubject
                ? x.data.regions.OTEmailSubject
                : "",
              HasAttachments:
                x.data.regions.OTEmailHasAttachments === "true" ? 1 : 0,
              SentDate: x.data.regions.OTEmailSentDate_formatted.toString(),
              ConversationId: x.data.regions.OTEmailConversationID
                ? x.data.regions.OTEmailConversationID
                : "",
              ParentNodeID: x.data.properties.parent_id,
            };

            return emailInfo;
          });
          await Promise.all(
            emails.map(async (email) => {
              try {
                const response = await axios.get(
                  `${config.REACT_APP_API_URL}/folders/navigationpath/${
                    email.ParentNodeID
                  }?userName=${cookies.get("uid")}`
                );
                email.Path = getPath(response.data);
              } catch (error) {
                console.error("Error fetching email location:", error);
              }
            })
          );

          // Fetching email locations
          await Promise.all(
            emails.map(async (email) => {
              try {
                const response = await axios.get(
                  `${config.OTCS_API_URL}/v1/nodes/${email.ParentNodeID}/ancestors`,
                  {
                    headers: {
                      Authorization: `Bearer ${cookies.get("otsession")}`,
                    },
                  }
                );
                email.Location =
                  response.data?.ancestors[response.data?.ancestors.length - 1]
                    .name || "";
              } catch (error) {
                console.error("Error fetching email location:", error);
              }
            })
          );

          const nodeIds = emails.map((x) => x.NodeID).join(",");
          this.getEmailSentDates(username, nodeIds ? nodeIds : "")
            .then((response) => {
              if (response.data) {
                for (var i = 0; i < response.data.length; i++) {
                  const emailInfoIndex = emails.findIndex(
                    (x) => x.NodeID == response.data[i].NodeID
                  );

                  if (emailInfoIndex >= 0)
                    emails[emailInfoIndex].SentDate = response.data[i].SentDate;
                }
              }
            })
            .catch((error) => {
              Logger.useDefaults();
              Logger.error("Logger::", error.message, error.toJSON());

              if (error.message.includes("status code 401")) {
                window.location.replace(
                  "".concat(config.REACT_APP_URL, "/error#session-expired")
                );
              }
              return null;
            });

          emailSearchResult.EmailInfos = emails;
          return { data: emailSearchResult };
        }
      })
      .catch((error) => {
        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },

  getConversation(id, sortBy, sortdirc) {
    return Api()
      .get(
        `emails/conversation?emailID=${id}&userName=${username}&sortedBy=${sortBy}&sortDirection=${sortdirc}`
      )
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error);

        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },

  getDefaultFolder(userName) {
    return Api()
      .get(`folders/getDefaultFolder?userName=${userName}`)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message, error);

        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },

  getEmailHtmlPreview(nodeID, username) {
    return Api()
      .get(`view/email?id=${nodeID}&userName=${username}`)
      .catch((error) => {
        Logger.useDefaults();
        Logger.error("Logger::", error.message);

        if (error.message.includes("status code 401")) {
          window.location.replace(
            "".concat(config.REACT_APP_URL, "/error#session-expired")
          );
        }
        return null;
      });
  },

  // emailPrint(id) {
  //   return Api().get("emails/content" + `?id=${id}&userName=alvin`).then((resp) => {
  //     return resp
  // })
  // .catch((err) => {
  //   console.log(err,"error")
  // alert(err);

  //    return null
  // });;
  // },
};
