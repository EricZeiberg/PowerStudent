var amountOfColumms = 0
var amountOfCourses = 0
var courseData = []


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
  links = gridNode.getElementsByTagName("a");
  tempData = []
  for (i = 0; i < links.length; i++){
      if (links[i].href.search("scores.html") !== -1){
        if (links[i].textContent === "--"){
          tempData.push("--")
        }
        else {
          score = links[i].textContent.replace(/[^\d.-]/g, '');
          tempData.push(score)
        }
      }
  }
  for (i=0, j=tempData.length; i<j; i+=amountOfColumms) {
    temparray = tempData.slice(i,i+amountOfColumms);
    courseData.push(temparray)
  }
  console.log(courseData)
}






$(document).ready(function() {
  parsePage()
})
