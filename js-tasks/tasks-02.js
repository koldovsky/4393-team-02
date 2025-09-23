//Базове завдання 1
function stringToArray(string){
 return string.split(" ")
}
//Базове завдання 2
function DNAtoRNA(dna) {
  return dna.replaceAll('T','U');
}
//Поглиблене завдання 1
var min = function(list) {
  let smallest = list[0];
  for (let i = 1; i < list.length; i++) {
    if (list[i] < smallest) {
      smallest = list[i]; 
    }
  }
  return smallest;
}

var max = function(list) {
  let largest = list[0];
  for (let i = 1; i < list.length; i++) {
    if (list[i] > largest) {
      largest = list[i]; 
    }
  }
  return largest;
}
//поглиблене завдання 1
function min(arr, toReturn) {
  let minValue = arr[0];
  let minIndex = 0;
  
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < minValue) {
      minValue = arr[i];
      minIndex = i;
    }
  }

  if (toReturn === "value") {
    return minValue;
  } else if (toReturn === "index") {
    return minIndex;
  }
}