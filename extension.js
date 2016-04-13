var totalPoints
var categories = []
var currentGrade
var numerator = 0
var denominator = 0
var amountOfRows = 0

function parseWeightingSystem() {
  weightNodes = document.querySelectorAll('[data-prtname="Q1"]')
  if (weightNodes.length > 1) {
    totalPoints = false
    for (i = 0; i < weightNodes.length; i++) {
      node = weightNodes[i]
      var category = {
        name: node.getAttribute("data-catname"),
        weight: node.getAttribute("data-w"),
        discard: node.getAttribute("data-ls")
      }
      categories.push(category)
    }
  } else {
    totalPoints = true
  }
}

function calculateCurrentGrade() {
  if (totalPoints) {
    assignmentNodes = document.getElementById("assignmentScores").getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].childNodes
    for (i = 2; i < assignmentNodes.length; i += 2) {
      node = assignmentNodes[i]
      colValues = node.childNodes
      score = colValues[9].textContent
      earned = score.split("/")[0]
      total = score.split("/")[1]
      if (earned === "--" | total === "--"){
        continue;
      }
      numerator += parseFloat(earned)
      denominator += parseFloat(total)
    }
    currentGrade = (numerator / denominator)
  }
}

function insertHTML() {
  if (totalPoints){
    htmlToInsert = '<form style="padding-left:22px" action=""><em>Total points grading system detected</em></form>';
    htmlToInsert += '<form style="padding-left:22px" action=""><center><strong>Add assignment</strong><center><input type="button" id="updateButton" value="Update Final Grade"><input type="button" id="addRowButton" value="Add row"></form>';
    htmlToInsert += '<table id="points" border=1><tr><th style="z-index:1; text-align:center">Earned Points</th><th align="center">Total Points</th></tr>';
    htmlToInsert += '<tr><td align="center"><input style="text-align:center" value="0" type="text" id="Earned-'+amountOfRows+'"></td>';
    htmlToInsert += '<td align="center"><input style="text-align:center" value="0" type="text" id="Total-'+amountOfRows+'"></td>';


    var content = document.getElementById("content-main");
    var newNode = document.createElement("div");
    newNode.innerHTML = htmlToInsert;
    this.newNode = newNode;


    var target = document.getElementById("assignmentScores");

    content.getElementsByTagName('div')[2].parentNode.insertBefore(newNode, target);

    document.getElementById("updateButton").addEventListener("click", reCalculate, false);
    document.getElementById("addRowButton").addEventListener("click", addRow, false);

  }
  else {

  }

}

function reCalculate(){
  numerator = 0
  denominator = 0
  calculateCurrentGrade()
  for (i = 0; i <= amountOfRows; i++){
    earned = document.getElementById("Earned-" + i)
    total = document.getElementById("Total-" + i)
    numerator += parseFloat(earned.value)
    denominator += parseFloat(total.value)
    currentGrade = (numerator / denominator)
  }
  updateGradeDisplay()
}

function updateGradeDisplay(){
  classDetail = document.getElementById("classDetail")
  node = classDetail.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[1]
  row = node.getElementsByTagName("td")[3]

  processedGrade = (currentGrade * 100)
  letterGrade = "??" // Get ready for the horror of calculating letter grades
  if (processedGrade >= 90){
    letterGrade = "A"
  }
  else if (processedGrade >= 80){
    letterGrade = "B"
  }
  else if (processedGrade >= 70){
    letterGrade = "C"
  }
  else if (processedGrade >= 60){
    letterGrade = "D"
  }
  else if (processedGrade >= 50){
    letterGrade = "F"
  }
  processedGrade = processedGrade.toString().substring(0, 4)
  decimalPlace = parseInt(processedGrade.split(".")[0].substring(1, 2))
  sign = ""
  console.log(decimalPlace)
  if (decimalPlace >= 0 && decimalPlace <= 3){
    sign = "-"
  }
  else if (decimalPlace > 3 && decimalPlace <= 5){
    sign = ""
  }
  else{
    sign = "+"
  }
  row.innerHTML = letterGrade + sign + "  " + processedGrade + "%"
}

function addRow(){
  amountOfRows++
  htmlToInsert = '<tr><td align="center"><input style="text-align:center" value="0" type="text" id="Earned-'+amountOfRows+'"></td>';
  htmlToInsert += '<td align="center"><input style="text-align:center" value="0" type="text" id="Total-'+amountOfRows+'"></td>';
  var table = document.getElementById("points");

  var row = table.insertRow(-1);
  var cell1 = row.insertCell(-1);
  var cell2 = row.insertCell(-1);

  cell1.innerHTML = '<tr><td><input style="text-align:center" value="0" type="text" id="Earned-'+amountOfRows+'"></td>';
  cell2.innerHTML = '<td><input style="text-align:center" value="0" type="text" id="Total-'+amountOfRows+'"></td>';

  cell1.setAttribute("align", "center");
  cell2.setAttribute("align", "center");
}


$(document).ready(function() {
  parseWeightingSystem()
  calculateCurrentGrade()
  insertHTML()
})
