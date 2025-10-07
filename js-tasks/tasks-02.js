//Базове завдання 1
function stringToArray(string) {
  return string.split(" ");
}

//Базове завдання 2
function DNAtoRNA(dna) {
  return dna.replaceAll("T", "U");
}

function DNAtoRNA(dna) {
  let rna = dna
    .split("")
    .map((item) => {
      if (item.valueOf() === "t") {
        item = "u";

        return item;
      } else if (item.valueOf() === "T") {
        item = "U";

        return item;
      } else {
        return item;
      }
    })
    .join("");

  return rna;
}

//Поглиблене завдання 1
var min = function (list) {
  let smallest = list[0];
  for (let i = 1; i < list.length; i++) {
    if (list[i] < smallest) {
      smallest = list[i];
    }
  }
  return smallest;
};

var max = function (list) {
  let largest = list[0];
  for (let i = 1; i < list.length; i++) {
    if (list[i] > largest) {
      largest = list[i];
    }
  }
  return largest;
};

var min = function (list) {
  return list.sort((a, b) => a - b)[0];
};

var max = function (list) {
  return list.sort((a, b) => b - a)[0];
};

//поглиблене завдання 2
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

function min(arr, toReturn) {
  let minNumber = Math.min(...arr);

  if (toReturn === "value") {
    return minNumber;
  } else if (toReturn === "index") {
    return arr.indexOf(minNumber);
  }
}
