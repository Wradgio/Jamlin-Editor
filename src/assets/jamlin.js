const dialog = require('electron').remote.dialog;
var fs = require('fs');
//dialog.showErrorBox('Error title', 'error')

$.getScript("./assets/save.js", function() {
   //alert("Script loaded but not necessarily executed.");
});

var jsonDataFile = null;
var jsonData = [];
var jsonDataLangs = [];
var tableData = [];
var hasJson = false;

var showJsonEditBlock = function(newValue) {
	hasJson = newValue;
	if ( hasJson ) {
		$('.needJson').slideUp(300);
		$('.hasJson').slideDown(300);
	} else {
		$('.hasJson').slideUp(300);
		$('.needJson').slideDown(300);
	}
}




var getJsonDataLangs = function() {
	if (typeof jsonData !== 'undefined' && jsonData!=null) {
		// blocks
		if ( typeof jsonData.translationBlocks !== 'undefined' && jsonData.translationBlocks instanceof Array && jsonData.translationBlocks.length>0 ) {
			for (var i=0; i<jsonData.translationBlocks.length; i++) {
				// strings
				if ( typeof jsonData.translationBlocks[i].translationStrings !== 'undefined' && jsonData.translationBlocks[i].translationStrings instanceof Array && jsonData.translationBlocks[i].translationStrings.length>0 ) {
					for (var j=0; j<jsonData.translationBlocks[i].translationStrings.length; j++) {
						// translations
						if ( typeof jsonData.translationBlocks[i].translationStrings[j].translations !== 'undefined' && jsonData.translationBlocks[i].translationStrings[j].translations instanceof Array && jsonData.translationBlocks[i].translationStrings[j].translations.length>0 ) {
							for (var k=0; k<jsonData.translationBlocks[i].translationStrings[j].translations.length; k++) {
								if ( $.inArray(jsonData.translationBlocks[i].translationStrings[j].translations[k].langCode, jsonDataLangs)<0 ) {
									jsonDataLangs.push(jsonData.translationBlocks[i].translationStrings[j].translations[k].langCode);
								}
							}// end for translations
						}
					} // end for strings
				}
			} // end for blocks
		}
	}
	
	
	for (var i=0; i<jsonDataLangs.length; i++) {
		tableCollFields.push(
			{ name: jsonDataLangs[i], type: "textarea", width: "auto" },
		);
	}
	tableCollFields.push( { type: "control", width: "70px" } );
	console.log(tableCollFields);
}



var processJsonData = function() {
	if (typeof jsonData !== 'undefined' && jsonData!=null) {
		if ( typeof jsonData.translationBlocks !== 'undefined' && jsonData.translationBlocks instanceof Array && jsonData.translationBlocks.length>0 ) {
		
			for (var i=0; i<jsonData.translationBlocks.length; i++) {
				// add block data
				var name = jsonData.translationBlocks[i].name;
				var nameCol = name;
				if ( $.trim(jsonData.translationBlocks[i].attrName)!='' ) {
					nameCol = nameCol+"["+jsonData.translationBlocks[i].attrName+"]";
				}
				var blockData = {
					"type" : "block", 
					"classes" : "block", 
					"data" : jsonData.translationBlocks[i].attrName, 
					"Name" : nameCol, 
					"Selector" : jsonData.translationBlocks[i].cssSelector
				};
				var blockChildData = JSON.stringify({
					"name": name, 
					"selector": jsonData.translationBlocks[i].cssSelector, 
					"attr": jsonData.translationBlocks[i].attrName
				});
				for (var x=0; x<jsonDataLangs.length; x++) {
					if (x==0) {
						blockData[jsonDataLangs[x]] = name;
					} else if (x==1) {
						blockData[jsonDataLangs[x]] = jsonData.translationBlocks[i].cssSelector;
					} else {
						blockData[jsonDataLangs[x]] = "---";
					}
				}
				tableData.push(blockData);
				//--
				if ( typeof jsonData.translationBlocks[i].translationStrings !== 'undefined' && jsonData.translationBlocks[i].translationStrings instanceof Array && jsonData.translationBlocks[i].translationStrings.length>0 ) {
					for (var j=0; j<jsonData.translationBlocks[i].translationStrings.length; j++) {
						// prepare strings data
						var stringsData = {
							"type" : "translation", 
							"classes" : "translation", 
							"data" : blockChildData, 
							"Name" : jsonData.translationBlocks[i].translationStrings[j].stringOrig, 
							"Selector" : jsonData.translationBlocks[i].translationStrings[j].selector
						};
						//--
						if ( typeof jsonData.translationBlocks[i].translationStrings[j].translations !== 'undefined' && jsonData.translationBlocks[i].translationStrings[j].translations instanceof Array && jsonData.translationBlocks[i].translationStrings[j].translations.length>0 ) {
							for (var k=0; k<jsonData.translationBlocks[i].translationStrings[j].translations.length; k++) {
								// add translations data
								stringsData[jsonData.translationBlocks[i].translationStrings[j].translations[k].langCode] = jsonData.translationBlocks[i].translationStrings[j].translations[k].translation;
							} // end for k
						}
						//--
						if ( jsonData.translationBlocks[i].translationStrings[j].translations.length==jsonDataLangs.length ) {
							tableData.push(stringsData);
						} else {
							console.log( "i="+i+" j="+j );
							console.log( jsonData.translationBlocks[i].translationStrings[j].stringOrig );
							console.log( jsonData.translationBlocks[i].translationStrings[j].selector );
						}
					} // end for j
				}
			} // end for i
			
		}
	}
	
	$("#jsGrid").jsGrid("refresh");
}



/*
 * after table row values was updated, find and update related 
 */
var updateJsonDataTranslationString = function(oldValue, newValue) {
	if ( typeof oldValue.data !== 'undefined' ) {
		oldValue.data = JSON.parse(oldValue.data);
	}
	
	if (typeof jsonData !== 'undefined' && jsonData!=null) {
		if ( typeof jsonData.translationBlocks !== 'undefined' && jsonData.translationBlocks instanceof Array && jsonData.translationBlocks.length>0 ) {
			// blocks
			for (var i=0; i<jsonData.translationBlocks.length; i++) {
				
				// if block found
				if ( oldValue.data.name==jsonData.translationBlocks[i].name && oldValue.data.selector==jsonData.translationBlocks[i].cssSelector && oldValue.data.attr==jsonData.translationBlocks[i].attrName ) {
					// continue looking for right translationString
				
					if ( typeof jsonData.translationBlocks[i].translationStrings !== 'undefined' && jsonData.translationBlocks[i].translationStrings instanceof Array && jsonData.translationBlocks[i].translationStrings.length>0 ) {
						// strings
						for (var j=0; j<jsonData.translationBlocks[i].translationStrings.length; j++) {
							
							// if translationString found
							if ( oldValue.Name==jsonData.translationBlocks[i].translationStrings[j].stringOrig && oldValue.Selector==jsonData.translationBlocks[i].translationStrings[j].selector ) {
								// update translationString values
								jsonData.translationBlocks[i].translationStrings[j].stringOrig = newValue.Name;
								jsonData.translationBlocks[i].translationStrings[j].selector = newValue.Selector;
								
								// get list of languages
								var listOfLanguages = newValue;
								delete listOfLanguages.Name;
								delete listOfLanguages.Selector;
								delete listOfLanguages.data;
								delete listOfLanguages.type;
								delete listOfLanguages.classes;
								
								if ( Object.keys(listOfLanguages).length>0 ) {
									// remove translations
									jsonData.translationBlocks[i].translationStrings[j].translations = [];
									// add translations
									for (var lang in listOfLanguages) {
										if (listOfLanguages.hasOwnProperty(lang)) {
											var newTranslation = {
												"langCode": lang,
												"translation": listOfLanguages[lang]
											};
											jsonData.translationBlocks[i].translationStrings[j].translations.push(newTranslation);
										}
									}
									
									return true;
								}
							
							} // if translationString found END
							
						} // end for strings
					}
				
				} // if block found END
				
			} // end for blocks
		}
	}
	
	return false;
}



var findValueInJsonData = function() {
	
}




$('.showOpenDialogButton').click(function(e){
	showOpenDialog();
});



var tableCollFields = [
	{ name: "type", type: "text", visible: false },
	{ name: "classes", type: "text", visible: false },
	{ name: "data", type: "text", visible: false },
	{ name: "Name", type: "text", visible: true, width: "auto", readOnly: true }, //validate: "required" },
	{ name: "Selector", type: "text", visible: false }, //validate: "required", width: "auto" }
];



var reloadTable = function() {
	$("#jsGrid").jsGrid({
		width: "100%",
		height: "600px",

		filtering: true,
		inserting: true,
		editing: true,
		sorting: true,
		//paging: true,
 
        pageSize: 50,
        pageButtonCount: 5,
        
        onItemEditing: function(args) {
        	// cancel editing of the row of item block type - blocks should be defined by extractor
			if(args.item.type == "block") {
				args.cancel = true;
			}
		}, 

        onItemUpdated: function(args) {
        	console.log(args); // row: init(1), item: Object, itemIndex: 1, previousItem: Object, grid: d
        	updateJsonDataTranslationString(args.previousItem, args.item);
        	if (jsonDataFile!=null) {
        		saveFile( jsonDataFile, JSON.stringify(jsonData, null, 2) );
        	}
        },
        
        rowRenderer: function(item, itemIndex) {
        	var rowClasses = '';
        	if ( itemIndex^2>0 ) {
        		rowClasses += 'jsgrid-row ';
        	} else {
        		rowClasses += 'jsgrid-alt-row ';
        	}
        	rowClasses += item.classes;
        	var thisRow = $("<tr>").addClass(rowClasses);
        	thisRow.append( $("<td>").addClass('jsgrid-cell').css('width', 'auto').append(item.Name) );
        	for (var i=0; i<jsonDataLangs.length; i++) {
        		thisRow.append( $("<td>").addClass('jsgrid-cell').attr('lang',jsonDataLangs[i]).css('width', 'auto').append(item[jsonDataLangs[i]]) );
        	}
        	var width = tableCollFields[tableCollFields.length-1].width;
        	thisRow.append( $("<td>").addClass('jsgrid-cell jsgrid-control-field jsgrid-align-center').css('width', width).append('...') );
			return thisRow;
		},

		data: tableData,

        controller: {
            loadData: function(filter) {
                return $.grep(tableData, function(item) {
                     // do filtering
                     if ( item.type=="block" ) {
                     	return true;
                     }
                     for (var key in filter) {
                        var value = filter[key];
                        if (value.length > 0) {
                            if (item[key].indexOf(value) == -1) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            }, 
            
			insertItem: function(insertingClient) { },

			updateItem: function(updatingClient) { },

			deleteItem: function(deletingClient) { }
        },

		fields: tableCollFields
	});
}