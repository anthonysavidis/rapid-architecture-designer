var functionColors = {
    "ondrag": "#009dff",
    "attached": "#99ff00"
}

function alterConstantValue(key, value) {
    functionColors[key] = value;
    return;
}


export { functionColors, alterConstantValue };