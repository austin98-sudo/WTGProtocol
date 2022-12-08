displayControl();
let currentColor = document.getElementById("colorDisplay");

document.getElementById("viewGrid").addEventListener("click", () => {
    document.getElementById("main").style.display = "none";
    document.getElementById("colorGrid").style.display = "grid";
});

document.addEventListener('click', (e) => {
    if (e.target.classList[0] == "back") {
        currentColor.innerHTML = "";
        displayControl();
    } else if (e.target.classList[0] == "backToGrid") {
        currentColor.innerHTML = "";
        displayControl("colorGrid", "grid")
    }
});

document.querySelectorAll(".mainBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        //displayControl(e.target.value, "block");
        switch(e.target.value) {
            case "pink":
                currentColor.innerHTML = pink;
                break;
            case "red":
                currentColor.innerHTML = red;
                break;
            case "purple":
                currentColor.innerHTML = purple;
                break;
            case "yellow":
                break;
            case "white":
                break;
            case "blue":
                break;
            case "orange":
                break;
            case "green":
                break;
            default: //default is green
                break;
        }
        displayControl("colorDisplay", "grid")
    })
});

let coords1 = [];
let coords2 = [];

document.getElementById("takePicture").addEventListener("input", (e) => { 
    //once picture has been taken it will display image
    displayControl("picture","block");
    document.getElementById("imageMeasure").src = URL.createObjectURL(e.target.files[0]);
    alert("Click on the top of the reference card then click on the bottom of the reference card");
    let imageEvent = document.getElementById("imageMeasure").addEventListener("click", (pos) => { 
        //user will click two points then listener will be removed
        if (coords1.length < 2) {
            coords1.push(pos.clientX);
            coords1.push(pos.clientY);
        } else {
            coords2.push(pos.clientX);
            coords2.push(pos.clientY);
        }
        if (coords1.length == 2 && coords2.length == 2) { //program will deteremine appropriate color in the future
            console.log(Math.hypot(coords1[0] - coords2[0] , coords1[1] - coords2[1]));
            displayControl("colorGrid","grid");
        }
    });
});

function displayControl(type = "hideAll", displayStyle) {
    let containers = ["main","colorGrid", "picture"];
    //hides all containers then displays main menu unless specified
    containers.forEach((e) => {
        document.getElementById(e).style.display = "none";
    });

    if (type != "hideAll") {
        document.getElementById(type).style.display = displayStyle;
    } else {
        document.getElementById("main").style.display = "flex";
    }
}