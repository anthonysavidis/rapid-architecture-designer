import { items } from "../Classes/ItemArray.js";
import { renderLine } from "../Item/createLine.js";

var zoom = 1;

function reRenderAllLines() {
    for(var i=0;i<items.itemList.length;i++){
        if(items.itemList[i]._type==="Component"){
            var id =items.itemList[i]._id;
            $('#'+items.itemList[i]._id).css('transform', 'scale(' + zoom + ')');
            document.getElementById(id).style.top = document.getElementById(id).style.top/100;
            document.getElementById(id).style.left = document.getElementById(id).style.left/100;
            if(i===0)
            renderLine(items.itemList[i]._id);
        }

    }    
}

function initializeZoomActions(params) {
    
    $('#zoomInButton').on('click', function(){
        zoom += 0.1;
        $('.workspace').css('transform', 'scale(' + zoom + ')');
        console.log(document.getElementById(items.itemList[0]._id).getBoundingClientRect());
        reRenderAllLines();
    });
    // $('.zoom-init').on('click', function(){
    //     zoom = 1;
    //     $('.target').css('transform', 'scale(' + zoom + ')');
    // });
    $('#zoomOutButton').on('click', function(){
        zoom -= 0.1;
        $('.workspace').css('transform', 'scale(' + zoom + ')');
        reRenderAllLines();

    });

}    

export {initializeZoomActions,zoom};