var totalPoints
var categories = []
var currentGrade
var numerator = 0
var denominator = 0

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
      console.log(score)
      numerator += parseFloat(score.split("/")[0])
      denominator += parseFloat(score.split("/")[1])
    }
    currentGrade = (numerator / denominator)
    console.log(currentGrade)
  }
}

function insertHTML() {
  if (totalPoints){
    htmlToInsert = '<form style="padding-left:22px" action=""><em>Total points grading system detected</em></form>';
    htmlToInsert += '<form style="padding-left:22px" action=""><center><strong>Add assignment</strong><center><input type="button" id="updateButton" value="Update Final Grade"><input type="button" id="addRowButton" value="Add row"></form>';
    htmlToInsert += '<table id="points" border=1><tr><th style="z-index:1; text-align:center">Earned Points</th><th align="center">Total Points</th></tr>';
    htmlToInsert += '<tr><td align="center"><input style="text-align:center" value="0" type="text" id=\"Earn\"></td>';
    htmlToInsert += '<td align="center"><input style="text-align:center" value="0" type="text" id=\"Tot\"></td>';

    var content = document.getElementById("content-main");
    var newNode = document.createElement("div");
    newNode.innerHTML = htmlToInsert;
    this.newNode = newNode;


    var target = document.getElementById("assignmentScores");

    content.getElementsByTagName('div')[2].parentNode.insertBefore(newNode, target);
  }
  else {

  }

}


$(document).ready(function() {
  parseWeightingSystem()
  calculateCurrentGrade()
  insertHTML()
})
