import { imageStorage } from "../../Classes/ImageHolder.js";

function restorePreviewImages(storageObj) {
    for (var x in storageObj) {
        imageStorage.save(x, storageObj[x])
    }
    return;
}

function savePreviewImages() {
    return imageStorage.toString();
}

export { restorePreviewImages, savePreviewImages };