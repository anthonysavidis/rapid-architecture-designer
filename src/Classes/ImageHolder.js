class ImageHolder {
    constructor(str) {
        if (str) {
            this.toObject(str);
            return;
        }
        this.imageMap = {};
        return;
    }
    save(key, context) {
        this.imageMap[key] = context;
    }
    get(key) {
        return this.imageMap[key];
    }
    remove(key) {
        delete this.imageMap[key];
    }
    toString() {
        return JSON.stringify(this.imageMap);
    }
    toObject(str) {
        delete this.imageMap;
        this.imageMap = JSON.parse(str);
        return;
    }
}

var imageStorage = new ImageHolder();
export { imageStorage };