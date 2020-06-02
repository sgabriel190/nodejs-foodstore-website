function addToList() {
    let elem = document.getElementById("input_produs").value;
    $.post("/add-to-list", {
        elem: elem
    }, (data, status) => {
        console.log(data + " " + status);
    });
}

function addToBasket() {
    let elem = document.getElementById("input_produs").value;
    $.post("/add-to-basket", {
        elem: elem
    }, (data, status) => {
        console.log(data + " " + status);
    });
}