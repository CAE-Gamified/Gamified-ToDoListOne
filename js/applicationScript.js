/*
 * Copyright (c) 2015 Advanced Community Information Systems (ACIS) Group, Chair
 * of Computer Science 5 (Databases & Information Systems), RWTH Aachen
 * University, Germany All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 * 
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * 
 * Neither the name of the ACIS Group nor the names of its contributors may be
 * used to endorse or promote products derived from this software without
 * specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

var client, dataStorage;//, dataStorage = [];

var init = function() {
  
  var iwcCallback = function(intent) {
    // define your reactions on incoming iwc events here
    console.log(intent);
  };
  
  client = new Las2peerWidgetLibrary("http://localhost:8080/ToDoList", iwcCallback);
  
Y({
  db: {
    name: 'memory'
  },
  connector: {
    name: 'websockets-client',
    room: 'todolistone'
  },
  sourceDir: "http://y-js.org/bower_components",
  share: {
    inputData:'Text',
    dataList:'Text',
    dataStorage: 'Array'
  }
}).then(function (y) {
  window.yTextarea = y

  y.share.inputData.bind(document.getElementById('inputData'))
y.share.dataList.bind(document.getElementById('dataList'))
 dataStorage = y.share.dataStorage
})

//dataStorage = y.share.map.set('array', Y.Array)

  $('#ShowButton').on('click', function() {
    ShowEntries();
  })
  $('#AddButton').on('click', function() {

  console.log("listContent")
    AddEntry();
  })
  $('#DeleteButton').on('click', function() {
    DeleteEntry();
  })
}


// DeleteEntry
var DeleteEntry = function(){
  deleteMessageFunction();
}


// ShowEntries
var ShowEntries = function(){
  reloadData();
  $("#messageStatus").val("Data fetched!");
}


// AddEntry
var AddEntry = function(){
  var listContent = $("#inputData").val();
  console.log(listContent)
  var temp = [];
  temp.push(listContent)
  sendMessageFunction(temp);
}

var reloadData = function(){
console.log(dataStorage.toArray())
  $("#messageStatus").val("Get Data");
  var DataContent = null;
  var textData = "";
  for(var i = 0;i < dataStorage.toArray().length;i++){
    textData += (i+1)+": "+dataStorage.toArray()[i]+"\n";
  }

  $('#dataList').attr("rows", dataStorage.toArray().length);
    $("#dataList").val(textData);
    $("#messageStatus").val("");
}

// responseAction
var responseAction = function(data){
  console.log(data);
  var dataJSON = JSON.parse(data);
  if(data){
    reloadData(dataJSON.list);    
  }else{
    $("#messageStatus").val("No data found!");
  }

}

var sendMessageFunction = function(contentData){
  dataStorage.push(contentData);
  $("#messageStatus").val(contentData + " is added! Click show button!");
}

function isInteger(x) {
    return x % 1 === 0;
}

var deleteMessageFunction = function(){
  var index = parseInt($("#inputData").val());
  console.log(isInteger(index));
  var isInt = isInteger(index);
  if (isInt) {
    console.log("True");
    if(dataStorage.toArray().length==0){
      $("#messageStatus").val("No data found!");
      console.log("Empty entries");
    }
    else{
        if(index > 0 || index <= dataStorage.toArray().length){
          var dataName = dataStorage.toArray()[index-1];
          dataStorage.delete(index-1,1);
          $("#messageStatus").val(dataName + " is removed! Click show button!");
        }
        else{
          console.log("Index not found");
          $("#messageStatus").val("Invalid input data!");
        }    
    }
  }
  else{

    var dataInput = $("#inputData").val();
    var idx = dataStorage.toArray().indexOf(dataInput);
    if(idx < 0){
          $("#messageStatus").val("Invalid input data!");      
    }
    else{
          var dataName = dataStorage.toArray()[idx];
          dataStorage.delete(idx,1);
          $("#messageStatus").val(dataName + " is removed! Click show button!");


    }
  }  
 

}


$(document).ready(function() {
  init();
});
