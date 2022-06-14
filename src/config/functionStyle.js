var functionColors = {
    "ondrag": "var(--operationDraggingColor)",
    "attached": "var(--operationSettedColor)"
}

function alterConstantValue(key, value) {
    functionColors[key] = value;
    return;
}


export { functionColors, alterConstantValue };