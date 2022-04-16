import { TextConfig } from "./TextConfig.js";

class Config{
    constructor(){
        this.componentsText = new TextConfig();
        this.linkText = new TextConfig();
        this.operationsText = new TextConfig();
        
    }
}

var configStyle = new Config();

export{configStyle};