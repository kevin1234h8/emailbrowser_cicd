import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AGOApi from "../../api/AGOApi";
import { LinearProgress } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

export default function BasicTable(props) {
    const [pathData, setPathData] = useState([]);
    const [isLoading, setIsLoading]  = useState(false);

    const useStyles = makeStyles({
        iconCloseButton: {
          color: "white"
        },
        content: {
            paddingTop: "20px"
        },
        contentHeader: {
          "&>h2": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          },
          background: "linear-gradient(61deg, #090e2c 0, #122c69 59%, #078db3 100%)",
          backgroundColor: "#111b58",
          backgroundAttachment: "fixed",
          color: "white",
        },
    });
    
    const classes = useStyles();

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            const response = await AGOApi.getFoldersPath(props.nodeID)
            if (response !== null) {
                setPathData(response.data)
                setIsLoading(false)

            }
        }
        fetchData()
    },[]);

    return (
        <Dialog open={true} fullWidth maxWidth={'md'} scroll={'body'} onClose={props.closeDialog}>
            <DialogTitle className={classes.contentHeader} >
                <h4>Path</h4>
                <IconButton aria-label="close" onClick={props.closeDialog}>
                    <CloseIcon className={classes.iconCloseButton} />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.content} >
                {isLoading ? <LinearProgress /> : null }
                <h5>{pathData.length > 0 && pathData.map(data => data.Name).toString().replaceAll(',', ' / ')}</h5>
            </DialogContent>
        </Dialog>
      );
}