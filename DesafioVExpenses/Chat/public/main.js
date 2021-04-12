

document.getElementById("load-data").addEventListener("click", function () {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //alert(this.responseText);
            document.getElementById('page-title').innerHTML = this.responseText;
        }
    };
    ajax.open("GET", "data.txt", true);
    ajax.send();
});