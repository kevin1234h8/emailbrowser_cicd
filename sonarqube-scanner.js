import scanner from "sonarqube-scanner"
scanner(
    {
        serverUrl: "http://localhost:9000",
        options: {
            "sonar.login": process.env.REACT_SONAR_USERNAME,
            "sonar.password": process.env.REACT_SONAR_PASSWORD,
            "sonar.projectName": "react_app",
            "sonar.projectDescription": "Just for demo...",
            "sonar.sourceEncoding":"UTF-8",
            "sonar.sources": ".",
            "sonar.test.inclusions": "**/*.test.tsx,**/*.test.ts",
            "sonar.exclusions": "**/*.test.tsx",
            "sonar.tests":"./src",
            "sonar.testExecutionReportPaths":"test-report.xml",
            "sonar.javascript.lcov.reportPaths":"coverage/lcov.info"
        },
    },
    () => process.exit()
);