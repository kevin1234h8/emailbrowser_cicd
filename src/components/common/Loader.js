import React from "react";
import  "../styles/loaderstyle.scss"

function Loader() {
  return (
    // <div className="loader">
    //   <div className="lds-ellipsis">
    //     <div></div>
    //     <div></div>
    //     <div></div>
    //     <div></div>
    //   </div>
    // </div>
    <div className="load-container binf-hidden"><div className="outer-border">
  <div className="loader1">
  </div>
  <div className="binf-sr-only" aria-label="Loading data, please wait." aria-live="polite" aria-busy="true">
  </div>
</div>
</div> 
  );
}

export default Loader;