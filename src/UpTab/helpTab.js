function addHelpTabListeners() {
    // loadSpecific("extendTest.txt");
    document.getElementById("helpButton").style.display = "inline-block";
    document.getElementById("helpButton").addEventListener("click", function() {
        console.log('Help button pressed');
    });

}

export { addHelpTabListeners }