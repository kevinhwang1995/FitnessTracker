var req = new XMLHttpRequest();
req.open("GET", "/get-data", true);
req.setRequestHeader('Content-Type', 'application/json');
req.addEventListener('load',function(){
  if(req.status >= 200 && req.status < 400)
    makeTable(JSON.parse(req.responseText));
 });
req.send();

function makeTable(dataArray){
  var tDiv = document.getElementById("workoutTable");
  if(tDiv.firstChild != null)
    tDiv.removeChild(tDiv.firstChild);
  var table = document.createElement("table");

  var hRow = document.createElement("tr");
  var hCell1 = document.createElement("th");
  var hCell2 = document.createElement("th");
  var hCell3 = document.createElement("th");
  var hCell4 = document.createElement("th");
  var hCell5 = document.createElement("th");
  var hCell6 = document.createElement("th");
  var hCell7 = document.createElement("th");

  hCell1.innerText = "Date";
  hCell2.innerText = "Name";
  hCell3.innerText = "Reps";
  hCell4.innerText = "Weight";
  hCell5.innerText = "Unit";
  hRow.appendChild(hCell1);
  hRow.appendChild(hCell2);
  hRow.appendChild(hCell3);
  hRow.appendChild(hCell4);
  hRow.appendChild(hCell5);
  hRow.appendChild(hCell6);
  hRow.appendChild(hCell7);

  table.appendChild(hRow);

  dataArray.forEach(function(row){
    var dataRow = document.createElement("tr");

    var dateCell = document.createElement("td");
    var nameCell = document.createElement("td");
    var repCell = document.createElement("td");
    var weightCell = document.createElement("td");
    var unitCell = document.createElement("td");
    var editCell = document.createElement("td");
    var deleteCell = document.createElement("td");

    if(row["date"] != null){
      dateCell.innerText = row["date"].substring(0,10);
    }
	nameCell.innerText = row["name"];
	repCell.innerText = row["reps"];
	weightCell.innerText = row["weight"];
    if(row["lbs"] == 1)
      unitCell.innerText = "LB";
    else if(row["lbs"] == 0)
      unitCell.innerText = "KG";
	  
    dataRow.appendChild(dateCell);
    dataRow.appendChild(nameCell);
    dataRow.appendChild(repCell);
    dataRow.appendChild(weightCell);
    dataRow.appendChild(unitCell);

    var form = document.createElement('form');
    var inputID = document.createElement('input');
    inputID.setAttribute('type',"hidden");
    inputID.setAttribute('value',row["id"]);
    var button = document.createElement('input');
    button.setAttribute('type',"button");
    button.setAttribute('value', "Edit");
    button.setAttribute('class', "edit");
    form.appendChild(inputID);
    form.appendChild(button);
    editCell.appendChild(form);
    dataRow.appendChild(editCell);

    var form = document.createElement('form');
    var inputID = document.createElement('input');
	inputID.setAttribute('type',"hidden");
	inputID.setAttribute('value',row["id"]);
    var button = document.createElement('input');
	button.setAttribute('type',"button");
	button.setAttribute('value', "Delete");
	button.setAttribute('class', "delete");
    form.appendChild(inputID);
    form.appendChild(button);
    deleteCell.appendChild(form);
    dataRow.appendChild(deleteCell);

    table.appendChild(dataRow);
  });
  tDiv.appendChild(table);

  var editButtons = document.getElementsByClassName("edit");
  for (var i = 0; i < editButtons.length; i++)
      editButtons[i].addEventListener('click', editEvent, false);

  var deleteButtons = document.getElementsByClassName("delete");
  for (var i = 0; i < deleteButtons.length; i++)
      deleteButtons[i].addEventListener('click', deleteEvent, false);
}

document.getElementById("addExercise").addEventListener("click", function(e){
  var req = new XMLHttpRequest();
  var payload = {date:null, name:null, reps:null, weight:null, unit:null};
    payload.date = document.getElementById('date').value || null;
    document.getElementById('date').value = null;
    payload.name = document.getElementById('name').value || null;
    document.getElementById('name').value = null;
    payload.reps = document.getElementById('reps').value || null;
    document.getElementById('reps').value = null;
    payload.weight = document.getElementById('weight').value || null;
    document.getElementById('weight').value = null;
    if(document.getElementById('unit').checked == true)
      payload.unit = 1;
    else
      payload.unit = 0;

    if(payload.name == null){
      alert("A workout must have a name.");
      e.preventDefault();
      return;
    }
  req.open("POST", "/add", true);
  req.setRequestHeader('Content-Type', 'application/json');

  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400)
      makeTable(JSON.parse(req.responseText));
    else 
        console.log("Error in network request: " + req.statusText);
  });
  req.send(JSON.stringify(payload));
  e.preventDefault();
});

function deleteEvent(event){
  var req = new XMLHttpRequest();
  var id = this.previousSibling.value;
  var payload = {"id":id};
  req.open("POST", "/delete", true);
  req.setRequestHeader("Content-Type","application/json");
  req.addEventListener("load",function(){
    if(req.status >= 200 && req.status < 400)
      makeTable(JSON.parse(req.responseText));
    else 
        console.log("Error in network request: " + req.statusText);
  });
  req.send(JSON.stringify(payload));
  event.preventDefault();
}

function editEvent(event){
  var uButtons = document.getElementsByClassName("update");
  if(uButtons.length > 0){
      alert("You are already updating a workout.");
      return;
  }
  var curRow = this.parentElement.parentElement.parentElement;
  var dateInput = document.createElement("input");
  dateInput.setAttribute("value",curRow.children[0].innerText);
  dateInput.setAttribute("type", "date");
  dateInput.setAttribute("id","updateDate");
  curRow.children[0].innerText = "";
  curRow.children[0].appendChild(dateInput);

  var nameInput = document.createElement("input");
  nameInput.setAttribute("value",curRow.children[1].innerText);
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("id","updateName");
  curRow.children[1].innerText = "";
  curRow.children[1].appendChild(nameInput);

  var repInput = document.createElement("input");
  repInput.setAttribute("value",curRow.children[2].innerText);
  repInput.setAttribute("type", "number");
  repInput.setAttribute("id","updateReps");
  repInput.setAttribute("class","num-input");
  curRow.children[2].innerText = "";
  curRow.children[2].appendChild(repInput);

  var weightInput = document.createElement("input");
  weightInput.setAttribute("value",curRow.children[3].innerText);
  weightInput.setAttribute("type", "number");
  weightInput.setAttribute("id","updateWeight");
  weightInput.setAttribute("class","num-input");
  curRow.children[3].innerText = "";
  curRow.children[3].appendChild(weightInput);
  
  var unitInput = document.createElement("select");
  unitInput.setAttribute("id","updateUnit");
    var option1 = document.createElement("option");
    option1.setAttribute("value","1")
    option1.innerText = "LB";
    unitInput.appendChild(option1);

    var option2 = document.createElement("option");
    option2.setAttribute("value","0")
    option2.innerText = "KG";
    unitInput.appendChild(option2);

  if(curRow.children[4].innerText == "LB")
    option1.selected = true;
  else
    option2.selected = true;
  curRow.children[4].innerText = "";
  curRow.children[4].appendChild(unitInput);

  var id = this.previousSibling.value;
  curRow.children[5].innerHTML = '';
  var form = document.createElement('form');
  var updateButton = document.createElement('form');
  var inputID = document.createElement('input');
  inputID.setAttribute('type',"hidden");
  inputID.setAttribute('value',id);
  var button = document.createElement('input');
  button.setAttribute('type',"button");
  button.setAttribute('value', "Save");
  button.setAttribute('class', "update");
  form.appendChild(inputID);
  form.appendChild(button);
  curRow.children[5].appendChild(form);

  button.addEventListener("click", updateEvent, false);
  event.preventDefault();
}

function updateEvent(event){
  var id = this.previousSibling.value;
  var req = new XMLHttpRequest();
  var payload = {id:null, date:null, name:null, reps:null, weight:null, unit:null};
  payload.date = document.getElementById('updateDate').value || null;
  payload.name = document.getElementById('updateName').value;
  payload.reps = document.getElementById('updateReps').value || null;
  payload.weight = document.getElementById('updateWeight').value || null;
  payload.unit = document.getElementById('updateUnit').value;
  payload.id = id;
  req.open("POST", "/update", true);
  req.setRequestHeader('Content-Type', 'application/json');

  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400)
      makeTable(JSON.parse(req.responseText));
    else 
        console.log("Error in network request: " + req.statusText);
  });
  req.send(JSON.stringify(payload));
  event.preventDefault();
}
