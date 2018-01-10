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
	jsonDataLangs = [];
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
	
	tableCollFields = $.extend(true,[],tableCollFieldsOrig);
	for (var i=0; i<jsonDataLangs.length; i++) {
		tableCollFields.push(
			{ name: jsonDataLangs[i], type: "textarea", width: "auto" },
		);
	}
	tableCollFields.push({ 
		type: "control", 
		width: "100px", 
		headerTemplate: function() {
			var grid = this._grid;
			var isInserting = grid.inserting;

			var $button = $("<input>").attr("type", "button")
				.addClass([this.buttonClass, this.modeButtonClass, this.insertModeButtonClass].join(" "))
				.on("click", function() {
					isInserting = !isInserting;
					grid.option("inserting", isInserting);
				});
				
			var $settings = $("<button>").attr("type", "button")
				.addClass(this.modeButtonClass+' translationSettings')
				.append($("<span>").addClass('glyphicon glyphicon-cog'))
				.on("click", function() {
					$('#dialogsOverlay').show();
					$('#dialogAdd').show();
					// langs select
					var langsOptions = '';
					for (var i=0; i<jsonDataLangs.length; i++) {
						langsOptions = langsOptions + '<option value="'+jsonDataLangs[i]+'">'+jsonDataLangs[i]+'</option>';
					}
					$('#removeLangCode')
					.find('option')
					.remove()
					.end()
					.append(langsOptions)
					.val( jsonDataLangs[jsonDataLangs.length-1] );
				});
				
			var $buttonsWrapper = $('<div>').addClass('buttonsWrapper');
			$buttonsWrapper.append($button);
			$buttonsWrapper.append($settings);

			return $buttonsWrapper;
		}, 
	});
	console.log(tableCollFields);
}



/**
 * 
 */
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
	if ( oldValue!=null && typeof oldValue.data !== 'undefined' ) {
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



var deleteTranslation = function(item2delete) {
	if ( item2delete!=null && typeof item2delete.data!=='undefined' ) {
		item2delete.data = JSON.parse(item2delete.data);
	}
	console.log(item2delete);
	/* {
	   "type":"translation",
	   "classes":"translation",
	   "data":"{\"name\":\"texts\",\"selector\":\"p, a\",\"attr\":\"\"}",
	   "Name":"Menu",
	   "Selector":"#mobile_menu",
	   "en":"Menu",
	   "sk":"Menu"
	} */
	
	if (typeof jsonData !== 'undefined' && jsonData!=null) {
		if ( typeof jsonData.translationBlocks !== 'undefined' && jsonData.translationBlocks instanceof Array && jsonData.translationBlocks.length>0 ) {
			// blocks
			for (var i=0; i<jsonData.translationBlocks.length; i++) {
				
				// if block found
				if ( item2delete.data.name==jsonData.translationBlocks[i].name && item2delete.data.selector==jsonData.translationBlocks[i].cssSelector && item2delete.data.attr==jsonData.translationBlocks[i].attrName ) {
					// continue looking for right translationString
				
					if ( typeof jsonData.translationBlocks[i].translationStrings !== 'undefined' && jsonData.translationBlocks[i].translationStrings instanceof Array && jsonData.translationBlocks[i].translationStrings.length>0 ) {
						// strings
						for (var j=0; j<jsonData.translationBlocks[i].translationStrings.length; j++) {
							
							// if translationString found
							if ( item2delete.Name==jsonData.translationBlocks[i].translationStrings[j].stringOrig && item2delete.Selector==jsonData.translationBlocks[i].translationStrings[j].selector ) {
								// update translationString values
								jsonData.translationBlocks[i].translationStrings.splice(j, 1);
								return true;							
							} // if translationString found END
							
						} // end for strings
					}
				
				} // if block found END
				
			} // end for blocks
		}
	}
	
	return false;
}



/**
 * add new language as code
 */
var addTranslationLanguage = function(newLangCode) {
	if (typeof jsonData !== 'undefined' && jsonData!=null) {
		// blocks
		if ( typeof jsonData.translationBlocks !== 'undefined' && jsonData.translationBlocks instanceof Array && jsonData.translationBlocks.length>0 ) {
			for (var i=0; i<jsonData.translationBlocks.length; i++) {
				// strings
				if ( typeof jsonData.translationBlocks[i].translationStrings !== 'undefined' && jsonData.translationBlocks[i].translationStrings instanceof Array && jsonData.translationBlocks[i].translationStrings.length>0 ) {
					for (var j=0; j<jsonData.translationBlocks[i].translationStrings.length; j++) {
						// translations
						if ( typeof jsonData.translationBlocks[i].translationStrings[j].translations !== 'undefined' && jsonData.translationBlocks[i].translationStrings[j].translations instanceof Array && jsonData.translationBlocks[i].translationStrings[j].translations.length>0 ) {
							var existingTranslationLaguages = [];
							for (var k=0; k<jsonData.translationBlocks[i].translationStrings[j].translations.length; k++) {
								existingTranslationLaguages.push( jsonData.translationBlocks[i].translationStrings[j].translations[k].langCode );
							}// end for translations
							//--
							if ( $.inArray(newLangCode, existingTranslationLaguages)<0 ) {
								jsonData.translationBlocks[i].translationStrings[j].translations.push( 
									{
										'langCode': newLangCode, 
										'translation': ''
									}
								);
							}
						}
					} // end for strings
				}
			} // end for blocks
		}
		return true;
	}
	return false;
}


var removeTranslationLanguage = function(removeLangCode) {
	if (typeof jsonData !== 'undefined' && jsonData!=null) {
		// blocks
		if ( typeof jsonData.translationBlocks !== 'undefined' && jsonData.translationBlocks instanceof Array && jsonData.translationBlocks.length>0 ) {
			for (var i=0; i<jsonData.translationBlocks.length; i++) {
				// strings
				if ( typeof jsonData.translationBlocks[i].translationStrings !== 'undefined' && jsonData.translationBlocks[i].translationStrings instanceof Array && jsonData.translationBlocks[i].translationStrings.length>0 ) {
					for (var j=0; j<jsonData.translationBlocks[i].translationStrings.length; j++) {
						// translations
						if ( typeof jsonData.translationBlocks[i].translationStrings[j].translations !== 'undefined' && jsonData.translationBlocks[i].translationStrings[j].translations instanceof Array && jsonData.translationBlocks[i].translationStrings[j].translations.length>0 ) {
							var existingTranslationLaguages = [];
							for (var k=0; k<jsonData.translationBlocks[i].translationStrings[j].translations.length; k++) {
								if ( jsonData.translationBlocks[i].translationStrings[j].translations[k].langCode == removeLangCode ) {
									jsonData.translationBlocks[i].translationStrings[j].translations.splice(k, 1);
								}
							}// end for translations
						}
					} // end for strings
				}
			} // end for blocks
		}
		return true;
	}
	return false;
}



var findValueInJsonData = function() {
	
}




$('.showOpenDialogButton').click(function(e){
	showOpenDialog();
});

$('#dialogsOverlay').click(function(e){
	e.stopPropagation();
	$(this).hide();
	$('.dialog').hide();
});
$('.dialog').click(function(e){
	e.stopPropagation();
});
$('.dialogCloseBox a').click(function(e){
	e.preventDefault();
	e.stopPropagation();
	$('#dialogsOverlay').hide();
	$('.dialog').hide();
});
$('#addTranslationCode').submit(function(e){
	e.preventDefault();
	var newLangCode = $(this).find('#newLangCode').val();
	if ( $.trim(newLangCode)!='' && /^[a-z]+$/.test(newLangCode) ) {
		// remove other than alphabet characters
		newLangCode.replace(/[^a-z]/g, "");
		var updateResult = addTranslationLanguage(newLangCode);
		if (updateResult && jsonDataFile!=null) {
			getJsonDataLangs();
			processJsonData();
			reloadTable();
			saveFile( jsonDataFile, JSON.stringify(jsonData, null, 2) );
			$('#dialogsOverlay').hide();
			$('.dialog').hide();
		}
	}
});
$('#removeTranslationLanguage').submit(function(e){
	e.preventDefault();
	var removeLangCode = $(this).find('#removeLangCode').val();
	if ( $.trim(removeLangCode)!='' && /^[a-z]+$/.test(removeLangCode) ) {
		// remove other than alphabet characters
		removeLangCode.replace(/[^a-z]/g, "");
		var updateResult = removeTranslationLanguage(removeLangCode);
		if (updateResult && jsonDataFile!=null) {
			getJsonDataLangs();
			processJsonData();
			reloadTable();
			saveFile( jsonDataFile, JSON.stringify(jsonData, null, 2) );
			$('#dialogsOverlay').hide();
			$('.dialog').hide();
		}
	}
});



var tableCollFieldsOrig = [
	{ name: "type", type: "text", visible: false },
	{ name: "classes", type: "text", visible: false },
	{ name: "data", type: "text", visible: false },
	{ name: "Name", type: "text", visible: true, width: "15%" }, //readOnly: true, validate: "required" },
	{ name: "Selector", type: "text", width: "15%" }, //, visible: false, validate: "required", width: "auto" }
];
var tableCollFields = $.extend(true,{},tableCollFieldsOrig);



var reloadTable = function() {
	$("#jsGrid").jsGrid("destroy");
	$("#jsGrid").jsGrid({
		width: "100%",
		height: "auto",

		filtering: true,
		inserting: true,
		editing: true,
		sorting: true,
		//paging: true,
 
        pageSize: 50,
        pageButtonCount: 5,
        
        onItemEditing: function(args) {
        	// cancel editing of the row of item block type - blocks should be defined by extractor
        	console.log('onItemEditing', args.item.type);
			if (args.item.type == "block") {
				args.cancel = true;
			} else {
				console.log('disable?');
				console.log( $('#jsGrid .jsgrid-grid-body .jsgrid-edit-row .jsgrid-cell input[type=text]') );
				args.row.find('input[type=text]').attr('disabled', 'disabled');
				$(document).ready(function(){
					$('#jsGrid .jsgrid-grid-body .jsgrid-edit-row .jsgrid-cell input[type=text]').attr('disabled', 'disabled');
				});
			}
		}, 

        onItemUpdated: function(args) {
        	console.log(args); // row: init(1), item: Object, itemIndex: 1, previousItem: Object, grid: d
        	var updateResult = updateJsonDataTranslationString(args.previousItem, args.item);
        	if (updateResult && jsonDataFile!=null) {
        		saveFile( jsonDataFile, JSON.stringify(jsonData, null, 2) );
        	}
        },
        
        rowRenderer: function(item, itemIndex) {
			var grid = this;
        	var rowClasses = '';
        	if ( itemIndex^2>0 ) {
        		rowClasses += 'jsgrid-row ';
        	} else {
        		rowClasses += 'jsgrid-alt-row ';
        	}
        	rowClasses += item.classes;
        	var thisRow = $("<tr>").addClass(rowClasses);
        	thisRow.append( $("<td>").addClass('jsgrid-cell infovalue').css('width', '15%').append(item.Selector) );
        	thisRow.append( $("<td>").addClass('jsgrid-cell infovalue').css('width', '15%').append(item.Name) );
        	for (var i=0; i<jsonDataLangs.length; i++) {
        		thisRow.append( $("<td>").addClass('jsgrid-cell').attr('lang',jsonDataLangs[i]).css('width', 'auto').append(item[jsonDataLangs[i]]) );
        	}
        	
			var $editButton = $("<input>").attr("type", "button").addClass("jsgrid-button jsgrid-edit-button");
			var $deleteButton = $("<input>").attr("type", "button").addClass("jsgrid-button jsgrid-delete-button");
			
			$editButton.on("click", function() {
				grid.editItem(item);
			});
			$deleteButton.on("click", function(e) {
				e.stopPropagation();
				grid.deleteItem(item);
				var deleteResult = deleteTranslation(item);
				if (deleteResult && jsonDataFile!=null) {
					saveFile( jsonDataFile, JSON.stringify(jsonData, null, 2) );
				}
			});
        	
        	var width = tableCollFields[tableCollFields.length-1].width;
        	thisRow.append( $("<td>").addClass('jsgrid-cell jsgrid-control-field jsgrid-align-center').css('width', width).append($editButton).append($deleteButton) );
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