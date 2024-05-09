[08/09/2023] v1.7 uat

## NEW FEATURE
- 

## IMPROVED
- 

## FIXED
- Advanced Search Filter 'From' and 'To' displaying 'No Results Found' even though there are emails that fits the criteria
- Advanced Search Filter 'Location' pagination behaving incorrectly when navigating between pages. (The total number of items will increase due to the selected Location filter being cleared when navigating to another page)
- Advanced Search Filter Displaying incorrect Paging information in the footer


## NOTE
-  


====================================================================================================================================
[21/04/2023] v1.6 prod

## NEW FEATURE
- 

## IMPROVED
- 

## FIXED
- Embedded Attachment not displaying properly in the Preview Panel
- Incorrect attachment file icon when viewing the Attachment List
- Incorrect sorting behavior
- Selected Search Period showing email(s) outside of the date after sorting through the 'Sent Date'
- Unable to search lowest filing folder
- Blank page appears after clicking the last page number of the returned search results


## NOTE
-  


====================================================================================================================================
Emailbrowser-web SGCustoms 
[20/01/2023] v1.5 uat 

## NEW FEATURE
- Add Search location in advance search
- Search Location option from API 'getFolderListByName'
- Get the Default folder defined in API config file. it will fetch from 'getDefaultFolder' then populate to the default search location.
- 

## IMPROVED
- notification Alert for Donwload limit. it will get the error messages from HTML body response.
- Left Panel 1st level folder is defined in API config file.
- await process on first load and show loading when still fetch.

## FIXED
- UI layout issue in advance serach more responsive.
- Removed Empty row data in Main panel. issue with 0kb file.
- issue on search pagination on next pages.


## NOTE
- the 2 default search option will get it from 1st and 2nd value from API config 'FolderUnderEnterprise'. 


====================================================================================================================================

Emailbrowser-web SGCustoms 
[04/01/2023] version 0.4 uat 

## NEW FEATURE
- Add more option in serach item right click to show folder path of the email results
- Add notification Alert when Download Limit is reached. 

## IMPROVED
- Reduced loading on search with Backend Pagination in search / advance search, it limit the results by 30 items of emails.
- 

## FIXED
- Commit Conflict because the history doesn't match with Latest SGCustoms-improvements Branch
- Download email now handled in front end. not just open the download URL in browser. so it need to handle buffer data from API response then save the downloaded files.


## NOTE
- 