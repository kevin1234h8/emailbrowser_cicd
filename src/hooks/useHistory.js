// import { useState } from "react";
// import { useLocation } from "react-router";

// export const useHistory = () => {
    
//     const { key } = useLocation();
    
//     const [history, setHistory] = useState([]);
//     const [currentKey, setCurrentKey] = useState(null);
//     const [previousKey, setPreviousKey] = useState(null);

//     const contemporaneousHistory = history.includes(key)
//         ? history
//         : [...history, key];
//     const index = contemporaneousHistory.indexOf(key);
//     const isHistoricRoute = index + 1 < contemporaneousHistory.length;
//     const state = { index, isHistoricRoute, key, previousKey };

//     if (history !== contemporaneousHistory) setHistory(contemporaneousHistory);

//     if (key !== currentKey) {
//         setPreviousKey(currentKey);
//         setCurrentKey(key);
//     }

//     return state;
// }