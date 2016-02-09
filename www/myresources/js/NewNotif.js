var xmlDoc="";
var sites=[];
var plants=[];
var assets=[];
var SearchMode=""
var selectedAssetSearchSite="";
var selectedAssetSearchGroup="";
var selectedAssetSearchType="";
var newEQField = 			new sap.m.Input("NewEquipment",{ type: sap.m.InputType.Input,
			// icon:"images//barcode.png",
			 //showValueHelp: true,
			valueHelpRequest: [function(event){
				//Scan()
			
		}]});
		//newEQField._getValueHelpIcon().setSrc("sap-icon://bar-code");
var formNewNotif = new sap.m.Dialog("dlgNewNotif",{
    title:" Notification1",
    modal: true,
    contentWidth:"1em",
    buttons: [
					new sap.m.Button( {
					    text: "Save",
					    type: 	sap.m.ButtonType.Accept,
					    tap: [ function(oEvt) {	
					    	//alert(sap.ui.getCore().byId("NewType").getSelectedItem().getKey()+"--"+sap.ui.getCore().byId("NewGroup").getSelectedItem().getKey()+"--"+sap.ui.getCore().byId("NewCode").getSelectedItem().getKey())
					    	var xntype=sap.ui.getCore().byId("NewType").getSelectedItem().getKey().split("|")
					    	var xgroup=sap.ui.getCore().byId("NewGroup").getSelectedItem().getKey().split("|")
					    	var xcode=sap.ui.getCore().byId("NewCode").getSelectedItem().getKey().split("|")
					    	var xpriority=sap.ui.getCore().byId("NewPriority").getSelectedItem().getKey().split("|")
					    	ndate=convertEODDate(sap.ui.getCore().getElementById('NewNotifStart').getValue()).split(" ")
					    	//alert(ndate+"caaaaac"+sap.ui.getCore().getElementById('NewNotifStart').getValue());
					    	if(sap.ui.getCore().byId("NewDescription").getValue().length>0){
					    		createNotification(xntype[0],xpriority[0],xgroup[1],xcode[0],sap.ui.getCore().byId("NewGroup").getSelectedItem().getText(),
										sap.ui.getCore().byId("NewCode").getSelectedItem().getText(),sap.ui.getCore().byId("NewDescription").getValue(),
										sap.ui.getCore().byId("NewDetails").getValue(),
										ndate[0], ndate[1],
										sap.ui.getCore().byId("NewFuncLoc").getValue(),
										sap.ui.getCore().byId("NewEquipment").getValue())


											formNewNotif.close()
										}else{
											DisplayErrorMessage("Create Job - Error", "Description is Mandatory")
										}
							
							  } ]
					   
					}),   
					new sap.m.Button( {
					    text: "Cancel",
					    type: 	sap.m.ButtonType.Reject,
					    tap: [ function(oEvt) {		  
							 
					    	formNewNotif.close()} ]   
					})
					],					
    content:[
 			new sap.ui.layout.form.SimpleForm({
				minWidth : 1024,
				maxContainerCols : 2,
				content : [
								
								
								new sap.m.Label({text:"Notification Type"}),
								new sap.m.Select('NewType',{
									
									items: [
										
									],

									change: function(oControlEvent) {
										
										BuildPriorities(oControlEvent.getParameter("selectedItem").getKey());
									}
								}),
								new sap.m.Label({text:"Work Type Group"}),
								new sap.m.Select('NewGroup',{
									
									items: [
										
									],

									change: function(oControlEvent) {
										BuildCodes(oControlEvent.getParameter("selectedItem").getKey());
										
									}
								}),
								new sap.m.Label({text:"Work Type Code"}),
								new sap.m.Select('NewCode',{
									
									items: [
										
									],

									change: function(oControlEvent) {
										
									}
								}),
								
								new sap.m.Label({text:"Priority"}),
								new sap.m.Select('NewPriority',{
									
									items: [
										
									],

									change: function(oControlEvent) {
										//jQuery.sap.log.info("Event fired: 'change' value property to " + oControlEvent.getParameter("selectedItem") + " on " + this);
									}
								}),
								new sap.m.Label({text: "Start Date/Time:"}),
								
								new sap.m.DateTimeInput('NewNotifStart',{
									width : "99%",
									type : "DateTime",
									dateValue : new Date()
								}),
								new sap.m.Label({text:"Description"}),
								new sap.m.Input("NewDescription",{ type: sap.m.InputType.Input}),
								
								new sap.m.Label({text:"Details"}),
								new sap.m.TextArea("NewDetails",{ rows: 3}),

			new sap.m.Label({text:"Functional Location"}),
			new sap.m.SearchField("NewFuncLoc",{
				tooltip: "Search for Functional Locations..",
				
				search: [function(event){
						SearchMode="NOTIF"
						formSearchAsset.open()
						//selectedFloc="LGF"
				 		//buildFlocList("LGF");
				 		//formSelectFloc.open()
					
				}]}),

			
			new sap.m.Label({text:"Equipment",
				}),
				newEQField,								
                  
							]
 					})

            ],
	contentWidth:"60%",
	contentHeight: "70%",
	beforeOpen:function(){
	      
		sap.ui.getCore().byId("NewDescription").setValue('');
		sap.ui.getCore().byId("NewDetails").setValue('');
		
		sap.ui.getCore().byId("NewFuncLoc").setValue('');
		sap.ui.getCore().byId("NewEquipment").setValue('');


      }
	 })
function BuildNotificationTypes(){

	var HTMLToOutput='';

	var SQLStatement="";
	var FirstVal="";
	SQLStatement="SELECT * from refnotificationtypes where level_number = '2'"
	
		sap.ui.getCore().getElementById("NewType").destroyItems();
	sap.ui.getCore().getElementById("NewType").addItem(
	new sap.ui.core.Item({
		key: "NOTSELECTED", 
		text: "Please Select"
	}))
		html5sql.process(SQLStatement,
		 function(transaction, results, rowsArray){
				//alert(rowsArray.length)
				for (var n = 0; n < rowsArray.length; n++) {
					item = rowsArray[n];
					sap.ui.getCore().getElementById("NewType").addItem(
							new sap.ui.core.Item({
								key: item.notiftype+"|"+item.notifprofile+"|"+item.priotype, 
								text: item.notifdesc
							}))
					
				}
					
				
		 },
		 function(error, statement){
			
		 }        
		);

	}
function BuildPriorities(selectedId){
	
	var x = selectedId.split("|")
	var priority_type = x[2];
	var profile=x[1];
		var HTMLToOutput='';

		var SQLStatement="";
		var FirstVal="";
		SQLStatement="SELECT * "
		SQLStatement+="from MyRefPriorityTypes "
		SQLStatement+="where type = '"+priority_type+"'"
		var HTMLToOutput="";
			html5sql.process(SQLStatement,
			 function(transaction, results, rowsArray){
				
				sap.ui.getCore().getElementById("NewPriority").destroyItems();
				sap.ui.getCore().getElementById("NewPriority").addItem(
						new sap.ui.core.Item({
							key: "NOTSELECTED", 
							text: "Please Select"
						}))
					for (var n = 0; n < rowsArray.length; n++) {
						item = rowsArray[n];
						sap.ui.getCore().getElementById("NewPriority").addItem(
								new sap.ui.core.Item({
									key: item.priority,
									text: item.description
								}))
					}
				BuildGroups(profile)
					
			 },
			 function(error, statement){
				
			 }        
			);

		}
		function BuildGroups(profile){



			var SQLStatement="";
			var FirstVal="";
			
			SQLStatement="SELECT *  "
			SQLStatement+="from refpaicodes "
			SQLStatement+="where level = '1'  and catalogue = 'W' and stsma = '"+profile+"'"
			var HTMLToOutput="";
				html5sql.process(SQLStatement,
				 function(transaction, results, rowsArray){

						sap.ui.getCore().getElementById("NewGroup").destroyItems();
						sap.ui.getCore().getElementById("NewCode").destroyItems();
						sap.ui.getCore().getElementById("NewGroup").addItem(
								new sap.ui.core.Item({
									key: "NOTSELECTED", 
									text: "Please Select"
								}))
						for (var n = 0; n < rowsArray.length; n++) {
							item = rowsArray[n];
							sap.ui.getCore().getElementById("NewGroup").addItem(
									new sap.ui.core.Item({
										key: profile+"|"+item.codegrp,
										text: item.kurztext_group
									}))
						}
						
				 },
				 function(error, statement){
					
				 }        
				);

			}
		function BuildCodes(Group){

			var HTMLToOutput='';

			var SQLStatement="";
			var res = Group.split("|")
			
			SQLStatement="SELECT *  "
			SQLStatement+="from refpaicodes "
			SQLStatement+="where level = '2'  and catalogue = 'W' and stsma = '"+res[0]+"' and codegrp = '"+res[1]+"'"
			var HTMLToOutput="";
				html5sql.process(SQLStatement,
				 function(transaction, results, rowsArray){

						sap.ui.getCore().getElementById("NewCode").destroyItems();
						sap.ui.getCore().getElementById("NewCode").addItem(
								new sap.ui.core.Item({
									key: "NOTSELECTED", 
									text: "Please Select"
								}))
						
						for (var n = 0; n < rowsArray.length; n++) {
							item = rowsArray[n];
							sap.ui.getCore().getElementById("NewCode").addItem(
									new sap.ui.core.Item({
										key: item.code,
										text: item.kurztext_code
									}))
						}
				 },
				 function(error, statement){
					
				 }        
				);

			}
		var aAlreadyAddedProducts7 = [];
		var oSuggestTableInput7=new sap.m.Input("sugtableinput7", {
			placeholder: "Site Name - Please Start Typing",
			showValueHelp: true,
			showTableSuggestionValueHelp: false,
			showSuggestion: true,
			valueHelpRequest: function (oEvent) {
				//sap.m.MessageBox.alert("Value help requested");
			},
			suggestionItemSelected: function(oEvent){
				var oItem = oEvent.getParameter("selectedRow");
				//alert("sap.m.Input id " + this.getId() + " with suggestion: selected item text is " + oItem.getCells()[0].getText()+":"+oItem.getCells()[1].getText());
				BuildAssetPlantGroups(oItem.getCells()[0].getText()+":"+oItem.getCells()[1].getText());
			},
			suggest: function(oEvent){
				var sValue = oEvent.getParameter("suggestValue"),
					oSuggestionRow;

				
				
				setTimeout(function () {
					// remove old columns
					oSuggestTableInput7.removeAllSuggestionColumns();
					oSuggestTableInput7.addSuggestionColumn(new sap.m.Column({
						styleClass : "name",
						hAlign : "Begin",
						header : new sap.m.Label({
							text : "Site"
						})
					}),
					new sap.m.Column({
						styleClass : "name",
						hAlign : "Begin",
						visible: false,
						header : new sap.m.Label({
							text : "plant"
						})
					}))
					
					
					//alert(sites.length)
					for(var i=0;sites.length; i++){
						x=sites[i].split(":")
						if(jQuery.inArray(x[0], aAlreadyAddedProducts7) < 0 && jQuery.sap.startsWithIgnoreCase(x[0], sValue)){
						oSuggestionRow = oTableItemTemplate.clone();
							oSuggestionRow.getCells()[0].setText(x[0]);
							oSuggestionRow.getCells()[1].setText(x[1]);
							
							oSuggestTableInput7.addSuggestionRow(oSuggestionRow);
							aAlreadyAddedProducts7.push(x[0]);
					}
						
					}
				}, 500);
			}
		})
		var oTableItemTemplate = new sap.m.ColumnListItem({
			type : "Active",
			vAlign : "Middle",
			cells : [
				new sap.m.Label({
					text : "SITE"
				}),
				new sap.m.Label({
					text: "{qty}",
					wrapping : true
				}), new sap.m.Label({
					text: "{limit}"
				}), new sap.m.Label({
					text : "{price}"
				})
			]
		});
		var formSearchAsset = new sap.m.Dialog("dlgSearchAsset",{
		    title:"Search Assets",
		    modal: true,
		    contentWidth:"1em",
		    buttons: [
		  

		                                  new sap.m.Button( {
		                                      text: "Search",
		                                      type: sap.m.ButtonType.Accept,
		                                      tap: [ function(oEvt) {         
		                                                 
		                                         showAssetSearchResults()} ]   
		                                  }),
		                                  new sap.m.Button( {
		                                      text: "Cancel",
		                                      type: sap.m.ButtonType.Reject,
		                                      tap: [ function(oEvt) {         
		                                             
		                                         formSearchAsset.close()} ]   
		                                  })
		                                  ],                                
		    content:[
		                    new sap.ui.layout.form.SimpleForm({
		                           minWidth : 1024,
		                           maxContainerCols : 2,
		                           content : [
		                                      new sap.m.Label({text:"Site"}),
		                                      oSuggestTableInput7,
                 
		                                                       
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                      
		                                                      /* new sap.m.Label({text:"Site"}),
		                                                       new sap.m.Select('AssetSite',{
		                                                              
		                                                              items: [
		                                                                     
		                                                              ],

		                                                              change: function(oControlEvent) {
		                                                                     
		                                                                     BuildAssetPlantGroups(oControlEvent.getParameter("selectedItem").getKey());
		                                                              }
		                                                       }),*/
		                                                       new sap.m.Label({text:"Plant Group"}),
		                                                       new sap.m.Select('AssetGroup',{
		                                                              
		                                                              items: [
		                                                                     
		                                                              ],

		                                                              change: function(oControlEvent) {
		                                                                     BuildAssetTypes(oControlEvent.getParameter("selectedItem").getKey());
		                                                                     
		                                                              }
		                                                       }),
		                                                       new sap.m.Label({text:"Asset Type"}),
		                                                       new sap.m.Select('AssetType',{
		                                                              
		                                                              items: [
		                                                                     
		                                                              ],

		                                                              change: function(oControlEvent) {
		                                                                     BuildAssetSearchResults(oControlEvent.getParameter("selectedItem").getKey());
		                                                              }
		                                                       })
		                                                       
		                     


		            ]
		                    }),
		                     new sap.m.Table("AssetSearchResults",{
		                           mode: sap.m.ListMode.SingleSelectMaster,
		                           selectionChange: function(evt){
		                                
		                                  selectedAssetSearch=evt.getParameter("listItem").getId()
		                                  x=selectedAssetSearch.split(":")
		                                  if(SearchMode=="NOTIF"){
		                                  	sap.ui.getCore().byId('NewFuncLoc').setValue(x[1])
		                                  	sap.ui.getCore().byId('NewEquipment').setValue(x[2])
		                                  }
		                                  if(SearchMode=="CLOSE"){
		                                	
		                                  	sap.ui.getCore().byId('Close_FunctionalLocation').setValue(x[1])
		                                  	sap.ui.getCore().byId('Close_Equipment').setValue(x[2])
		                                  	}
		                                  formSearchAsset.close()
		                         },
		                           columns:[
		                                    new sap.m.Column({header: new sap.m.Label({text:"Plant Group"}),
		                                          hAlign: 'Left',width: '15%',minScreenWidth : "" , demandPopin: false}),
		                                    new sap.m.Column({header: new sap.m.Label({text:"Asset Type"}),
		                                          hAlign: 'Left',width: '15%',minScreenWidth : "" , demandPopin: true}),
		                                    new sap.m.Column({header: new sap.m.Label({text:"Functional Location"}),
		                                          hAlign: 'Left',width: '19%',minScreenWidth : "" , demandPopin: false}),
		                                    new sap.m.Column({header: new sap.m.Label({text:"Description"}),
		                                          hAlign: 'Left',width: '20%',minScreenWidth : "" , demandPopin: true}),
		                                    new sap.m.Column({header: new sap.m.Label({text:"Equipment"}),
		                                          hAlign: 'Left',width: '15%',minScreenWidth : "" , demandPopin: false}),
		                                    new sap.m.Column({header: new sap.m.Label({text:"Make"}),
		                                          hAlign: 'Left',width: '8%',minScreenWidth : "" , demandPopin: true}),
		                                    new sap.m.Column({header: new sap.m.Label({text:"Model"}),
		                                          hAlign: 'Right',width: '8%',minScreenWidth : "" , demandPopin: true })                                
		                                 ]
		                     })
		                    ],
		             beforeOpen:function(){
		            	 if(sites.length<1){
			            	 $.ajax({
				         		    type: "GET",
				         		    url: "TestData/Sites.xml",
				         		    dataType: "xml",
				         		    success: function (xml) {    
				         		       xmlDoc=xml 
				         		      BuildAssetSites();
	
				         		    }    
				         		       
				         		});
		            	 }
		                    
		             },
		        contentWidth:"85%",
		        contentHeight: "85%",
		       }).addStyleClass("sapUiSizeCompact");


		function showMessage(msg){
			sap.m.MessageToast.show(msg, {
				
				duration: Number(500),
				
				
				at: "center center",		
				autoClose: true,

			});

}


		function BuildAssetSites(){
			
				sites=[]
				
			
		
		       
		       $(xmlDoc).find('ASSET_EXTRACT ASSET').each(function(){
		              
		              var text= $(this).attr('SITE');
		              var text1= $(this).attr('MTCE_PLANT');
		              
		               if ($.inArray(text+":"+text1, sites)===-1){
		                   sites.push(text+":"+text1);
		               }
		   })
		   //LoadSites()


		}
		function LoadSites(){
			sap.ui.getCore().getElementById('AssetSite').destroyItems()
		    sap.ui.getCore().getElementById('AssetGroup').destroyItems()
		    sap.ui.getCore().getElementById('AssetType').destroyItems()
			   sites.sort();
			   selectedAssetSearchSite="ALL"
			   selectedAssetSearchGroup="ALL"
			   selectedAssetSearchType="ALL"
				   sap.ui.getCore().getElementById("AssetSite").addItem(
			                   new sap.ui.core.Item({
			                         key: "ALL",
			                         text: "Please Select Site"
			                   }))    
			   for (i=0;i<sites.length;i++)
			   {
			     
				     x=sites[i].split(":")
			          sap.ui.getCore().getElementById("AssetSite").addItem(
			                           new sap.ui.core.Item({
			                                  key: sites[i],
			                                  text:  x[0]
			                           }))   


			  
			   }
			   sap.ui.getCore().getElementById("AssetGroup").addItem(
			                     new sap.ui.core.Item({
			                           key: "ALL",
			                           text: "ALL"
			                     })) 
			                        sap.ui.getCore().getElementById("AssetType").addItem(
			                                         new sap.ui.core.Item({
			                                                key: "ALL",
			                                                text: "ALL"
			                                         })) 


		}

		function BuildAssetPlantGroups(site){
		if(site=="ALL"){
			selectedAssetSearchSite=site
			return
		}
			
		sap.ui.getCore().getElementById('AssetSearchResults').destroyItems();	
		x=site.split(":")
		
   	 if(navigator.platform=="Win32"){
   		 AssetPath="Assets/"
   	 }else{
   		AssetPath=cordova.file.dataDirectory
   	 }
		opMessage(AssetPath+"T2_MPLT_"+x[1]+".XML")

			 $.ajax({
      		    type: "GET",
      		    url: AssetPath+"T2_MPLT_"+x[1]+".XML",
      		    dataType: "xml",
      		    success: function (xml) {    
      		       xmlDoc=xml 
      		      
     		      selectedAssetSearchSite=x[0];
                   sap.ui.getCore().getElementById('AssetGroup').destroyItems()
                   sap.ui.getCore().getElementById('AssetType').destroyItems()
					     $(xmlDoc).find('ASSET_EXTRACT ASSET[SITE="'+x[0]+'"]').each(function(){
					            
					            var text= $(this).attr('PLANT_GROUP');
					             if ($.inArray(text, plants)===-1){
					                 plants.push(text);
					             }
					 })
					
					 plants.sort();
					                      
					                      selectedAssetSearchGroup="ALL"
					                      selectedAssetSearchType="ALL"
					                    	                
                	  sap.ui.getCore().getElementById("AssetGroup").addItem(
			                   new sap.ui.core.Item({
			                         key: "ALL",
			                         text: "ALL"
			                   })) 
					 for (i=0;i<plants.length;i++)
					 {
					    
					
					        sap.ui.getCore().getElementById("AssetGroup").addItem(
					                         new sap.ui.core.Item({
					                                key: plants[i],
					                                text: plants[i]
					                         }))   
					
					
					
					 }
					
					 
					                      sap.ui.getCore().getElementById("AssetType").addItem(
					                                       new sap.ui.core.Item({
					                                              key: "ALL",
					                                              text: "ALL"
					                                       })) 
      		    },
			 })
		       
		}
		
		function BuildAssetTypes(AssetGroup){

     		      selectedAssetSearchGroup=AssetGroup;
     		      selectedAssetSearchType="ALL"
    		       sap.ui.getCore().getElementById('AssetType').destroyItems()
					$(xmlDoc).find('ASSET_EXTRACT ASSET[SITE="'+selectedAssetSearchSite+'"]').each(function(){
							              
							              var text= $(this).attr('ASSET_DESC');
							              
							               
							               if ($(this).attr('PLANT_GROUP')==AssetGroup){
							               if ($.inArray(text, assets)===-1){
							                   assets.push(text);
							               }
							              }
							    })
							assets.sort();
     		     sap.ui.getCore().getElementById("AssetType").addItem(
	                     new sap.ui.core.Item({
	                           key: "ALL",
	                           text: "ALL"
	                     }))                       

    			   for (i=0;i<assets.length;i++)
    			   {
    			      

    			          sap.ui.getCore().getElementById("AssetType").addItem(
    			                           new sap.ui.core.Item({
    			                                  key: assets[i],
    			                                  text: assets[i]
    			                           }))   


    			  
    			   }
    			  
			 

		}

		function BuildAssetSearchResults(type){
		       selectedAssetSearchType=type;
		}

		function showAssetSearchResults(){
		       var flocs=[]
		       var flocdets=[];
		       var TestGroup=""
		    	   var TestType=""
		    		   if(selectedAssetSearchSite=="ALL"){
		    				
		    				return
		    			}
		       var opTable = sap.ui.getCore().getElementById('AssetSearchResults');
               x=selectedAssetSearchSite.split(":")
		       sap.ui.getCore().getElementById('AssetSearchResults').destroyItems();
		       $(xmlDoc).find('ASSET_EXTRACT ASSET[SITE="'+x[0]+'"]').each(function(){
		              
		              var text= $(this).attr('ASSET_DESC');
		              if(selectedAssetSearchGroup=="ALL"){
		            	  TestGroup=$(this).attr('PLANT_GROUP')
		              }else{
		            	  TestGroup=selectedAssetSearchGroup
		              }
		            	  
		               
		               if ($(this).attr('PLANT_GROUP')==TestGroup){
				    	   if(selectedAssetSearchType=="ALL"){
				            	  TestType=$(this).attr('ASSET_DESC')
				              }else{
				            	  TestType=selectedAssetSearchType
				              }
		                     if ($(this).attr('ASSET_DESC')==TestType){
		                    	
					              // if ($.inArray(text, flocs)==-1){
					               //    flocs.push(text);
					                   flocdets.push($(this).attr('PLANT_GROUP')+":"+$(this).attr('ASSET_DESC')+":"+$(this).attr('FUNC_LOC')+":"+$(this).attr('FUNC_LOC_DESC')+":"+$(this).attr('EQUIP_DESC')+":"+$(this).attr('MAKE')+":"+$(this).attr('MODEL')+":"+$(this).attr('EQUIP'));
					               //}
		                     }
		              }
		    })

		                                                                             flocdets.sort();
		                                                                                  for (n=0; n < flocdets.length; n++) {
		                                                                                         x=flocdets[n].split(":")
		                                                                           
		                                                                                         opTable.addItem (new sap.m.ColumnListItem("Asset"+n+":"+x[2]+":"+x[7],{
		                                                                                                
		                                                                                                cells : 
		                                                                                                       [
		                                                                                                       new sap.m.Text({text: x[0]}),
		                                                                                                       new sap.m.Text({text: x[1]}),
		                                                                                                       new sap.m.Text({text: x[2]}),
		                                                                                                       new sap.m.Text({text: x[3]}),
		                                                                                                       new sap.m.Text({text: x[4]}),
		                                                                                              new sap.m.Text({text: x[5]}),
		                                                                                                       new sap.m.Text({text: x[6]})   
		                                                                                                       ]
		                                                                                                }));
		                                                                                  
		                                                                                  }
		}
		