var amountOfColumms = 0
var amountOfCourses = 0
var courseData = []
var courseNames = []

var gpaData = []

function parsePage(){
  outerNode = document.getElementsByClassName("center th2")[0]
  for (i = 7; i < outerNode.childNodes.length; i+=2){
    node = outerNode.childNodes[i]
    if (node.textContent !== "Absences"){
      amountOfColumms++;
    }
    else {
      break;
    }
  }

  gridNode = document.getElementsByClassName("grid")[0]
  tdElements = gridNode.getElementsByTagName("td");
  for (i = 0; i < tdElements.length; i++){
      if (tdElements[i].hasAttribute("align")) {
        courseNames.push(tdElements[i].textContent)
    }
  }


  links = gridNode.getElementsByTagName("a");
  tempData = []
  for (i = 0; i < links.length; i++){
      if (links[i].href.search("scores.html") !== -1){
        if (links[i].textContent === "--"){
          tempData.push("--")
        }
        else {
             score = links[i].textContent
          tempData.push(score)
        }
      }
  }
  for (i=0, j=tempData.length; i<j; i+=amountOfColumms) {
    temparray = tempData.slice(i,i+amountOfColumms);
    courseData.push(temparray)
  }

  for (i = 0; i < courseData[0].length; i++){
      currentGPATotal = 0.00
      courseTotal = 0
    for (j = 0; j < (amountOfColumms); j++){
            score = courseData[j][i]
            if (score === "--"){
                continue;
            }
            else {
                if (score.search("A") != -1){
                    currentGPATotal += 4.0;
                    courseTotal+=1;
                    if (courseNames[j].search("AP ") != -1) {
                        currentGPATotal += 0.5;
                    }
                    else if (courseNames[j].search("Honors ") != -1) {
                        currentGPATotal += 0.25;
                    }
                }
                else if (score.search("B") != -1){
                    currentGPATotal += 3.0;
                    courseTotal+=1;
                     if (courseNames[j].search("AP ") != -1) {
                        currentGPATotal += 0.5;
                    }
                    else if (courseNames[j].search("Honors ") != -1) {
                        currentGPATotal += 0.25;
                    }
                }
                else if (score.search("C") != -1){
                    currentGPATotal += 2.0;
                    courseTotal+=1;
                     if (courseNames[j].search("AP ") != -1) {
                        currentGPATotal += 0.5;
                    }
                    else if (courseNames[j].search("Honors ") != -1) {
                        currentGPATotal += 0.25;
                    }
                }
                else if (score.search("D") != -1){
                    currentGPATotal += 1.0;
                    courseTotal+=1;
                     if (courseNames[j].search("AP ") != -1) {
                        currentGPATotal += 0.5;
                    }
                    else if (courseNames[j].search("Honors ") != -1) {
                        currentGPATotal += 0.25;
                    }
                }
                else if (score.search("F") != -1){
                    currentGPATotal += 0.0;
                    courseTotal+=1;
                     if (courseNames[j].search("AP ") != -1) {
                        currentGPATotal += 0.5;
                    }
                    else if (courseNames[j].search("Honors ") != -1) {
                        currentGPATotal += 0.25;
                    }
                }

            }
        }
        gpaData.push([Math.round((currentGPATotal / courseTotal) * 100) / 100, i])
    }
}


function insertHTML(){
  gridNode = document.getElementsByClassName("grid")[0]
  thElements = gridNode.getElementsByTagName("th");

  for (i = 5; i < 13; i++){
    element = thElements[i]
    element.innerHTML = element.innerHTML + "<br><small><i>" + gpaData[i - 5][0].toString() + "</i></small>"
  }

}

$(document).ready(function() {
  parsePage()
  insertHTML()
})
