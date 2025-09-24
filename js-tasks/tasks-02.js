//Завдання з першого заняття по JS
//https://www.codewars.com/kata/grasshopper-messi-goals-function/train/javascript
function goals(laLigaGoals, copaDelReyGoals, championsLeagueGoals) {
  return laLigaGoals + copaDelReyGoals + championsLeagueGoals;
}

//https://www.codewars.com/kata/55685cd7ad70877c23000102/train/javascript
function makeNegative(num) {
  return num > 0 ? -num : num;
}

//https://www.codewars.com/kata/grasshopper-terminal-game-move-function/train/javascript
function move(position, roll) {
  return position + roll * 2;
}

//https://www.codewars.com/kata/grasshopper-personalized-message/train/javascript
function greet(name, owner) {
  return `Hello ${name === owner ? "boss" : "guest"}`;
}

//https://www.codewars.com/kata/keep-hydrated-1/train/javascript
function litres(time) {
  return Math.floor(time * 0.5);
}

//https://www.codewars.com/kata/555086d53eac039a2a000083/train/javascript
function lovefunc(flower1, flower2) {
  return (flower1 + flower2) % 2 ? true : false;
}

//Заняття2
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
