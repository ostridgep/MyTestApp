var formTaskStatus = new sap.m.Dialog("dlgTaskStatus",{
    title:"Task Status",
    modal: true,
    contentWidth:"1em",
    buttons: [
				new sap.m.Button( {
				    text: "Save",
				    type: 	sap.m.ButtonType.Accept,
				    tap: [ function(oEvt) {		  
						 
				    	formTaskStatus.close()
						  } ]
				}),
				new sap.m.Button( {
				    text: "Close",
				    type: 	sap.m.ButtonType.Reject,
				    tap: [ function(oEvt) {		  
						 
				    	formTaskStatus.close()
						  } ]
				})
				],	
//				  contentHeight:"50%",
				  contentWidth:"35%",
    content:[			
			new sap.ui.layout.form.Form("TaskStatusForm",{
			
				editable: true,
				layout: oLayout2,
				formContainers: [
					new sap.ui.layout.form.FormContainer("F0C1",{
						
						formElements: [
						               
							new sap.ui.layout.form.FormElement({
								title: "1",
								fields: [
								        new sap.m.CheckBox({}),
										new sap.m.Text({text: 'AB01 - Aborted Wrong Job Type'})
									]
								}),
							new sap.ui.layout.form.FormElement({
								title: "2",
								fields: [
								        new sap.m.CheckBox({}),
										new sap.m.Text({text: 'AB02 - Aborted Not Skilled'})
									]
								}),
							new sap.ui.layout.form.FormElement({
								title: "3",
								fields: [
								        new sap.m.CheckBox({}),
										new sap.m.Text({text: 'AB03 - Aborted Other'})
									]
								}),
							new sap.ui.layout.form.FormElement({
								title: "1",
								fields: [
								        new sap.m.CheckBox({}),
										new sap.m.Text({text: 'AB04 - Aborted Wrong Job Type'})
									]
								}),
							new sap.ui.layout.form.FormElement({
								title: "2",
								fields: [
								        new sap.m.CheckBox({}),
										new sap.m.Text({text: 'AB05 - Aborted Not Skilled'})
									]
								}),
							new sap.ui.layout.form.FormElement({
								title: "3",
								fields: [
								        new sap.m.CheckBox({}),
										new sap.m.Text({text: 'AB06 - Aborted Other'})
									]
								})
							
							]
						})
						
						]
			 	})

            ],
            beforeOpen:function(){
            }
 })
var formTask = new sap.m.Dialog("dlgTask",{
    title:"",
    modal: true,
    contentWidth:"1em",
    buttons: [
					new sap.m.Button( {
					    text: "Save",
					    tap: [ function(oEvt) {	
					    	CreateListEntry("Task")
									formTask.close()
							  } ]
					   
					}),   
					new sap.m.Button( {
					    text: "Cancel",
					    tap: [ function(oEvt) {		  						 
					    	formTask.close()} ]   
					})
					],	
		            contentWidth:"90%",
		            
		            	
    content:[


new sap.ui.layout.form.Form("TaskForm",{
	//title: new sap.ui.core.Title({text: "Address Data", icon: "../../commons/demokit/images/address.gif", tooltip: "Title tooltip"}),
	title: "",
	editable: false,
	layout: oLayout1,
	formContainers: [
		new sap.ui.layout.form.FormContainer("F1C1",{
			title: "",
			formElements: [

				new sap.ui.layout.form.FormElement({
					label: "Group",
					fields: [
					         new sap.m.Select('TaskGroup',{items: [],
					        	 change: function(oControlEvent) {
										changeCodes("Task",oControlEvent.getParameter("selectedItem").getId());
									}})
							]
					}),
				new sap.ui.layout.form.FormElement({
					label: "Code",
					fields: [
					          new sap.m.Select('TaskCode',{items: []})
						]
					}),
				new sap.ui.layout.form.FormElement({
					label: "Text",
					fields: [
					         new sap.m.Input("TaskText",{})
						]
					})
				]
		}),
		new sap.ui.layout.form.FormContainer("F1C2",{
			title: "",
			formElements: [
				new sap.ui.layout.form.FormElement({
					label: "SLA End Date",
					fields: [
							new sap.m.Input("TaskSLAEnd",{})
							]
					}),
				new sap.ui.layout.form.FormElement({
					label: "Planned Start Date",
					fields: [
							new sap.m.Input("TaskPlannedStart",{})
							]
					}),
				new sap.ui.layout.form.FormElement({
					label: "Planned End Date",
					fields: [
							new sap.m.Input("TaskPlannedEnd",{})
							]
					})
				]
		}),
		new sap.ui.layout.form.FormContainer("F1C3",{
			title: "",

			formElements: [
				new sap.ui.layout.form.FormElement({
					label: "Status",
					fields: [
					        new sap.m.Input("TaskStatus",{}),
					        new sap.m.Button( {
							    text: "Change",
							    tap: [ function(oEvt) {		  
											formTaskStatus.open()
									  } ]
							   
							})
							]
					}),

				new sap.ui.layout.form.FormElement({
					label: "Complete",
					fields: [
							new sap.m.Switch({state: false,type: sap.m.SwitchType.AcceptReject})
							]
					})
				]
			}),
			new sap.ui.layout.form.FormContainer("F1C4",{
				title: "",

				formElements: [

					new sap.ui.layout.form.FormElement({
						label: "Long Text",
						fields: [
								new sap.m.TextArea("TaskLongText",{})
								]
						})
					]
				})
	]
})
             


            ],
            beforeOpen:function(){
            	var x =selectedTableEntry.split(":")
            	this.setTitle(formMode+" Task Details")
  				BuildTaskForm()
  				BuildGroupSelect('TaskGroup')
            	if(formMode=="Display"){
            		sap.ui.getCore().getElementById('F1C2').setVisible(true)
            		sap.ui.getCore().getElementById('F1C3').setVisible(true)
            		sap.ui.getCore().getElementById('F1C4').setVisible(true)
            		sap.ui.getCore().getElementById('TaskForm').setEditable(false)
            	}
            	if(formMode=="Create"){
            		sap.ui.getCore().getElementById('TaskText').setValue("")
            		sap.ui.getCore().getElementById('F1C2').setVisible(false)
            		sap.ui.getCore().getElementById('F1C3').setVisible(false)
            		sap.ui.getCore().getElementById('F1C4').setVisible(false)
            		sap.ui.getCore().getElementById('TaskForm').setEditable(true)
            	}
            

            },
	 })
var formActivity = new sap.m.Dialog("dlgActivity",{
    title:"",
    modal: true,
    contentWidth:"1em",
    buttons: [
					new sap.m.Button( {
					    text: "Save",
					    tap: [ function(oEvt) {		 
					    	CreateListEntry("Activity")
					    	formActivity.close()
							  } ]
					   
					}),   
					new sap.m.Button( {
					    text: "Cancel",
					    tap: [ function(oEvt) {		  						 
					    	formActivity.close()} ]   
					})
					],	
		            contentWidth:"90%",
		            
		            	
    content:[


new sap.ui.layout.form.Form("ActivityForm",{
	//title: new sap.ui.core.Title({text: "Address Data", icon: "../../commons/demokit/images/address.gif", tooltip: "Title tooltip"}),
	title: "",
	editable: false,
	layout: oLayout3,
	formContainers: [
		new sap.ui.layout.form.FormContainer("A1C1",{
			title: "",
			formElements: [
				new sap.ui.layout.form.FormElement({
					label: "Group",
					fields: [
					         new sap.m.Select('ActivityGroup',{items: [],
					        	 change: function(oControlEvent) {
										changeCodes("Activity",oControlEvent.getParameter("selectedItem").getId());
									}})
							]
					}),
				new sap.ui.layout.form.FormElement({
					label: "Code",
					fields: [
					          new sap.m.Select('ActivityCode',{items: []})
						]
					}),
				new sap.ui.layout.form.FormElement({
					label: "Text",
					fields: [
					         new sap.m.Input("ActivityText",{})
						]
					})
				]
		}),
		new sap.ui.layout.form.FormContainer("A1C2",{
			title: "",
			formElements: [
				new sap.ui.layout.form.FormElement({
					label: "Start Date",
					fields: [
							new sap.m.Input("ActivityStart",{})
							]
					}),
				new sap.ui.layout.form.FormElement({
					label: "End Date",
					fields: [
							new sap.m.Input("ActivityEnd",{})
							]
					})
				]
		}),
		new sap.ui.layout.form.FormContainer("A1C3",{
			title: "",

			formElements: [
				new sap.ui.layout.form.FormElement({
					label: "Status",
					fields: [
					        new sap.m.Input("ActivityStatus",{}),
					        new sap.m.Button( {
							    text: "Change",
							    tap: [ function(oEvt) {		  
											formTaskStatus.open()
									  } ]
							   
							})
							]
					})

				
				]
			}),
			new sap.ui.layout.form.FormContainer("A1C4",{
				title: "",

				formElements: [

					new sap.ui.layout.form.FormElement({
						label: "Long Text",
						fields: [
								new sap.m.TextArea("ActivityLongText",{})
								]
						})
					]
				})
	]
})
             


            ],
            beforeOpen:function(){
            	var x =selectedTableEntry.split(":")
            	this.setTitle(formMode+" Activity Details")
  				BuildActivityForm()
  				BuildGroupSelect('ActivityGroup')
            	if(formMode=="Display"){
            		sap.ui.getCore().getElementById('A1C2').setVisible(true)
            		sap.ui.getCore().getElementById('A1C3').setVisible(true)
            		sap.ui.getCore().getElementById('A1C4').setVisible(true)
            		sap.ui.getCore().getElementById('ActivityForm').setEditable(false)
            	}
            	if(formMode=="Create"){
            		sap.ui.getCore().getElementById('ActivityText').setValue("")
            		sap.ui.getCore().getElementById('A1C2').setVisible(false)
            		sap.ui.getCore().getElementById('A1C3').setVisible(false)
            		sap.ui.getCore().getElementById('A1C4').setVisible(false)
            		sap.ui.getCore().getElementById('ActivityForm').setEditable(true)
            	}
            

            },
	 })
var formCause = new sap.m.Dialog("dlgCause",{
    title:"",
    modal: true,
    contentWidth:"1em",
    buttons: [
					new sap.m.Button( {
					    text: "Save",
					    tap: [ function(oEvt) {	
					    	CreateListEntry("Cause")
					    	formCause.close()
							  } ]
					   
					}),   
					new sap.m.Button( {
					    text: "Cancel",
					    tap: [ function(oEvt) {		  						 
					    	formCause.close()} ]   
					})
					],	
		            contentWidth:"90%",
		            
		            	
    content:[


new sap.ui.layout.form.Form("CauseForm",{
	//title: new sap.ui.core.Title({text: "Address Data", icon: "../../commons/demokit/images/address.gif", tooltip: "Title tooltip"}),
	title: "",
	editable: false,
	layout: oLayout4,
	formContainers: [
		new sap.ui.layout.form.FormContainer("C1C1",{
			title: "",
			formElements: [
				new sap.ui.layout.form.FormElement({
					label: "Group",
					fields: [
					         new sap.m.Select('CauseGroup',{items: [],
					        	 change: function(oControlEvent) {
										changeCodes("Cause",oControlEvent.getParameter("selectedItem").getId());
									}})
							]
					}),
				new sap.ui.layout.form.FormElement({
					label: "Code",
					fields: [
					          new sap.m.Select('CauseCode',{items: []})
						]
					}),
				new sap.ui.layout.form.FormElement({
					label: "Text",
					fields: [
					         new sap.m.Input("CauseText",{})
						]
					})
				]
		}),

		new sap.ui.layout.form.FormContainer("C1C2",{
			title: "",

			formElements: [
				new sap.ui.layout.form.FormElement({
					label: "Status",
					fields: [
					        new sap.m.Input("CauseStatus",{}),
					        new sap.m.Button( {
							    text: "Change",
							    tap: [ function(oEvt) {		  
											formTaskStatus.open()
									  } ]
							   
							})
							]
					})

				
				]
			}),
			new sap.ui.layout.form.FormContainer("C1C3",{
				title: "",

				formElements: [

					new sap.ui.layout.form.FormElement({
						label: "Long Text",
						fields: [
								new sap.m.TextArea("CauseLongText",{})
								]
						})
					]
				})
	]
})
             


            ],
            beforeOpen:function(){
            	var x =selectedTableEntry.split(":")
            	this.setTitle(formMode+" Cause Details")
  				BuildCauseForm()
  				BuildGroupSelect('CauseGroup')
            	if(formMode=="Display"){
            		sap.ui.getCore().getElementById('C1C1').setVisible(true)
            		sap.ui.getCore().getElementById('C1C2').setVisible(true)
            		sap.ui.getCore().getElementById('C1C3').setVisible(true)
            		sap.ui.getCore().getElementById('CauseForm').setEditable(false)
            	}
            	if(formMode=="Create"){
            		sap.ui.getCore().getElementById('CauseText').setValue("")
            		sap.ui.getCore().getElementById('C1C2').setVisible(false)
            		sap.ui.getCore().getElementById('C1C3').setVisible(false)
            	
            		sap.ui.getCore().getElementById('CauseForm').setEditable(true)
            	}
            

            },
	 })
var formEffect = new sap.m.Dialog("dlgEffect",{
    title:"",
    modal: true,
    contentWidth:"1em",
    buttons: [
					new sap.m.Button( {
					    text: "Save",
					    tap: [ function(oEvt) {	
					    	CreateListEntry("Effect")
					    	formEffect.close()
							  } ]
					   
					}),   
					new sap.m.Button( {
					    text: "Cancel",
					    tap: [ function(oEvt) {		  						 
					    	formEffect.close()} ]   
					})
					],	
		            contentWidth:"90%",
		            
		            	
    content:[


new sap.ui.layout.form.Form("EffectForm",{
	//title: new sap.ui.core.Title({text: "Address Data", icon: "../../commons/demokit/images/address.gif", tooltip: "Title tooltip"}),
	title: "",
	editable: false,
	layout: oLayout5,
	formContainers: [
		new sap.ui.layout.form.FormContainer("E1C1",{
			title: "",
			formElements: [
				new sap.ui.layout.form.FormElement({
					label: "Group",
					fields: [
					         new sap.m.Select('EffectGroup',{items: [],
					        	 change: function(oControlEvent) {
										changeCodes("Effect",oControlEvent.getParameter("selectedItem").getId());
									}})
							]
					}),
				new sap.ui.layout.form.FormElement({
					label: "Code",
					fields: [
					          new sap.m.Select('EffectCode',{items: []})
						]
					}),
				new sap.ui.layout.form.FormElement({
					label: "Value",
					fields: [
					         new sap.m.Input("EffectValue",{})
						]
					})
				]
		})
	]
})
             


            ],
            beforeOpen:function(){
            	var x =selectedTableEntry.split(":")
            	this.setTitle(formMode+" Effect Details")
  				BuildEffectForm()
  				BuildGroupSelect('EffectGroup')
            	if(formMode=="Display"){

            		sap.ui.getCore().getElementById('EffectForm').setEditable(false)
            	}
            	if(formMode=="Create"){
            		sap.ui.getCore().getElementById('EffectValue').setValue("")
            	
            		sap.ui.getCore().getElementById('EffectForm').setEditable(true)
            	}
            

            },
	 })