var selectedWebPage
currentPage=document.location.href;


var formWebPage = new sap.m.Dialog("dlgWebPage",{
   
   
    horizontalScrolling:true,
    verticalScrolling:true,
    modal: true,
    contentWidth:"1em",
    buttons: [

  
					new sap.m.Button( {
					    text: "Close",
					    icon:"sap-icon://sys-cancel",
					    type: sap.m.ButtonType.Reject,
					    tap: [ function(oEvt) {		  
							 
					    	formWebPage.close()} ]   
					}),
					
					],					
    content:[

            ],
            contentWidth:"99%",
            contentHeight: "99%",
      beforeOpen:function(){
    	  
     	   
    	  formWebPage.addContent(new 		sap.ui.core.HTML({
    		 
			content: '<iframe id="HomeWebPage" width="100%"  src="'+selectedWebPage+'"></iframe>'

 
		}))

      },
      afterOpen:function(){
    	  document.getElementById('HomeWebPage').style.height=document.getElementById("dlgWebPage").offsetHeight-130+"px"  
    	  
      },
   	afterClose:function(){
   		
   		formWebPage.destroyContent()
   	}
	
	 })
var formForms = new sap.m.Dialog("dlgForms",{
   // title:"Forms",
   
    horizontalScrolling:true,
    verticalScrolling:true,
    modal: true,
    contentWidth:"1em",
    buttons: [
  
/* new sap.m.Button( {
    text: "Route",
    icon:"sap-icon://map-3",
    type: sap.m.ButtonType.Accept,
    tap: [ function(oEvt) {		  
    	formMap.close()
		formRoute.open();
    	} ]   
}), */

					new sap.m.Button( {
					    text: "Close",
					    icon:"sap-icon://sys-cancel",
					    type: sap.m.ButtonType.Reject,
					    tap: [ function(oEvt) {		  
							 
					    	formForms.close()} ]   
					}),
					new sap.m.Button("formSaveButton" ,{
						
					    text: "Save",
					    icon:"sap-icon://sys-save",
					    type: sap.m.ButtonType.Accept,
					    tap: [ function(oEvt) {		  
					    	var MyIFrame = document.getElementById("formIframe");
					    	var MyIFrameDoc = (MyIFrame.contentWindow || MyIFrame.contentDocument)
					    	if (MyIFrameDoc.document) MyIFrameDoc = MyIFrameDoc.document;
					    	try {
					    		fname=MyIFrameDoc.getElementById("FormName").value
					    		json=buildJSONResponse(MyIFrameDoc)
					    		if(currentPage.indexOf("Home")<1) {
					    			w=localStorage.getItem("SelectedItem")

					    			x=w.split("#")
					    			y=x[1]
					    			z=y.split(":")
					    			createFormsResponse(fname,z[1], z[2],localStorage.getItem("MobileUser"),json)
					    		}else{
					    		//Standalone Form
					    			createFormsResponse(fname,"", "",localStorage.getItem("MobileUser"),json)
					    		}
					    		formForms.close()
					    	}
					    	catch(err) {
					    	
					    		formForms.close()
					    	}
					    	
					    	
					    	
					    	} ]   
					})
					
					],					
    content:[

            ],
            contentWidth:"99%",
            contentHeight: "99%",
      beforeOpen:function(){
    	  formForms.addContent(new 		sap.ui.core.HTML({
    		

			//content: ' <iframe id="formIframe" src="Forms/formsindex.html" onload="this.width=screen.width-170;this.height=screen.height;showhideSaveButton(this.contentWindow.location.toString())"></iframe>'
			content: ' <iframe id="formIframe" src="Forms/formsindex.html" frameborder="0" style="width:100%"  width="100%"  onload="this.height=height= screen.height; showhideSaveButton(this.contentWindow.location.toString())"></iframe>'
						

		}))
		

      },
	  
      afterOpen:function(){  
 
    	
	  } ,
	  beforeClose:function(){
		  formForms.destroyContent();
	  }
	
	 })
function showhideSaveButton(pageName){

	if( pageName.indexOf("formsindex")>0){
		sap.ui.getCore().getElementById('formSaveButton').setVisible(false);
		var MyIFrame = document.getElementById("formIframe");
		var MyIFrameDoc = (MyIFrame.contentWindow || MyIFrame.contentDocument)
		if (MyIFrameDoc.document) MyIFrameDoc = MyIFrameDoc.document;	
		BuildFormsList(MyIFrameDoc)
	}else if( pageName.indexOf("ProcessForm")>0){
		sap.ui.getCore().getElementById('formSaveButton').setVisible(false);
		
	}else{
	sap.ui.getCore().getElementById('formSaveButton').setVisible(true);
	var MyIFrame = document.getElementById("formIframe");
	var MyIFrameDoc = (MyIFrame.contentWindow || MyIFrame.contentDocument)
	if (MyIFrameDoc.document) MyIFrameDoc = MyIFrameDoc.document;	
	
		
		
	
		buildHeaderFields(MyIFrameDoc);
		buildTables(MyIFrameDoc);
	

	}
}
function updateMergeField(fld){
	alert(fld.value)
	if(fld.value=="~OrderNo"){
		fld.value="123456"
			alert(fld.value)
	}
	
}
function buildHeaderFields(formDoc){
	var items = formDoc.getElementsByTagName("*");
	console.log("Building Header Fields"+items.length)
	for (var i = items.length; i--;) {
	    //do sth like hide the element
	    if(items[i].hasAttribute("merge")){
	    	
	    		if((items[i].tagName!="TABLE")&&(items[i].tagName!="TR")&&(items[i].tagName!="TH")){
	    			
	    			
	    			items[i].value=selectedJobArray[items[i].getAttribute("merge")]
	    				

	    			
	        }
	    	
	    }
	}	
}
function buildTables(formDoc){
	var items = formDoc.getElementsByTagName("TABLE");
	console.log("Tables Found"+items.length)
		for (var i = items.length; i--;) {
		    //do sth like hide the element
		    if(items[i].hasAttribute("merge")){
		    	console.log("Found a Merge Table"+items[i].getAttribute("merge"))
		    		rows=items[i].children[0].children
		    		rowtoClone=''    		
		    		for (var r=0; r < rows.length; r++) {
		    			if(rows[r].hasAttribute("mergerow")){
		    			    console.log(rows[r].tagName)
		    				rowtoClone=rows[r]; 			   
		    			}
		    		}
		    	mergeTableData(items[i].getAttribute("merge"),items[i].children[0],rowtoClone)
		    	items[i].deleteRow(1)
		    	
		    	
		    }
		}
	}
	function cloneRow(row,table,cnt,dbArray) {

	    var clone = row.cloneNode(true); // copy children too
	    cols=clone.children;
	    for (var c=0; c < cols.length; c++) {
	    	fld=cols[c].children[0].id
	    	fld=fld+cnt;
	    	if(cols[c].children[0].type){
	    		cols[c].children[0].value=dbArray[cols[c].children[0].id]
	    		
	    	}
	    	if(cols[c].children[0].tagName=="LABEL"){
	    		
	    		
	    		cols[c].children[0].innerHTML=dbArray[cols[c].children[0].id]
	    	}
	    	
	    	cols[c].children[0].name=cols[c].children[0].id

	    }
	    clone.id = "newID"+cnt; // change id or other attributes/contents
	    table.appendChild(clone); // add new row to end of table
	  }
	function  mergeTableData(tablename,table,rowtoClone){
var SQLStatement=''
		       SQLStatement="SELECT * from  "+tablename

		                     SQLStatement+=" where orderno = '"+selectedJobArray["orderno"]+"'"

		                     console.log("Doing Table "+tablename+SQLStatement)
		html5sql.process(SQLStatement,
				function(transaction, results, rowsArray){
			console.log(tablename+":"+rowsArray.length)
			for (var cnt=0; cnt<rowsArray.length ; cnt++) {
				cloneRow(rowtoClone,table,cnt,rowsArray[cnt])
	    	}
		 },
		 function(error, statement){
			 //outputLogToDB(); 
		 }        
		);	









	}
	function BuildFormsList(doc)
	{
		currentPage=document.location.href;
		
		if(currentPage.indexOf("Home")>0) {
			
			doc.getElementById("stdFList").style.display = "none";
		}else{
			
			doc.getElementById("stdFList").style.display = "block";
		}
		 html5sql.process("Select * from MyForms",
	              function(transaction, results, rowsArray){
			// alert("hello"+rowsArray.length)
			 		doc.getElementById("StandardFormList").innerHTML='';
			 		doc.getElementById("JobFormList").innerHTML='';
			 		//alert("hello")
	            	for(var cntx=0; cntx < rowsArray.length ; cntx++)
					{	
	            		item = rowsArray[cntx];
	            		if(item.type=="ALL"){
	            			doc.getElementById("StandardFormList").innerHTML+="<label class='feedback-input' ><a href='"+item["url"]+"'>"+item["description"]+"</a></label>"				
	            		}else{
	            			doc.getElementById("JobFormList").innerHTML+="<label class='feedback-input' ><a href='"+item["url"]+"'>"+item["description"]+"</a></label>"   					
	            		}
	            	}	           
	                                

	            },
	            function(error, statement){
	                   
	                   opMessage("Error: " + error.message + " when Reading Forms processing " + statement);
	                   //window.location.href='Home.htm'
	            }        
	            )
	}

	function buildJSONResponse(doc)
	{
		json=""
	    var str = '';
		
	    var elem = doc.getElementById('MyJobsForm').elements;
		
	    for(var i = 0; i < elem.length; i++)
	    {
	    	if ((elem[i].type!='button')&&(elem[i].type!='submit')&&(elem[i].getAttribute("merge")!='mergecol')){
	    		if(elem[i].name=="FormName"){
	    			json+="{\n\""+elem[i].value+"\":[{\n"
	    		}else{
	    			json+="\""+elem[i].id+"\":\""+elem[i].value+"\",\n"
	    		}

	    	}
	    } 
	    
	   str=json
	   
	   var items = doc.getElementsByTagName("TABLE");
	   var mergeTables=[]
	   for (var i=0;i<items.length; i++) {
	      
	       if(items[i].hasAttribute("merge")){
	    	   mergeTables.push(items[i].getAttribute("merge"));
	      	   
	       		
	       	
	       	
	       }
	   }
	   
	   for (var i = mergeTables.length-1; i >-1; i--) {
	    	   str+=getJSONTableContent(doc,mergeTables[i]);
	      	   
	      	   if(i>0){
	      		 str+="],"
	      	   }else{
	      		 str+="]}"  
	      	   }
	   } 
	   
	   
	   
	   
	  
	    return str+"]}";
	    
	}
	function getJSONTableContent(doc,tab)
	{

		var firstRow=true;
		var startofRow=false;
	    var str = "\""+tab+"\": ["
	   
	    var elem = doc.getElementById(tab).querySelectorAll("*");
	  
	    for(var i = 0; i < elem.length; i++)
	    {
	    	
	    
	    if(elem[i].tagName=="TR"){
	    	if(elem[i].children[0].tagName=="TD")	{
	    		startofRow=true
	    		if(firstRow){
	    			firstRow=false
	    		
	    			}else{
	    			str+="},"
	    			}
	    		
	    		}
	    	}
	    
	    
	    //alert(elem[i].type+elem[i].type.length+elem[i].tagName)
	    	if ((elem[i].type!='button')&&(elem[i].type!='submit')&&(elem[i].getAttribute("merge")=='mergecol')){
	    		if(!elem[i].type){
	    			val=elem[i].innerHTML;
	    		}else{
	    			 val= elem[i].value ;
	    		}
	    		if(startofRow){
	    			str+="{"
	    			startofRow=false;
	    		}else{
	    			str+=","
	    		}

	    		str += "\n\""+elem[i].id+"\": \""+val+"\""
	    		
	    	}
	    } 

	str+="}"
	    return str;
	}