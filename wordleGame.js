function formUpdate(){
  // Name of Players
  let playerNames = ["Annalise Chia", "Matthew Chin", "Brian Lin", "Lucas Liow", "Jonathan Ogbomo", "Alec Steele", "Derek Tang", "Charles Wong"]

  // Setup Spreadsheet variables
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let formSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Game Response Form");
  let displaySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Game");
  let formData = formSheet.getDataRange().getValues();
  let outputArray = []

  // Initiate output array
  outputArray.push(["Name"])

  for(let aNum = 0; aNum < playerNames.length; aNum++){
    outputArray.push([playerNames[aNum]])
  }

  // Transfering form data to output array
  for(let i = 1; i < formData.length; i++){
    for(let j = 1; j < outputArray.length; j++){
      if(formData[i][1] === outputArray[j][0]){
        outputArray[j].push(formData[i][2])
      }
    }
  }
  
  // Adding days to column titles 
  let longestNum = longestLength(outputArray)
  for(let i = 1; i < longestNum; i++){
    let tempString = "Day " + (longestNum-1).toString() + "/Wordle " + (longestNum+223).toString()
    outputArray[0].push(tempString)
  }
  
  // Setting up the total scores
  outputArray = alignOutput(outputArray, longestNum)
  outputArray[0].push("Average Score")

  for(let i = 1; i < outputArray.length; i++){
    let forNum = i+1
    let forNumString = forNum.toString()
    let alphabetLetter = alphabet[(longestNum-1)]
    let scoreString = "=AVERAGE(B" + forNumString + ":" +  alphabetLetter + forNumString + ")" 
    outputArray[i].push(scoreString)
  }

  // Print to the spreadsheet
  displaySheet.deleteRows(1,playerNames.length+4)
  for(let i = 0; i < outputArray.length; i++){
    displaySheet.appendRow(outputArray[i])
  }

  // Current Winner Finder
  let winnerArray = [[" "],["Current Winner(s):"]]
  let columnCord = longestNum+1
  let lowestNum = 100
  let lowestPOS = [1]
  for(let i = 0; i < playerNames.length; i++){
    let intPlayer = i+2
    if(displaySheet.getRange(intPlayer, columnCord).getValue() < lowestNum){
      lowestNum = displaySheet.getRange(intPlayer, columnCord).getValue()
      lowestPOS = [i+1]
    }else if(displaySheet.getRange(intPlayer, columnCord).getValue() === lowestNum){
      lowestPOS.push(i+1)
    }
  }

  // Print Winner onto sheet
  let winnerString = ""
  if(lowestPOS.length === 1){
    winnerString += outputArray[lowestPOS[0]][0]
  }else{
    for(let i = 0; i < lowestPOS.length; i++){
      if(i+1 === lowestPOS.length){
        winnerString += "and " + outputArray[lowestPOS[i]][0]
      }else{
        winnerString += outputArray[lowestPOS[i]][0] + ", "
      }
    }
  }
  winnerArray[1].push(winnerString)

  for(let i = 0; i < winnerArray.length; i++){
    displaySheet.appendRow(winnerArray[i])
  }
}


function longestLength(array){
  let longestNum = 0
  for(let i = 0; i < array.length; i++){
    if(array[i].length > longestNum){
      longestNum = array[i].length
    }
  }
  return longestNum
}

function alignOutput(array, inputLengthNum){
  let finalArray = array
  let lengthNum = inputLengthNum
  for(let i = 1; i < finalArray.length; i++){
    for(let q = finalArray[i].length; q < lengthNum; q++){
      finalArray[i].push(7)
    }
  }
  return finalArray
}