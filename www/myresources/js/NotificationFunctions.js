function buildNotificationDetails(){
	
		var objectHeader  = new sap.m.ObjectHeader('notificationHEADER',
{
			
	title:"",
	number:'',
	numberUnit:'',
	attributes: [
	               	                new sap.m.ObjectAttribute('notificationStartDate',{
	            	                   
	            	                }),

	            	                new sap.m.ObjectAttribute('notificationReportedOn',{
	            	                    
	            	                }),
	            	                new sap.m.ObjectAttribute('notificationFuncLoc',{
	            	                    
	            	                }),
	            	                new sap.m.ObjectAttribute('notificationEquipment',{
	            	                    
	            	                }),
	               	             ,
	            	                new sap.m.ObjectAttribute('notificationOrder',{
	            	                    
	            	                })
	               	                ],
	            	    firstStatus: [
	            	                new sap.m.ObjectStatus( 'notificationState',{
	            	                  
	            	                   
	            	                })
	            	                ]

});


return objectHeader;

}
function BuildGroupSelect(GType)
{
	
	selectedListType=GType
	if (GType =="TaskGroup") {
		type = "2"
		selectedListType="TaskCode"
		selectedProfile='Z_WWA W01'
		};
	if (GType == "EffectGroup") {
		type = "4"
		selectedListType="EffectCode"
		selectedProfile='000000001'
		};
	if (GType == "CauseGroup") {
		type = "5"
		selectedListType="CauseCode"
		selectedProfile='000000001'
	};
	if (GType == "ActivityGroup") {
		type = "A"
		selectedListType="ActivityCode"
		selectedProfile='000000001'
		};

	SQLStatement="SELECT * from RefCodeGroups where catalog_type = '"+type+"' and profile = '"+selectedProfile+"'"
	sap.ui.getCore().getElementById(GType).destroyItems();
	html5sql.process(SQLStatement,
		 function(transaction, results, rowsArray){
			//alert(SQLStatement+"--"+ rowsArray.length)
			n=0;
		 	while (n < rowsArray.length) {
				 sap.ui.getCore().getElementById(GType).addItem(
						 new sap.ui.core.Item("Group:"+rowsArray[n].id,{
								key:  rowsArray[n].catalog_type+":"+rowsArray[n].codegroup,
								text: rowsArray[n].codegroup_text
							}))				
				n++;				 
			 }
		 	
			
			
		 },
		 function(error, statement){
			 alert(error+statement)
		 }        
		);	 
}
function BuildCodeSelect(CCGroup,Code)
{
	var type = "S"
	var selectedId=0;
	
	SQLStatement="SELECT * from RefCodes where code_cat_group = '"+CCGroup+"' and profile = '"+selectedProfile+"'"

	sap.ui.getCore().getElementById(selectedListType).destroyItems();
	html5sql.process(SQLStatement,
		 function(transaction, results, rowsArray){
			n=0;
			//alert(SQLStatement+"--"+ rowsArray.length)
		 	while (n < rowsArray.length) {
				 sap.ui.getCore().getElementById(selectedListType).addItem(
						 new sap.ui.core.Item("Code:"+rowsArray[n].id,{
								key:  rowsArray[n].code_cat_group+":"+rowsArray[n].code,
								text: rowsArray[n].code_text
							}))	
							if(formMode!="Create"){
								if(rowsArray[n].code==Code){
									selectedId=rowsArray[n].id
								}
							}
							
				n++;				 
			 }
		 	if(formMode!="Create"){
		 		sap.ui.getCore().getElementById('selectedListType').setSelectedItem("Code:"+selectedId)
		 	}
			
			
		 },
		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	 
}
function changeCodes(LType,selectedGroup)
{
	res=selectedGroup.split(":")

	SQLStatement="SELECT * from RefCodeGroups where id = '"+res[1]+"'"

	sap.ui.getCore().getElementById(LType+"Code").destroyItems();
	html5sql.process(SQLStatement,
		 function(transaction, results, rowsArray){
			
		 	if (rowsArray.length>0) {
			 
		 	SQLStatement="SELECT * from RefCodes where code_cat_group = '"+rowsArray[0].code_cat_group+"' and profile = '"+selectedProfile+"'"
		 	//alert(SQLStatement)
		 	html5sql.process(SQLStatement,
		 			 function(transaction, results, rowsArray){
		 				var n=0;
		 				
		 			 	while (n < rowsArray.length) {
		 					 sap.ui.getCore().getElementById(LType+"Code").addItem(
		 							 new sap.ui.core.Item("Code:"+rowsArray[n].id,{
		 									key:  rowsArray[n].code_cat_group+":"+rowsArray[n].code,
		 									text: rowsArray[n].code_text
		 								}))	
		 								
		 								
		 					n++;				 

		 			 	}
		 				
		 			 },
		 			 function(error, statement){
		 				//alert(error+statement)
		 			 }        
		 			);	 
		 	}
			
		 },
		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	 
}
function BuildTaskForm(){

	var res = selectedTableEntry.split(":")

	
	SQLStatement="SELECT * from MyTasks where id = '"+res[1]+"'"

	html5sql.process(SQLStatement,
		 function(transaction, results, rowsArray){

			 if (rowsArray.length>0){
				 
				 

				 if(formMode!="Create"){
					 sap.ui.getCore().getElementById('TaskText').setValue(rowsArray[0].task_text)
					 sap.ui.getCore().getElementById('TaskSLAEnd').setValue(formatDateTime1(rowsArray[0].sla_end_date+" "+rowsArray[0].sla_end_time))
					 sap.ui.getCore().getElementById('TaskPlannedStart').setValue(formatDateTime1(rowsArray[0].plnd_start_date+" "+rowsArray[0].plnd_start_time))
					 sap.ui.getCore().getElementById('TaskPlannedEnd').setValue(formatDateTime1(rowsArray[0].plnd_end_date+" "+rowsArray[0].plnd_end_time))
					 sap.ui.getCore().getElementById('TaskStatus').setValue(rowsArray[0].status)
					 sap.ui.getCore().getElementById('TaskLongText').setValue(rowsArray[0].longtext)
				 }
			 }
					SQLStatement="SELECT * from RefCodeGroups where catalog_type = '"+rowsArray[0].task_cat_typ+"' and codegroup = '"+rowsArray[0].task_codegrp+"' and profile = '"+selectedProfile+"'"
						var ctype=rowsArray[0].task_cat_typ
						var cgrp =rowsArray[0].task_codegrp
						var ccod=rowsArray[0].task_code
						html5sql.process(SQLStatement,
							 function(transaction, results, rowsArray){
								
							 	if (rowsArray.length>0) {
								
								 	sap.ui.getCore().getElementById('TaskGroup').setSelectedItem("Group:"+rowsArray[0].id)
								 	BuildCodeSelect(""+ctype+cgrp,ccod)
							 	}
								
							 },
							 function(error, statement){
								 alert(error+statement) 
							 }        
							);	 
				 
			 
			
			
		 },
		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	 

	 








	}
function BuildActivityForm(){

	var res = selectedTableEntry.split(":")

	
	SQLStatement="SELECT * from Myactivities where id = '"+res[1]+"'"

	html5sql.process(SQLStatement,
		 function(transaction, results, rowsArray){

			 if (rowsArray.length>0){
				 
				 if(formMode!="Create"){
					 sap.ui.getCore().getElementById('ActivityText').setValue(rowsArray[0].act_text)
					 sap.ui.getCore().getElementById('ActivityStart').setValue(formatDateTime1(rowsArray[0].start_date+" "+rowsArray[0].start_time))
					 sap.ui.getCore().getElementById('ActivityEnd').setValue(formatDateTime1(rowsArray[0].end_date+" "+rowsArray[0].end_time))
					 sap.ui.getCore().getElementById('ActivityStatus').setValue(rowsArray[0].status)
					 sap.ui.getCore().getElementById('ActivityLongText').setValue(rowsArray[0].long_text)
				 }
					SQLStatement="SELECT * from RefCodeGroups where catalog_type = '"+rowsArray[0].task_cat_typ+"' and codegroup = '"+rowsArray[0].task_codegrp+"' and profile = '"+selectedProfile+"'"
					var ctype=rowsArray[0].task_cat_typ
					var cgrp =rowsArray[0].task_codegrp
					var ccod=rowsArray[0].task_code
					html5sql.process(SQLStatement,
						 function(transaction, results, rowsArray){
							
						 	if (rowsArray.length>0) {
							
							 	sap.ui.getCore().getElementById('ActivityGroup').setSelectedItem("Group:"+rowsArray[0].id)
							 	BuildCodeSelect(""+ctype+cgrp,ccod)
						 	}
							
						 },
						 function(error, statement){
							 alert(error+statement) 
						 
			 })
			 }
		 },
		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	 
	}
function BuildCauseForm(){

	var res = selectedTableEntry.split(":")

	
	SQLStatement="SELECT * from Mycauses where id = '"+res[1]+"'"

	html5sql.process(SQLStatement,
		 function(transaction, results, rowsArray){

			 if (rowsArray.length>0){
				 
				 if(formMode!="Create"){
					 sap.ui.getCore().getElementById('CauseText').setValue(rowsArray[0].cause_text)
					 sap.ui.getCore().getElementById('Causetatus').setValue(rowsArray[0].status)
					 sap.ui.getCore().getElementById('CauseLongText').setValue(rowsArray[0].long_text)				 
				 }
				 SQLStatement="SELECT * from RefCodeGroups where catalog_type = '"+rowsArray[0].task_cat_typ+"' and codegroup = '"+rowsArray[0].task_codegrp+"' and profile = '"+selectedProfile+"'"
					var ctype=rowsArray[0].task_cat_typ
					var cgrp =rowsArray[0].task_codegrp
					var ccod=rowsArray[0].task_code
					html5sql.process(SQLStatement,
						 function(transaction, results, rowsArray){
							
						 	if (rowsArray.length>0) {
							
							 	sap.ui.getCore().getElementById('CauseGroup').setSelectedItem("Group:"+rowsArray[0].id)
							 	BuildCodeSelect(""+ctype+cgrp,ccod)
						 	}
							
						 },
						 function(error, statement){
							 alert(error+statement) 
						 
						 })
			 }
		 },

		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	 
	}
function BuildEffectForm(){

	var res = selectedTableEntry.split(":")

	
	SQLStatement="SELECT * from Myeffects where id = '"+res[1]+"'"

	html5sql.process(SQLStatement,
		 function(transaction, results, rowsArray){

			 if (rowsArray.length>0){
				 if(formMode!="Create"){
				 	sap.ui.getCore().getElementById('EffectValue').setValue(rowsArray[0].value)
				 	}
				 SQLStatement="SELECT * from RefCodeGroups where catalog_type = '"+rowsArray[0].task_cat_typ+"' and codegroup = '"+rowsArray[0].task_codegrp+"' and profile = '"+selectedProfile+"'"
					var ctype=rowsArray[0].task_cat_typ
					var cgrp =rowsArray[0].task_codegrp
					var ccod=rowsArray[0].task_code
					html5sql.process(SQLStatement,
						 function(transaction, results, rowsArray){
							
						 	if (rowsArray.length>0) {
							
							 	sap.ui.getCore().getElementById('EffectGroup').setSelectedItem("Group:"+rowsArray[0].id)
							 	BuildCodeSelect(""+ctype+cgrp,ccod)
						 	}
							
						 },
						 function(error, statement){
							 alert(error+statement) 
						 
						 })
			 }
		 },
		
		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	 
	}
function buildNotificationDetailsContent(aid){

var res = aid.split(":")
var notifno=res[1];
selectedNotification=notifno;

var StatusState="";
var StatusIcon="";
SQLStatement="SELECT * from MyNotifications where id = '"+notifno+"'"

html5sql.process(SQLStatement,
	 function(transaction, results, rowsArray){

		 if (rowsArray.length>0){
			 
			 selectedNotification=rowsArray[0].notifno;

			 sap.ui.getCore().getElementById('notificationHEADER').setTitle(rowsArray[0].shorttext)
			 sap.ui.getCore().getElementById('notificationHEADER').setNumber(rowsArray[0].notifno)
			 sap.ui.getCore().getElementById('notificationHEADER').setNumberUnit(rowsArray[0].type)
			 sap.ui.getCore().getElementById('notificationHEADER').destroyStatuses()
			 sap.ui.getCore().getElementById('notificationHEADER').addStatus( new sap.m.ObjectStatus({
					text : rowsArray[0].priority,
					

					state : "Success"
			 }))
			
			  sap.ui.getCore().getElementById('notificationStartDate').setTitle("Start Date")
			  sap.ui.getCore().getElementById('notificationStartDate').setText(formatDateTime1(rowsArray[0].startdate))
			  sap.ui.getCore().getElementById('notificationReportedOn').setTitle("Reported On ")
			  sap.ui.getCore().getElementById('notificationReportedOn').setText(rowsArray[0].enddate)

			  sap.ui.getCore().getElementById('notificationOrder').setTitle("Order ")	
			  sap.ui.getCore().getElementById('notificationOrder').setText(rowsArray[0].orderno)	
			  sap.ui.getCore().getElementById('notificationFuncLoc').setTitle("Funcloc ")	
			  sap.ui.getCore().getElementById('notificationFuncLoc').setText(rowsArray[0].funcloc)	
			  sap.ui.getCore().getElementById('notificationEquipment').setTitle("Equipment ")	
			  sap.ui.getCore().getElementById('notificationEquipment').setText(rowsArray[0].equipment)	
			  sap.ui.getCore().getElementById('notificationLongText').setText(rowsArray[0].longtext)	

			 
		 }
		
		 buildNotificationDetailsTabContent(notifno)
		 currentPage=window.location.href
		 if(currentPage.indexOf("Jobs.html") <1){
		 	oDetailPage.setFooter(longtextFooter)
		 	}
	 },
	 function(error, statement){
		 //outputLogToDB(); 
	 }        
	);	

 








}

function buildNotificationDetailsTabs(){
	var tabBar  = new sap.m.IconTabBar('ntabBar',
			{
				expanded:'{device>/isNoPhone}',

				select:[function(oEvt) {	
				currentPage=window.location.href
				//alert(currentPage+currentPage.indexOf("Jobs.html"))
						if(currentPage.indexOf("Jobs.html") <1){
						
					 if(oEvt.getParameters().key=="Tasks"){oDetailPage.setFooter(tasksFooter)}
					  if(oEvt.getParameters().key=="Activities"){oDetailPage.setFooter(activitiesFooter)}
					  if(oEvt.getParameters().key=="Effects"){oDetailPage.setFooter(effectsFooter)}
					  if(oEvt.getParameters().key=="nLongText"){oDetailPage.setFooter(longtextFooter)}
					  if(oEvt.getParameters().key=="Causes"){oDetailPage.setFooter(causesFooter)}
					 }else{
					/*  
					  if(oEvt.getParameters().key=="Tasks"){formOrdNotification.setFooter(tasksFooter)}
					  if(oEvt.getParameters().key=="Activities"){formOrdNotification.setFooter(activitiesFooter)}
					  if(oEvt.getParameters().key=="Effects"){formOrdNotification.setFooter(effectsFooter)}
					  if(oEvt.getParameters().key=="nLongText"){formOrdNotification.setFooter(longtextFooter)}
					  if(oEvt.getParameters().key=="Causes"){formOrdNotification.setFooter(causesFooter)}
					 */
					 }
					}
				],
				
				items: [
						new sap.m.IconTabFilter( {
							text:'Long Text',
						    key:'nLongText',
						    tooltip: 'Long Text',
						    icon: "sap-icon://document-text",
						    content:[
										new sap.m.Text( 'notificationLongText',{})
						             ]
						 }),
						 new sap.m.IconTabFilter( {
	    	                   key:'Tasks',
	    	                   text:'Tasks',
	    	                   tooltip: 'Tasks',
	    	                   icon: "sap-icon://order-status",
	       	                   content:[
									new sap.m.Table("TasksTable",{
										mode: sap.m.ListMode.SingleSelectMaster,
										selectionChange: function(evt){
											selectedTableEntry=evt.getParameter("listItem").getId()
											formMode="Display"
											formTask.open()
									    },
										columns:[
										         new sap.m.Column({header: new sap.m.Label({text:"Id"}),
										        	 hAlign: 'Left',width: '10%', minScreenWidth : "" , demandPopin: false}),
										         new sap.m.Column({header: new sap.m.Label({text:"Group"}),
										        	 hAlign: 'Left',width: '20%',minScreenWidth : "" , demandPopin: false}),
										         new sap.m.Column({header: new sap.m.Label({text:"Code"}),
										        	 hAlign: 'Left',width: '20%', minScreenWidth : "" , demandPopin: false}),
										         new sap.m.Column({header: new sap.m.Label({text:"SLA End"}),
										        	 hAlign: 'Left',width: '12%', minScreenWidth : "" , demandPopin: true}),
											     new sap.m.Column({header: new sap.m.Label({text:"End Date"}),
											       	 hAlign: 'Left',width: '12%', minScreenWidth : "" , demandPopin: true}),
										         new sap.m.Column({header: new sap.m.Label({text:"Complete"}),
										        	 hAlign: 'Left',width: '14%',minScreenWidth : "" , demandPopin: true }) ,
										         new sap.m.Column({header: new sap.m.Label({text:"Del"}),
										        	 hAlign: 'Left',width: '12%',minScreenWidth : "" , demandPopin: true }) 
								           	     ]
									})
									]
					    }),     
     	               new sap.m.IconTabFilter( 'ACTIVITIES',{
    	                   text:'Activities',
    	                   key:'Activities',
    	                   tooltip: 'Activities',
    	                   icon: "sap-icon://activities",
       	                   content:[
								new sap.m.Table("ActivitiesTable",{
									mode: sap.m.ListMode.SingleSelectMaster,
									selectionChange: function(evt){
										selectedTableEntry=evt.getParameter("listItem").getId()
										formMode="Display"
										formActivity.open()
								    },
									columns:[
									         new sap.m.Column({header: new sap.m.Label({text:"Task"}),
									        	 hAlign: 'Left',width: '8%', minScreenWidth : "" , demandPopin: false}),
									         new sap.m.Column({header: new sap.m.Label({text:"Id"}),
									        	 hAlign: 'Left',width: '8%',minScreenWidth : "" , demandPopin: true}),
									         new sap.m.Column({header: new sap.m.Label({text:"Type"}),
									        	 hAlign: 'Left',width: '8%', minScreenWidth : "" , demandPopin: false}),
									         new sap.m.Column({header: new sap.m.Label({text:"Group"}),
									        	 hAlign: 'Left',width: '15%',minScreenWidth : "" , demandPopin: true}),
									         new sap.m.Column({header: new sap.m.Label({text:"Code"}),
									        	 hAlign: 'Left',width: '15%', minScreenWidth : "" , demandPopin: false}),
									         new sap.m.Column({header: new sap.m.Label({text:"Text"}),
									        	 hAlign: 'Left',width: '40%',minScreenWidth : "" , demandPopin: true }) ,   
									         new sap.m.Column({header: new sap.m.Label({text:"Del"}),
									        	 hAlign: 'Left',width: '6%',minScreenWidth : "" , demandPopin: true }) 
							           	     ]
								})
								]
				    }),
       	                
       	                

           	                new sap.m.IconTabFilter( 'CAUSES',{
         	                   key:'Causes',
         	                  text:'Causes',
         	                  tooltip: 'Causes',
         	                  icon: "sap-icon://cause",
            	                   content:[
     									new sap.m.Table("CausesTable",{
     										width:'100%',
    										mode: sap.m.ListMode.SingleSelectMaster,
    										selectionChange: function(evt){
    											selectedTableEntry=evt.getParameter("listItem").getId()
    											formMode="Display"
    											formCause.open()
    									    },
     										columns:[
     										         
     										         
    										         new sap.m.Column({header: new sap.m.Label({text:"Item Id"}),
    										        	 hAlign: 'Left',width: '10%', minScreenWidth : "" , demandPopin: false}),
    										        	 new sap.m.Column({header: new sap.m.Label({text:"Id"}),
        										        	 hAlign: 'Left',width: '5%', minScreenWidth : "" , demandPopin: false}),
    										         new sap.m.Column({header: new sap.m.Label({text:"Group"}),
    										        	 hAlign: 'Left',width: '25%',minScreenWidth : "" , demandPopin: true}),
    										         new sap.m.Column({header: new sap.m.Label({text:"Code"}),
    										        	 hAlign: 'Left',width: '25%',minScreenWidth : "" , demandPopin: true }),     	                          
    										        	 new sap.m.Column({header: new sap.m.Label({text:"Description"}),
        										        	 hAlign: 'Left',width: '29%',minScreenWidth : "" , demandPopin: true }),
        										        	 new sap.m.Column({header: new sap.m.Label({text:"Del"}),
        											        	 hAlign: 'Left',width: '6%',minScreenWidth : "" , demandPopin: true }) 
								           	     ]
     									})
     									]          	                
         	                }),			
           	                new sap.m.IconTabFilter( 'EFFECTS',{
          	                   text:'Effects',
          	                 key:'Effects',
          	                  tooltip: 'Effects',
          	                  icon: "sap-icon://list",
             	                   content:[
      									new sap.m.Table("EffectsTable",{
      										width:'100%',
    										mode: sap.m.ListMode.SingleSelectMaster,
    										selectionChange: function(evt){
    											selectedTableEntry=evt.getParameter("listItem").getId()
    											formMode="Display"
    											formEffect.open()
    									    },
      										columns:[
      										         
      										         
      										         new sap.m.Column({header: new sap.m.Label({text:"Item Id"}),
      										        	 hAlign: 'Left',width:'10%', minScreenWidth : "" , demandPopin: false}),
          										     new sap.m.Column({header: new sap.m.Label({text:"id"}),
          										         hAlign: 'Left',width:'5%', minScreenWidth : "" , demandPopin: false}),
              										 new sap.m.Column({header: new sap.m.Label({text:"Type"}),
      										        	 hAlign: 'Left',width:'10%', minScreenWidth : "" , demandPopin: false}),
              										 new sap.m.Column({header: new sap.m.Label({text:"Group"}),
      										        	 hAlign: 'Left',width:'20%', minScreenWidth : "" , demandPopin: true}),
              										 new sap.m.Column({header: new sap.m.Label({text:"Code"}),
      										        	 hAlign: 'Left',width:'20%', minScreenWidth : "" , demandPopin: true}),
 	 										         new sap.m.Column({header: new sap.m.Label({text:"Value"}),
 	 										        	 hAlign: 'Left',width:'29%', minScreenWidth : "small" , demandPopin: true}),      
    										        	 new sap.m.Column({header: new sap.m.Label({text:"Del"}),
    											        	 hAlign: 'Left',width: '6%',minScreenWidth : "" , demandPopin: true }) 
 								           	     ]
      									})
      									]          	                
          	                }),        	                
       	                ]


			})
	
	return tabBar;

	}

function deleteEntry(selItem){
	var x=selItem.split(":")
	var tabName='';
	var id=x[1];
	var LType=x[0]

	if(LType=="Task"){tabName="MyTasks"}
	if(LType=="Activity"){tabName="MyActivities"}
	if(LType=="Cause"){tabName="MyCauses"}
	if(LType=="Effect"){tabName="MyEffects"}
	//alert("DELETE FROM "+tabName+" where id = "+id)
	html5sql.process("DELETE FROM "+tabName+" where id = "+id,
			 function(){
				buildNotificationDetailsTabContent(selectedNotification)
			 },
			 function(error, statement){
				 opMessage("Error: " + error.message + " when Deleting " + statement);
				 aler("Error: " + error.message + " when Deleting " + statement);
			 }        
	); 

}
function completeEntry(type){
	alert("Complete "+type)
}
function buildNotificationDetailsTabContent(notifNo){
var del='';
	
html5sql.process("SELECT * FROM MyActivities where notifno = '"+notifNo+"' ;",
		 function(transaction, results, rowsArray){
			var n = 0;
			var opTable = sap.ui.getCore().getElementById('ActivitiesTable');
			opTable.destroyItems();
			while (n < rowsArray.length) {
				if(rowsArray[n].item_id=="NEW"){
					del=new sap.m.Button( {
						type: 	sap.m.ButtonType.Reject,
		       			 icon:"sap-icon://delete",
		       			type: 	sap.m.ButtonType.Reject,
		       				 press: [ function(evt){
		       					
		       					deleteEntry(evt.getSource().getParent().getId());
		       				
		       						}]
		       			 })
				}else{
					del="";
				}
		
				opTable.addItem (new sap.m.ColumnListItem("Activity:"+rowsArray[n].id,{
					cells : 
						[
						new sap.m.Text({text: rowsArray[n].task_id}),
			            new sap.m.Text({text: rowsArray[n].item_id}),
						new sap.m.Text({text: rowsArray[n].act_cat_typ}),			    
						new sap.m.Text({text: rowsArray[n].txt_actgrp}),
			            new sap.m.Text({text: rowsArray[n].txt_actcd}),
						new sap.m.Text({text: rowsArray[n].act_text})   ,
						del
				 		]
					}));
				n++;
			 }

		 },
		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	
//Mpoints
html5sql.process("SELECT * FROM MyTasks where notifno = '"+notifNo+"' ;",
		 function(transaction, results, rowsArray){
			var n = 0;
			var opTable = sap.ui.getCore().getElementById('TasksTable');
			opTable.destroyItems();
			while (n < rowsArray.length) {
				if(rowsArray[n].item_id=="NEW"){
					del=new sap.m.Button( {
						type: 	sap.m.ButtonType.Reject,
		       			 icon:"sap-icon://delete",
		       			
		       				 press: [ function(evt){
		       					deleteEntry(evt.getSource().getParent().getId());
		       				
		       						}]
		       			 })
				}else{
					del="";
				}
			
		
				opTable.addItem (new sap.m.ColumnListItem("Task:"+rowsArray[n].id,{
					cells : 
						[
						new sap.m.Text({text: rowsArray[n].item_id}),
			            new sap.m.Text({text: rowsArray[n].task_codegrp}),
						new sap.m.Text({text: rowsArray[n].task_code}),
						new sap.m.Text({text: formatDateTime(rowsArray[n].sla_end_date+rowsArray[n].sla_end_time)}),
						new sap.m.Text({text: formatDateTime(rowsArray[n].plnd_end_date+rowsArray[n].plnd_end_time)}),
						new sap.m.Text({text: rowsArray[n].task_complete}),
							del
				 		]
					}));
				n++;
			 }

		 },
		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	

 //Time Confirmations
html5sql.process("SELECT * FROM MyCauses where notifno = '"+notifNo+"' ;",
		 function(transaction, results, rowsArray){

			var n = 0;
			var opTable = sap.ui.getCore().getElementById('CausesTable');
			opTable.destroyItems();
			while (n < rowsArray.length) {
				if(rowsArray[n].item_id=="NEW"){
					del=new sap.m.Button( {
						type: 	sap.m.ButtonType.Reject,
		       			 icon:"sap-icon://delete",
		       			
		       				 press: [ function(evt){
		       					deleteEntry(evt.getSource().getParent().getId());
		       				
		       						}]
		       			 })
				}else{
					del="";
				}
		
				opTable.addItem (new sap.m.ColumnListItem("Cause:"+rowsArray[n].id,{
					cells : 
						[
						new sap.m.Text({text: rowsArray[n].item_id}),
			            new sap.m.Text({text: rowsArray[n].cause_id}),
						new sap.m.Text({text: rowsArray[n].txt_causegrp}),
						new sap.m.Text({text: rowsArray[n].txt_causecd}),
			            new sap.m.Text({text: rowsArray[n].cause_text}),
			            del
				 		]
					}));
				n++;
			 }

		 },
		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	
html5sql.process("SELECT * FROM MyEffects where notifno = '"+notifNo+"' ;",
		 function(transaction, results, rowsArray){
			var n = 0;
			var opTable = sap.ui.getCore().getElementById('EffectsTable');
			opTable.destroyItems();
			while (n < rowsArray.length) {
				if(rowsArray[n].item_id=="NEW"){
					del=new sap.m.Button( {
						type: 	sap.m.ButtonType.Reject,
		       			 icon:"sap-icon://delete",
		       			
		       				 press: [ function(evt){
		       					deleteEntry(evt.getSource().getParent().getId());
		       				
		       						}]
		       			 })
				}else{
					del="";
				}
		
				opTable.addItem (new sap.m.ColumnListItem("Effect:"+rowsArray[n].id,{
					cells : 
						[
						new sap.m.Text({text: rowsArray[n].item_id}),
			            new sap.m.Text({text: rowsArray[n].task_id}),
						new sap.m.Text({text: rowsArray[n].txt_effectgrp}),
						new sap.m.Text({text: rowsArray[n].txt_effectcd}),
			            new sap.m.Text({text: rowsArray[n].value}),
			            del
				 		]
					}));
				n++;
			 }

		 },
		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	
}

function CreateListEntry(LType){

	var x = sap.ui.getCore().byId(LType+"Group").getSelectedItem().getKey();
	var y = sap.ui.getCore().byId(LType+"Code").getSelectedItem().getKey();
	var gc = x.split(":")
	var cc = y.split(":")
	
	if(LType=="Task"){		


		createTask(selectedNotification,gc[0], gc[1],cc[1], sap.ui.getCore().byId(LType+"Group").getSelectedItem().getText(), sap.ui.getCore().byId(LType+"Code").getSelectedItem().getText(), sap.ui.getCore().byId(LType+"Text").getValue())
	}else if (LType=="Activity"){		
		createActivity(selectedNotification,gc[0], 'NEW', gc[1],cc[1], sap.ui.getCore().byId(LType+"Group").getSelectedItem().getText(), sap.ui.getCore().byId(LType+"Code").getSelectedItem().getText(), sap.ui.getCore().byId(LType+"Text").getValue())
	}else if (LType=="Cause"){		
		createCause(selectedNotification,gc[0], gc[1],cc[1], sap.ui.getCore().byId(LType+"Group").getSelectedItem().getText(), sap.ui.getCore().byId(LType+"Code").getSelectedItem().getText(),  sap.ui.getCore().byId(LType+"Text").getValue())
	}else if (LType=="Effect"){		
		createEffect(selectedNotification,gc[0], gc[1],cc[1], sap.ui.getCore().byId(LType+"Group").getSelectedItem().getText(), sap.ui.getCore().byId(LType+"Code").getSelectedItem().getText(), sap.ui.getCore().byId(LType+"Value").getValue())
	}
	buildNotificationDetailsTabContent(selectedNotification)
}