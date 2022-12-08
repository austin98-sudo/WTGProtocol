document.querySelectorAll("#listBackMenu, #backMenu").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("codeList").style.display = "none";
    document.getElementById("codeAlert").style.display = "none";
    document.getElementById("codeMenu").style.display = "grid";
    document.getElementById("header").style.display = "block";
  });
});

document.getElementById("previousCode").addEventListener("click", () => {
  document.getElementById("codeMenu").style.display = "none";
  document.getElementById("codeList").style.display = "block";

  generateCodeList();
});

document.getElementById("backList").addEventListener("click", () => {
  //change view
  document.getElementById("codeListDisplay").style.display = "block";
  document.getElementById("codeDisplay").style.display = "none";

  //change button
  document.getElementById("listBackMenu").style.display = "block";
  document.getElementById("backList").style.display = "none";
});

function generateCodeList() {
  document.getElementById("codeListDisplay").innerHTML = "";

  //get list of previous codes
  Object.keys(localStorage).forEach((code) => {
    let div = document.createElement("div");

    let codeTitle = document.createElement("span");
    codeTitle.textContent = code;
    codeTitle.onclick = function () {
      document.getElementById("codeListDisplay").style.display = "none";
      document.getElementById("codeDisplay").style.display = "block";

      document.getElementById("listBackMenu").style.display = "none";
      document.getElementById("backList").style.display = "block";

      document.getElementById("codeDisplay").innerHTML = "";

      //generate list from code;
      let codeArray = localStorage.getItem(code).split(",");
      codeArray.forEach((item) => {
        let lineItem = document.createElement("li");
        lineItem.textContent = item;

        document.getElementById("codeDisplay").append(lineItem);
      });
    };
    div.append(codeTitle);

    let deleteBtn = document.createElement("span");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.float = "right";
    deleteBtn.onclick = function () {
      localStorage.removeItem(code);
      generateCodeList();
    };
    div.append(deleteBtn);

    document.getElementById("codeListDisplay").append(div);
  });
}
