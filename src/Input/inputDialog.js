function showInputDialog(message){
    let name = prompt(message, "");
    if (name == null || name == "")
      return null;
    return name;
}

export {showInputDialog};