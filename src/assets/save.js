/* functions for macgap from 
 * https://macgapproject.github.io/documentation/ref/dialog.html

openDialog(object) { files: true, multiple: true, directories: true, allowedTypes: [‘txt’, ‘doc’, ‘js’], callback: function() {…} }
// all params are optional and default to false

saveDialog(object) { {title:”Sheet Title”, prompt: “Button Text”, message: “Sheet Message”, filename: “myfile.txt”, createDirs: true, allowedTypes: [‘txt’, ‘doc’, ‘js’], callback: function(result) { console.log(result); }}}


 * and https://macgapproject.github.io/documentation/ref/file.html
 
 MacGap.File.read(filePath, fileType)
 MacGap.File.write(filePath, fileData, fileType)

 */

var showOpenDialog = function() {		
	dialog.showOpenDialog( {filters: [{ name: 'json', extensions: ['json'] }]}, (fileNames) => {
		console.log(fileNames);
		// fileNames is an array that contains all the selected
		if(fileNames === undefined){
			console.log("No file selected");
			showJsonEditBlock(false);
			return;
		}

		fs.readFile(fileNames[0], 'utf-8', (err, data) => {
			if(err){
				alert("An error ocurred reading the file :" + err.message);
				return;
			}
			// Change how to handle the file content
			jsonDataFile = fileNames[0];
			jsonData = JSON.parse(data);
			showJsonEditBlock(true);
			getJsonDataLangs();
			console.log( jsonDataLangs );
			processJsonData();
			console.log(jsonData);
			console.log(tableData);
			reloadTable();
		});
	});
}


var showSaveDialog = function() {
	let content = JSON.stringify(jsonData, null, 2);

	// You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
	dialog.showSaveDialog( {filters: [{ name: 'json', extensions: ['json'] }]}, (fileName) => {
		if (fileName === undefined){
			console.log("You didn't save the file");
			return;
		}
		
		saveFile(fileName, content);
	});
}


var saveFile = function(fileName, content, messages) {
	if (typeof messages=='undefined') { var messages = false; }
	// fileName is a string that contains the path and filename created in the save file dialog.  
	fs.writeFile(fileName, content, (err) => {
		if(err){
			alert("An error ocurred creating the file "+ err.message)
		}
		
		if ( messages ) {
			alert("The file has been succesfully saved");
		}
	});
}