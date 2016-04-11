var totalPoints
var categories = []

function parseWeightingSystem() {
    weightNodes = document.querySelectorAll('[data-prtname="Q1"]')
    if (weightNodes.length > 0){
      totalPoints = false
      for (i = 0; i < weightNodes.length; i++){
        node = weightNodes[i]
        var category = {
          name:node.getAttribute("data-catname"),
          weight:node.getAttribute("data-w"),
          discard:node.getAttribute("data-ls")
        }
        categories.push(category)
      }
    }
    else {
      totalPoints = true
    }
}

function calculateCurrentGrade(){
  if (totalPoints){
    assignmentNodes = document.getElementById("assignmentScores").childNodes
    for (i = 1; i < assignmentNodes.length; i++){
      node = assignmentNodes[i]
      if (node.tagName === "tr"){
        colValues = node.childNodes
        score = colValue[4]
        
      }
    }
  }
}

function insertHTML(){
   htmlToInsert ='<table id="points" border=1><tr><th style="z-index:1; text-align:center">Earned Points</th><th align="center">Total Points</th><th align="center">Update Grade</th></tr>';
   htmlToInsert +='<tr><td align="center"><input style="text-align:center" value="1" type="text" id=\"Earn\"></td>';
   htmlToInsert +='<td align="center"><input style="text-align:center" value="2" type="text" id=\"Tot\"></td>';
   htmlToInsert +='<td align="center"><input style="text-align:center" value="3" type="text" id=\"Percent\"></td>';

   var content = document.getElementById("content-main");
   var newNode = document.createElement("div");
   newNode.innerHTML = htmlToInsert;
   this.newNode = newNode;


   var target = document.getElementById("assignmentScores");

   content.getElementsByTagName('div')[2].parentNode.insertBefore(newNode, target);
}


$(document).ready(function() {
  parseWeightingSystem()
  insertHTML()
})
