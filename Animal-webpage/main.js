
var btn = document.getElementById('btn')
btn.addEventListener('click', function(){

    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET','https://learnwebcode.github.io/json-example/animals-1.json');
    ourRequest.onload = function(){
        var ourData = JSON.parse(ourRequest.responseText);
    };
    ourRequest.send();
}); 
