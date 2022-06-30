import { constantNames } from "../config/constantNames.js";

// const cancelSave = (closeBox) => {
//     closeBox();
// }

const confirmSave = (closeBox, callBack, projectName) => {
    if (!projectName) {
        callBack(constantNames["emptyNames"][""]);
    } else
        callBack(projectName);
    closeBox();
}

const dontSaveProjectCallback = () => {
    location.reload();
}


const modalCallbacksDispatch = {
    "dontSave": dontSaveProjectCallback,
    "save": confirmSave
}

export { modalCallbacksDispatch }