// Function use on mouseover event atribute
function mouseHoverAuthButton() {
    document.getElementById("buton_autentificare").style.transition = "0.3s";
    document.getElementById("buton_autentificare").style.color = "#003d4d";
}

// Function use on mouseout event atribute
function mouseOutAuthButton() {
    document.getElementById("buton_autentificare").style.color = "white";
}

// Function use on mouseover event atribute
function mouseOverSearch() {
    document.getElementById("search_button").style.transition = "0.3s";
    document.getElementById("search_button").style.backgroundColor = "#309900";
    document.getElementById("search_button").style.color = "white";
}

// Function use on mouseout event atribute
function mouseOutSearch() {
    document.getElementById("search_button").style.backgroundColor = "#ddd";
    document.getElementById("search_button").style.color = "black";
}