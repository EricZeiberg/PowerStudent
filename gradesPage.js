var totalPoints
var categories = []
var currentGrade = 0

var assignmentNodes = []

var amountOfRows = 0

function parseWeightingSystem() {
  quarter = window.location.href.split("&fg=")[1] // Grab what quarter the page is in from URL parameters
  weightNodes = document.querySelectorAll('[data-prtname="' + quarter + '"]')
  if (weightNodes.length > 1) {
    totalPoints = false
    for (i = 0; i < weightNodes.length; i++) {
      node = weightNodes[i]
      var category = {
        name: node.getAttribute("data-catname"),
        weight: parseFloat(node.getAttribute("data-w")),
        balancedWeight: parseFloat(node.getAttribute("data-w")),
        discard: node.getAttribute("data-ls"),
        ave: 0,
        assignments: [],
        extraCredit: 0
      }
      categories.push(category)
    }
  } else {
    totalPoints = true
  }
}

function calculateCurrentGrade(process) {
  if (totalPoints) {
    var numerator = 0
    var denominator = 0
    for (i = 2; i < assignmentNodes.length; i += 2) {
      node = assignmentNodes[i]
      if (node.nodeType === 3) {
        continue
      }

      colValues = node.childNodes
        // Check if assignment (or score) not included in final grade
      if (colValues[23].childNodes[0].style.display === "inline" || colValues[21].childNodes[0].style.display === "inline") {
        continue
      }
      score = colValues[9].textContent
      earned = score.split("/")[0]
      total = score.split("/")[1]
      if (earned === "--" | total === "--") {
        continue;
      }
      numerator += parseFloat(earned)
      denominator += parseFloat(total)
    }
    currentGrade = (numerator / denominator)
    return [numerator, denominator]
  } else {
    for (i = 0; i < categories.length; i++) {
      categories[i].assignments = []
      categories[i].extraCredit = 0
    }
    for (i = 2; i < assignmentNodes.length; i += 1) {
      node = assignmentNodes[i]
      if (node.nodeType === 3) {
        continue
      }
      colValues = node.childNodes
        // Check if assignment (or score) not included in final grade
      if (colValues[23].childNodes[0].style.display === "inline" || colValues[21].childNodes[0].style.display === "inline") {
        continue
      }

      categoryText = colValues[3].textContent
      var category
      for (i2 = 0; i2 < categories.length; i2++) {
        if (categories[i2].name === categoryText) {
          category = categories[i2]
        }
      }
      if (category === null) {
        console.log("Category " + categoryText + " is not recognized. Something has gone wrong")
        continue
      }

      score = colValues[9].textContent
      earned = score.split("/")[0]
      total = score.split("/")[1]


      if (earned === "--" | total === "--") {
        continue;
      }
      earned = parseFloat(earned)
      total = parseFloat(total)
      if (total === 0) {
        category.extraCredit += earned

      } else {
        category.assignments.push([earned, total, (earned / total)])
      }
    }
    if (process) {
      processWeighedGrading()
    }

  }
}

function processWeighedGrading() {

  for (i = 0; i < categories.length; i++) {
    category = categories[i]
  //Low score discarding, sorts assignments by score and removes lowest grade(s) from array
  category.assignments = bubbleSort(category.assignments)

  if (category.assignments.length < category.discard) { // If category discards more grades than are currently in, only discard the available grades
    category.discard = category.assignments.length
  }

  if (category.assignments.length > 1 && category.discard > 0) {
    category.assigments = category.assignments.splice(0, category.discard)
  }
}
  // If certain category has no assignments in it yet, weight from that category is distributed evenly among all other valid categories. Needs to be tested more.
  nonNullCats = categories.length
  distributedWeight = 0
  for (i = 0; i < categories.length; i++) {
    if (categories[i].assignments.length < 1) { // Calculates all null categories
      nonNullCats--
      distributedWeight += parseFloat(categories[i].weight)
    }
  }
  singularDW = (distributedWeight / nonNullCats) // Averages out weight to give to each valid category
  document.getElementById("cat-Desc").innerHTML = "<strong>--Category Rundown--</strong><br>"
  for (i = 0; i < categories.length; i++) {
    category = categories[i]
    if (category.assignments.length > 0) {
      category.balancedWeight = category.weight
      category.balancedWeight += singularDW
    } else {
      continue
    }

    numerator = 0
    denominator = 0
    for (i2 = 0; i2 < category.assignments.length; i2++) {

      numerator += category.assignments[i2][0]
      denominator += category.assignments[i2][1]
    }
    catPercentage = Math.floor((numerator / denominator) * 100) / 100;
    document.getElementById("cat-Desc").innerHTML = document.getElementById("cat-Desc").innerHTML + "<strong>" + category.name
    + ": </strong>" + catPercentage + " * " + category.balancedWeight + "% (weight)"  + "<br>"
    categoryScore = ((numerator + category.extraCredit) / denominator) * (category.balancedWeight * .01)  // The final calculation, where the magic happens

    currentGrade += categoryScore
  }
}

function insertHTML() {
  if (totalPoints) {
    htmlToInsert = '<form style="padding-left:22px" action=""><em>Total points grading system detected</em></form>';
    htmlToInsert += '<form style="padding-left:22px" action=""><center><strong>Add assignment</strong><center><input type="button" id="updateButton" value="Update Final Grade"><input type="button" id="addRowButton" value="Add row"></form>';
    htmlToInsert += '<table id="points" border=1><tr><th style="z-index:1; text-align:center">Earned Points</th><th align="center">Total Points</th></tr>';
    htmlToInsert += '<tr><td align="center"><input style="text-align:center" value="0" type="text" id="Earned-0"></td>';
    htmlToInsert += '<td align="center"><input style="text-align:center" value="0" type="text" id="Total-0"></td>';
  } else {
    htmlToInsert = '<form style="padding-left:22px" action=""><em>Weighted grading system detected</em><br><div id="cat-Desc" style="padding-left:22px"></div></form>';
    htmlToInsert += '<form style="padding-left:22px" action=""><center><strong>Add assignment</strong><center><input type="button" id="updateButton" value="Update Final Grade"><input type="button" id="addRowButton" value="Add row"></form>';
    htmlToInsert += '<table id="points" border=1><tr><th style="text-align:center">Category</th><th style="text-align:center">Earned Points</th><th align="center">Total Points</th></tr>';
    htmlToInsert += '<tr><td align="center"><select id="catList-0">'
    for (i = 0; i < categories.length; i++) {
      category = categories[i]
      name = category.name.split(" ")[0]
      htmlToInsert += "<option value=&quot;" + name + "&quot;> " + category.name + "</option>"
    }
    htmlToInsert += '</td>';
    htmlToInsert += '<td align="center"><input style="text-align:center" value="0" type="text" id="Earned-' + amountOfRows + '"></td>';
    htmlToInsert += '<td align="center"><input style="text-align:center" value="0" type="text" id="Total-' + amountOfRows + '"></td>';

  }
  var content = document.getElementById("content-main");
  var newNode = document.createElement("div");
  newNode.innerHTML = htmlToInsert;
  this.newNode = newNode;


  var target = document.getElementById("assignmentScores");

  content.getElementsByTagName('div')[2].parentNode.insertBefore(newNode, target);

  document.getElementById("updateButton").addEventListener("click", reCalculate, false);
  document.getElementById("addRowButton").addEventListener("click", addRow, false);

  // Add in remove row and button
  headerNode = assignmentNodes[0]
  var th = document.createElement("th");
  th.innerHTML = 'Options';
  var att = document.createAttribute("class");
  att.value = "center";
  th.setAttributeNode(att);
  headerNode.appendChild(th);
  for (i = 1; i < assignmentNodes.length; i++) {
    node = assignmentNodes[i]
    if (node.nodeType === 3) {
      continue
    }
    var td = document.createElement("td");
    var att = document.createAttribute("align");
    att.value = "center";
    td.setAttributeNode(att);
    td.innerHTML = '<input type="button" style="margin: 0px; font-size: 75%;" id="removeButton-' + (i / 2) + '" value="X">';
    node.appendChild(td);

    // Prepare for weird scope stuff, since I need to pass i by value to removeRow
    (function(i)
    {
      document.getElementById("removeButton-" + (i /2)).addEventListener("click", function() {
        removeRow(i)
      }, false);

    })(i);
  }
}

function removeRow(i) {
  document.getElementById("removeButton-" + (i / 2)).parentElement.parentElement.remove()
  assignmentNodes = document.getElementById("assignmentScores").getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].childNodes
}

function reCalculate() {
  if (totalPoints) {
    valueArray = calculateCurrentGrade(true)
    for (i = 0; i <= amountOfRows; i++) {
      earned = document.getElementById("Earned-" + i)
      total = document.getElementById("Total-" + i)
      valueArray[0] += parseFloat(earned.value)
      valueArray[1] += parseFloat(total.value)
      currentGrade = (valueArray[0] / valueArray[1])
    }
  } else {  // A bit of code reuse, TODO fix this
    currentGrade = 0
    calculateCurrentGrade(false)
    for (i = 0; i <= amountOfRows; i++) {

      earned = parseFloat(document.getElementById("Earned-" + i).value)
      total = parseFloat(document.getElementById("Total-" + i).value)
      if (earned === 0 && total === 0) {
        continue;
      }
      var e = document.getElementById("catList-" + i);
      var selectedCatText = e.options[e.selectedIndex].text;
      category = null
      for (i2 = 0; i2 < categories.length; i2++) {
        if (categories[i2].name === selectedCatText) {
          category = categories[i2]
        }
      }
      if (category === null) {
        console.log("Category not recognized, please send help")
        continue
      }
      if (total === 0) {
        category.extraCredit += earned
      } else {
        category.assignments.push([earned, total, (earned / total)])
      }

    }
    processWeighedGrading()
  }
  updateGradeDisplay()
}

function updateGradeDisplay() {
  classDetail = document.getElementById("classDetail")
  node = classDetail.getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[1]
  row = node.getElementsByTagName("td")[3]

  processedGrade = (currentGrade * 100)
  letterGrade = "??" // Get ready for the horror of calculating letter grades
  if (processedGrade >= 90) {
    letterGrade = "A"
  } else if (processedGrade >= 80) {
    letterGrade = "B"
  } else if (processedGrade >= 70) {
    letterGrade = "C"
  } else if (processedGrade >= 60) {
    letterGrade = "D"
  } else if (processedGrade >= 50) {
    letterGrade = "F"
  }
  processedGrade = processedGrade.toString().substring(0, 4)
  decimalPlace = parseInt(processedGrade.split(".")[0].substring(1, 2))
  // Technically, x9.5 gets rounded up to next letter grade, but I'm not going to make this more ugly than it already is.
  sign = ""
  if (decimalPlace >= 0 && decimalPlace <= 3) {
    sign = "-"
  } else if (decimalPlace > 3 && decimalPlace <= 5) {
    sign = ""
  } else {
    sign = "+"
  }
  row.innerHTML = letterGrade + sign + "  " + processedGrade + "%"
}

function addRow() {
  amountOfRows++
  if (totalPoints) {
    htmlToInsert = '<tr><td align="center"><input style="text-align:center" value="0" type="text" id="Earned-' + amountOfRows + '"></td>';
    htmlToInsert += '<td align="center"><input style="text-align:center" value="0" type="text" id="Total-' + amountOfRows + '"></td>';
    var table = document.getElementById("points");

    var row = table.insertRow(-1);
    var cell1 = row.insertCell(-1);
    var cell2 = row.insertCell(-1);

    cell1.innerHTML = '<tr><td><input style="text-align:center" value="0" type="text" id="Earned-' + amountOfRows + '"></td>';
    cell2.innerHTML = '<td><input style="text-align:center" value="0" type="text" id="Total-' + amountOfRows + '"></td>';

    cell1.setAttribute("align", "center");
    cell2.setAttribute("align", "center");
  } else { // Another area of code reuse, TODO fix this
    htmlToInsert = '<select id="catList-' + amountOfRows + '">'
    for (i = 0; i < categories.length; i++) {
      category = categories[i]
      name = category.name.split(" ")[0]
      htmlToInsert += "<option value=&quot;" + name + "&quot;> " + category.name + "</option>"
    }
    var table = document.getElementById("points");

    var row = table.insertRow(-1);
    var cell1 = row.insertCell(-1);
    var cell2 = row.insertCell(-1);
    var cell3 = row.insertCell(-1)

    cell1.innerHTML = htmlToInsert
    cell2.innerHTML = '<td align="center"><input style="text-align:center" value="0" type="text" id="Earned-' + amountOfRows + '"></td>';
    cell3.innerHTML = '<td align="center"><input style="text-align:center" value="0" type="text" id="Total-' + amountOfRows + '"></td>';

    cell1.setAttribute("align", "center");
    cell2.setAttribute("align", "center");
    cell3.setAttribute("align", "center");
  }

}

function bubbleSort(arr) { // not my code, please dont sue
  var len = arr.length;
  for (var i = len - 1; i >= 0; i--) {
    for (var j = 1; j <= i; j++) {
      if (arr[j - 1][2] > arr[j][2]) {
        var temp = arr[j - 1];
        arr[j - 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}

$(document).ready(function() {
  assignmentNodes = document.getElementById("assignmentScores").getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].childNodes

  parseWeightingSystem()
  calculateCurrentGrade(false)
  insertHTML()
})
