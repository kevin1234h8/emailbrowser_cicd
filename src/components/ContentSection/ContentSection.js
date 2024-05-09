import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ContentSection.scss";
import AGOApi from "../../api/AGOApi";
import Cookies from "universal-cookie";
import { GrFormClose, GrStatusWarning } from "react-icons/gr";
import { LinearProgress } from "@mui/material";
import summaryIcon from "../../components/assets/summary.png";
import summaryCopilotIcon from "../../components/assets/summary-copilot.png";
import axios from "axios";
const cookies = new Cookies();
let prevEmailId = -1;
const { Config } = require("../common/AppConfig");
const config = Config();

function ContentSection(props) {
  const [loading, setLoading] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [showSummarizer, setShowSummarizer] = useState(false);
  const [emailSummarizerBaseUrl, setEmailSummarizerBaseUrl] = useState("");

  // const showSummarizer = config.SHOW_SUMMARIZER;
  // const [emailSummary, setEmailSummary] = useState("");
  // const [canSeeContent, setCanSeeContent] = useState(true);
  // const [htmlContent, setHtmlContent] = useState("");
  useEffect(() => {
    const getShowSummarizer = async () => {
      try {
        const res = await axios.get(
          `${config.REACT_APP_API_URL}/folders/GetShowSummarizer`
        );
        if (res.status === 200) {
          setShowSummarizer(res.data);
        }
      } catch (err) {
        setShowSummarizer(false);
      }
    };
    getShowSummarizer();
  }, []);

  useEffect(() => {
    const getShowSummarizer = async () => {
      try {
        const res = await axios.get(
          `${config.REACT_APP_API_URL}/emails/GetEmailBrowserSummarizerApiBaseUri`
        );
        if (res.status === 200) {
          setEmailSummarizerBaseUrl(res.data);
        }
      } catch (err) {
        setEmailSummarizerBaseUrl(false);
      }
    };
    getShowSummarizer();
  }, []);

  const handleShowEmailSummaryContent = () => {
    props.setShowEmailSummaryContent(!props.showEmailSummaryContent);
  };

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(props.htmlContent, "text/html");
    const title = doc.querySelector(".MsoNormal > div")?.textContent;
    const emailBodyContentString = doc.querySelectorAll(".WordSection1 > p");
    const emailFromToCcDateStringg = Array.from(
      doc.querySelectorAll(`.MsoNormal > div > div > div `)
    )
      .map((pElement) => pElement.textContent.trim())
      .filter(Boolean)
      .join(" ");
    const emailFromToCcDate = emailFromToCcDateStringg.replace(
      /(To: [^\s]+)(Cc:)/,
      "$1 $2"
    );
    if (title && emailBodyContentString) {
      const emailBodyContent = Array.from(emailBodyContentString)
        .map((pElement) => pElement.textContent.trim())
        .filter(Boolean)
        .join(" ");
      let emailBody = `${emailFromToCcDate} ${emailBodyContent}`;
      emailBody = emailBody.trim().replace(/\n/g, "");
      setEmailBody(emailBody);
    }
  }, [props.htmlContent]);

  const getEmailSummaryContent = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${emailSummarizerBaseUrl}/summarize_email`,
        {
          emailBody,
        }
      );
      if (res.status === 200) {
        props.setEmailSummary(res.data.result);
        props.setShowEmailSummaryContent(true);
        setLoading(false);
      }
    } catch (err) {
      props.setShowEmailSummaryContent(true);
      setLoading(false);
    }
  };

  return props.isContentSectionLoading ? (
    <LinearProgress />
  ) : (
    <div>
      {showSummarizer ? (
        <div className="email-summary-container">
          <div
            className="email-summary-title d-flex align-items-center justify-content-between"
            style={{ padding: "0.5rem 1rem" }}
          >
            <div className="title"></div>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ gap: "16px" }}
            >
              <button
                onClick={getEmailSummaryContent}
                className="summarize-btn d-flex  justify-content-center align-items-center"
                style={{ gap: "8px", border: "none" }}
              >
                <img
                  src={summaryIcon}
                  alt="summary-icon"
                  className="summary-icon"
                />
                <div className="subtitle">Summarize</div>
              </button>
              <div className="d-flex align-items-center" style={{ gap: "4px" }}>
                <div
                  onClick={handleShowEmailSummaryContent}
                  className={`summary-icon ${
                    props.showEmailSummaryContent ? "rotate" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                    style={{ width: "20px", height: "20px" }}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
                <GrFormClose
                  size={24}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => props.setPreviewPaneHidden(true)}
                />
              </div>
            </div>
          </div>
          {loading ? <LinearProgress /> : null}
          <div className="email-summary-content">
            {props.showEmailSummaryContent ? (
              <>
                {/* <GrFormClose
                  size={24}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: 0,
                    cursor: "pointer",
                  }}
                  onClick={() => props.setShowEmailSummaryContent(false)}
                /> */}
                <div className="">
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <img
                      src={summaryCopilotIcon}
                      style={{ width: "20px", height: "20px" }}
                      alt="summary-copilot-icon"
                    />
                    <div
                      style={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: ".4rem",
                      }}
                    >
                      {/* <div style={{ fontSize: "13px", fontWeight: 600 }}>
                        Summary by Copilot
                      </div> */}
                      <div style={{ fontSize: "12px" }}>
                        {props.emailSummary !== "" || undefined
                          ? props.emailSummary
                          : " No relevant content found for summarization. Your emails are currently empty or don't contain content suitable for summarizing"}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <div style={{ position: "relative", padding: "0 1rem", height: "100%" }}>
        {showSummarizer ? null : (
          <GrFormClose
            size={24}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              cursor: "pointer",
            }}
            onClick={() => props.setPreviewPaneHidden(true)}
          />
        )}

        {props.canSeeContent ? (
          <div>
            {/* {props.isEmailContentExists ? ( */}
            <div dangerouslySetInnerHTML={{ __html: props.htmlContent }} />
            {/* ) : ( */}
            {/* <div>
              the requested email content does not exist or is currently
              unavailable.
            </div>
          )} */}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <GrStatusWarning size={24} />
            &nbsp;&nbsp;
            <b>You don't have the permission to see the content</b>
          </div>
        )}
      </div>
    </div>
  );
}

ContentSection.propTypes = {
  ContentIDSelected: PropTypes.number.isRequired,
};

export default ContentSection;
