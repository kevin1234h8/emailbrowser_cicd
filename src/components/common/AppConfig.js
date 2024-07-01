function getBaseUrl() {
  const protocol = window.location.protocol;
  const host = window.location.host.replace(":3000", "");
  const baseUrl = `${protocol ? protocol : "http:"}//${host}`;
  return baseUrl;
}

function getBaseAppUrl() {
  return "".concat(getBaseUrl(), "/otcsemails");
}

function getBaseOTCSUrl() {
  return "".concat(getBaseUrl(), "/otcs/cs.exe");
}

function getOTDSUrl(isDEV = true) {
  if (isDEV === true)
    return "".concat(`http://${window.location.host}`, ":8080");
  else return "".concat(`http://${window.location.host}`); //Need to update accordingly to the agency where this is deployed
}

function getBaseAPIUrl() {
  return "".concat(getBaseUrl(), "/emailbrowserapi/api/v1");
}

function getAppRedirectUrl() {
  return "".concat(getBaseAppUrl(), "/redirect");
}

function getOTCSRestApiUrl() {
  return "".concat(getBaseUrl(), "/otcs/llisapi.dll/api");
}

function getOTDSRestApiUrl(isDev = true) {
  return "".concat(getOTDSUrl(isDev), "/otdsws/rest");
}

function Config() {
  const isDEV = true; /* false = PROD/UAT; true = DEV */
  const appBaseURL = getBaseAppUrl();
  const apiBaseURL = getBaseAPIUrl();
  const otcsBaseURL = getBaseOTCSUrl();
  const otdsBaseURL = getOTDSUrl(isDEV);
  const baseUrl = getBaseUrl();
  const appRedirectURL = getAppRedirectUrl();
  const otcsRestApiURL = getOTCSRestApiUrl();
  const otdsRestApiURL = getOTDSRestApiUrl(isDEV);
  const customConfig = JSON?.parse(sessionStorage.getItem("custom-config"));
  const emailBrowserSummarizerApiBaseUri = sessionStorage.getItem(
    "summarizer-base-uri"
  );
  let config;
  if (isDEV)
    config = {
      // REACT_APP_API_URL: `${customConfig?.LLMApiHostName}/api/v1`, //apiBaseURL,
      REACT_APP_API_URL: `${window.location.origin}/emailbrowserapi/api/v1`,
      REACT_APP_FRAME_URL_1: `${window.location.origin}/otcs/cs.exe?func=ll&objid=`, //`${otcsBaseURL}?func=ll&objid=`,
      REACT_APP_FRAME_URL_2: process.env.REACT_APP_FRAME_URL_2, //"&objAction=ViewAsHTML",
      REACT_APP_FRAME_ATTACHMENT: `${window.location.origin}/otcs/cs.exe?func=otemail.viewAttachments&objid=`, //`${otcsBaseURL}?func=otemail.viewAttachments&objid=`,
      REACT_APP_TESTING_USER: process.env.REACT_APP_TESTING_USER, //"",
      REACT_APP_DOWNLOAD_URL_1: `${window.location.origin}/otcs/cs.exe?func=ll&objId=`, //`${otcsBaseURL}?func=ll&objid=`,
      REACT_APP_DOWNLOAD_URL_2: process.env.REACT_APP_DOWNLOAD_URL_2, //"&objAction=download",
      REACT_APP_HOME_URL: `${window.location.origin}/otcs/cs.exe/app`, //`${otcsBaseURL}/app`,
      REACT_APP_VIEW_PROPERTIES_URL: process.env.REACT_APP_VIEW_PROPERTIES_URL, //`${otcsBaseURL}/app/nodes/`,
      REACT_APP_PERMMANAGER_URL: process.env.REACT_APP_PERMMANAGER_URL, //`${baseUrl}/OTCSPermManagerAPI/api/v1`,
      REACT_APP_OAUTH_URL: `${otdsBaseURL}/otdsws/login?response_type=token&client_id=emailbrowser&redirect_uri=${encodeURI(
        appRedirectURL
      )}&state=none`, //`${otdsBaseURL}/otdsws/login?response_type=token&client_id=emailbrowser&redirect_uri=${encodeURI(appRedirectURL)}&state=none`,
      REACT_APP_REDIRECT_URL: process.env.REACT_APP_REDIRECT_URL, //appRedirectURL,
      REACT_APP_OTDSINTEGRATION_REDIRECT:
        process.env.REACT_APP_OTDSINTEGRATION_REDIRECT, //`${otcsBaseURL}?func=otdsintegration.redirect&NextURL=`,
      REACT_APP_URL: `${window.location.origin}/otcsemails`, //appBaseURL,
      OTCS_API_URL: `${window.location.origin}/otcs/llisapi.dll/api`, //otcsRestApiURL,
      OTDS_API_URL: otdsRestApiURL,
      OTCS_RESOURCE_ID: "123ceaea-b5f2-4c0d-b7a1-0d86fcb35cc4",
      FolderUnderEnterprise: "68895;68979;56408",
      MIGRATION_FOLDER_NAME: "Corporate Services Division",
      // REACT_EMAIL_SUMMARIZER_API_URL: emailBrowserSummarizerApiBaseUri,
      REACT_APP_API_URL_VERSION_TWO: `${window.location.origin}/otcs/cs.exe/api/v2`,
      CONTENT_SERVER_HOST_URL: `${window.location.origin}/otcs/cs.exe`,
      REACT_APP_LOGOUT_URL: `${window.location.origin}:8080/otdsws/logout`,
      BCA_ICON_URL: `${baseUrl}/img/csui/themes/carbonfiber/image/csui/headerbar_content_suite_platform_li.svg`,
      // SHOW_SUMMARIZER: process.env.SHOW_SUMMARIZER,
      // SHOW_SEARCH_LIST_FOLDER_LOCATION:
      //   process.env.SHOW_SEARCH_LIST_FOLDER_LOCATION,
    };
  else
    config = {
      // REACT_APP_API_URL: `${customConfig?.LLMApiHostName}/api/v1`,
      REACT_APP_API_URL: `${window.location.origin}/emailbrowserapi/api/v1`,
      REACT_APP_FRAME_URL_1: `${otcsBaseURL}?func=ll&objid=`,
      REACT_APP_FRAME_URL_2: "&objAction=ViewAsHTML",
      REACT_APP_FRAME_ATTACHMENT: `${otcsBaseURL}?func=otemail.viewAttachments&objid=`,
      REACT_APP_TESTING_USER: "",
      REACT_APP_DOWNLOAD_URL_1: `${otcsBaseURL}?func=ll&objid=`,
      REACT_APP_DOWNLOAD_URL_2: "&objAction=download",
      REACT_APP_HOME_URL: `${otcsBaseURL}/app`,
      REACT_APP_VIEW_PROPERTIES_URL: `${otcsBaseURL}/app/nodes/`,
      REACT_APP_PERMMANAGER_URL: `${baseUrl}/OTCSPermManagerAPI/api/v1`,
      REACT_APP_OAUTH_URL: `${otdsBaseURL}/otdsws/login?response_type=token&client_id=emailbrowser&redirect_uri=${encodeURI(
        appRedirectURL
      )}&state=none`,
      REACT_APP_REDIRECT_URL: appRedirectURL,
      REACT_APP_OTDSINTEGRATION_REDIRECT: `${otcsBaseURL}?func=otdsintegration.redirect&NextURL=`,
      REACT_APP_URL: appBaseURL,
      OTCS_API_URL: otcsRestApiURL,
      OTDS_API_URL: otdsRestApiURL,
      OTCS_RESOURCE_ID: "123ceaea-b5f2-4c0d-b7a1-0d86fcb35cc4",
      FolderUnderEnterprise: "68895;68979;56408",
      // MIGRATION_FOLDER_NAME: "Internal Audit",
      MIGRATION_FOLDER_NAME: "Corporate Services Division",
      // REACT_EMAIL_SUMMARIZER_API_URL: emailBrowserSummarizerApiBaseUri,
      REACT_APP_API_URL_VERSION_TWO: `${window.location.origin}/otcs/cs.exe/api/v2`,
      CONTENT_SERVER_HOST_URL: `${window.location.origin}/otcs/cs.exe`,
      REACT_APP_LOGOUT_URL: `${window.location.origin}:8080/otdsws/logout`,
      BCA_ICON_URL: `${baseUrl}/img/csui/themes/carbonfiber/image/csui/headerbar_content_suite_platform_li.svg`,
      // SHOW_SUMMARIZER: process.env.SHOW_SUMMARIZER,
      // SHOW_SEARCH_LIST_FOLDER_LOCATION:
      //   process.env.SHOW_SEARCH_LIST_FOLDER_LOCATION,
    };

  return config;
}

module.exports = {
  Config,
  getBaseUrl,
  getBaseAppUrl,
  getBaseOTCSUrl,
  getOTDSUrl,
  getBaseAPIUrl,
  getAppRedirectUrl,
  getOTCSRestApiUrl,
};
