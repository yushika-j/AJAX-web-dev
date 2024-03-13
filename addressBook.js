var webServiceUrl = "http://localhost:8080/AddressBookWebService/Service.svc";
var phoneValid = false; //indicates if the phone number is valid
var zipValip = false; //indicates if the zip code is valid

function showAddressBook(){
    document.getElementById("addEntry").style.display = "none";
    document.getElementById("addressBook").style.display = "block";
    callWebservice("getAllNames", parseData);
}   

function callWebService(methodAndArguments, callback){
    var requestUrl = webServiceUrl + "/" + methodAndArguments;
    try{
        var asyncRequest = new XMLHttpRequest();

        //setup callback function and store it
        asyncRequest.addEventListener("readystatechange", function(){ callback(asyncRequest);},false);
        //send async request
        asyncRequest.open("GET", requestUrl,true);
        asyncRequest.setRequestHeader("Accept", "application/json;charset=utf-8");
        asyncRequest.send();
    }
    catch(exception){
        alert("Request failed");
    }
}

//parse JSON data and display it on the page
function parseData(asyncRequest){
    if (asyncRequest.readyState == 4 && asyncRequest.status == 200){
        //convert json string into a javascript object
        var data = JSON.parse(asyncRequest.responseText);
        displayNames(data);
    }
}

function displayNames(data){    
    //get placeholder element from page
    var listBox = document.getElementById("Names");
    listBox.innerHTML = ""; //clear names
    //loop through data and add names to the list
    for(var i = 0;i < data.length; i++){
        var entry = document.createElement("div");
        var field = document.createElement("fieldset");
        entry.onclick = function() {
            getAddress(this, this.innerHTML);
        };
        entry.id = i;
        entry.innerHTML = data[i].First + " " + data[i].Last;
        field.appendChild(entry);
        listBox.appendChild(field);
    }
}

function search(input){
    var listBox = document.getElementById("Names");
    listBox.innerHTML = "";

    if (input == ""){
        showAddressBook();
    }else{
        callWebService("/search/" + input, parseData);
    }
}

function getAddress(entry, name){
    var firstLast = name.split(" ");
    var requestUrl = webServiceUrl + "/getAddress/" + firstLast[0] + "/" + firstLast[1];

    try{
        var asyncRequest = new XMLHttpRequest();

        asyncRequest.addEventListener("readystatechange", function(){ displayAddress(entry,asyncRequest);},false);
        asyncRequest.open("GET", requestUrl,true);
        asyncRequest.setRequestHeader("Accept", "application/json;charset=utf-8");
        asyncRequest.send();
    }catch(exception){
        alert("Request failed");
    }
}

function displayAddress(entry, asyncRequest){
    if (asyncRequest.readyState == 4 && asyncRequest.status == 200){
        var data = JSON.parse(asyncRequest.responseText);
        var name = entry.innerHTML;
        entry.innerHTML = name + "<br>" + data.Street + ", " + data.City + ", " + data.State + ", " + data.Zip + "<br>" + data.Telephone;
        //change event listener
        entry.onclick = function() {
        clearField(entry, name)
        }
    }
}

function clearField(entry, name) {
    entry.innerHTML = name; // set the entry to display only the name
    entry.onclick = function() { getAddress(entry, name); };
}

// display the form that allows the user to enter more data
function addEntry() {
    document.getElementById("addressBook").style.display = "none";
    document.getElementById("addEntry").style.display = "block";
}

// send the ZIP code to be validated and to generate city and state
function validateZip(zip) {
    callWebService("/validateZip/" + zip, showCityState);
}

// get city and state that were generated using the zip code
// and display them on the page
function showCityState(asyncRequest) {
    // display message while request is being processed
    document.getElementById("validateZip").innerHTML = "Checking zip...";

    // if request has completed successfully, process the response
    if (asyncRequest.readyState == 4) {
        if (asyncRequest.status == 200) {
            // convert the JSON string to an object
            var data = JSON.parse(asyncRequest.responseText);

            // update ZIP-code validity tracker and show city and state
            if (data.Validity == "Valid") {
                zipValid = true; // update validity tracker

                // display city and state
                document.getElementById("validateZip").innerHTML = "";
                document.getElementById("city").innerHTML = data.City;
                document.getElementById("state").
            }
        }
    }
}
