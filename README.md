################################################################################################
################################ AGO DEMO #########################################
################################################################################################

############Url to change############
############################
########.env###############
############################
####dev

REACT_APP_API_URL = http://localhost:54469/api/v1/ago
##type ViewAsHTML
REACT_APP_FRAME_URL_1 = http://localhost/otcs/cs.exe?func=ll&objid=
REACT_APP_FRAME_URL_2 = &objAction=ViewAsHTML
##type docview
REACT_APP_FRAME_URL_1 = http://localhost/otcs/cs.exe/view/
REACT_APP_FRAME_URL_2 = /1/?func=doc.View

##type viewDoc
REACT_APP_FRAME_URL_1 = http://localhost/otcs/cs.exe?func=doc.ViewDoc&nodeid=
REACT_APP_FRAME_URL_2 =
##type Brava
REACT_APP_FRAME_URL_1 = http://localhost/otcs/cs.exe?func=brava.bravaviewer&nodeid=
REACT_APP_FRAME_URL_2 =

##type properties
REACT_APP_VIEW_PROPERTIES_URL = http://localhost/otcs/cs.exe/app/nodes/
##type download
REACT_APP_DOWNLOAD_URL_1 = http://localhost/otcs/cs.exe?func=ll&objId=
REACT_APP_DOWNLOAD_URL_2 = &objAction=download
####prod
REACT_APP_API_URL = http://192.168.1.118/agoapi/api/v1/ago
REACT_APP_FRAME_URL_1 = http://192.168.1.118/otcs/cs.exe?func=ll&objid=
REACT_APP_FRAME_URL_2 = &objAction=ViewAsHTML

############################
########package.json#######
############################
####dev
"homepage": "http://localhost:3000/",

####prod
"homepage": "http://192.168.1.118/smartemail/",

############################
########index.html#######
############################
####AGO

<title>AGO EAMS Emails</title>

####PARL

<title>RMS Email Browser</title>

######################
####Deploy to IIS#####

1. npm run build
2. in IIS, create app pool, can be managed or unmanaged
3. in add application and point to the build directory
4. the app name has to match with the homepage is package.json and the basename in index.js

################################################################################################
################################################################################################
################################################################################################

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
