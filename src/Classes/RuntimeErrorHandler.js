import { layers } from "./LayerHolder";

class RuntimeErrorHandler {
    constructor() {

    }
    checkExistingLayerItemsLists(id) {
        if (id.includes("L")) {
            const index = layers.layerList.indexOf(el._id === id)
            return (index!==-1);
        }
        else {
            for (var l in layers.layerList) {
                const currentItemList =layers.itemMap.get(l._id); 
                for (var i in currentItemList) {
                    var itemIndex = currentItemList[i].indexOf(el._id===id);
                    if(itemIndex!==-1)
                        return true;
                }
            }
        }
    }
    checkCopiedObjectJSONForDublicateId(objectJSON) {
        for(var x in objectJSON["ItemMap"]){
            const layerExists = (x==="current")?false:this.checkExistingLayerItemsLists(x);
            if(layerExists)
                return true;
            var exists = false;
            for(var i in objectJSON[x]){
                exists=this.checkExistingLayerItemsLists(JSON.parse(objectJSON[x][i])._id);
                if(exists)
                    return true;
            }
        }
    }
    checkSavedObjectJSONForDublicateId(objectJSON) {

    }
    checkObjectJSONForDublicateId(objectJSON, isPaste) {
        if(isPaste){
            this.checkCopiedObjectJSONForDublicateId(objectJSON);
        }
        else{
            checkSavedObjectJSONForDublicateId(objectJSON);
        }
    }

    throwErrorMessage() { //via message box

    }
}