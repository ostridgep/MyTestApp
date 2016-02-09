var oLayout1 = new sap.ui.layout.form.ResponsiveGridLayout("L1");
var oLayout2 = new sap.ui.layout.form.ResponsiveGridLayout("L2");
var oLayout3 = new sap.ui.layout.form.ResponsiveGridLayout("L3");
var oLayout4 = new sap.ui.layout.form.ResponsiveGridLayout("L4");
var oLayout5 = new sap.ui.layout.form.ResponsiveGridLayout("L5");
var selectedTableEntry='';
var selectedListType='';
var formMode='';
var currentStatus;
var firstNotification="";
var selectedNotification='';
var selectedProfile=''
var EmployeeID = localStorage.getItem("EmployeeID")
var notificationDetailFooter = new sap.m.Bar({
		id: 'notificationDetailFooter',
		contentRight : [
						
						]
		
	})
var tasksFooter = new sap.m.Bar({
	id: 'tasksFooter',
	contentMiddle : [
					new sap.m.Button( {
					    text: "Create",
					    type: 	sap.m.ButtonType.Accept,
					    tap: [ function(oEvt) {		  
							formMode="Create" 
					    	formTask.open()
							  } ]
					})
					]
	
})
var activitiesFooter = new sap.m.Bar({
	id: 'activitiesFooter',
	contentMiddle : [
					new sap.m.Button( {
					    text: "Create",
					    type: 	sap.m.ButtonType.Accept,
					    tap: [ function(oEvt) {		  
							formMode="Create" 
					    	formActivity.open()
							  } ]
					})
					]
	
})
var causesFooter = new sap.m.Bar({
	id: 'causesFooter',
	contentMiddle : [
					new sap.m.Button( {
					    text: "Create",
					    type: 	sap.m.ButtonType.Accept,
					    tap: [ function(oEvt) {		  
							formMode="Create" 
					    	formCause.open()
							  } ]
					})
					]
	
})
var longtextFooter = new sap.m.Bar({
	id: 'longtextFooter',
	contentMiddle : [
					
					]
	
})
var effectsFooter = new sap.m.Bar({
	id: 'effectsFooter',
	contentMiddle : [
					new sap.m.Button( {
					    text: "Create",
					    type: 	sap.m.ButtonType.Accept,
					    tap: [ function(oEvt) {		  
							formMode="Create" 
					    	formEffect.open()
							  } ]
					})
					]
	
})