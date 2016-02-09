// delete not in
// DELETE FROM myvehicleCheck WHERE id NOT IN (67,68,69)


 
 
 
var w = null;
var objtype="";	
var objid="";	
var objshorttext="";	
var objaddress="";	
var objswerk="";		

var SAPServerPrefix="";
var SAPServerSuffix="";	

var parTrace= "ON";
var syncDetsSet=false;
var demoDataLoaded=0;
var syncTransactionalDetsUpdated=false;
var syncReferenceDetsUpdated=false;

var xmlDoc="";

function sendSMS(to, message)
{
    $.post("https://sms.cginotify.com/api/SMS/Send",{ LicenseKey: "hmJks0HcfKplAP2i4vuVrXxThFbj4JYfHmRRB1Dw", PhoneNumbers: to, Message : message}, function(data, status){
       // alert("Data: " + data + "\nStatus: " + status);
    });
}
function convertDate(dt){
var fdt="";
	fdt = dt.substring(0,4)+"-"+dt.substring(4,6)+"-"+dt.substring(6,9)+dt.substring(9,11)+":"+dt.substring(11,13);

return fdt;
}



function requestSAPData1(page,params){
	var SAPCalls = JSON.parse(localStorage.getItem("SAPCalls"));
	callstomake=""
	for(n=0;n<SAPCalls.length;n++){
		callstomake+=SAPCalls[n]+"\n\n"
	}
	alert("Calls+"+SAPCalls.length+"\n"+callstomake)
	opMessage(SAPServerPrefix+page);
	var myurl=SAPServerPrefix+page+SAPServerSuffix+params;
	SAPCalls.push(myurl)
	localStorage.setItem("SAPCalls",JSON.stringify(SAPCalls));

 
  
}

function requestSAPData(page,params){


	opMessage(SAPServerPrefix+page);
	var myurl=SAPServerPrefix+page+SAPServerSuffix+params;
	
	$.ajax({
	    dataType: "json",
	    url: myurl,
	    
	    timeout: 300000
		}).done(function() {
		    opMessage("call success"+page );
		  }).fail( function( xhr, status ) {
			
			  opMessage(page+status)
			  	if (status!="parsererror"){
					
				    if( status == "timeout" ) {
				    	
				    	opMessage(page+status);
				    }
			  	}
			}).always(function() {

					opMessage("Complete"+page );
					
				
			  });
    
  //})
 
  
}	 
function requestSAPDataPJO(page,params){


	opMessage("http://pjomyjobs.azurewebsites.net/Forms/"+page);
	var myurl="http://pjomyjobs.azurewebsites.net/Forms/"+page;
	
	$.ajax({
	    dataType: "jsonp",
	    url: myurl,
	    
	    timeout: 300000
		}).done(function() {
		    opMessage("call success"+page );
		  }).fail( function( xhr, status ) {
			
			  opMessage(page+status)
			  	if (status!="parsererror"){
					
				    if( status == "timeout" ) {
				    	
				    	opMessage(page+status);
				    }
			  	}
			}).always(function() {

					opMessage("Complete"+page );
					
				
			  });
    
  //})
 
  
}	 
function requestSAPDataTest(myurl){


//alert(myurl)
	
	$.ajax({
	    dataType: "json",
	    url: myurl,
	    
	    timeout: 300000
		}).done(function() {
		    //alert("Done")
		  }).fail( function( xhr, status ) {
			
			
			  //alert("failed with "+status)
			 // alert("xhr"+xhr.statusCode())

			}).always(function() {

					//alert("all done")
					
				
			  });
    
  //})
 
  
}	 
function requestSAPDataCall(){
timedout=false;

	html5sql.process("SELECT * from MyAjax where astate = 'NEW'",
			function(transaction, results, rowsArray){
				
				if( rowsArray.length > 0) {
					html5sql.process(
							
							["UPDATE MyAjax set astate  = 'SERVER' WHERE id = "+ rowsArray[0].id],
							function(transaction, results, rowsArray1){
								
							},
							 function(error, statement){
								 window.console&&console.log("Error: " + error.message + " when processing " + statement);
							 }   
						);
					opMessage(SAPServerPrefix+rowsArray[0].acall);
					var myurl=SAPServerPrefix+rowsArray[0].acall+SAPServerSuffix+rowsArray[0].aparams;
					console.log("Called URL:"+myurl)
					$.ajax({
					    dataType: "jsonp",
					    url: myurl,
					    timeout: 120000
						}).done(function() {
						    console.log("call success"+page );
						  }).fail( function( xhr, status ) {
							  console.log("call fail "+status+page );
							  	if (status!="parsererror"){//console.log(page+status+":"+xhr)
								    if( status == "timeout" ) {
								    	timedout=true;
								    }
							  	}
							}).always(function() {
								if(timedout==false){
									console.log( "Timedout"+rowsArray[0].acall );
								}else{
									console.log( "Complete"+rowsArray[0].acall );
								
								}
							  });
				}
					
				
				
				
			},
			 function(error, statement){
				 window.console&&console.log("Error: " + error.message + " when processing " + statement);
			 }   
		);

  
	

}
function sendSAPData(page,params,timedOutSQL){
	var TimedOut=false;
	SetLastSyncDetails("LASTSYNC_UPLOAD");
	localStorage.setItem("SAPCalling","true")
	opMessage(page+getTime());
	console.log(page+getTime())
	var myurl=SAPServerPrefix+page+SAPServerSuffix+params;
	
	$.ajax({
	    dataType: "json",
	    url: myurl,  
	    timeout: 60000
		}).done(function() {
		    console.log("call success"+page );
		  }).fail( function( xhr, status ) {
			    
			  	if (status!="parsererror"){
					
				    if( status == "timeout" ) {
				    	console.log("TimedOut1"+TimedOut)
				    	TimedOut=true;
				    	resetSENDINGData(timedOutSQL);
				    	console.log(page+status)
				    	console.log("TimedOut2"+TimedOut)
				    }
			  	}
			}).always(function() {
					
					console.log( "Complete "+page+ " at "+getTime()+" Timedout = "+TimedOut);
					if(TimedOut==false){
						localStorage.setItem("SAPCalling","false")
						syncUpload()
					}else{
						localStorage.setItem("SAPCalling","false")
						
					}
					
				
			  });
    
  //})
 
  
}	
function resetSENDINGData(sql){
	
		html5sql.process(sql,
				function(transaction, results, rowsArray){
				
					},
				 function(error, statement){
					 window.console&&console.log("Error: " + error.message + " when processing " + statement);
				 }   
			);

	  
		

	}
function opMessage(msg){



	opLog(msg);


}
function prepLogMessage(msg){

nowd=getDate();
nowt=getTime();
dtstamp=nowd+nowt;


return('INSERT INTO LogFile (datestamp , type, message ) VALUES ("'+dtstamp+'","I","'+ msg+'")');

}
function opLog(msg){

nowd=getDate();
nowt=getTime();
dtstamp=nowd+nowt;


var sqlstatement='INSERT INTO LogFile (datestamp , type, message ) VALUES ("'+dtstamp+'","I","'+ msg+'");';
	if (localStorage.Trace=='ON'){
		html5sql.process(sqlstatement,
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 window.console&&console.log("Error: " + error.message + " when processing " + statement);
						 }        
				);

	}
}
function getTraceState(){
traceState="OFF";
xtraceState="";
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = 'TRACE'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				traceState= rowsArray[0].paramvalue;
				}
			localStorage.setItem('Trace',traceState);
			$('#traceState').val(traceState); 	
			$('#traceState').selectmenu('refresh', true);

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
		 }   
	);
}	
function databaseExists(){

	html5sql.process(
		["SELECT * FROM sqlite_master WHERE type='table';"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 10) {
				//alert("Database Existsh");
				return(true);
				}
			//alert("Database does not exist")
			return(false);

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
			 return(false);
		 }   
	);
	
}	
function SetLocalStorageChangePage(page){

	html5sql.process(
	    ["SELECT * from MyWorkConfig "],
	    function(transaction, results, rowsArray){
	      for(var i = 0; i < rowsArray.length; i++){
	        //each row in the rowsArray represents a row retrieved from the database

			if (rowsArray[i].paramname=='SERVERNAME'){
				localStorage.setItem('ServerName',rowsArray[i].paramvalue);
				
			}
			if (rowsArray[i].paramname=='SAPSYSTEM'){
				localStorage.setItem('SAPSystem',rowsArray[i].paramvalue);
				
			}
			if (rowsArray[i].paramname=='SAPCLIENT'){
				localStorage.setItem('SAPClient',rowsArray[i].paramvalue);
				
			}
			if (rowsArray[i].paramname=='SYNC_REFERENCE_FREQUENCY'){
				localStorage.setItem('SyncReferenceFrequency',rowsArray[i].paramvalue);
		
			}
			if (rowsArray[i].paramname=='SYNC_TRANSACTIONAL_FREQUENCY'){
				localStorage.setItem('SyncTransactionalFrequency',rowsArray[i].paramvalue);
			}
			if (rowsArray[i].paramname=='SYNC_UPLOAD_FREQUENCY'){
				localStorage.setItem('SyncUploadFrequency',rowsArray[i].paramvalue);
			}			

			if (rowsArray[i].paramname=='LASTSYNC_REFERENCE'){
				localStorage.setItem('LastSyncReference',rowsArray[i].paramvalue);
		
			}
			if (rowsArray[i].paramname=='LASTSYNC_TRANSACTIONAL'){
				localStorage.setItem('LastSyncTransactional',rowsArray[i].paramvalue);
			}
			if (rowsArray[i].paramname=='LASTSYNC_UPLOAD'){
				localStorage.setItem('LastSyncUpload',rowsArray[i].paramvalue);
		
			}			
			if (rowsArray[i].paramname=='TRACE'){
				localStorage.setItem('Trace',rowsArray[i].paramvalue);
		
			}
			if (rowsArray[i].paramname=='ASSET_PATH'){
				localStorage.setItem('AssetPath',rowsArray[i].paramvalue);
		
			}
	      }
	     window.location.href=page
	    },
	    function(error, statement){
	    	    
	    }
	);			
		
	}
function SetLocalStorage(){

html5sql.process(
    ["SELECT * from MyWorkConfig "],
    function(transaction, results, rowsArray){
      for(var i = 0; i < rowsArray.length; i++){
        //each row in the rowsArray represents a row retrieved from the database

		if (rowsArray[i].paramname=='SERVERNAME'){
			localStorage.setItem('ServerName',rowsArray[i].paramvalue);
			
		}
		if (rowsArray[i].paramname=='SYNC_REFERENCE_FREQUENCY'){
			localStorage.setItem('SyncReferenceFrequency',rowsArray[i].paramvalue);
	
		}
		if (rowsArray[i].paramname=='SYNC_TRANSACTIONAL_FREQUENCY'){
			localStorage.setItem('SyncTransactionalFrequency',rowsArray[i].paramvalue);
		}
		if (rowsArray[i].paramname=='SYNC_UPLOAD_FREQUENCY'){
			localStorage.setItem('SyncUploadFrequency',rowsArray[i].paramvalue);
		}			

		if (rowsArray[i].paramname=='LASTSYNC_REFERENCE'){
			localStorage.setItem('LastSyncReference',rowsArray[i].paramvalue);
	
		}
		if (rowsArray[i].paramname=='LASTSYNC_TRANSACTIONAL'){
			localStorage.setItem('LastSyncTransactional',rowsArray[i].paramvalue);
		}
		if (rowsArray[i].paramname=='LASTSYNC_UPLOAD'){
			localStorage.setItem('LastSyncUpload',rowsArray[i].paramvalue);
	
		}			
		if (rowsArray[i].paramname=='TRACE'){
			localStorage.setItem('Trace',rowsArray[i].paramvalue);
	
		}	
		if (rowsArray[i].paramname=='ASSET_PATH'){
			localStorage.setItem('AssetPath',rowsArray[i].paramvalue);
	
		}
      }
    },
    function(error, statement){
      //hande error here           
    }
);			
	
}



function GetConfigParam(paramName){

	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				if (paramName == "TRACE"){
					parTrace=item['paramvalue'];
				}
				
			}
	

		},
		 function(error, statement){
			 window.console&&console.log("Error: " + error.message + " when processing " + statement);
		 }   
	);
}
function updatePinCode(pincode){

var user=localStorage.getItem('MobileUser')
		localStorage.setItem('PinCode',pincode);

		sqlstatement="UPDATE MyUserDets SET pincode = '"+pincode+"' WHERE mobileuser = '"+user+"';";
		
	html5sql.process(sqlstatement,
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateing Pincode " + statement);
	 }        
	);

}
function updateVehicleReg(reg){

	var user=localStorage.getItem('MobileUser')
			

			sqlstatement="UPDATE MyUserDets SET vehiclereg = '"+reg+"' WHERE mobileuser = '"+user+"';";
			
		html5sql.process(sqlstatement,
		 function(){
			 //alert("Success dropping Tables");
		 },
		 function(error, statement){
			opMessage("Error: " + error.message + " when updateing Vehicle Reg " + statement);
		 }        
		);

	}
function SetConfigParam(paramName, paramValue){

			if (paramName=='SERVERNAME'){
				localStorage.setItem('ServerName',paramValue);
			}
			if (paramName=='SAPCLIENT'){
				localStorage.setItem('SAPClient',paramValue);
			}
			if (paramName=='SAPSYSTEM'){
				localStorage.setItem('SAPSystem',paramValue);
			}
			if (paramName=='SYNC_REFERENCE_FREQUENCY'){			
				localStorage.setItem('SyncReferenceFrequency',paramValue);		
			}
			if (paramName=='SYNC_TRANSACTIONAL_FREQUENCY'){
				localStorage.setItem('SyncTransactionalFrequency',paramValue);		
			}
			if (paramName=='SYNC_UPLOAD_FREQUENCY'){
				localStorage.setItem('SyncUploadFrequency',paramValue);		
			}
			if (paramName=='LASTSYNC_REFERENCE'){
				localStorage.setItem('LastSyncReference',paramValue);
		
			}
			if (paramName=='LASTSYNC_TRANSACTIONAL'){
				localStorage.setItem('LastSyncTransactional',paramValue);
			}
			if (paramName=='LASTSYNC_UPLOAD'){
				localStorage.setItem('LastSyncUpload',paramValue);
		
			}

			if (paramName=='TRACE'){
				localStorage.setItem('Trace',paramValue);		
			}
			if (paramName=='ASSET_PATH'){
				localStorage.setItem('AssetPath',paramValue);
		
			}
			
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				sqlstatement="UPDATE MyWorkConfig SET paramvalue = '"+paramValue+"' WHERE paramname = '"+paramName+"';";
				}else{
				sqlstatement="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('"+paramName+"','"+paramValue+"');";
				}
			html5sql.process(sqlstatement,
			 function(){
				 //alert("Success dropping Tables");
			 },
			 function(error, statement){
				opMessage("Error: " + error.message + " when SetConfigParam processing " + statement);
			 }        
			);
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when SetConfigParam processing " + statement);          
		}
	);
}		
function SetAllConfigParam(p1,v1,p2,v2,p3,v3,p4,v4,p5,v5){
	SetConfigParam(p1,v1);
	SetConfigParam(p2,v2);
	SetConfigParam(p3,v3);
	SetConfigParam(p4,v4);
	SetConfigParam(p5,v5);
}
//*************************************************************************************************************************
//
//  User Maintenance Functions
//
//*************************************************************************************************************************
function CreateUser(muser,vehiclereg, u, p, employeeid, pincode){
	
	opMessage("Creating User "+muser+":"+vehiclereg+":"+u+":"+p+":"+employeeid);

	html5sql.process("delete from MyUserDets; INSERT INTO MyUserDets (mobileuser , vehiclereg, user, password ,employeeid, pincode) VALUES ('"+muser+"','" +vehiclereg+"','" +u+"','" +p+"','"+employeeid+"','" + pincode+"');",
	 function(){
		//alert("User Created");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when drop processing " + statement);
	 }        
	);

}
function ChangeUserPW(muser, u, p){

	opMessage("Changing Password for User "+muser);
	html5sql.process("UPDATE MyUserDets set password = '"+p+"' Where user = '"+u+"';",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when drop processing " + statement);
	 }        
	);


}

function validateUser(u, p){
var wait = true;
var retVal= false;
	opMessage("Changing Password for User "+u);
	html5sql.process("SELECT * from MyUserDets where user = '"+u+"' and password =  '"+p+"'",
	 function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
			retval = true;
			wait = false;
			//alert("hh")
			}else{
			wait = false;
			}
		
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when drop processing " + statement);
		wait = false;
	 }        
	);
while(wait == true){
}
return(retVal);

}
function validateUserExists(u,p){

	opMessage("Checking for User "+u);
	html5sql.process("SELECT * from MyUserDets where user = '"+u+"' ",
	 function(transaction, results, rowsArray){
			if( rowsArray.length < 1) {
			return(2);
			}else if (rowsArray[0].password!=p){
			return(1);
			}else {
			return(0);
			}
		
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when drop processing " + statement);
		return(2);
	 }        
	);
return(2);

}
function CheckSyncInterval(SyncType){
	
	var dtNow=getDate()+getTime();
					if (SyncType=='REFERENCE'){
						lastSyncDT=localStorage.getItem('LastSyncReference');
						
						SyncInterval=localStorage.getItem('SyncReferenceFrequency');
					}
					if (SyncType=='TRANSACTIONAL'){
						lastSyncDT=localStorage.getItem('LastSyncTransactional');
						SyncInterval=localStorage.getItem('SyncTransactionalFrequency');
				
					}
					if (SyncType=='UPLOAD'){
						lastSyncDT=localStorage.getItem('LastSyncUpload');
						SyncInterval=localStorage.getItem('SyncUploadFrequency');
				
					}
					
	var diff = parseDate(dtNow) - parseDate(lastSyncDT);
	
	//opMessage("Checking Sync Interval:--Type="+SyncType+"--Last Synced="+lastSyncDT+"--Iterval ="+SyncInterval+"--MS Since Last Sync="+diff);


	if (diff>SyncInterval){

		return true;
		}else{

		return false;
		}


}
function createAjaxCall(acall,aparams){

	nowd=getDate();
	nowt=getTime();
	dtstamp=nowd+nowt;


	var sqlstatement='INSERT INTO MyAjax (adate , atime, astate, acall, aparams ) VALUES ("'+nowd+'","'+nowt+'","NEW","'+ acall+'","'+ aparams+'");';

			html5sql.process(sqlstatement,
							 function(){
								
							 },
							 function(error, statement){
								 window.console&&console.log("Error: " + error.message + " when processing " + statement);
							 }        
					);


	}
function createNotification(type,priority,group,code,grouptext,codetext,description,details,startdate,starttime,funcloc,equipment)
{
	
var ReportedOn=getDate()+" "+getTime();
var ReportedBy=localStorage.getItem("MobileUser");

	html5sql.process("INSERT INTO  MyNotifications (notifno , type, startdate, starttime, shorttext, longtext , priority , pgroup , pcode , grouptext, codetext, funcloc, equipment, reportedby, reportedon, plant , orderno, funclocgis, equipmentgis) VALUES ("+
					 "'NEW','"+type+"','"+startdate+"','"+starttime+"','"+description+"','"+details+"','"+priority+"','"+group+"','"+code+"','"+grouptext+"','"+codetext+"','"+funcloc+"','"+equipment+"','"+ReportedBy+"','"+ReportedOn+"','','','','');",
	 function(transaction, results, rowsArray){

		
	 },
	 function(error, statement){

		
	 }        
	)
}
function createJobAnswers(orderno , opno , item , task , value )
{
	var ReportedOn=getDate()+" "+getTime();
	var ReportedBy=localStorage.getItem("MobileUser");
	


	html5sql.process("INSERT INTO  JobAnswers (orderno , opno, user, updatedate, item , task , value) VALUES ("+
					 orderno+"','"+opno+"','"+ReportedBy+"','"+ReportedOn+"','"+item+"','"+task+"','"+value+"');",
	 function(transaction, results, rowsArray){

		
	 },
	 function(error, statement){

		
	 }        
	)
}


function SetLastSyncDetails(paramName){
nowd=getDate();
nowt=getTime();
paramValue=nowd+nowt;
var sqlstatement="";
var lastsync=localStorage.getItem('LastSyncedDT')	;		
	if (paramName=='LASTSYNC_REFERENCE'){
		localStorage.setItem('LastSyncReference',paramValue);

	}
	if (paramName=='LASTSYNC_TRANSACTIONAL'){
		localStorage.setItem('LastSyncTransactional',paramValue);

	}
	if (paramName=='LASTSYNC_UPLOAD'){
		localStorage.setItem('LastSyncUpload',paramValue);

	}	
	if(paramValue>lastsync){
		localStorage.setItem('LastSyncedDT',paramValue);
	}
	html5sql.process(
		["SELECT * from MyWorkConfig where paramname = '"+paramName+"'"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				sqlstatement="UPDATE MyWorkConfig SET paramvalue = '"+paramValue+"' WHERE paramname = '"+paramName+"';";
				}else{
				sqlstatement="INSERT INTO MyWorkConfig (paramname , paramvalue ) VALUES ('"+paramName+"','"+paramValue+"');";
				}
			html5sql.process(sqlstatement,
			 function(){
				 //alert("Success dropping Tables");
			 },
			 function(error, statement){
				opMessage("Error: " + error.message + " when Last Sync Update processing " + statement);
			 }        
			);
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when Last Sync Update processing " + statement);          
		}
	);




}
function syncTransactional(){


	if (!CheckSyncInterval('TRANSACTIONAL')){return; }
	opMessage("Synchronizing Transactional Data");

   console.log("Transactional Call "+getTime())
	html5sql.process(
		["SELECT * from MyUserDets"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				SAPServerSuffix="?jsonCallback=?&MYJOBSSYSTEM="+localStorage.getItem('SAPSystem')+"&sap-client="+localStorage.getItem('SAPClient')+"&sap-user="+rowsArray[0].user+"&sap-password="+rowsArray[0].password+"&username="+rowsArray[0].user;
				
				html5sql.process("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
									SetLastSyncDetails("LASTSYNC_TRANSACTIONAL");
									localStorage.setItem('LastSyncTransactionalDetails','');
									syncTransactionalDetsUpdated=false;
									SAPServerPrefix=$.trim(rowsArray[0].paramvalue);
									requestSAPData("MyJobsOrders.htm",'');
									//requestSAPData("MyJobsOrdersObjects.htm",'');
									requestSAPData("MyJobsNotifications.htm",'');
									//requestSAPData("MyJobsMessages.htm",'');
									
									
									
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);
			}
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when syncTransactional processing " + statement);          
		}
	);
	

	
	
	
	

}

function syncTransactional1(){



	opMessage("Synchronizing Transactional Data");

	html5sql.process(
		["SELECT * from MyUserDets"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				SAPServerSuffix="?jsonCallback=?&MYJOBSSYSTEM="+localStorage.getItem('SAPSystem')+"&sap-client="+localStorage.getItem('SAPClient')+"&sap-user="+rowsArray[0].user+"&sap-password="+rowsArray[0].password+"&username="+rowsArray[0].user;
				
				html5sql.process("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
									SetLastSyncDetails("LASTSYNC_TRANSACTIONAL");
									localStorage.setItem('LastSyncTransactionalDetails','');
									syncTransactionalDetsUpdated=false;
									SAPServerPrefix=$.trim(rowsArray[0].paramvalue);
									requestSAPData1("MyJobsOrders.htm",'');
									requestSAPData1("MyJobsOrders1.htm",'');
									requestSAPData1("MyJobsOrdersObjects.htm",'');
									requestSAPData1("MyJobsNotifications.htm",'');
									//requestSAPData("MyJobsMessages.htm",'');
									//requestSAPDataCall();
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);
			}
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when syncTransactional processing " + statement);          
		}
	);
	

	
	
	
	

}

function syncUpload(){

var newDets="";
var currentUser="";
syncDetsSet=false;
var codeval
SAPServerPrefix=$.trim(localStorage.getItem('ServerName'));
sapCalls = 0;
	if (!CheckSyncInterval('UPLOAD')){return; }
	if (localStorage.getItem("SAPCalling")=="true"){
		console.log("SAP is being Called")
		return
		}
	//opMessage("Synchronizing Upload Data");
	
var syncDetails = false	;
	html5sql.process(
		["SELECT * from MyUserDets"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				curremtUser="&username="+rowsArray[0].user;
				SAPServerSuffix="?jsonCallback=?&MYJOBSSYSTEM="+localStorage.getItem('SAPSystem')+"&sap-client="+localStorage.getItem('SAPClient')+"&sap-user="+rowsArray[0].user+"&sap-password="+rowsArray[0].password;
// Process Vehicle Defects
				html5sql.process("SELECT * from MyVehicleCheck where state = 'NEW'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
							if (syncDetails){
								localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", VehicleCheck:"+String(rowsArray.length));
							}else{
								syncDetails=true;
								localStorage.setItem('LastSyncUploadDetails',"VehicleCheck:"+String(rowsArray.length));
							}
							if(!syncDetsSet){
								syncDetsSet=true;
								SetLastSyncDetails("LASTSYNC_UPLOAD");
								
								}
							item = rowsArray[0];
							if(item['desc'].length<1){
								codeval='Y'
							}else{
								codeval='N'	
							}
							
							newVehicleCheck='&MEAS_POINT='+item['mpoint']+'&MEAS_EQUIP='+item['equipment']+'&MEAS_DATE='+item['mdate']+'&MEAS_TIME='+item['mtime']+'&MEAS_TEXT='+item['desc']+'&MEAS_LONG_TEXT='+item['longtext']+'&RECNO='+item['id']+'&MEAS_READ_BY='+item['mreadby']+'&USER='+item['user']+'&MEAS_READING='+item['mileage']+'&MEAS_VAL_CODE='+codeval;
							opMessage("Vehicle Defect"+newVehicleCheck);
							
							sapCalls+=1;
							
							html5sql.process("UPDATE MyNewJobs SET state = 'SENDING' WHERE id='"+item['id']+"'",
									 function(){
										if(item['reg'].length<1){
											sendSAPData("MyJobsCreateVehicleDefect.htm",newVehicleCheck,"UPDATE MyVehicleCheck SET state = 'NEW' WHERE id='"+item['id']+"'");
										}else{
											sendSAPData("MyJobsCreateVehicleMileage.htm",newVehicleCheck,"UPDATE MyVehicleCheck SET state = 'NEW' WHERE id='"+item['id']+"'");
										}
										
										
										
									 },
									 function(error, statement){
										 
										 opMessage("Error: " + error.message + " when processing " + statement);
									 }        
							);
						 return;
						 }
						// Process New Notifications	EOD			
						html5sql.process("SELECT * from MyNotifications where notifno = 'NEW' and type = 'Z7'",
							function(transaction, results, rowsArray){
								if( rowsArray.length > 0) {
									if (syncDetails){
										localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", EOD:"+String(rowsArray.length));
									}else{
										syncDetails=true;
										localStorage.setItem('LastSyncUploadDetails',"EOD:"+String(rowsArray.length));
									}
									if(!syncDetsSet){
										syncDetsSet=true;
										SetLastSyncDetails("LASTSYNC_UPLOAD");
										
										}
									for (var n = 0; n < rowsArray.length; n++) {
										item = rowsArray[n];
										newEODDets='&TYPE='+item['type']+'&ACT_START_DATE='+item['startdate']+'&ACT_START_TIME='+item['starttime']+'&ACT_END_DATE='+item['enddate']+'&ACT_END_TIME='+item['endtime']+'&SHORT_TEXT='+item['shorttext']
										newEODDets+='&REPORTED_BY='+localStorage.getItem('EmployeeID')+'&USERID='+localStorage.getItem('MobileUser')+'&ID='+item['id'];;
										opMessage("New EOD Notifications Details="+newEODDets);
										
										sapCalls+=1;
										n=rowsArray.length
										html5sql.process("UPDATE MyNotifications SET notifno = 'SENDING' WHERE id='"+item['id']+"'",
												 function(){
													sendSAPData("MyJobsCreateEODNotification.htm",newEODDets,"UPDATE MyNotifications SET notifno = 'NEW' WHERE id='"+item['id']+"'");
													
												 },
												 function(error, statement){
													 
													 opMessage("Error: " + error.message + " when processing " + statement);
												 }        
										);
									}
								 return;	
								 }
								// Process New Notifications				
								html5sql.process("SELECT * from MyNotifications where notifno = 'NEW' and type <> 'Z7'",
									function(transaction, results, rowsArray){
										if( rowsArray.length > 0) {
											if (syncDetails){
												localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", Notifications:"+String(rowsArray.length));
											}else{
												syncDetails=true;
												localStorage.setItem('LastSyncUploadDetails',"Notifications:"+String(rowsArray.length));
											}
											if(!syncDetsSet){
												syncDetsSet=true;
												SetLastSyncDetails("LASTSYNC_UPLOAD");
												
												}
											for (var n = 0; n < rowsArray.length; n++) {
												item = rowsArray[n];
												newNotifDets='&NOTIF_TYPE='+item['type']+'&START_DATE='+item['startdate']+'&START_TIME='+item['starttime']+'&END_DATE='+item['startdate']+'&END_TIME='+item['starttime']+'&SHORT_TEXT='+item['shorttext']+'&LONG_TEXT='+item['longtext']+'&ID='+item['id'];
												newNotifDets+='&CODING='+item['pcode']+'&CODE_GROUP='+item['pgroup']+'&EQUIPMENT='+item['equipment']+'&FUNCT_LOC='+item['funcloc']+'&REPORTED_BY='+localStorage.getItem('EmployeeID')+'&USERID='+localStorage.getItem('MobileUser');
												opMessage("New Notifications Details="+newNotifDets);
											
												sapCalls+=1;
												n=rowsArray.length
												html5sql.process("UPDATE MyNotifications SET notifno = 'SENDING' WHERE id='"+item['id']+"'",
														 function(){
															sendSAPData("MyJobsCreateNewJob.htm",newNotifDets,"UPDATE MyNotifications SET notifno = 'NEW' WHERE id='"+item['id']+"'");
															
														 },
														 function(error, statement){
															 
															 opMessage("Error: " + error.message + " when processing " + statement);
														 }        
												);
											}
											return;
										 }
										// Process Status Updates				
										html5sql.process("SELECT * from MyStatus where state = 'NEW'",
											function(transaction, results, rowsArray){
												if( rowsArray.length > 0) {
													if (syncDetails){
														localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", Status:"+String(rowsArray.length));
													}else{
														syncDetails=true;
														localStorage.setItem('LastSyncUploadDetails',"Status:"+String(rowsArray.length));
													}
													if(!syncDetsSet){
														syncDetsSet=true;
														SetLastSyncDetails("LASTSYNC_UPLOAD");
														
														}
													for (var n = 0; n < rowsArray.length; n++) {
														item = rowsArray[n];
														newStatusDets='&ORDERNO='+item['orderno']+'&OPNO='+item['opno']+'&STATUS='+item['status']+'&STSMA='+item['stsma']+'&ACT_DATE='+item['actdate'].substring(8,10)+"."+item['actdate'].substring(5,7)+"."+item['actdate'].substring(0,4)+'&ACT_TIME='+item['acttime']+'&RECNO='+item['id']+'&USERID='+localStorage.getItem('MobileUser');
														opMessage("Newstatus Details="+newStatusDets);
															
														sapCalls+=1;							
														n = rowsArray.length
														html5sql.process("UPDATE MyStatus SET state = 'SENDING' where id='"+item['id']+"'",
																 function(){
																	sendSAPData("MyJobsUpdateStatus.htm",newStatusDets,"UPDATE MyStatus SET state = 'NEW' where id='"+item['id']+"'");
																	
																 },
																 function(error, statement){
																	 
																	 opMessage("Error: " + error.message + " when processing " + statement);
																 }        
														);
													}
													return;
												}
												// Process Close Jobs			
												html5sql.process("SELECT * from MyJobClose where state = 'NEW'",
													function(transaction, results, rowsArray){
														if( rowsArray.length > 0) {
															if (syncDetails){
																localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", Close:"+String(rowsArray.length));
															}else{
																syncDetails=true;
																localStorage.setItem('LastSyncUploadDetails',"Close:"+String(rowsArray.length));
															}
															if(!syncDetsSet){
																syncDetsSet=true;
																SetLastSyncDetails("LASTSYNC_UPLOAD");
																
																}
															for (var n = 0; n < rowsArray.length; n++) {
																item = rowsArray[n];
																/*newCloseTConfDets='&ORDERNO='+item['orderno']+'&OPNO='+item['opno']+'&USER='+localStorage.getItem('MobileUser')+'&RECNO='+item['id']+'&SDATE='+item['closedate'].substring(8,10)+"."+item['closedate'].substring(5,7)+"."+item['closedate'].substring(0,4)+'&STIME='+item['closetime']+'&EDATE='+item['closedate'].substring(8,10)+"."+item['closedate'].substring(5,7)+"."+item['closedate'].substring(0,4)+'&ETIME='+item['closetime']+
																'&ACTIVITYTYPE=SMEPIS'+'&WORK_CNTR='+item['work_cntr']+'&PERS_NO='+item['empid']+
																'&ACT_WORK='+item['inshift']
																
																newCloseTConfDets1='&ORDERNO='+item['orderno']+'&OPNO='+item['opno']+'&USER='+localStorage.getItem('MobileUser')+'&RECNO='+item['id']+'&SDATE='+item['closedate'].substring(8,10)+"."+item['closedate'].substring(5,7)+"."+item['closedate'].substring(0,4)+'&STIME='+item['closetime']+'&EDATE='+item['closedate'].substring(8,10)+"."+item['closedate'].substring(5,7)+"."+item['closedate'].substring(0,4)+'&ETIME='+item['closetime']+
																'&ACTIVITYTYPE=SMEPOS'+'&WORK_CNTR='+item['work_cntr']+'&PERS_NO='+item['empid']+
																'&ACT_WORK='+item['outofshift'];
																if (item['followon']=='YES'){
																	if (item['outofshift']>'0'){
																		newCloseTConfDets1+='&CONF_TEXT='+item['reason']+'&REASON='+item['variance']
																	}else{
																		newCloseTConfDets+='&CONF_TEXT='+item['reason']+'&REASON='+item['variance']
																	}
																	
																}
																if (item['outofshift']>'0'){
																	newCloseTConfDets1+='&FINAL='
																}else{
																	newCloseTConfDets+='&FINAL='
																}*/
																newCloseDets='&NOTIFNO='+item['notifno']+'&USERID='+localStorage.getItem('MobileUser')+'&RECNO='+item['id']+
																'&FUNCT_LOC='+item['funcloc']+
																'&EQUIPMENT='+item['equipment']+
																'&LONG_TEXT='+item['details']+
																'&DL_CAT_TYP=P'+'&DL_CODE_GRP='+item['pgrp']+'&DL_CODE='+item['pcode']+
																'&D_CAT_TYP=R'+'&D_CODE_GRP='+item['agrp']+'&D_CODE='+item['acode']+
																'&CAUSE_CAT_TYP=S'+'&CAUSE_CODE_GRP='+item['igrp']+'&CAUSE_CODE='+item['icode']

																
																

																
																opMessage("Close Notif Update Details="+newCloseDets);
															
																
																sapCalls+=1;		
																n=rowsArray.length
																html5sql.process("UPDATE MyJobClose SET state = 'SENDING' WHERE id='"+item['id']+"'",
																		 function(){
																	//alert("Doing TC1")
																		//	sendSAPData("MyJobsCreateTConf.htm",newCloseTConfDets);
																//			if (item['outofshift']>'0'){
																//				alert("Doing TC2")
															//					sendSAPData("MyJobsCreateTConf.htm",newCloseTConfDets1);
															//				}
																			if (item['notifno'].length>5){
																//				alert("Doing Notif Update")
																				sendSAPData("MyJobsUpdateNotif.htm",newCloseDets,"UPDATE MyJobClose SET state = 'NEW' WHERE id='"+item['id']+"'");
																				
																			}
																			
																		 },
																		 function(error, statement){
																			// alert("Error: " + error.message + " when processing " + statement);
																			 opMessage("Error: " + error.message + " when processing " + statement);
																		 }        
																);
															}
															return;
														 }
														// Process Time Confirmations
														html5sql.process("SELECT * from MyTimeConfs where confno = 'NEW'",
															function(transaction, results, rowsArray){
																if( rowsArray.length > 0) {
																	if (syncDetails){
																		localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", TimeConfs:"+String(rowsArray.length));
																	}else{
																		syncDetails=true;
																		localStorage.setItem('LastSyncUploadDetails',"TimeConfs:"+String(rowsArray.length));
																	}
																	for (var n = 0; n < rowsArray.length; n++) {
																		item = rowsArray[n];
																		if(item['final']=="Yes"){
																			fconf="X";
																		}else{
																			fconf="";
																		}									
																		newTConfDets='&ORDERNO='+item['orderno']+'&OPNO='+item['opno']+'&CONF_TEXT='+item['description']+
																		'&TIME='+item['duration']+'&USER='+item['user']+'&RECNO='+item['id']+
																		'&SDATE='+item['date'].substring(8,10)+"."+item['date'].substring(5,7)+"."+item['date'].substring(0,4)+'&STIME='+item['time']+'&EDATE='+item['enddate'].substring(8,10)+"."+item['enddate'].substring(5,7)+"."+item['enddate'].substring(0,4)+'&ETIME='+item['endtime']+
																		'&ACTIVITYTYPE='+item['type']+'&WORK_CNTR='+item['work_cntr']+'&PERS_NO='+item['empid']+'&LONG_TEXT='+item['longtext']+
																		'&ACT_WORK='+item['act_work']+'&REM_WORK='+item['rem_work']+'&FINAL='+item['final']
																		if (item['reason']!=null){
																			newTConfDets+='&REASON='+item['reason']
																		}
																			
																		opMessage("NewTconf Details="+newTConfDets);
																	
																		sapCalls+=1;
																		n = rowsArray.length
																		html5sql.process("UPDATE MyTimeConfs SET confno = 'SENDING' WHERE id='"+item['id']+"'",
																				 function(){
																					sendSAPData("MyJobsCreateTConf.htm",newTConfDets,"UPDATE MyTimeConfs SET confno = 'NEW' WHERE id='"+item['id']+"'");
																					
																				 },
																				 function(error, statement){
																					 
																					 opMessage("Error: " + error.message + " when processing " + statement);
																				 }        
																		);
																	 }
																	return
																}
																// Upload the Messages READ Indicator
																
																html5sql.process("SELECT * from MyMessages where state = 'READ'",
																	function(transaction, results, rowsArray){
																		
																		//opMessage("done READ Message Select");
																		//opMessage("READ Messages = "+rowsArray.length);
																		if( rowsArray.length > 0) {
																			if (syncDetails){
																				localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", Read Messages:"+String(rowsArray.length));
																			}else{
																				syncDetails=true;
																				localStorage.setItem('LastSyncUploadDetails',"Read Messages:"+String(rowsArray.length));
																			}
																			if(!syncDetsSet){
																				syncDetsSet=true;
																				SetLastSyncDetails("LASTSYNC_UPLOAD");
																				
																				}

																			item = rowsArray[0];

																			newMessageDets='&ID='+item['id']+'&DOCID='+item['msgid'];
																			opMessage("READ Status= "+newMessageDets);
																			
																			
																			html5sql.process("UPDATE MyMessages SET state = 'SENDING' WHERE id='"+item['id']+"'",
																					 function(){
																					///sendSAPData("MyJobsMessageSetReadFlag.htm",newMessageDets,"UPDATE MyMessages SET state = 'NEW' WHERE id='"+item['id']+"'");
																					
																					 },
																					 function(error, statement){
																						 
																						 opMessage("Error: " + error.message + " when processing " + statement);
																					 }        
																			);	
																			return;	
																		 }
																		// Upload the NEW Sent Messages
																		
																		html5sql.process("SELECT * from MyMessages where state = 'NEW'",
																			function(transaction, results, rowsArray){
																			
																				//opMessage("done SEND Message Select");
																				//opMessage("SEND Messages = "+rowsArray.length);
																				if( rowsArray.length > 0) {
																					if (syncDetails){
																						localStorage.setItem('LastSyncUploadDetails',localStorage.getItem('LastSyncUploadDetails')+", Messages:"+String(rowsArray.length));
																					}else{
																						syncDetails=true;
																						localStorage.setItem('LastSyncUploadDetails',"Messages:"+String(rowsArray.length));
																					}
																					if(!syncDetsSet){
																						syncDetsSet=true;
																						SetLastSyncDetails("LASTSYNC_UPLOAD");
																						sapCalls+=1;
																						}

																					item = rowsArray[0];

																					newSentMsgDets='&ID='+item['id']+'&TO='+item['msgtoid']+'&SUBJECT='+item['msgsubject']+'&CONTENT='+item['msgtext'];
																					opMessage("SEND Status= "+newSentMsgDets);
																					
																					
																					html5sql.process("UPDATE MyMessages SET state = 'SENDING' WHERE id='"+item['id']+"'",
																								 function(){
																								      //sendSAPData("MyJobsMessageSend.htm",newSentMsgDets,"UPDATE MyMessages SET state = 'NEW' WHERE id='"+item['id']+"'");
																										
																								 },
																								 function(error, statement){
																									 
																									 opMessage("Error: " + error.message + " when processing " + statement);
																								 }        
																						);	
																					return;
																				 }
																				 
																			},
																			function(error, statement){
																				opMessage("Error: " + error.message + " when New Message processing New " + statement); 
																			}
																		);		 
																	},
																	function(error, statement){
																		opMessage("Error: " + error.message + " when Message Read processing " + statement); 
																	}
																);		
															},
															function(error, statement){
																opMessage("Error: " + error.message + " when Time Confirmation processing " + statement); 
															}
														);	 
													},
													function(error, statement){
														opMessage("Error: " + error.message + " when Job Status processing " + statement); 
													}
												);	
											},
											function(error, statement){
												opMessage("Error: " + error.message + " when New Notif processing " + statement); 
											}
										);	
									},
									function(error, statement){
										opMessage("Error: " + error.message + " when EOD Notif processing " + statement); 
									}
								);	 
							
							},
							function(error, statement){
								opMessage("Error: " + error.message + " when Defects processing " + statement); 
							}
						);	 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when Users processing " + statement); 
					}
				);	
				




	
	
			
				
				
// Check for New Messages to retrieve
				
				//requestSAPData("MyJobsMessages.htm",SAPServerSuffix+currentUser);
			}
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when syncTransactional processing " + statement);          
		}
	);
	

	
	
	
	

}
function loadAssetXML(fname){
	 $.ajax({
		    type: "GET",
		    url: fname,
		    dataType: "xml",
		    success: function (xml) {    
		       xmlDoc=xml 
		      BuildAssetDetails();
		    }    
		       
		});
         
};
function BuildAssetDetails(){
	var sqlinsert1=""
	var sqlinsert2=""
	var sqlstatement=""
		var opsql=0;
	    txt = "";
	    x = xmlDoc.documentElement.childNodes;
	    for (i = 0; i < x.length; i++) { 
	        if (x[i].nodeType == 1) {
	           
	            y = x[i].attributes;
				
	            var first=0
				var len=x[i].attributes.length
				
	            for (n = 0; n < 22; n++) { 
	                if(first==0){
	                         sqlinsert1=y[0].name
	                         sqlinsert2='"'+escape(y[n].value)+'"'
	                         first=1
	                         }else{
	                         sqlinsert1+=","+y[n].name
	                         sqlinsert2+=',"'+escape(y[n].value)+'"'
	                         }
	               
	            } 
	             sqlstatement+="insert into assetdetails ("+sqlinsert1+") values ("+sqlinsert2+");"
			sqlinsert1=""
			sqlinsert2=""
	        }
        if((i!=0)&&((i%1000)==0)){
        	
        		insertAssetDetails(sqlstatement)
        		
        	sqlstatement=""

        	}
	        
	    }
	   
	    insertAssetDetails(sqlstatement)

	 
	}

function insertAssetDetails(sql){
	console.log("isertig stuff")
	html5sql.process(sql,
			 function(){
			
		console.log("write ok")
			 },
			 function(error, statement){
				 console.log("Error: " + error.message + " when loading Assets " + statement);
				 opMessage("Error: " + error.message + " when loading Assets " + statement);
			 }        
	);
}	


function syncReference(){


	if (!CheckSyncInterval('REFERENCE')){return; }
	opMessage("Synchronizing Reference Data");

	
	html5sql.process(
		["SELECT * from MyUserDets"],
		function(transaction, results, rowsArray){
			if( rowsArray.length > 0) {
				SAPServerSuffix="?jsonCallback=?&MYJOBSSYSTEM="+localStorage.getItem('SAPSystem')+"&sap-client="+localStorage.getItem('SAPClient')+"&sap-user="+rowsArray[0].user+"&sap-password="+rowsArray[0].password+"&username="+rowsArray[0].mobileuser;
			
				html5sql.process("SELECT * from MyWorkConfig where paramname = 'SERVERNAME'",
					function(transaction, results, rowsArray){
						if( rowsArray.length > 0) {
							SetLastSyncDetails("LASTSYNC_REFERENCE");
							localStorage.setItem('LastSyncReferenceDetails','');
							syncReferenceDetsUpdated=false;
							SAPServerPrefix=$.trim(rowsArray[0].paramvalue);							
							opMessage("Sending SAP Request for Ref Data");	
							getAssetFiles()
							requestSAPData("MyJobsRefData.htm",'');
							requestSAPData("MyJobsRefDataCodes.htm",'');
							requestSAPData("MyJobsUsers.htm",'');
							requestSAPData("MyJobsVehiclesDefault.htm",'');
							requestSAPData("MyJobsVehicles.htm",'');
							requestSAPDataPJO("getFormsJSON.php",'');
							//requestSAPData("MyJobsFunclocs.htm",'');
							//requestSAPData("MyJobsEquipment.htm",'');
						 }
						 
					},
					function(error, statement){
						opMessage("Error: " + error.message + " when syncTransactional processing " + statement); 
					}
				);
			}
		},
		function(error, statement){
		 opMessage("Error: " + error.message + " when syncTransactional processing " + statement);          
		}
	);
	

	
	
	
	

}

function getAssetFiles(){
	
	//downloadfile("T2_MPLT_ESVM.XML")
	//downloadfile("T2_MPLT_ESVN.XML")
	//downloadfile("T2_MPLT_ESVS.XML")
	//downloadfile("T2_MPLT_LSVM.XML")
	//downloadfile("T2_MPLT_LSVN.XML")
	//downloadfile("T2_MPLT_LSVS.XML")
	//downloadfile("T2_MPLT_NSVE.XML")
	//downloadfile("T2_MPLT_NSVM.XML")
	//downloadfile("T2_MPLT_NSVW.XML")
	//downloadfile("T2_MPLT_RSVM.XML")
	//downloadfile("T2_MPLT_RSVN.XML")
	//downloadfile("T2_MPLT_RSVS.XML")
}
function downloadfile(fname){ 
	var myurl=SAPServerPrefix+fname+SAPServerSuffix;
	//alert(myurl+"---------------"+cordova.file.dataDirectory)
	opMessage(myurl)
   
	var fileTransfer = new FileTransfer();
	var uri = encodeURI(myurl);
	//SetConfigParam("ASSET_PATH","cdvfile://localhost/persistent/")
	var fileURL = cordova.file.dataDirectory+fname

	fileTransfer.download(
	    uri,
	    fileURL,
	    function(entry) {
	    	opMessage("download complete: " + entry.toURL());
	    },
	    function(error) {
	    	opMessage("download error source " + error.source);
	    	opMessage("download error target " + error.target);
	    	opMessage("download error code" + error.code);
	    },
	    true,
	    {
	        headers: {
	          
	        }
	    }
	);	

} 
//*************************************************************************************************************************
//
//  Survery Routines
//
//*************************************************************************************************************************
function getSurveyType(type){

var TypeName="";
switch(type) {
    case "1":
        TypeName="CheckBox";
        break;
    case "2":
        TypeName="Radio";
        break;
    case "3":
        TypeName="Text";
        break;
    case "4":
        TypeName="Number";
        break;
    case "5":
        TypeName="TextArea";
        break;
    case "6":
        TypeName="Select";
        break;
    case "7":
        TypeName="Slider";
        break;
    case "8":
        TypeName="Date";
        break;
    case "9":
        TypeName="Time";
        break;
	case "10":
        TypeName="Group";
        break;

}

	return TypeName;

}

//*************************************************************************************************************************
//
//  Update Routines
//
//*************************************************************************************************************************
function updateOrderEquipment(orderno, property, funcloc, equipment)
{

	html5sql.process("UPDATE MyOrders SET property = '"+property+"', funcloc =  '"+funcloc+"',  equipment =  '"+equipment+"' where orderno = '"+orderno+"' ",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateOrderEquipment processing " + statement);
	 }        
	);
}

function updateTaskLongText(id,longtext)
{

	html5sql.process("UPDATE MyTasks SET longtext = '"+longtext+"' where id = '"+id+"' ",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateTaskLongText processing " + statement);
	 }        
	);
}
function updateOrderAddress(orderno, house, houseno, street, district, city, postcode, workaddress)
{

	html5sql.process("UPDATE MyOrders SET house = '"+house+"', houseno = '"+houseno+"',  street ='"+street+"',  district = '"+district+"', city = '"+city+"',  postcode = '"+postcode+"',  workaddress='"+workaddress+"' where orderno = '"+orderno+"' ",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateOrderAddress processing " + statement);
	 }        
	);
}
function updateNotifLatLong(notifno, fname, latlong)
{
res=notifno.split("|");


	html5sql.process("UPDATE MyOrders SET "+fname+" = '"+latlong+"' where id = '"+res[1]+"';",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateNotifLatLong processing " + statement);
	 }        
	);
}
function updateOrderLatLong(orderno, fname, latlong)
{

	html5sql.process("UPDATE MyOrders SET "+fname+" = '"+latlong+"' where orderno = '"+orderno+"';",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when updateOrderLatLong processing " + statement);
	 }        
	);
}

function updateOperationStatus(orderno, opno, code, status)
{
	sqltimestamp=""
	
	if(code=='ACPT'){
		sqltimestamp=", acpt_date = '"+statusUpdateDate+"', acpt_time ='"+statusUpdateTime+"'"
	}else if(code=='SITE'){
		sqltimestamp=", onsite_date = '"+statusUpdateDate+"', onsite_time ='"+statusUpdateTime+"'"
	}else if(code=='PARK'){
		sqltimestamp=", park_date = '"+statusUpdateDate+"', park_time ='"+statusUpdateTime+"'"
	}

	html5sql.process("update  myjobdets set status = '"+code+"', status_s = '"+code+"', status_l =  '"+code+"'"+sqltimestamp+" ,tconf_date = '"+statusUpdateDate+"', tconf_time = '"+statusUpdateTime+"' where  orderno = '"+orderno+"' and opno = '"+ opno+"';",
		function(){
				
				html5sql.process("insert into mystatus (orderno, opno, state,  stsma, status, actdate, acttime, statusdesc) values("+
					 "'"+orderno+"','"+opno+"','NEW','ZMAM_1', '"+code+"','"+statusUpdateDate+"','"+statusUpdateTime+"','"+status+"');",				
				function(){
					if((code=="REJ1")||(code=="REJ2")){
						updateJobDetsStatus(orderno, opno, code)
					}
					if((code=='CONF')&&(followOnWork=="YES"))
    				{
    					// this is where we create the Follow on Work Status NWWK or MRWK
    					createNewStatus(CurrentOrderNo, CurrentOpNo, "NWWK", "New Work")
    				}
					 
				 },
				 function(error, statement){
					opMessage("Error: " + error.message + " when InsertOperationStatus processing " + statement);
				 }        
				);
		},
		function(error, statement){
		opMessage("Error: " + error.message + " when insertOperationStatus processing " + statement);          
		
		}
	);
}

function createNewStatus(orderno, opno, code, status)
{
	
	
			
				html5sql.process("insert into mystatus (orderno, opno, state,  stsma, status, actdate, acttime, statusdesc) values("+
					 "'"+orderno+"','"+opno+"','NEW','ZMAM_1', '"+code+"','"+statusUpdateDate+"','"+statusUpdateTime+"','"+status+"');",				
				function(){
					
					 
				 },
				 function(error, statement){
					opMessage("Error: " + error.message + " when InsertOperationStatus processing " + statement);
				 }        
				);
		
}
function updateJobDetsStatus(orderno, opno, status)
{



	html5sql.process("update  myjobdets set status = '"+status+"', status_s = '"+status+"', status_l =  '"+status+"' ,tconf_date = '"+statusUpdateDate+"', tconf_time = '"+statusUpdateTime+"' where  orderno = '"+orderno+"' and opno = '"+ opno+"';",
		function(){
		
				
		},
		function(error, statement){
		opMessage("Error: " + error.message + " when insertOperationStatus processing " + statement);          
		
		}
	);
}
function updateJobDetsDateTime(orderno, opno)
{



	html5sql.process("update  myjobdets set tconf_date = '"+statusUpdateDate+"', tconf_time = '"+statusUpdateTime+"' where  orderno = '"+orderno+"' and opno = '"+ opno+"';",
		function(){
		
				
		},
		function(error, statement){
		opMessage("Error: " + error.message + " when insertOperationStatus processing " + statement);          
		
		}
	);
}
function countStatus()
{



	html5sql.process("select count(*) as PARK ,   (select count(*)   from myjobdets  where status = 'ACPT') as ACPT, (select count(*)   from myjobdets  where status = 'SITE') as SITE from myjobdets  where status = 'PARK'",
		function(transaction, results, rowsArray){
		localStorage.setItem("totalParked",rowsArray[0].PARK)
		localStorage.setItem("totalAccepted",'0')
		if(rowsArray[0].ACPT!='0'){
			localStorage.setItem("totalAccepted",'1')
		}
		if(rowsArray[0].SITE!='0'){
			localStorage.setItem("totalAccepted",'1')
		}		
					
		},
		function(error, statement){
		opMessage("Error: " + error.message + " when insertOperationStatus processing " + statement);          
		
		}
	);
}

//*************************************************************************************************************************
//
//  Create Routines
//
//*************************************************************************************************************************
function saveQuestionField(id,type,surveyid,dt)
{
var	value = surveyid+":"+type+":"+id;
	if(type=='S'){
		value=sap.ui.getCore().getElementById(id).getValue()
	}else if(type=='Y'){
		value=sap.ui.getCore().getElementById(id).getState()
	}else if(type=='M'){
		value=sap.ui.getCore().getElementById(id).getValue()
	}else if(type=='!'){
		value=sap.ui.getCore().getElementById(id).getValue()
	}else if(type==';'){
		value=sap.ui.getCore().getElementById(id).getValue()
	}else if(type=='Q'){
		value=sap.ui.getCore().getElementById(id).getValue()
	}else {
		value = surveyid+":"+type+":"+id;
		
	}
	html5sql.process("select * from JobAnswers where orderno = '"+CurrentOrderNo+
			"' and opno = '"+CurrentOpNo+"' and user = '"+localStorage.getItem('MobileUser')+"' and item = '"+surveyid+"' and task = '"+id+"';",
			function(transaction, results, rowsArray){
				if(rowsArray.length>0){
					html5sql.process("UPDATE JobAnswers SET updateddate = '"+dt+"', value = '" +value+"'"+
							" where orderno = '"+CurrentOrderNo+
								"' and opno = '"+CurrentOpNo+"' and user = '"+localStorage.getItem('MobileUser')+"' and item = '"+surveyid+"' and task = '"+id+"';",
							 function(){
								 
							 },
							 function(error, statement){
								opMessage("Error: " + error.message + " when updateOrderLatLong processing " + statement);
							 }        
							);
				}else{
					html5sql.process("INSERT INTO  JobAnswers (orderno , opno, user, updateddate, item , task , value ) VALUES ("+
							 "'"+CurrentOrderNo+"','"+CurrentOpNo+"','"+localStorage.getItem('MobileUser')+"','"+dt+"','"+surveyid+"','"+id+"','"+value+"');",
					 function(){
						
					 },
					 function(error, statement){
						 //alert("Error: " + error.message + " when JobAnswers Inserting " + statement);
						opMessage("Error: " + error.message + " when JobAnswers Inserting " + statement);
					 }        
					);
				}
			 },
			 function(error, statement){
				opMessage("Error: " + error.message + " when updateOrderLatLong processing " + statement);
			 }        
			);
	


}
function saveTheAnswer(order,opno,user,dt,item,task,value,type)
{
	var xval;
	if(type=="PHOTO"){
		xval=escape(sap.ui.getCore().getElementById(value).getSrc())
	}else if(type=="SIG"){
		
		xval=escape(sap.ui.getCore().getElementById(value).getSrc())
	}else{
		xval=value
	}
	
	html5sql.process("select * from JobAnswers where orderno = '"+order+
			"' and opno = '"+opno+"' and user = '"+user+"' and item = '"+item+"' and task = '"+task+"';",
			function(transaction, results, rowsArray){
				if(rowsArray.length>0){
					html5sql.process("UPDATE JobAnswers SET updateddate = '"+dt+"' , value = '" +xval+"'"+
							" where orderno = '"+order+
								"' and opno = '"+opno+"' and user = '"+user+"' and item = '"+item+"' and task = '"+task+"';",
							 function(){
								 
							 },
							 function(error, statement){
								opMessage("Error: " + error.message + " when updateOrderLatLong processing " + statement);
							 }        
							);
				}else{
					html5sql.process("INSERT INTO  JobAnswers (orderno , opno, user, updateddate, item , task , value ) VALUES ("+
							 "'"+order+"','"+opno+"','"+user+"','"+dt+"','"+item+"','"+task+"','"+xval+"');",
					 function(){
						
					 },
					 function(error, statement){
						 //alert("Error: " + error.message + " when JobAnswers Inserting " + statement);
						opMessage("Error: " + error.message + " when JobAnswers Inserting " + statement);
					 }        
					);
				}
			 },
			 function(error, statement){
				opMessage("Error: " + error.message + " when updateOrderLatLong processing " + statement);
			 }        
			);
	


}
function createAWSEODNotif(workdate,homedate,empno)
{

	

	wdate=convertEODDate(workdate).split(" ")
	hdate=convertEODDate(homedate).split(" ")
	
	html5sql.process("INSERT INTO  MyNotifications (notifno , type, startdate, starttime, enddate, endtime, shorttext) VALUES ("+
					 "'NEW','Z7','"+wdate[0]+"','"+wdate[1]+"','"+hdate[0]+"','"+hdate[1]+"','Day End Travel/"+getDate()+"/"+empno+"');",
	 function(transaction, results, rowsArray){

		
	 },
	 function(error, statement){

		
	 } )   

}

function createAWSJobClose(order,opno,notifno, details, empid,work_cntr,closedate,closetime, funcloc , equipment, inshift , outofshift , pgrp, pcode, agrp, acode, igrp, icode, followon , variance, reason)
{
html5sql.process("INSERT INTO  MyJobClose (orderno , opno, notifno, details, empid, work_cntr, state , closedate, closetime, funcloc , equipment, inshift , outofshift , pgrp, pcode, agrp, acode, igrp, icode, followon , variance, reason) VALUES ("+
			 "'"+order+"','"+opno+"','"+notifno+"','"+details+"','"+empid+"','"+work_cntr+"','NEW','"+closedate+"','"+closetime+"','"+
			 funcloc+"','"+equipment+"','"+inshift+"','"+outofshift+"','"+pgrp+"','"+pcode+"','"+agrp+"','"+
			 acode+"','"+igrp+"','"+icode+"','"+followon+"','"+variance+"','"+reason+"');",
	 function(){
		
	 },
	 function(error, statement){
			
		opMessage("Error: " + error.message + " when createTConf processing " + statement);
	 }        
	);
}
function createFormsResponse(formname, order,opno,user,content)
{
	
	html5sql.process("INSERT INTO  MyFormsResponses (formname, orderno , opno, user, contents, date , time , state) VALUES ("+
				 "'"+formname+"','"+order+"','"+opno+"','"+user+"','"+content+"','"+getDate()+"','"+getTime()+"','NEW');",
		 function(){
			
		 },
		 function(error, statement){

			opMessage("Error: " + error.message + " when FormsResponses processing " + statement);
		 }        
		);
}
function createAWSTConf(order,opno,empid,work_cntr,acttype,reasontype,startdate,starttime,enddate, endtime, actwork,remwork,text,details,finalconf)
{
/*	alert(work_cntr+":"+CurrentJobWorkCentreOp)
html5sql.process("INSERT INTO  MyTimeConfs (orderno , opno,reason,type, confno , description , longtext, date , time , enddate, endtime, act_work, rem_work, empid, work_cntr, final , datestamp, user, state) VALUES ("+
			 "'"+order+"','"+opno+"','"+reasontype+"','"+acttype+"','NEW','"+text+"','"+details+"','"+startdate+"','"+starttime+"','"+enddate+"','"+endtime+"','"+actwork+"','"+remwork+"','"+empid+"','"+work_cntr+"','"+finalconf+"','"+getDate()+" "+getTime()+"','"+localStorage.getItem("MobileUser")+"','');",
	 function(){
		rebuildTimeConfs();
	 },
	 function(error, statement){

		opMessage("Error: " + error.message + " when createTConf processing " + statement);
	 }        
	);*/

	html5sql.process("INSERT INTO  MyTimeConfs (orderno , opno,reason,type, confno , description , longtext, date , time , enddate, endtime, act_work, rem_work, empid, work_cntr, final , datestamp, user, state) VALUES ("+
				 "'"+order+"','"+opno+"','"+reasontype+"','"+acttype+"','NEW','"+text+"','"+details+"','"+startdate+"','"+starttime+"','"+enddate+"','"+endtime+"','"+actwork+"','"+remwork+"','"+empid+"','"+CurrentJobWorkCentreOp+"','"+finalconf+"','"+getDate()+" "+getTime()+"','"+localStorage.getItem("MobileUser")+"','');",
		 function(){
			rebuildTimeConfs();
		 },
		 function(error, statement){

			opMessage("Error: " + error.message + " when createTConf processing " + statement);
		 }        
		);
}
function createTConf(order,opno,empid,type,startdate,enddate,duration,finalconf,comments)
{

	var xempid=empid.split("|")
	var xstartdate=convertDateTimePicker(startdate).split("|")

	var xenddate=convertDateTimePicker(enddate).split("|")

	var xtctype="Travel"
	var xfinalconf=""

	if (type=="tconfWork"){
		xtctype="Work"
	}

	if (finalconf=="tconfFinalYes"){
		xfinalconf="X"
	}
	//alert("INSERT INTO  MyTimeConfs (orderno , opno,type, confno , description , date , time , enddate, endtime, duration, empid, final , datestamp, user, state) VALUES ("+
	//		 "'"+order+"','"+opno+"','"+xtctype+"','NEW','"+comments+"','"+xstartdate[0]+"','"+xstartdate[1]+"','"+xenddate[0]+"','"+xenddate[1]+"','"+duration+"','"+xempid[2]+"','"+xfinalconf+"','"+getDate()+" "+getTime()+"','"+localStorage.getItem("MobileUser")+"','');")

	html5sql.process("INSERT INTO  MyTimeConfs (orderno , opno,type, confno , description , date , time , enddate, endtime, duration, empid, final , datestamp, user, state) VALUES ("+
			 "'"+order+"','"+opno+"','"+xtctype+"','NEW','"+comments+"','"+xstartdate[0]+"','"+xstartdate[1]+"','"+xenddate[0]+"','"+xenddate[1]+"','"+duration+"','"+xempid[2]+"','"+xfinalconf+"','"+getDate()+" "+getTime()+"','"+localStorage.getItem("MobileUser")+"','');",
	 function(){
		rebuildTimeConfs();
	 },
	 function(error, statement){

		opMessage("Error: " + error.message + " when createTConf processing " + statement);
	 }        
	);
}
function xxcreateNotification(type,priority,group,code,grouptext,codetext,description,details,startdate,funcloc,equipment)
{
var ReportedpOn=getDate()+" "+getTime();
var ReportedBy=localStorage.getItem("MobileUser");


	html5sql.process("INSERT INTO  MyNotifications (notifno , type, startdate, shorttext, longtext , priority , pgroup , pcode , grouptext, codetext, funcloc, equipment, reportedby, reportedon, plant , orderno, funclocgis, equipmentgis) VALUES ("+
					 "'NEW','"+type+"','"+startdate+"','"+description+"','"+details+"','"+priority+"','"+group+"','"+code+"','"+grouptext+"','"+codetext+"','"+funcloc+"','"+equipment+"','"+ReportedBy+"','"+ReportedpOn+"','','','','');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createNotification processing " + statement);
	 }        
	);
}
function createVehicleDefect(type,description,details,equipment)
{
var startdate=getSAPDate();
var starttime=getSAPTime();
var ReportedBy=localStorage.getItem("MobileUser");
//alert("INSERT INTO  MyNewJobs (state , type, date, time, shorttext, longtext, equipment, reportedby) VALUES ("+
//					 "'VEHICLEDEFECT','"+type+"','"+startdate+"','"+starttime+"','"+description+"','"+details+"','"+equipment+"','"+ReportedBy+"');");
	html5sql.process("INSERT INTO  MyNewJobs (state , type, date, time, shorttext, longtext, equipment, reportedby) VALUES ("+
					 "'VEHICLEDEFECT','"+type+"','"+startdate+"','"+starttime+"','"+description+"','"+details+"','"+equipment+"','"+ReportedBy+"');",
	 function(){
		 //alert("Created VDefect");
	 },
	 function(error, statement){
		 //alert("Error: " + error.message + " when createNotification processing " + statement);
		opMessage("Error: " + error.message + " when createNotification processing " + statement);
	 }        
	);
	
}
function createTask(notifno, cattype, groupcd, codecd, grouptext, codetext, description)
{
	html5sql.process("INSERT INTO MyTasks (notifno , item_id, task_cat_typ, task_codegrp , task_code , txt_taskgrp, txt_taskcd , task_text, plnd_start_date, plnd_start_time, plnd_end_date, plnd_end_time, sla_end_date, sla_end_time, longtext, complete, status) VALUES ("+
					 "'"+notifno+"','NEW','"+cattype+"','"+groupcd+"','"+codecd+"','"+grouptext+"','"+codetext+"','"+description+"','"+getDate()+"','"+getTime()+"','','','"+ getDate()+"','"+getTime()+"','','','');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createNotification processing " + statement);
	 }        
	);
}


function createActivity(notifno, cattype, task,groupcd,codecd, grouptext, codetext, description)
{
	html5sql.process("INSERT INTO MyActivities (notifno ,task_id, item_id, act_codegrp , act_code , txt_actgrp, txt_actcd , act_text, act_id, act_cat_typ, start_date, start_time, end_date, end_time, long_text, status) VALUES ("+
					 "'"+notifno+"','"+task+"','NEW','"+groupcd+"','"+codecd+"','"+grouptext+"','"+codetext+"','"+description+"','','"+cattype+"','"+getDate()+"','"+getTime()+"','','','','');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createActivity processing " + statement);
	 }        
	);
}
function createEffect(notifno,cattype,groupcd,codecd, grouptext, codetext, description)
{

	html5sql.process("INSERT INTO MyEffects (notifno , item_id, effect_codegrp , effect_code , txt_effectgrp, txt_effectcd , value, task_id, effect_cat_typ ) VALUES ("+
					 "'"+notifno+"','NEW','"+groupcd+"','"+codecd+"','"+grouptext+"','"+codetext+"','"+description+"','','"+cattype+"');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createActivity processing " + statement);
	 }        
	);
}
function createCause(notifno,cattype,groupcd,codecd, grouptext, codetext, description)
{

	html5sql.process("INSERT INTO MyCauses (notifno , item_id, cause_codegrp , cause_code , txt_causegrp, txt_causecd , cause_text , cause_id, cause_cat_typ, long_text, status) VALUES ("+
					 "'"+notifno+"','NEW','"+groupcd+"','"+codecd+"','"+grouptext+"','"+codetext+"','"+description+"','','"+cattype+"','','');",
	 function(){
		 //alert("Success dropping Tables");
	 },
	 function(error, statement){
		opMessage("Error: " + error.message + " when createActivity processing " + statement);
	 }        
	);
}
//*************************************************************************************************************************
//
//  Create Database Tables
//
//*************************************************************************************************************************
function createTables(type) { 




	//opMessage("Creating The Tables");	
        
		sqlstatement='CREATE TABLE IF NOT EXISTS MyOrders     			( orderno TEXT, changedby TEXT, changeddatetime TEXT, shorttext TEXT, longtext TEXT, startdate TEXT, enddate TEXT, contact TEXT,   telno TEXT,    type TEXT, priority TEXT, address TEXT, workaddress TEXT, house TEXT, houseno TEXT, street TEXT, district TEXT, city TEXT, postcode TEXT,gis TEXT, property TEXT, funcloc TEXT, equipment TEXT, propertygis TEXT, funclocgis TEXT, equipmentgis TEXT, notifno TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyOperations 			( orderno TEXT, opno TEXT,      type TEXT,     priority TEXT,  shorttext TEXT, startdate TEXT, enddate TEXT, duration TEXT, status TEXT, assignedto TEXT, apptstart TEXT, apptend TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyOperationsSplit 		( orderno TEXT, opno TEXT,      assignedto TEXT,  duration TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyPartners   			( orderno TEXT, notifno TEXT, id TEXT,        type TEXT,     name TEXT,      address TEXT,   postcode TEXT, telno TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyAssets     			( orderno TEXT, id TEXT,        type TEXT,     name TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyMaterials     		( orderno TEXT, id TEXT, material TEXT, qty TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyUserStatus     		( id integer primary key autoincrement, type TEXT, orderno TEXT, opno TEXT, inact TEXT, status TEXT, statuscode TEXT, statusdesc TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyOperationInfo     	( id integer primary key autoincrement, orderno TEXT, opno TEXT, type TEXT, value1 TEXT, value2 TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyNotifications     	( id integer primary key autoincrement, notifno TEXT, changedby TEXT, changeddatetime TEXT, shorttext TEXT, longtext TEXT, cattype TEXT,  pgroup TEXT, pcode TEXT, grouptext TEXT, codetext TEXT, startdate TEXT, starttime TEXT, enddate TEXT, endtime TEXT, type TEXT, priority TEXT, funcloc TEXT,   equipment TEXT, orderno TEXT, reportedon TEXT,   reportedby TEXT, plant TEXT, funclocgis TEXT,   equipmentgis TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyItems     			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, descript TEXT, d_cat_typ TEXT, d_codegrp TEXT, d_code TEXT, dl_cat_typ TEXT, dl_codegrp TEXT, dl_code TEXT, long_text TEXT, stxt_grpcd TEXT ,txt_probcd TEXT  ,txt_grpcd TEXT , txt_objptcd TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyCauses      			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, cause_id TEXT, cause_text TEXT, cause_cat_typ TEXT, cause_codegrp TEXT, cause_code TEXT, long_text TEXT, txt_causegrp TEXT, txt_causecd TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyActivities     		( id integer primary key autoincrement, notifno TEXT, task_id TEXT, item_id TEXT,  act_id TEXT, act_text TEXT, act_cat_typ TEXT, act_codegrp TEXT, act_code TEXT,  start_date TEXT, start_time TEXT ,end_date TEXT  ,end_time TEXT , long_text TEXT, txt_actgrp TEXT, txt_actcd TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyTasks      			( id integer primary key autoincrement, notifno TEXT, item_id TEXT, task_text TEXT, task_cat_typ TEXT, task_codegrp TEXT, task_code TEXT, txt_taskgrp TEXT, txt_taskcd TEXT, plnd_start_date TEXT, plnd_start_time TEXT ,plnd_end_date TEXT  ,plnd_end_time TEXT , sla_end_date TEXT  ,sla_end_time TEXT , longtext TEXT, complete TEXT, status TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyEffects      		( id integer primary key autoincrement, notifno TEXT, item_id TEXT, task_id TEXT, effect_cat_typ TEXT, effect_codegrp TEXT, effect_code TEXT, txt_effectgrp TEXT, txt_effectcd TEXT, value TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyStatus     			( id integer primary key autoincrement, orderno TEXT, opno TEXT, stsma TEXT, status TEXT, statusdesc, state TEXT, actdate TEXT, acttime TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyTimeConfs     		( id integer primary key autoincrement, orderno TEXT, opno TEXT, confno TEXT, type TEXT, description TEXT, date TEXT, time TEXT, enddate TEXT, endtime TEXT,act_work TEXT, rem_work TEXT, act_type TEXT, work_cntr TEXT, reason TEXT, longtext TEXT, duration TEXT, datestamp TEXT,  user TEXT,  empid TEXT, final TEXT, state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyJobClose             ( id integer primary key autoincrement, orderno TEXT , opno TEXT, notifno TEXT, details TEXT, empid TEXT, work_cntr TEXT, state TEXT , closedate TEXT, closetime TEXT, funcloc  TEXT, equipment TEXT, inshift  TEXT, outofshift  TEXT, pgrp TEXT, pcode TEXT, agrp TEXT, acode TEXT, igrp TEXT, icode TEXT, followon  TEXT, variance TEXT, reason TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyNewJobs     			( id integer primary key autoincrement, type TEXT, defect TEXT, mpoint TEXT, mpval TEXT, shorttext TEXT, longtext TEXT, description TEXT, date TEXT, time TEXT, enddate TEXT, endtime TEXT, funcloc TEXT, equipment TEXT, cattype TEXT, codegroup TEXT, coding TEXT, activitycodegroup TEXT, activitycode TEXT, activitytext TEXT, prioritytype TEXT, priority TEXT, reportedby TEXT, state TEXT, assignment TEXT, spec_reqt TEXT, assig_tome TEXT, userid TEXT, eq_status TEXT, breakdown TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyWorkConfig     		( id integer primary key autoincrement, paramname TEXT, paramvalue TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyWorkSyncDets    		( id integer primary key autoincrement, lastsync TEXT, comments   TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyUserDets             ( id integer primary key autoincrement, mobileuser TEXT, vehiclereg TEXT, employeeid TEXT, user TEXT, password TEXT,pincode TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyRefUsers    			(  id integer primary key autoincrement, userid TEXT, scenario TEXT, plant TEXT, workcenter TEXT, plannergroup TEXT, plannergroupplant TEXT, storagegroup TEXT, storageplant TEXT, partner TEXT, partnerrole TEXT, funclocint TEXT, funcloc TEXT, compcode TEXT, employeeno TEXT, equipment TEXT, firstname TEXT, lastname TEXT, telno TEXT);'+													
					 'CREATE TABLE IF NOT EXISTS MyRefOrderTypes     	(  id integer primary key autoincrement, scenario TEXT, type TEXT, description TEXT, statusprofile TEXT, opstatusprofile TEXT, priorityprofile TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyRefNotifTypes     	(  id integer primary key autoincrement, scenario TEXT, type TEXT, description TEXT, statusprofile TEXT, taskstatusprofile TEXT,priority_type TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyRefPriorityTypes     (  id integer primary key autoincrement, scenario TEXT, type TEXT, priority TEXT, description TEXT);'+
				  	 'CREATE TABLE IF NOT EXISTS MyRefUserStatusProfiles (  id integer primary key autoincrement, scenario TEXT, type TEXT, status TEXT, statuscode TEXT, statusdesc TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyVehiclesDefault     	(  sysid integer primary key autoincrement, equipment TEXT, reg TEXT, id TEXT, partner TEXT, level TEXT, sequence TEXT,mpoint TEXT,mpointdesc TEXT, mpointlongtext TEXT,description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyVehicles     		(  sysid integer primary key autoincrement, reg TEXT, id TEXT, partner TEXT, mpoints TEXT,description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyForms        		(  id integer primary key autoincrement, name TEXT, type TEXT, lastupdated TEXT, url TEXT,description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyFormsResponses  		(  id integer primary key autoincrement, user TEXT, formname TEXT, lastupdated TEXT, orderno TEXT, opno TEXT, date TEXT, time TEXT, contents TEXT, state TEXT);'+

					 'CREATE TABLE IF NOT EXISTS MyVehicleCheck     	(  id integer primary key autoincrement, equipment TEXT, reg TEXT,  mileage TEXT,  mpoint TEXT,  desc TEXT,  longtext TEXT,  mdate TEXT, mtime TEXT, mreadby TEXT, user TEXT,  state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyMessages    			(  id integer primary key autoincrement, msgid TEXT, type TEXT,  date TEXT, time TEXT, msgfromid TEXT, msgfromname TEXT, msgtoid TEXT, msgtoname TEXT, msgsubject TEXT, msgtext TEXT,  expirydate TEXT, state TEXT);'+
					 'CREATE TABLE IF NOT EXISTS Assets     			(  type TEXT, id TEXT, eqart TEXT, eqtyp TEXT, shorttext TEXT,  address TEXT, workcenter TEXT);'+
					 'CREATE TABLE IF NOT EXISTS AssetClassVals     	(  type TEXT, id TEXT,  charact TEXT,  valuechar TEXT,  valueto TEXT, valueneutral TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS AssetMeasurementPoints (  type TEXT, id TEXT,  mpoint TEXT,  description TEXT,  value TEXT);'+
					 'CREATE TABLE IF NOT EXISTS AssetInstalledEquip    (  type TEXT, id TEXT,  eqno TEXT,  description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS LogFile    			( id integer primary key autoincrement, datestamp TEXT, type TEXT, message TEXT);'+
					 'CREATE TABLE IF NOT EXISTS RefNotifprofile  		( id integer primary key autoincrement, scenario TEXT, profile TEXT, notif_type TEXT);'+
					 'CREATE TABLE IF NOT EXISTS RefCodeGroups  		( id integer primary key autoincrement, scenario TEXT, profile TEXT, catalog_type TEXT, code_cat_group TEXT, codegroup TEXT, codegroup_text TEXT);'+
					 'CREATE TABLE IF NOT EXISTS RefCodes  				( id integer primary key autoincrement, scenario TEXT, profile TEXT, code_cat_group TEXT, code TEXT, code_text TEXT);'+
					 'CREATE TABLE IF NOT EXISTS HRAbsence     			( id integer primary key autoincrement, requesteddate TEXT, startdate TEXT, enddate TEXT, type TEXT, days TEXT, status TEXT, comments TEXT);'+
					 
					 'CREATE TABLE IF NOT EXISTS HRTravel     			( id integer primary key autoincrement, requesteddate TEXT, startdate TEXT, enddate TEXT, travelfrom TEXT, travelto TEXT, status TEXT, comments TEXT);'+
					 'CREATE TABLE IF NOT EXISTS AssetDetails     		( id integer primary key autoincrement,PLAN_PLANT TEXT, MTCE_PLANT TEXT, SITE TEXT, FUNC_LOC TEXT, FUNC_LOC_DESC TEXT, EQUIP TEXT, EQUIP_DESC TEXT, PLANT_GROUP TEXT, ASSET_TYPE TEXT, ASSET_DESC TEXT, MAKE TEXT, MODEL TEXT, SERIAL_NO TEXT, OBJ_TYPE TEXT, EQTYPE_DESC TEXT, EFUNC_TYPE TEXT, FTYPE_DESC TEXT, SYS_CODE TEXT, SCODE_DESC TEXT, ASSET_TAG TEXT, START_UP_DATE TEXT, STATUS TEXT);'+

					 'CREATE TABLE IF NOT EXISTS JobAnswers     		( id integer primary key autoincrement, orderno TEXT, opno TEXT, user TEXT, updateddate TEXT, item TEXT, task TEXT, value TEXT);'+
					 'CREATE TABLE IF NOT EXISTS StockSearch     		( id integer primary key autoincrement, materialno TEXT, description TEXT, depot TEXT, available TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveyAnswers     		( id integer primary key autoincrement, orderno TEXT, opno TEXT, user TEXT, updateddate TEXT, surveyid TEXT, groupid TEXT, questionid TEXT, name TEXT, answer TEXT);'+
					 'CREATE TABLE IF NOT EXISTS Survey     			( id integer primary key autoincrement, surveyid TEXT, name TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveyGroup     		( id integer primary key autoincrement, surveyid TEXT, groupid TEXT, name TEXT, title TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveyQuestion    		( id integer primary key autoincrement, surveyid TEXT, groupid TEXT, questionid TEXT, questiontype TEXT, defaultvalue TEXT, name TEXT, title TEXT, dependsonid TEXT, dependsonval TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveySubQuestion  	( id integer primary key autoincrement, surveyid TEXT, groupid TEXT, questionid TEXT, subquestionid TEXT, subquestiontype TEXT, name TEXT, title TEXT, dependsonid TEXT, dependsonval TEXT);'+
					 'CREATE TABLE IF NOT EXISTS SurveyQuestionChildren ( id integer primary key autoincrement, surveyid TEXT, groupid TEXT, questionid TEXT, questionvalue TEXT, childquestions TEXT);'+
					 'CREATE TABLE IF NOT EXISTS FuncLocs			  	( id integer primary key autoincrement, flid TEXT, description TEXT, swerk TEXT, level TEXT, parentid TEXT, children TEXT);'+
					 'CREATE TABLE IF NOT EXISTS Equipments			  	( id integer primary key autoincrement, eqid TEXT, description TEXT, flid TEXT);'+
					 'CREATE TABLE IF NOT EXISTS MyMenuBar 		        ( id integer primary key autoincrement, scenario TEXT, level TEXT, item TEXT, position TEXT, type TEXT,  subitem TEXT, command TEXT, item2 TEXT);'+	
					 'CREATE TABLE IF NOT EXISTS MyJobDets 		        ( id integer primary key autoincrement, orderno TEXT, opno TEXT, notifno TEXT, eworkcentre TEXT, oworkcentre TEXT,priority_code TEXT,priority_desc TEXT, pmactivity_code TEXT,pmactivity_desc TEXT,oppmactivity_code TEXT,oppmactivity_desc TEXT,start_date TEXT, start_time TEXT,duration TEXT, equipment_code TEXT, equipment_desc TEXT, equipment_gis TEXT, funcloc_code TEXT,funcloc_desc TEXT,funcloc_gis TEXT, site TEXT, acpt_date TEXT, acpt_time TEXT, onsite_date TEXT, onsite_time TEXT,park_date TEXT, park_time TEXT, tconf_date TEXT, tconf_time TEXT, status TEXT, status_l TEXT, status_s TEXT, notif_cat_profile TEXT);'+	
					 'CREATE TABLE IF NOT EXISTS MyAjax		  	 		( id integer primary key autoincrement, adate TEXT,atime TEXT, astate TEXT, acall TEXT,aparams TEXT);'+	
					 'CREATE TABLE IF NOT EXISTS TSActivities		    ( id integer primary key autoincrement, code TEXT, skill TEXT,  subskill TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS TSNPJobs			    ( id integer primary key autoincrement, jobno TEXT, subtype TEXT,  description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS TSData		    		( id integer primary key autoincrement, date TEXT, job TEXT, skill TEXT, activity TEXT, time TEXT, ot15 TEXT, ot20 TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurveyQ			    ( id integer primary key autoincrement, type TEXT, qno TEXT,  qtype TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurveyA			    ( id integer primary key autoincrement, type TEXT, qno TEXT,  qkey TEXT, qvalue TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurveyMake		    ( id integer primary key autoincrement, make TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurveyModel		    ( id integer primary key autoincrement, make TEXT, model TEXT, description TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurvey			    ( id integer primary key autoincrement, orderno TEXT, opno TEXT, make TEXT, model TEXT, location TEXT, dv1 TEXT, dv2 TEXT, dv3 TEXT, dv4 TEXT, dv5 TEXT, dv6 TEXT, dv7 TEXT, dv8 TEXT, dv9 TEXT, dv10 TEXT, dv11 TEXT, dv12 TEXT, dv13 TEXT, dv14 TEXT, dv15 TEXT);'+
					 'CREATE TABLE IF NOT EXISTS GASSurveyHDR		    ( id integer primary key autoincrement, orderno TEXT, opno TEXT, date TEXT, signed TEXT, hv1 TEXT, hv2 TEXT, hv3 TEXT, hv4 TEXT, text1 TEXT, text2 TEXT, text3 TEXT);'+
					 'CREATE TABLE IF NOT EXISTS REFPAICODES			( id integer primary key autoincrement, scenario TEXT, userid TEXT, level TEXT, stsma TEXT, plant TEXT, work_cntr TEXT, catalogue TEXT, codegrp TEXT, kurztext_group TEXT, code TEXT, kurztext_code TEXT);'+
					 'CREATE TABLE IF NOT EXISTS REFNOTIFICATIONTYPES	( id integer primary key autoincrement, scenario TEXT, userid TEXT, level_number TEXT, notiftype TEXT, notifdesc TEXT, notifprofile TEXT, priotype TEXT,priority TEXT, prioritydesc TEXT);'+
					 'CREATE TABLE IF NOT EXISTS REFVARIANCESRFV		( id integer primary key autoincrement, scenario TEXT, userid TEXT, plant TEXT, work_cntr TEXT, job_activity TEXT, dev_reason TEXT, dev_reas_txt TEXT, mandate TEXT);'+
					 'CREATE TABLE IF NOT EXISTS REFACTIVITY			( id integer primary key autoincrement, scenario TEXT, work_center TEXT, activity TEXT, activity_desc TEXT, action TEXT, deflt TEXT);'+
					 'CREATE VIEW viewoperationstatus as SELECT orderno, opno, statusdesc FROM myuserstatus where type = "OV" GROUP BY orderno, opno Order by id desc ;'+

					 'CREATE VIEW viewprioritycodes as select myrefordertypes.scenario, myrefordertypes.type as ordertype, myrefordertypes.priorityprofile, myrefprioritytypes.priority as priority, myrefprioritytypes.description as prioritydesc from myrefordertypes left join myrefprioritytypes on myrefordertypes.priorityprofile = myrefprioritytypes.type where myrefordertypes.scenario = myrefprioritytypes.scenario;';
		html5sql.process(sqlstatement,
						 function(){
							
							emptyTables(type);
							
							
						 },
						 function(error, statement){
							 opMessage("Error: " + error.message + " when create processing " + statement);
							
							 
						 }        
				);


}
//*************************************************************************************************************************
//
//  Delete all Tables
//
//*************************************************************************************************************************
function dropTables() { 


		sqlstatement=	'DROP TABLE IF EXISTS MyOrders;'+
		'DROP TABLE IF EXISTS MyAjax;'+
						'DROP TABLE IF EXISTS MyOperations;'+
						'DROP TABLE IF EXISTS MyOperationsSplit;'+
						'DROP TABLE IF EXISTS MyPartners;'+
						'DROP TABLE IF EXISTS MyAssets;'+
						'DROP TABLE IF EXISTS AssetDetails;'+
						'DROP TABLE IF EXISTS MyMaterials;'+
						'DROP TABLE IF EXISTS MyUserStatus;'+
						'DROP TABLE IF EXISTS MyOperationInfo;'+
						'DROP TABLE IF EXISTS MyNotifications;'+
						'DROP TABLE IF EXISTS MyItems;'+
						'DROP TABLE IF EXISTS MyCauses;'+
						'DROP TABLE IF EXISTS MyActivities;'+
						'DROP TABLE IF EXISTS MyTasks;'+
						'DROP TABLE IF EXISTS MyEffects;'+
						'DROP TABLE IF EXISTS MyStatus;'+
						'DROP TABLE IF EXISTS MyTimeConfs;'+
						'DROP TABLE IF EXISTS MyJobClose;'+
						'DROP TABLE IF EXISTS MyNewJobs;'+
						'DROP TABLE IF EXISTS MyWorkConfig;'+
						'DROP TABLE IF EXISTS MyRefUsers;'+
						'DROP TABLE IF EXISTS MyRefOrderTypes;'+
						'DROP TABLE IF EXISTS MyRefNotifTypes;'+
						'DROP TABLE IF EXISTS MyRefPriorityTypes;'+
						'DROP TABLE IF EXISTS MyRefUserStatusProfiles;'+
						'DROP TABLE IF EXISTS MyWorkSyncDets;'+
						'DROP TABLE IF EXISTS MyUserDets;'+
						'DROP TABLE IF EXISTS MyVehicles;'+
						'DROP TABLE IF EXISTS MyVehiclesDefault;'+
						'DROP TABLE IF EXISTS MyVehicleCheck;'+
						'DROP TABLE IF EXISTS MyMessages;'+
						'DROP TABLE IF EXISTS Assets;'+
						'DROP TABLE IF EXISTS LogFile;'+
						'DROP TABLE IF EXISTS AssetClassVals;'+
						'DROP TABLE IF AssetInstalledEquip;'+
						'DROP TABLE IF AssetMeasurementPoints;'+
						'DROP TABLE IF EXISTS RefNotifprofile;'+
						'DROP TABLE IF EXISTS RefCodeGroups;'+
						'DROP TABLE IF EXISTS RefCodes;'+
						'DROP TABLE IF EXISTS HRAbsence;'+	
						'DROP TABLE IF EXISTS HRTravel;'+	
						'DROP TABLE IF EXISTS SurveyAnswers;'+	
						'DROP TABLE IF EXISTS Survey;'+	
						'DROP TABLE IF EXISTS SurveyGroup;'+
						'DROP TABLE IF EXISTS SurveyQuestion;'+
						'DROP TABLE IF EXISTS SurveySubQuestion;'+
						'DROP TABLE IF EXISTS SurveyQuestionChildren;'+
						'DROP TABLE IF EXISTS FuncLocs;'+
						'DROP TABLE IF EXISTS Equipments;'+
						'DROP TABLE IF EXISTS TSActivities;'+	
						'DROP TABLE IF EXISTS TSNPJobs;'+
						'DROP TABLE IF EXISTS TSData;'+
						'DROP TABLE IF EXISTS JobAnswers;'+							
						'DROP TABLE IF EXISTS GASSurveyQ;'+	
						'DROP TABLE IF EXISTS GASSurveyA;'+
						'DROP TABLE IF EXISTS GASSurveyMake;'+
						'DROP TABLE IF EXISTS GASSurveyModel;'+
						'DROP TABLE IF EXISTS GASSurvey;'+
						'DROP TABLE IF EXISTS GASSurveyHDR;'+
						'DROP TABLE IF EXISTS StockSearch;'+
						'DROP TABLE IF EXISTS MyMenuBar;'+
						'DROP TABLE IF EXISTS MyJobDets;'+
										'DROP TABLE IF EXISTS  REFPAICODES;'+
					'DROP TABLE IF EXISTS REFNOTIFICATIONTYPES;'+
					'DROP TABLE IF EXISTS  REFVARIANCESRFV;'+
					'DROP TABLE IF EXISTS  REFACTIVITY;'+
					'DROP TABLE IF EXISTS  MyForms;'+
					'DROP TABLE IF EXISTS  MyFormsResponses;'+
						'DROP VIEW IF EXISTS viewoperationstatus;'+
						'DROP TABLE IF EXISTS viewprioritycodes;';

						html5sql.process(sqlstatement,
						 function(){
							 //alert("Success dropping Tables");
						 },
						 function(error, statement){
							
						 }        
				);
}
function emptyTables(type) { 
	
		sqlstatement=	'DELETE FROM  MyOrders;'+
						'DELETE FROM  MyAjax;'+
						'DELETE FROM  MyOperations;'+
						'DELETE FROM  MyOperationsSplit;'+
						'DELETE FROM  MyPartners;'+
						'DELETE FROM  MyMaterials;'+
						'DELETE FROM  MyAssets;'+
						'DELETE FROM  AssetDetails;'+
						'DELETE FROM  MyUserStatus;'+
						'DELETE FROM  MyOperationInfo;'+
						'DELETE FROM  MyNotifications;'+
						'DELETE FROM  MyItems;'+
						'DELETE FROM  MyCauses;'+
						'DELETE FROM  MyActivities;'+
						'DELETE FROM  MyTasks;'+
						'DELETE FROM  MyEffects;'+
						'DELETE FROM  MyStatus;'+
						'DELETE FROM  MyTimeConfs;'+
						'DELETE FROM  MyJobClose;'+
						'DELETE FROM  MyNewJobs;'+
						'DELETE FROM  MyWorkConfig;'+
						'DELETE FROM  MyRefUsers;'+
						'DELETE FROM  MyRefOrderTypes;'+
						'DELETE FROM  MyRefNotifTypes;'+
						'DELETE FROM  MyRefPriorityTypes;'+
						'DELETE FROM  MyRefUserStatusProfiles;'+
						'DELETE FROM  MyWorkSyncDets;'+
						'DELETE FROM  MyUserDets;'+
						'DELETE FROM  MyVehicles;'+
						'DELETE FROM  MyVehiclesDefault;'+
						'DELETE FROM  MyVehicleCheck;'+
						'DELETE FROM  MyMessages;'+
						'DELETE FROM  Assets;'+
						'DELETE FROM  LogFile;'+
						'DELETE FROM  AssetClassVals;'+
						'DELETE FROM  AssetInstalledEquip;'+
						'DELETE FROM  AssetMeasurementPoints;'+
						'DELETE FROM  RefNotifprofile;'+
						'DELETE FROM  RefCodeGroups;'+
						'DELETE FROM  RefCodes;'+ 
						'DELETE FROM  HRAbsence;'+	
						'DELETE FROM  HRTravel;'+	
						'DELETE FROM  SurveyAnswers;'+	
						'DELETE FROM  Survey;'+	
						'DELETE FROM  SurveyGroup;'+
						'DELETE FROM  SurveyQuestion;'+
						'DELETE FROM  SurveySubQuestion;'+
						'DELETE FROM  SurveyQuestionChildren;'+
						'DELETE FROM  FuncLocs;'+
						'DELETE FROM  Equipments;'+
						'DELETE FROM  TSActivities;'+	
						'DELETE FROM  TSNPJobs;'+
						'DELETE FROM  TSData;'+
						'DELETE FROM  JobAnswers;'+	
						'DELETE FROM  GASSurveyQ;'+	
						'DELETE FROM  GASSurveyA;'+
						'DELETE FROM  GASSurveyMake;'+
						'DELETE FROM  GASSurveyModel;'+
						'DELETE FROM  GASSurvey;'+
						'DELETE FROM  StockSearch;'+
						'DELETE FROM MyMenuBar;'+
						'DELETE FROM MyJobDets;'+
										'DELETE FROM  REFPAICODES;'+
					'DELETE FROM  REFNOTIFICATIONTYPES;'+
					'DELETE FROM  REFVARIANCESRFV;'+
					'DELETE FROM  REFACTIVITY;'+
					'DELETE FROM  MyForms;'+
					'DELETE FROM  MyFormsResponses;'+
						'DELETE FROM  GASSurveyHDR;';
						
						

						html5sql.process(sqlstatement,
						 function(){
							demoDataLoaded=type;
							
							SetConfigParam("TRACE", "OFF");
							SetConfigParam("SYNC_REFERENCE_FREQUENCY", "8400000");
							SetConfigParam("SYNC_TRANSACTIONAL_FREQUENCY", "600000");
							SetConfigParam("SYNC_UPLOAD_FREQUENCY", "300");
							SetConfigParam("LASTSYNC_REFERENCE", "20130316170000");
							SetConfigParam("LASTSYNC_TRANSACTIONAL", "20130316224900");
							SetConfigParam("LASTSYNC_UPLOAD", "20130316214900");
							SetConfigParam("SERVERNAME", "http://awssvstol411.globalinfra.net:8000/sap/bc/bsp/sap/zbsp_myjobsall/");
							SetConfigParam("SAPCLIENT", "120");
							SetConfigParam("SAPSYSTEM", "AW2MYJOBS");
							
							busycreateDB.close()
							formLogin.open()
							
						
							
 
						 },
						 function(error, statement){
							
							 opMessage("Error: " + error.message + " when delete processing " + statement);
						 }        
				);
}
function loadDemoData() { 
	 var path = window.location.pathname;
     var page = path.split("/").pop();
     
	localStorage.setItem("LastSyncedDT",getDate()+getTime())
	sqlstatement=	'DELETE FROM  MyOrders;'+
					'DELETE FROM  MyAjax;'+
					'DELETE FROM  MyOperations;'+
					'DELETE FROM  MyOperationsSplit;'+
					'DELETE FROM  MyPartners;'+
					'DELETE FROM  MyMaterials;'+
					'DELETE FROM  MyAssets;'+
					'DELETE FROM  AssetDetails;'+
					'DELETE FROM  MyUserStatus;'+
					'DELETE FROM  MyOperationInfo;'+
					'DELETE FROM  MyNotifications;'+
					'DELETE FROM  MyItems;'+
					'DELETE FROM  MyCauses;'+
					'DELETE FROM  MyActivities;'+
					'DELETE FROM  MyTasks;'+
					'DELETE FROM  MyEffects;'+
					'DELETE FROM  MyStatus;'+
					'DELETE FROM  MyTimeConfs;'+
					'DELETE FROM  MyJobClose;'+
					'DELETE FROM  MyNewJobs;'+
					'DELETE FROM  MyWorkConfig;'+
					'DELETE FROM  MyRefUsers;'+
					'DELETE FROM  MyRefOrderTypes;'+
					'DELETE FROM  MyRefNotifTypes;'+
					'DELETE FROM  MyRefPriorityTypes;'+
					'DELETE FROM  MyRefUserStatusProfiles;'+
					'DELETE FROM  MyWorkSyncDets;'+
					//'DELETE FROM  MyUserDets;'+
					'DELETE FROM  MyVehicles;'+
					'DELETE FROM  MyVehiclesDefault;'+
					'DELETE FROM  MyVehicleCheck;'+
					'DELETE FROM  MyMessages;'+
					'DELETE FROM  Assets;'+
					'DELETE FROM  LogFile;'+
					'DELETE FROM  AssetClassVals;'+
					'DELETE FROM  AssetInstalledEquip;'+
					'DELETE FROM  AssetMeasurementPoints;'+
					'DELETE FROM  RefNotifprofile;'+
					'DELETE FROM  RefCodeGroups;'+
					'DELETE FROM  RefCodes;'+ 
					'DELETE FROM  HRAbsence;'+	
					'DELETE FROM  HRTravel;'+	
					'DELETE FROM  SurveyAnswers;'+	
					'DELETE FROM  Survey;'+	
					'DELETE FROM  SurveyGroup;'+
					'DELETE FROM  SurveyQuestion;'+
					'DELETE FROM  SurveySubQuestion;'+
					'DELETE FROM  SurveyQuestionChildren;'+
					'DELETE FROM  FuncLocs;'+
					'DELETE FROM  Equipments;'+
					'DELETE FROM  TSActivities;'+	
					'DELETE FROM  TSNPJobs;'+
					'DELETE FROM  TSData;'+
					'DELETE FROM  JobAnswers;'+	
					'DELETE FROM  GASSurveyQ;'+	
					'DELETE FROM  GASSurveyA;'+
					'DELETE FROM  GASSurveyMake;'+
					'DELETE FROM  GASSurveyModel;'+
					'DELETE FROM  GASSurvey;'+
					'DELETE FROM  StockSearch;'+
					'DELETE FROM MyMenuBar;'+
					'DELETE FROM MyJobDets;'+
									'DELETE FROM  REFPAICODES;'+
				'DELETE FROM  REFNOTIFICATIONTYPES;'+
				'DELETE FROM  REFVARIANCESRFV;'+
				'DELETE FROM  REFACTIVITY;'+
				'DELETE FROM  MyForms;'+
				'DELETE FROM  MyFormsResponses;'+
					'DELETE FROM  GASSurveyHDR;';
					
					

					html5sql.process(sqlstatement,
					 function(){
						
						
						SetConfigParam("TRACE", "ON");
						SetConfigParam("SYNC_REFERENCE_FREQUENCY", "8400000");
						SetConfigParam("SYNC_TRANSACTIONAL_FREQUENCY", "600000");
						SetConfigParam("SYNC_UPLOAD_FREQUENCY", "300");
						SetConfigParam("LASTSYNC_REFERENCE", "20180316170000");
						SetConfigParam("LASTSYNC_TRANSACTIONAL", "20180316224900");
						SetConfigParam("LASTSYNC_UPLOAD", "20180316214900");
						SetConfigParam("SERVERNAME", "xhttp://awssvstol411.globalinfra.net:8000/sap/bc/bsp/sap/zbsp_myjobs/");
						SetConfigParam("SAPCLIENT", "120");
						//loadAssetXML("TestData\\T2_MPLT_ESVN.XML")
						//loadAssetXML("TestData\\T2_MPLT_LSVM.XML")
						//loadAssetXML("TestData\\T2_MPLT_LSVS.XML")
						//loadAssetXML("TestData\\T2_MPLT_NSVE.XML")
						//loadAssetXML("TestData\\T2_MPLT_NSVM.XML")
						//loadAssetXML("TestData\\T2_MPLT_NSVW.XML")
						//loadAssetXML("TestData\\T2_MPLT_RSVM.XML")
						//loadAssetXML("TestData\\T2_MPLT_RSVN.XML")
						
						requestDEMOData('MyJobsOrders.json');
					
						requestDEMOData('MyJobsNotifications.json');
					
						requestDEMOData('MyJobsUsers.json');
						
						requestDEMOData('MyJobsOrdersObjects.json');	
						
						requestDEMOData('MyJobsRefData.json');
						
						requestDEMOData('MyJobsRefDataCodes.json');
						
						//requestDEMOData('funclocs.json');
						requestDEMOData('MyForms.json');
						requestDEMOData('MyJobsVehicles.json');
						requestDEMOData('MyJobsVehiclesDefault.json');
						
					
						//requestDEMOData('GASSurvey.json');
					
						//requestDEMOData('GASSurveyHdr.json');
						//requestDEMOData('MyMessagesData.json');
						//
						//requestDEMOData('TimeSheetNPJobs.json');
						
						//requestDEMOData('TimeSheetActivities.json');
						//requestDEMOData('MySurveys.json');
					
					
						
					
						

					 },
					 function(error, statement){
						 
						 opMessage("Error: " + error.message + " when delete processing " + statement);
					 }        
			);
}
function resetTables() { 
	var sqlstatement="";

	sqlstatement=	'DELETE FROM  MyOrders;'+
					'DELETE FROM  MyAjax;'+
					'DELETE FROM  MyOperations;'+
					'DELETE FROM  MyOperationsSplit;'+
					'DELETE FROM  MyJobDets;'+
					'DELETE FROM  MyPartners;'+
					'DELETE FROM  MyMaterials;'+
					'DELETE FROM  MyAssets;'+
					'DELETE FROM  AssetDetails;'+
					'DELETE FROM  MyUserStatus;'+
					'DELETE FROM  MyOperationInfo;'+
					'DELETE FROM  MyNotifications;'+
					'DELETE FROM  MyItems;'+
					'DELETE FROM  MyCauses;'+
					'DELETE FROM  MyActivities;'+
					'DELETE FROM  MyTasks;'+
					'DELETE FROM  MyEffects;'+
					'DELETE FROM  MyStatus;'+
					'DELETE FROM  MyTimeConfs;'+
					'DELETE FROM  MyJobClose;'+
					'DELETE FROM  MyNewJobs;'+
					'DELETE FROM  MyRefUsers;'+
					'DELETE FROM  MyRefOrderTypes;'+
					'DELETE FROM  MyRefNotifTypes;'+
					'DELETE FROM  MyRefPriorityTypes;'+
					'DELETE FROM  MyRefUserStatusProfiles;'+
					'DELETE FROM  MyWorkSyncDets;'+
					'DELETE FROM  MyVehicles;'+
					'DELETE FROM  MyVehiclesDefault;'+
					'DELETE FROM  MyVehicleCheck;'+
					'DELETE FROM  MyMessages;'+
					'DELETE FROM  Assets;'+
					'DELETE FROM  LogFile;'+
					'DELETE FROM  AssetClassVals;'+
					'DELETE FROM  AssetInstalledEquip;'+
					'DELETE FROM  AssetMeasurementPoints;'+
					'DELETE FROM  RefNotifprofile;'+
					'DELETE FROM  RefCodeGroups;'+
					'DELETE FROM  RefCodes;'+  
					'DELETE FROM  HRAbsence;'+
					'DELETE FROM  HRTravel;'+	
					'DELETE FROM  SurveyAnswers;'+	
					'DELETE FROM  Survey;'+	
					'DELETE FROM  SurveyGroup;'+
					'DELETE FROM  SurveyQuestion;'+
					'DELETE FROM  SurveySubQuestion;'+
					'DELETE FROM  SurveyQuestionChildren;'+
					'DELETE FROM  FuncLocs;'+
					'DELETE FROM  Equipments;'+
					'DELETE FROM  TSActivities;'+	
					'DELETE FROM  TSNPJobs;'+
					'DELETE FROM  TSData;'+
					'DELETE FROM  JobAnswers;'+	
					'DELETE FROM  GASSurveyQ;'+	
					'DELETE FROM  GASSurveyA;'+
					'DELETE FROM  GASSurveyMake;'+
					'DELETE FROM  GASSurveyModel;'+
					'DELETE FROM  GASSurvey;'+
					'DELETE FROM  StockSearch;'+
					'DELETE FROM  REFPAICODES;'+
					'DELETE FROM  REFNOTIFICATIONTYPES;'+
					'DELETE FROM  REFVARIANCESRFV;'+
					'DELETE FROM  REFACTIVITY;'+
					'DELETE FROM  MyForms;'+
					'DELETE FROM  MyFormsResponses;'+
					'DELETE FROM  GASSurveyHDR;';
					
					

					html5sql.process(sqlstatement,
					 function(){
						
						var x = window.location.href.split("/")
						if(x[x.length-1]=="Home.html"){
							
							setCounts()
						}
						requestDEMOData('MySurveys.json');
						SetConfigParam('LASTSYNC_REFERENCE', "20120101010101");
						SetConfigParam('LASTSYNC_TRANSACTIONAL', "20120101010101");

						


					 },
					 function(error, statement){
					
						 opMessage("Error: " + error.message + " when delete processing " + statement);
					 }        
			);
}
function DeleteLog() { 
		html5sql.process("DELETE FROM LogFile",
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 opMessage("Error: " + error.message + " when processing " + statement);
						 }        
				);

}
function createDB(type){

		createTables(type);

		


}	


function requestDEMOData(page){
		
		opMessage("DEMOLoad "+page);
		
		$.getJSON("TestData/"+page,function(data,status){ 	
			
			if(page=='MyJobsOrders.json'){
				
				orderCB(data);
				
			}
			if(page=='MyJobsNotifications.json'){
				
				notificationCB(data);
			
			}
			if(page=='MyJobsUsers.json'){
				userCB(data);
				
			}
			if(page=='MyForms.json'){
				formCB(data);
				
			}
			if(page=='MyJobsOrdersObjects.json'){
				orderobjectsCB(data);
				
			}
			if(page=='MyJobsRefData.json'){
				refdataCB(data);
				
			}
			if(page=='MyJobsRefJobsDataCodes.json'){
				refdatacodesCB(data);
				
			}		
			if(page=='MyJobsVehicles.json'){
				vehicleCB(data);
				
			}
			if(page=='MyJobsVehiclesDefault.json'){
				vehicleDefaultCB(data);
				
			}
			if(page=='MyMessagesData.json'){
				messageCB(data);
				
			}	
			if(page=='GASSurvey.json'){
				refgasCB(data);
				
			}
			if(page=='GASSurveyHdr.json'){
				refgashdrCB(data);
				
			}
			if(page=='funclocs.json'){
				refflocsCB(data);
				
			}
			if(page=='TimeSheetNPJobs.json'){
				tsnpjobsCB(data);
			
			}
			if(page=='TimeSheetActivities.json'){
				tsactivitiesCB(data);

			}
			if(page=='MySurveys.json'){
				
				surveysCB(data);

			}
  })
  .fail(function(data,status) {
    //alert( "error:"+status+":"+data );
  })

}
function orderCB(MyOrders){

var sqlDelete="";
var sqlstatement="";
var sqlstatements=[];
var ordernos=[];
var changeddatetime=[];
var orderlist="";
		opMessage("Doing Orders");
		
		console.log(MyOrders.order.length+"Orders")
		
		if(MyOrders.order.length>0){
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Orders:'+String(MyOrders.order.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Orders:'+String(MyOrders.order.length));
			}
			opMessage("Deleting Existing Orders");
			sqlDelete = 	'DELETE FROM MyOrders;'+
							'DELETE FROM MyOperations;'+
							'DELETE FROM MyJobDets;'+
							'DELETE FROM MyOperationsSplit;'+
							'DELETE FROM MyPartners;'+
							'DELETE FROM MyMaterials;'+
							'DELETE FROM MyAssets;'+
		
							'DELETE FROM MyTimeConfs;'+
							
							'DELETE FROM MyUserStatus;'+
							'DELETE FROM MyOperationInfo;'+
							'DELETE FROM MyStatus where state="SERVER";';
			
/*			html5sql.process(sqlDelete,
						 function(){
							 //alert("Success del Tables");
						 },
						 function(error, statement){
							 opMessage("Error: " + error.message + " when processing " + statement);
						 }        
				);*/
			opMessage("Loading "+MyOrders.order.length+" Orders");
		
	
			for(var cntx=0; cntx < MyOrders.order.length ; cntx++)
				{
				if(cntx>0){
					orderlist+=","	
					}
				orderlist+="'"+MyOrders.order[cntx].orderno+"'"
				ordernos.push(MyOrders.order[cntx].orderno)
				changeddatetime.push(MyOrders.order[cntx].changed_date+MyOrders.order[cntx].changed_time)
				stext=unescape(MyOrders.order[cntx].shorttext).replace(/'/g, "");;
				stext=stext.replace("\/", "");;
				stext=stext.replace(/&/g, "");;
				ltext=unescape(MyOrders.order[cntx].longtext).replace(/'/g, "");;
				ltext=stext.replace("\/", "");;
				ltext=stext.replace(/&/g, "");;
				sqlstatement='INSERT INTO MyOrders (orderno , changedby, changeddatetime, shorttext , longtext , startdate ,  enddate ,contact , telno , type , priority , address ,workaddress, house, houseno, street, district, city, postcode, gis,  property, funcloc, equipment, propertygis, funclocgis, equipmentgis, notifno) VALUES ('+
					 '"'+MyOrders.order[cntx].orderno+ '","'+ MyOrders.order[cntx].changed_by+ '","'+ MyOrders.order[cntx].changed_date+MyOrders.order[cntx].changed_time+ '","'+ stext + '","'+ ltext + '","'+ MyOrders.order[cntx].startdate + '","'+ MyOrders.order[cntx].enddate + '","'+MyOrders.order[cntx].contact+'",'+ 
					 '"'+MyOrders.order[cntx].telno + '","'+MyOrders.order[cntx].type + '","'+MyOrders.order[cntx].priority + '","'+MyOrders.order[cntx].address + '","'+MyOrders.order[cntx].workaddress+ '","'+MyOrders.order[cntx].house+'",'+ 
					 '"'+MyOrders.order[cntx].houseno+ '","'+MyOrders.order[cntx].street+ '","'+MyOrders.order[cntx].district+ '","'+MyOrders.order[cntx].city+ '","'+MyOrders.order[cntx].postcode+ '","'+MyOrders.order[cntx].gis+'",'+ 
					 '"'+MyOrders.order[cntx].property+  '","'+MyOrders.order[cntx].funcloc+  '","'+MyOrders.order[cntx].equipment+'",'+ 
					 '"'+MyOrders.order[cntx].propertygis+  '","'+MyOrders.order[cntx].funclocgis+  '","'+MyOrders.order[cntx].equipmentgis+ '","'+MyOrders.order[cntx].notifno+'");';
				//Loop and write operations to DB
				
	 			//opMessage("Loading "+MyOrders.order[cntx].operation.length+" Operations");

				for(var opscnt=0; opscnt < MyOrders.order[cntx].operation.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO MyOperations (orderno , opno, type , priority , shorttext , startdate, enddate, duration , status, apptstart, apptend) VALUES ('+
						 '"'+MyOrders.order[cntx].orderno+  '","'+ MyOrders.order[cntx].operation[opscnt].opno+  '","'+ MyOrders.order[cntx].operation[opscnt].type+  '","'+MyOrders.order[cntx].operation[opscnt].priority+  '",'+
						 '"'+MyOrders.order[cntx].operation[opscnt].shorttext+  '","'+ MyOrders.order[cntx].operation[opscnt].startdate+  '","'+ MyOrders.order[cntx].operation[opscnt].enddate+  '","'+  MyOrders.order[cntx].operation[opscnt].duration+  '",'+
						 '"'+MyOrders.order[cntx].operation[opscnt].status+  '","'+ MyOrders.order[cntx].operation[opscnt].apptstart+  '","'+ MyOrders.order[cntx].operation[opscnt].apptend+'");';
				
					}
				
	 			//opMessage("Loading "+MyOrders.order[cntx].opsplit.length+" Operations Split");
				

				for(var opscnt=0; opscnt < MyOrders.order[cntx].operationsplit.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO MyOperationsSplit (orderno , opno, assignedto, duration) VALUES ('+
						 '"'+MyOrders.order[cntx].orderno+  '","'+ MyOrders.order[cntx].operationsplit[opscnt].opno+  '","'+ MyOrders.order[cntx].operationsplit[opscnt].assignedto+  '","'+ MyOrders.order[cntx].operationsplit[opscnt].duration+'");';
				
					}
				//opMessage("Loading "+MyOrders.order[cntx].partner.length+" Partners");
			
				//Loop and write partners to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].partner.length ; pcnt++)
					{	
					sqlstatement+='INSERT INTO MyPartners (orderno , id, type , name , address , postcode , telno, notifno) VALUES ('+ 
						'"'+MyOrders.order[cntx].orderno+  '","'+ MyOrders.order[cntx].partner[pcnt].id+  '","'+  MyOrders.order[cntx].partner[pcnt].type+  '","'+ MyOrders.order[cntx].partner[pcnt].name+  '",'+
						'"'+MyOrders.order[cntx].partner[pcnt].address+  '","'+  MyOrders.order[cntx].partner[pcnt].postcode+  '","'+ MyOrders.order[cntx].partner[pcnt].telno+  '","'+ ""+'");';
				}

			//Loop and write components to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].component.length ; pcnt++)
					{	

					sqlstatement+='INSERT INTO Mymaterials (orderno , id, material , description , qty) VALUES ('+ 
						'"'+MyOrders.order[cntx].orderno+  '","'+ MyOrders.order[cntx].component[pcnt].item+  '","'+  MyOrders.order[cntx].component[pcnt].material+  '","'+
						MyOrders.order[cntx].component[pcnt].description+  '","'+ MyOrders.order[cntx].component[pcnt].quantity+  '");';
				}				
				
				
				//opMessage("Loading "+MyOrders.order[cntx].userstatus.length+" UserStatus");
				//Loop and write userstatus to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].userstatus.length ; pcnt++)
					{	
					sqlstatement+='INSERT INTO MyUserStatus (type , orderno, opno , inact , status , statuscode , statusdesc) VALUES ('+
						'"'+MyOrders.order[cntx].userstatus[pcnt].type+  '","'+  MyOrders.order[cntx].userstatus[pcnt].orderno+  '","'+ MyOrders.order[cntx].userstatus[pcnt].opno+  '",'+
						'"'+MyOrders.order[cntx].userstatus[pcnt].inact+  '","'+  MyOrders.order[cntx].userstatus[pcnt].status+  '","'+  MyOrders.order[cntx].userstatus[pcnt].statuscode+  '",'+
						'"'+MyOrders.order[cntx].userstatus[pcnt].statusdesc+'");';
				}

				//opMessage("Loading "+MyOrders.order[cntx].operationinfo.length+" OperationInfo");
				//Loop and write userstatus to DB
				for(var pcnt=0; pcnt < MyOrders.order[cntx].operationinfo.length ; pcnt++)
					{	
					sqlstatement+='INSERT INTO MyOperationInfo (orderno, opno , type , value1 , value2) VALUES ('+
						'"'+MyOrders.order[cntx].operationinfo[pcnt].orderno+  '","'+  MyOrders.order[cntx].operationinfo[pcnt].opno+  '","'+  MyOrders.order[cntx].operationinfo[pcnt].type+  '",'+ 
						'"'+MyOrders.order[cntx].operationinfo[pcnt].icon_filename+  '","'+  MyOrders.order[cntx].operationinfo[pcnt].value2+'");';
				}
				
				//Loop and write priorityicons
				for(var pcnt=0; pcnt < MyOrders.order[cntx].jobicons.length ; pcnt++)
					{
					if (MyOrders.order[cntx].orderno==	MyOrders.order[cntx].jobicons[pcnt].orderno){					
					   sqlstatement+='INSERT INTO MyOperationInfo (orderno, opno , type , value1 , value2) VALUES ('+
						'"'+MyOrders.order[cntx].jobicons[pcnt].orderno+  '","'+  MyOrders.order[cntx].jobicons[pcnt].opno+  '","'+  "JOBICON"+  '",'+ 
						'"'+MyOrders.order[cntx].jobicons[pcnt].icon_filename+  '","'+  MyOrders.order[cntx].jobicons[pcnt].tooltip_desc+'");';
						
					}
				}
				//Loop and write Jobicons
				for(var pcnt=0; pcnt < MyOrders.order[cntx].priorityicons.length ; pcnt++)
					{
					if (MyOrders.order[cntx].orderno==	MyOrders.order[cntx].priorityicons[pcnt].orderno){					
					   sqlstatement+='INSERT INTO MyOperationInfo (orderno, opno , type , value1 , value2) VALUES ('+
						'"'+MyOrders.order[cntx].priorityicons[pcnt].orderno+  '","'+  MyOrders.order[cntx].priorityicons[pcnt].opno+  '","'+  "PRIORITYICON"+  '",'+ 
						'"'+MyOrders.order[cntx].priorityicons[pcnt].icon_filename+  '","'+  MyOrders.order[cntx].priorityicons[pcnt].tooltip_desc+'");';
					
					}
				}				
				//Loop and write JobDets
				for(var pcnt=0; pcnt < MyOrders.order[cntx].jobdets.length ; pcnt++)
					{
						if(MyOrders.order[cntx].jobdets[pcnt].orderno.length>1){				
							sqlstatement+='INSERT INTO MyJobDets (orderno, opno, notifno, eworkcentre, oworkcentre, priority_code, priority_desc, pmactivity_code, pmactivity_desc,oppmactivity_code, oppmactivity_desc, start_date, start_time, duration, equipment_code, equipment_desc, equipment_gis, funcloc_code, funcloc_desc, funcloc_gis, acpt_date, acpt_time, onsite_date, onsite_time, park_date, park_time, status, status_l, status_s, notif_cat_profile, site) VALUES ('+
							'"'+MyOrders.order[cntx].jobdets[pcnt].orderno+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].opno+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].notifno+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].eworkcentre+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].oworkcentre+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].priority_code+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].priority_desc+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].pmactivity_code+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].pmactivity_desc+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].oppmactivity_code+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].oppmactivity_desc+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].start_date+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].start_time+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].duration+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].equipment_code+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].equipment_desc+'","'+
							MyOrders.order[cntx].jobdets[pcnt].equipment_gis+'","'+
							MyOrders.order[cntx].jobdets[pcnt].funcloc_code+'","'+ 
							MyOrders.order[cntx].jobdets[pcnt].funcloc_desc+'","'+
							MyOrders.order[cntx].jobdets[pcnt].funcloc_gis+'","'+
							MyOrders.order[cntx].jobdets[pcnt].acpt_date+'","'+
							MyOrders.order[cntx].jobdets[pcnt].acpt_time+'","'+
							MyOrders.order[cntx].jobdets[pcnt].onsite_date+'","'+
							MyOrders.order[cntx].jobdets[pcnt].onsite_time+'","'+
							MyOrders.order[cntx].jobdets[pcnt].park_date+'","'+
							MyOrders.order[cntx].jobdets[pcnt].park_time+'","'+
							MyOrders.order[cntx].jobdets[pcnt].status+'","'+
							MyOrders.order[cntx].jobdets[pcnt].status_l+'","'+
							MyOrders.order[cntx].jobdets[pcnt].status_s+'","'+
							MyOrders.order[cntx].jobdets[pcnt].notif_cat_prof+'","'+
							MyOrders.order[cntx].jobdets[pcnt].site+'");';
						  
						   
						}
					
				}				
				
				//Loop and write Assets to DB
				
	  
				//opMessage("Loading "+MyOrders.order[cntx].asset.length+" Assets");
				for(var acnt=0; acnt < MyOrders.order[cntx].asset.length ; acnt++)
					{
					if (MyOrders.order[cntx].asset[acnt].equipment.length>0){
						sqlstatement+='INSERT INTO MyAssets (orderno , id, type , name ) VALUES ('+
							'"'+MyOrders.order[cntx].orderno+  '","'+   MyOrders.order[cntx].asset[acnt].equipment+  '","'+   'EQ'+  '","'+   MyOrders.order[cntx].asset[acnt].equidescr+'");';
						}
						if (MyOrders.order[cntx].asset[acnt].funcloc.length>0){
						sqlstatement+='INSERT INTO MyAssets (orderno , id, type , name ) VALUES ('+ 
							'"'+MyOrders.order[cntx].orderno+  '","'+   MyOrders.order[cntx].asset[acnt].funcloc+  '","'+  'FL'+  '","'+   MyOrders.order[cntx].asset[acnt].funclocdesc+'");';
						}
				}
				//Loop and write TConfs to DB
				
	  
				//opMessage("Loading "+MyOrders.order[cntx].tconf.length+" TimeConfs");
			
				for(var acnt=0; acnt < MyOrders.order[cntx].tconf.length ; acnt++)
					{	
					if(MyOrders.order[cntx].tconf[acnt].description=="Travel"){
						tcType = "Travel";
						tcDesc="";
					}else{
						tcType = "Work";
						tcDesc=MyOrders.order[cntx].tconf[acnt].description;
					}
					if(MyOrders.order[cntx].tconf[acnt].final==""){
						tcFinal="";
					}else{
						tcFinal="Yes";
					}
					sqlstatement+='INSERT INTO MyTimeConfs (orderno , opno,type, confno , description , date , time , enddate, endtime, duration, empid, final,datestamp, user, state ) VALUES ('+
						'"'+MyOrders.order[cntx].orderno+  '","'+   MyOrders.order[cntx].tconf[acnt].activity+  '","'+   tcType+  '","'+   MyOrders.order[cntx].tconf[acnt].confno+  '","'+  tcDesc+  '","'+  MyOrders.order[cntx].tconf[acnt].date+  '","'+  MyOrders.order[cntx].tconf[acnt].time+  '",'+ 
						'"'+MyOrders.order[cntx].tconf[acnt].enddate+  '","'+  MyOrders.order[cntx].tconf[acnt].endtime+  '","'+  MyOrders.order[cntx].tconf[acnt].duration+  '","'+  MyOrders.order[cntx].tconf[acnt].empid+  '","'+  tcFinal+  '","","","");';
	

					}
				
					sqlstatements.push(sqlstatement);
				
				
				sqlstatement=""

				
				
				

			
			}
			for(var cntx=0; cntx < ordernos.length ; cntx++)
			{
				
				InsertOrder(sqlstatements[cntx],ordernos[cntx],changeddatetime[cntx])
			}
			sqldeleteorders="delete from MyOrders WHERE orderno NOT IN ("+orderlist+");"
			sqldeleteorders+="DELETE FROM MyOperations WHERE orderno NOT IN ("+orderlist+");"
			sqldeleteorders+="DELETE FROM MyOperationsSplit WHERE orderno NOT IN ("+orderlist+");"
			sqldeleteorders+="DELETE FROM MyJobDets WHERE orderno NOT IN ("+orderlist+");"
			sqldeleteorders+="DELETE FROM MyPartners  WHERE orderno NOT IN ("+orderlist+");"
			sqldeleteorders+="DELETE FROM MyMaterials  WHERE orderno NOT IN ("+orderlist+");"
			sqldeleteorders+="DELETE FROM MyAssets  WHERE orderno NOT IN ("+orderlist+");"
			sqldeleteorders+="DELETE FROM MyTimeConfs WHERE orderno NOT IN ("+orderlist+");"
			sqldeleteorders+="DELETE FROM MyUserStatus WHERE orderno NOT IN ("+orderlist+");"
			sqldeleteorders+="DELETE FROM MyOperationInfo WHERE orderno NOT IN ("+orderlist+");"
			sqldeleteorders+="DELETE FROM MyStatus where state='SERVER' and orderno NOT IN ("+orderlist+");"
			
			html5sql.process(sqldeleteorders,
					 function(transaction, results, rowsArray){
				 var path = window.location.pathname;
			     var page = path.split("/").pop();
			     if(page=="Jobs.html"){
						console.log("about to refreshList")
						refreshJobList()
					}else if(page=="Home.html"){
						setCounts()
					}
					 },
					 function(error, statement){
					
					 }        
					);


	
		}

}
function InsertOrder(sqlstatement,orderno,changeddatetime){
	var sqlstatement1=""
console.log(orderno)

	html5sql.process("select * from MyOrders where orderno = '"+orderno+"'",
			 function(transaction, results, rowsArray){

					if ((rowsArray.length<1)||(rowsArray[0].changeddatetime<changeddatetime)){
						if(rowsArray.length<1){
							console.log("Inserting New Order details "+orderno)
							opMessage("Inserting New Order details "+orderno);
							sqlstatement1 = '';
						}else{
							//alert("DB="+rowsArray[0].changeddatetime+"SAP="+changeddatetime)
							opMessage("Deleting Existing Order details "+orderno);
							sqlstatement1 = 	'DELETE FROM MyOrders where orderno = "'+orderno+'";'+
											'DELETE FROM MyOperations where orderno = "'+orderno+'";'+
											'DELETE FROM MyOperationsSplit where orderno = "'+orderno+'";'+
											'DELETE FROM MyJobDets where orderno = "'+orderno+'";'+
											'DELETE FROM MyPartners where orderno = "'+orderno+'";'+
											'DELETE FROM MyMaterials where orderno = "'+orderno+'";'+
											'DELETE FROM MyAssets where orderno = "'+orderno+'";'+
						
											'DELETE FROM MyTimeConfs where orderno = "'+orderno+'";'+
											'DELETE FROM MyUserStatus where orderno = "'+orderno+'";'+
											'DELETE FROM MyOperationInfo where orderno = "'+orderno+'";'+
											'DELETE FROM MyStatus where state="SERVER" and orderno = "'+orderno+'";'
						}
						console.log("about to Insert");
						if(orderno=="000052172758") {
							console.log("Failed"+sqlstatement)
						         
							}
						html5sql.process(sqlstatement1+sqlstatement,
								 function(transaction, results, rowsArray){
console.log("OK")
									//addNewJobToList(orderno){
			
										
								 },
								 function(error, statement){
									 console.log("Failed"+statement)
								 }        
								);

					}else{
						cocole.log("Order Exists")
						//alert("Order Exists "+rowsArray[0].changeddatetime+"SAP="+changeddatetime)
					}

			 },
			 function(error, statement){
				 console.log("Error"+statement)
			 }        
			);
}
function objectsCB(Objects){
opMessage("Callback objects triggured");

		if(Objects.object.length>0){
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Objects:'+String(Objects.object.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Objects:'+String(Objects.object.length));
			}
			opMessage("Deleting Existing Ref Assets");
			sqlstatement = 	'DELETE FROM Assets;';
			html5sql.process(sqlstatement,
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 opMessage("Error: " + error.message + " when processing " + statement);
						 }        
				);		
			sqlstatement='';	
			opMessage("Loading "+Objects.object.length+" Ref Assets");
			for(var cntx=0; cntx < Objects.object.length ; cntx++)
				{
				
				sqlstatement+='INSERT INTO Assets ( id, type , eqart, eqtyp, shorttext, address, workcenter ) VALUES ('+ 
						'"'+Objects.object[cntx].id+  '","'+  Objects.object[cntx].type+  '","'+  Objects.object[cntx].eqart+  '","'+ 
						    Objects.object[cntx].eqtyp+  '","'+ Objects.object[cntx].shorttext+  '","'+ Objects.object[cntx].address+  '","'+ Objects.object[cntx].swerk+'");';
					
				}
				
			html5sql.process(sqlstatement,
							 function(){
								 //alert("Success - Finished Loading Orders");
							 },
							 function(error, statement){
								 opMessage("Error: " + error.message + " when processing " + statement);
							 }        
			);			  
	



		}
}
function notificationCB(MyNotifications){
var sqlstatement;
var notiftype=""
opMessage("Callback Notifications triggured");

	if(MyNotifications.notification.length>0){
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', MyNotifications:'+String(MyNotifications.notification.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'MyNotifications:'+String(MyNotifications.notification.length));
			}	
			opMessage("Deleting Existing Notifications");
			sqlstatement = 	'DELETE FROM MyNotifications where notifno!="NEW";'+
							'DELETE FROM MyTasks;'+
							'DELETE FROM MyItems;'+
							'DELETE FROM MyCauses;'+
							'DELETE FROM MyActivities;'+
							'DELETE FROM MyEffects;';

			html5sql.process(sqlstatement,
						 function(){
							 //alert("Success Creating Tables");
						 },
						 function(error, statement){
							 //alert("Error: " + error.message + " when processing " + statement);
						 }        
				);		
			opMessage("Loading "+MyNotifications.notification.length+" Notifications");
			sqlstatement='';	
			
			for(var cntx=0; cntx < MyNotifications.notification.length ; cntx++)
				{
		
				/*if(MyNotifications.notification[cntx].sortfield.length==0){
					notiftype=MyNotifications.notification[cntx].type;
				}else{
					notiftype=MyNotifications.notification[cntx].sortfield;
				}*/
				x=unescape(MyNotifications.notification[cntx].shorttext).replace(/'/g, "");;
				x=x.replace("\/", "");;
				x=x.replace(/&/g, "");;
				y=unescape(MyNotifications.notification[cntx].longtext).replace(/'/g, "");;
			y=y.replace("\/", "");;
				y=y.replace(/&/g, "");;
				sqlstatement1='INSERT INTO MyNotifications (notifno , changedby, changeddatetime, shorttext , longtext , startdate , priority , type, funcloc, equipment,orderno, reportedon , reportedby , plant, funclocgis, equipmentgis, cattype, pgroup, pcode, grouptext, codetext) VALUES ( '+ 
					'"'+MyNotifications.notification[cntx].notifno +'",'+
					'"'+MyNotifications.notification[cntx].changed_by+'",'+ 
					'"'+MyNotifications.notification[cntx].changed_date +MyNotifications.notification[cntx].changed_time +'",'+ 
					'"'+MyNotifications.notification[cntx].shorttext+'",'+ 
					'"'+MyNotifications.notification[cntx].longtext +'",'+ 
					'"'+MyNotifications.notification[cntx].startdate+'",'+ 
					'"'+MyNotifications.notification[cntx].priority+'",'+
					'"'+MyNotifications.notification[cntx].type+'",'+
					//'"'+notiftype+'",'+
					'"'+MyNotifications.notification[cntx].funcloc +'",'+ 
					'"'+MyNotifications.notification[cntx].equipment +'",'+
					'"'+MyNotifications.notification[cntx].orderno+'",'+
					'"'+MyNotifications.notification[cntx].reportedon +'",'+
					'"'+MyNotifications.notification[cntx].reportedby +'",'+
					'"'+MyNotifications.notification[cntx].plant+'",'+
					'"'+MyNotifications.notification[cntx].funclocgis +'",'+ 
					'"'+MyNotifications.notification[cntx].equipmentgis+'",'+
					'"'+MyNotifications.notification[cntx].cattype+'",'+
					'"'+MyNotifications.notification[cntx].pgroup +'",'+
					'"'+MyNotifications.notification[cntx].pcode+'",'+
					'"'+MyNotifications.notification[cntx].pgrouptext+'",'+ 
					'"'+MyNotifications.notification[cntx].pcodetext+'");';
					//Loop and write Items to DB
	

					opMessage("Loading "+MyNotifications.notification[cntx].task.length+" Tasks");
					for(var tcnt=0; tcnt < MyNotifications.notification[cntx].task.length ; tcnt++)
						{	

						sqlstatement1+='INSERT INTO MyTasks (notifno , item_id , task_text , task_cat_typ , task_codegrp , task_code , txt_taskgrp ,txt_taskcd , plnd_start_date , plnd_start_time, plnd_end_date, plnd_end_time, sla_end_date, sla_end_time, longtext, complete, status) VALUES ( '+  
							'"'+MyNotifications.notification[cntx].notifno +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].id +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].task_text +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].task_cat_typ +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].task_codegrp +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].task_code +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].txt_taskgrp +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].txt_taskcd +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].plnd_start_date +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].plnd_start_time +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].plnd_end_date +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].plnd_end_time +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].sla_end_date +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].sla_end_time +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].longtext +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].complete +'",'+
							 '"'+MyNotifications.notification[cntx].task[tcnt].status +'");';
				
						}
						
					opMessage("Loading "+MyNotifications.notification[cntx].effect.length+" Effect");
					for(var ecnt=0; ecnt < MyNotifications.notification[cntx].effect.length ; ecnt++)
						{	

						sqlstatement1+='INSERT INTO MyEffects (notifno , item_id , task_id, effect_cat_typ , effect_codegrp , effect_code , txt_effectgrp ,txt_effectcd , value) VALUES (  '+
							 '"'+MyNotifications.notification[cntx].notifno+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].id+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].task+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].effect_cat_typ+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].effect_codegrp+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].effect_code+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].txt_effectgrp+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].txt_effectcd+'",'+
							 '"'+MyNotifications.notification[cntx].effect[ecnt].value+'");';
						}
	
					opMessage("Loading "+MyNotifications.notification[cntx].item.length+" Items");
					for(var icnt=0; icnt < MyNotifications.notification[cntx].item.length ; icnt++)
						{	
				
						sqlstatement1+='INSERT INTO MyItems (notifno , item_id , descript , d_cat_typ , d_codegrp , d_code , dl_cat_typ , dl_codegrp , dl_code , stxt_grpcd , txt_probcd , txt_grpcd, txt_objptcd,  status, long_text) VALUES  (  '+
							 '"'+MyNotifications.notification[cntx].notifno +'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].id+'",'+ 
							 '"'+MyNotifications.notification[cntx].item[icnt].description+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].d_cat_typ+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].d_codegrp+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].d_code+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].dl_cat_typ+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].dl_codegrp+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].dl_code+'",'+
						
							 '"'+MyNotifications.notification[cntx].item[icnt].stxt_grpcd+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].txt_prodcd+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].txt_grpcd+'",'+
							 '"'+MyNotifications.notification[cntx].item[icnt].txt_objptcd+  '","S","");';

						}
					//Loop and write Causes to DB
						
					opMessage("Loading "+MyNotifications.notification[cntx].cause.length+" Causes");
					for(var ccnt=0; ccnt < MyNotifications.notification[cntx].cause.length ; ccnt++)
						{	

						sqlstatement1+='INSERT INTO MyCauses (notifno , item_id , cause_id, cause_text , cause_cat_typ , cause_codegrp , cause_code , txt_causegrp , txt_causecd ,  status, long_text) VALUES ( '+ 
							  '"'+MyNotifications.notification[cntx].notifno+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].id+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_key+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].causetext+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_cat_typ+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_codegrp+'",'+ 
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_code+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_txt_causegrp+'",'+
							  '"'+MyNotifications.notification[cntx].cause[ccnt].cause_txt_causecd+  '","S","");';
						}
					//Loop and write Items to DB
					
					opMessage("Loading "+MyNotifications.notification[cntx].activity.length+" Activities");
					for(var acnt=0; acnt < MyNotifications.notification[cntx].activity.length ; acnt++)
						{	

						sqlstatement1+='INSERT INTO MyActivities (notifno , item_id , task_id, act_text , act_cat_typ , act_codegrp , act_code ,txt_actgrp, txt_actcd ,start_date , start_time , end_date , end_time,   status, act_id, long_text) VALUES ( '+ 
							  '"'+MyNotifications.notification[cntx].notifno+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].id+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_key+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].acttext+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_cat_typ+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_codegrp+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].act_code+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].txt_actgrp+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].txt_actcd+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].start_date+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].start_time+'",'+ 
							  '"'+MyNotifications.notification[cntx].activity[acnt].end_date+'",'+
							  '"'+MyNotifications.notification[cntx].activity[acnt].end_time+  '","S","","");';
						}
						
					if((MyNotifications.notification[cntx].notifno=="null")	||
							(MyNotifications.notification[cntx].notifno.length<4)){
						sqlstatement1=""
					}else{
						sqlstatement+=sqlstatement1;
					}
						

				}
			
			html5sql.process(sqlstatement,
							 function(transaction, results, rowsArray){
								//setCounts()
								/*var x = window.location.href.split("/")
								if(x[x.length-1]=="Home.html"){
									
								}*/
								
/*								html5sql.process("select * from MyNotifications",
												 function(transaction, results, rowsArray){
													 for (var n = 0; n < rowsArray.length; n++) {
														nitem = rowsArray[n];
														//alert("select  CODEGROUP_TEXT from refcodegroups where catalog_type = '"+nitem.cattype+"' and codegroup = '"+nitem.pgroup+"' ORDER BY CODEGROUP_TEXT ASC LIMIT 1")
														html5sql.process("select  CODEGROUP_TEXT from refcodegroups where catalog_type = '"+nitem.cattype+"' and codegroup = '"+nitem.pgroup+"' ORDER BY CODEGROUP_TEXT ASC LIMIT 1",
																		 function(transaction, results, rowsArray1){
																			 for (var n = 0; n < rowsArray1.length; n++) {
																				if(rowsArray1.length>0){
																					//alert("update  MyNotifications set pgrouptext = '"+rowsArray1[0].codegroup_text+"' where notifno = '"+nitem.notifno+"'")
																					html5sql.process("update  MyNotifications set grouptext = '"+rowsArray1[0].codegroup_text+"' where notifno = '"+nitem.notifno+"'",
																									 function(transaction, results, rowsArray2){
																										 
																									 },
																									 function(error, statement){
																										 opMessage("Error: " + error.message + " when processing " + statement);
																									 }        
																					);
																				}
																			 }
																		 },
																		 function(error, statement){
																			 opMessage("Error: " + error.message + " when processing " + statement);
																		 }        
														);	
														


														html5sql.process("select CODE_TEXT from refcodes where code_cat_group = '"+nitem.cattype+nitem.pgroup+"' and code = '"+nitem.pcode+"' ORDER BY CODE_TEXT ASC LIMIT 1",
																		 function(transaction, results, rowsArray3){
																			 for (var n = 0; n < rowsArray3.length; n++) {
																				if(rowsArray3.length>0){
																					//alert("update  MyNotifications set pcodetext = '"+rowsArray3[0].code_text+"' where notifno = '"+nitem.notifno+"'")
																					html5sql.process("update  MyNotifications set codetext = '"+rowsArray3[0].code_text+"' where notifno = '"+nitem.notifno+"'",
																									 function(transaction, results, rowsArray4){
																										 
																									 },
																									 function(error, statement){
																										 opMessage("Error: " + error.message + " when processing " + statement);
																									 }        
																					);
																				}
																			 }
																		 },
																		 function(error, statement){
																			 opMessage("Error: " + error.message + " when processing " + statement);
																		 }        
														);														
													 }
												 },
												 function(error, statement){
													 opMessage("Error: " + error.message + " when processing " + statement);
												 }        
								);	*/	
							
							 },
							 function(error, statement){
								// alert("Error: " + error.message + " when processing " + statement);
								 opMessage("Error: " + error.message + " when processing " + statement);
							 }        
			);	
	}
}		
function sapCB(MySAP){
	
var sqlstatement="";
opMessage("Callback sapCB triggured");


	


	
	if(MySAP.message.length>0){
		
			opMessage("Processing Update Response: ");
//Handle NewJob Create Response
			if (MySAP.message[0].type=="createnewjob"){
				//alert(MySAP.message[0].type+":"+MySAP.message[0].recno+":"+MySAP.message[0].sapmessage+":"+MySAP.message[0].message+":"+MySAP.message[0].notifno)
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->row= "+MySAP.message[0].recno);
				opMessage("-->Message= "+MySAP.message[0].sapmessage);
				opMessage("-->Message= "+MySAP.message[0].message);
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);
				if((MySAP.message[0].message=="Success")&&(MySAP.message[0].sapmessage.indexof("Created")>0))
					{
						sqlstatement+="UPDATE MyNotifications SET notifno = '"+ MySAP.message[0].notifno+"' WHERE id='"+ MySAP.message[0].recno+"';";
					}else{
						sqlstatement+="UPDATE MyNotifications SET notifno = 'SENT"+MySAP.message[0].recno+"' WHERE id='"+ MySAP.message[0].recno+"';";
					}
					

		
			}
//Handle EOD Create Response
			if (MySAP.message[0].type=="createeodnotification"){
				//alert(MySAP.message[0].type+":"+MySAP.message[0].recno+":"+MySAP.message[0].message+":"+MySAP.message[0].notifno)
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->row= "+MySAP.message[0].recno);
				opMessage("-->Message= "+MySAP.message[0].sapmessage);
				opMessage("-->Message= "+MySAP.message[0].message);
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);
				if(MySAP.message[0].message=="Success")
					{
					sqlstatement+="UPDATE MyNotifications SET notifno = '"+ MySAP.message[0].notifno+"' WHERE id='"+ MySAP.message[0].recno+"';";
					}else{
					sqlstatement+="UPDATE MyNotifications SET notifno = 'SENT"+MySAP.message[0].recno+"' WHERE id='"+ MySAP.message[0].recno+"';";	
					}
					
					
					

		
			}
//Handle Close Create Response
			if (MySAP.message[0].type=="updatenotification"){
				console.log(MySAP.message[0].type+":"+MySAP.message[0].recno+":"+MySAP.message[0].message+":"+MySAP.message[0].notifno)
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->row= "+MySAP.message[0].recno);
				opMessage("-->Message= "+MySAP.message[0].sapmessage);
				opMessage("-->Message= "+MySAP.message[0].message);
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);
					sqlstatement+="UPDATE MyJobClose SET state = 'SENT"+MySAP.message[0].recno+"' WHERE id='"+ MySAP.message[0].recno+"';";

					
					
					

		
			}
//Handle Notification Create Response
			if (MySAP.message[0].type=="createnotificationxx"){
				//alert(MySAP.message[0].type+":"+MySAP.message[0].recno+":"+MySAP.message[0].message+":"+MySAP.message[0].notifno)
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->row= "+MySAP.message[0].recno);
				opMessage("-->Message= "+MySAP.message[0].message);
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);

	
					sqlstatement+="UPDATE MyNewJobs SET state = '"+ MySAP.message[0].recno+"' WHERE id='"+ MySAP.message[0].notifno+"';";
					

		
			}
//Handle Vehicle Defect Response
			if (MySAP.message[0].type=="fileupload"){
//alert("File Uploaded response");
			}		
//Handle Vehicle Defect Response
			if (MySAP.message[0].type=="createvehiclemileage"){
				opMessage("VehicleMilege-->Message= "+MySAP.message[0].message+"-->NotifNo= "+MySAP.message[0].notifno+"-->measdoc= "+MySAP.message[0].measdoc);
				
				if(MySAP.message[0].message=="Success"){
						sqlstatement+="delete from MyVehicleCheck WHERE id='"+MySAP.message[0].recno+"';";
					}
		
			}	
			if (MySAP.message[0].type=="createvehicledefect"){
				opMessage("-->Message= "+MySAP.message[0].message);
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);
				opMessage("-->measdoc= "+MySAP.message[0].measdoc);
				if(MySAP.message[0].message=="Success"){
					sqlstatement+="delete from MyVehicleCheck WHERE id='"+MySAP.message[0].recno+"';";
						
					}
		
			}	
//Handle Time Confirmation Create Response			
			if (MySAP.message[0].type=="createtconf"){
				console.log(MySAP.message[0].type+":"+MySAP.message[0].message+":"+MySAP.message[0].message_type+":"+MySAP.message[0].confno+":"+MySAP.message[0].recno)
				opMessage("-->Type= "+MySAP.message[0].type);
				opMessage("-->confno= "+MySAP.message[0].confno);
				if(MySAP.message[0].confno!="0000000000"){

					
		
						sqlstatement+="UPDATE MyTimeConfs SET confno = '"+MySAP.message[0].confno+"' WHERE id='"+MySAP.message[0].recno+"';";
						

					}else{
						sqlstatement+="UPDATE MyTimeConfs SET confno = 'SENT"+MySAP.message[0].recno+"' WHERE id='"+MySAP.message[0].recno+"';";
					}
		
			}
//Handle Status Update Response
			if (MySAP.message[0].type=="updatestatus"){
				console.log("-->UpdateStatus"+MySAP.message[0].orderno+":"+MySAP.message[0].opno+":"+MySAP.message[0].message+":"+MySAP.message[0].recno);
				opMessage("-->UpdateStatus");
				opMessage("-->Orderno= "+MySAP.message[0].orderno);
				opMessage("-->Opno= "+MySAP.message[0].opno);
				opMessage("-->Message= "+MySAP.message[0].message);
				if(MySAP.message[0].message=="Operation successfully updated"){

						
						sqlstatement+="delete from MyStatus WHERE id = '"+MySAP.message[0].recno + "';";
			
					}else{
						sqlstatement+="UPDATE MyStatus SET state = 'SENT"+MySAP.message[0].recno+"' WHERE id='"+ MySAP.message[0].recno+"';";	
					}
		
			}	
//Handle Create Notification Response
			if (MySAP.message[0].type=="createnotification"){
				//alert(MySAP.message[0].type+":"+MySAP.message[0].recno+":"+MySAP.message[0].message+":"+MySAP.message[0].notifno)
				opMessage("-->Create Notification");
				opMessage("-->NotifNo= "+MySAP.message[0].notifno);
				opMessage("-->Message= "+MySAP.message[0].message);
				if(MySAP.message[0].message=="Success"){

						sqlstatement+="UPDATE MyNotifications SET notifno = '"+MySAP.message[0].notifno+"' WHERE id='"+MySAP.message[0].recno+"';";
			

			
					}
		
			}			
			if (MySAP.message[0].type=="updatemessagereadstatus"){
				//alert("mess read-->"+MySAP.message[0].id+":"+MySAP.message[0].message)
				opMessage("-->UpdateMessage Read");
				opMessage("-->ID= "+MySAP.message[0].id);
				opMessage("-->Message= "+MySAP.message[0].message);
				if(MySAP.message[0].message=="Success"){

			
		
						sqlstatement+="UPDATE MyMessages SET state = '1' WHERE id='"+MySAP.message[0].id + "';";
						
						
			
					}
		
			}	
			if (MySAP.message[0].type=="messagesend"){
				//alert("mess send-->"+MySAP.message[0].id+":"+MySAP.message[0].message)
				opMessage("-->UpdateMessage Sent");
				opMessage("-->ID= "+MySAP.message[0].id);
				opMessage("-->Message= "+MySAP.message[0].message);
				if(MySAP.message[0].message=="Success"){

			
		
						sqlstatement+="UPDATE MyMessages SET state = 'SENT' WHERE id="+MySAP.message[0].id + ";";
						
						
			
					}
		
			}
			html5sql.process(sqlstatement,
						 function(){
						 console.log("Success handling SAPCB"+sqlstatement);
						 },
						 function(error, statement){
							 console.log("Error: " + error.message + " when processing " + statement);
							 opMessage("Error: " + error.message + " when processing " + statement);
						 }        
				);	
	}
}		
function getFlocs(){
	
	$.getJSON('MyFuncloc.json',function(Funcloc){ 
		var sqlstatement="";

		opMessage("Loading "+Funcloc.funcloc.length+" Functional Locations");
		for(var cntx=0; cntx < Funcloc.funcloc.length ; cntx++)
			{	
			sqlstatement+='INSERT INTO Assets (type , id , shorttext , name , city , street, postcode ) VALUES ('+ 
				'"FL",' + 
				'"'+Funcloc.funcloc[cntx].id +'",'+ 
				'"'+Funcloc.funcloc[cntx].shorttext +'",'+  
				'"'+Funcloc.funcloc[cntx].name +'",'+ 
				'"'+Funcloc.funcloc[cntx].city +'",'+ 
				'"'+Funcloc.funcloc[cntx].street +'",'+ 
				'"'+Funcloc.funcloc[cntx].postcod+'");';
				//Loop and write Tasks to DB

				opMessage("Loading "+Funcloc.funcloc[cntx].classval.length+" Class Vals");
				for(var opscnt=0; opscnt < Funcloc.funcloc[cntx].classval.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO AssetClassVals (type , id, charact , valuechar , valueto , valueneutral , description) VALUES ('+ 
						'"FL",' + 
						 '"'+Funcloc.funcloc[cntx].id +'",'+ 
						 '"'+Funcloc.funcloc[cntx].classval[opscnt].charact +'",'+ 
						 '"'+Funcloc.funcloc[cntx].classval[opscnt].valuechar +'",'+ 
						 '"'+Funcloc.funcloc[cntx].classval[opscnt].valueto +'",'+ 
						 '"'+Funcloc.funcloc[cntx].classval[opscnt].valueneutral +'",'+ 
						 '"'+Funcloc.funcloc[cntx].classval[opscnt].description+'");';
				
				}
				

			}
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);	


	});
	
	

		
}
function refflocsCB(Funcloc){
	

	var sqlstatement="";

	opMessage("Loading "+Funcloc.funcloc.length+" Reference Functional Locations");
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Funcloc:'+String(Funcloc.funcloc.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Funcloc:'+String(Funcloc.funcloc.length));
			}
sqlstatement = 	'DELETE FROM funclocs;'


		
	for(var cntx=0; cntx < Funcloc.funcloc.length ; cntx++)
		{	
		fllevel=((Funcloc.funcloc[cntx].id).match(/-/g) || []).length;
		if(fllevel=="0"){
			parentid="";
			}else{		
			parentid=(Funcloc.funcloc[cntx].id).substring(0,(Funcloc.funcloc[cntx].id).lastIndexOf("-"));
			}
		childcnt=cntx+1;
		if(childcnt<Funcloc.funcloc.length)
			{
			fllevelchild=((Funcloc.funcloc[childcnt].id).match(/-/g) || []).length;
			if(fllevelchild=="0"){
				parentidchild="";
				}else{		
				parentidchild=(Funcloc.funcloc[childcnt].id).substring(0,(Funcloc.funcloc[childcnt].id).lastIndexOf("-"));
				}
			if(parentidchild==Funcloc.funcloc[cntx].id)
				{
				children=1;
				}else{
				children=0;
				}
			}else{
				Children=0;
			}
	
		sqlstatement+='INSERT INTO FuncLocs (flid , description , swerk , level , parentid , children ) VALUES ('+ 
			'"'+Funcloc.funcloc[cntx].id +'",'+ 
			'"'+Funcloc.funcloc[cntx].shorttext +'",'+  
			'"'+Funcloc.funcloc[cntx].swerk +'",'+ 		
			'"'+fllevel +'",'+  //Works out the level by number of Hyphens
			'"'+parentid+'",' + // Gets the Parent Id as before last hyphen
			'"'+children+'");';

			

		}

		html5sql.process(sqlstatement,
			 function(){
			opMessage("Flocs inserted and now we do the Parent ID bit");
			
					},
					
			 function(error, statement){
				 opMessage("Error: " + error.message + " when processing " + statement);
			 }        
		);	







	
}
function refequipsCB(Equipment){
	

	var sqlstatement="";

	opMessage("Loading "+Equipment.equipment.length+" Reference Equipment Locations");
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Equipment:'+String(Equipment.equipment.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Equipment:'+String(Equipment.equipment.length));
			}
sqlstatement = 	'DELETE FROM equipments;'


		
	for(var cntx=0; cntx < Equipment.equipment.length ; cntx++)
		{	

	
		sqlstatement+='INSERT INTO Equipments (eqid , description , flid  ) VALUES ('+ 
			'"'+Equipment.equipment[cntx].id.replace(/^0+/, '') +'",'+ 
			'"'+Equipment.equipment[cntx].shorttext +'",'+  
			'"'+Equipment.equipment[cntx].funcloc+'");';	


			

		}

		html5sql.process(sqlstatement,
			 function(){
			opMessage("New Equipment List inserted ");
			
					},
					
			 function(error, statement){
				 opMessage("Error: " + error.message + " when processing " + statement);
			 }        
		);	







	
}
function refgasCB(Survey){


		var sqlstatement="";
		
		opMessage("Loading "+Survey.QUESTION.length+" Reference Gas Survey Questions");
		for(var cntx=0; cntx < Survey.QUESTION.length ; cntx++)
			{	

			sqlstatement+='INSERT INTO GASSurveyQ (type , qno , qtype , description) VALUES ('+ 
				'"Q",'+ 
				'"'+Survey.QUESTION[cntx].KEY +'",'+  
				'"'+Survey.QUESTION[cntx].TYPE +'",'+ 		
				'"'+Survey.QUESTION[cntx].LABEL +'");';
			
			if (Survey.QUESTION[cntx].TYPE=="LB")
				{
				opMessage("Loading "+Survey.QUESTION[cntx].ANSWER.length+" Answers");
				for(var opscnt=0; opscnt < Survey.QUESTION[cntx].ANSWER.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO GASSurveyA (type , qno, qkey , qvalue) VALUES ('+ 
						 '"Q",'+ 
						 '"'+ Survey.QUESTION[cntx].KEY+'",'+ 
						 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].KEY+'",'+  
						 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].VALUE+'");' ;
					}
				}//End of LB Build
				else
				{
				sqlstatement+='INSERT INTO GASSurveyA (type , qno, qkey , qvalue) VALUES ('+ 
					 '"Q",'+ 
					 '"'+ Survey.QUESTION[cntx].KEY+'",'+ 
					 '" ",'+  
					 '" ");' ;	
				}
			if (Survey.QUESTION[cntx].TYPE=="LDB")
				{
				//alert (Survey.QUESTION[cntx].LABEL+" - "+Survey.QUESTION[cntx].ANSWER.length)

				opMessage("Loading "+Survey.QUESTION[cntx].ANSWER.length+" Answers");
				for(var opscnt=0; opscnt < Survey.QUESTION[cntx].ANSWER.length ; opscnt++)
					{	
					if (Survey.QUESTION[cntx].LABEL=="Make") 
						{
						sqlstatement+='INSERT INTO GASSurveyMake (make , description) VALUES ('+ 
							 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].KEY+'",'+  
							 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].VALUE+'");' ;
						}
					if (Survey.QUESTION[cntx].LABEL=="Model") 
						{
					    var res = Survey.QUESTION[cntx].ANSWER[opscnt].VALUE.split("-");
						sqlstatement+='INSERT INTO GASSurveyModel (make , model, description) VALUES ('+ 
							 '"'+res[0]+'",'+  
							 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].KEY+'",'+ 
							 '"'+res[1]+'");' ;
						}
					if (Survey.QUESTION[cntx].LABEL=="Model") {
						if (opscnt>600) {
							//alert (Survey.QUESTION[cntx].ANSWER[opscnt].VALUE)
							opscnt = 10000;
							}
						} 
					}
				}//End of LDB Build
			}
			//alert(sqlstatement)
 			html5sql.process(sqlstatement,
				 function(){
					opMessage("Flocs inserted and now we do the Parent ID bit");
						//alert("good")
						},
						
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
					 //alert("bad")
				 }        
			);	 

}
function refgashdrCB(Survey){
	

	var sqlstatement="";

	opMessage("Loading "+Survey.QUESTION.length+" Reference Gas Survey Header Questions");
	for(var cntx=0; cntx < Survey.QUESTION.length ; cntx++)
		{

		sqlstatement+='INSERT INTO GASSurveyQ (type , qno , qtype , description) VALUES ('+ 
			'"H",'+ 
			'"'+Survey.QUESTION[cntx].KEY +'",'+  
			'"'+Survey.QUESTION[cntx].TYPE +'",'+ 		
			'"'+Survey.QUESTION[cntx].LABEL +'");';
		
		if (Survey.QUESTION[cntx].TYPE=="LB")
			{
			opMessage("Loading "+Survey.QUESTION[cntx].ANSWER.length+" Answers");
			for(var opscnt=0; opscnt < Survey.QUESTION[cntx].ANSWER.length ; opscnt++)
				{	
				
				sqlstatement+='INSERT INTO GASSurveyA (type , qno, qkey , qvalue) VALUES ('+ 
					 '"H",'+ 
					 '"'+ Survey.QUESTION[cntx].KEY+'",'+ 
					 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].KEY+'",'+  
					 '"'+ Survey.QUESTION[cntx].ANSWER[opscnt].VALUE+'");' ;
				}
			}//End of LB Build
			else
			{
			sqlstatement+='INSERT INTO GASSurveyA (type , qno, qkey , qvalue) VALUES ('+ 
				 '"H",'+ 
				 '"'+ Survey.QUESTION[cntx].KEY+'",'+ 
				 '" ",'+  
				 '" ");' 	;
			}
		}
//alert(sqlstatement)
 		html5sql.process(sqlstatement,
			 function(){
			opMessage("Flocs inserted and now we do the Parent ID bit");
			
					},
					
			 function(error, statement){
				 opMessage("Error: " + error.message + " when processing " + statement);
			 }        
		);	 







	
}


function getEquips(){	

	$.getJSON('MyEquipment.json',function(Equipment){ 
		var sqlstatement="";

		opMessage("Loading "+Equipment.equipment.length+" Equipment");
		for(var cntx=0; cntx < Equipment.equipment.length ; cntx++)
			{	
			sqlstatement+='INSERT INTO Assets (type , id , shorttext , name , city , street, postcode ) VALUES ('+ 
				'"EQ",'+ 
				'"'+ Equipment.equipment[cntx].id +'",'+ 
				'"'+ Equipment.equipment[cntx].shorttext +'",'+ 
				'"'+ Equipment.equipment[cntx].name +'",'+ 
				'"'+ Equipment.equipment[cntx].city +'",'+ 
				'"'+ Equipment.equipment[cntx].street +'",'+ 
				'"'+ Equipment.equipment[cntx].postcode+'");' ;
				//Loop and write Tasks to DB

				opMessage("Loading "+Equipment.equipment[cntx].classval.length+" Class Vals");
				for(var opscnt=0; opscnt < Equipment.equipment[cntx].classval.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO AssetClassVals (type , id, charact , valuechar , valueto , valueneutral , description) VALUES ('+ 
						 '"EQ",'+ 
						 '"'+ Equipment.equipment[cntx].id+'",'+ 
						 '"'+ Equipment.equipment[cntx].classval[opscnt].charact+'",'+  
						 '"'+ Equipment.equipment[cntx].classval[opscnt].valuechar+'",'+ 
						 '"'+ Equipment.equipment[cntx].classval[opscnt].valueto+'",'+ 
						 '"'+ Equipment.equipment[cntx].classval[opscnt].valueneutral+'",'+  
						 '"'+ Equipment.equipment[cntx].classval[opscnt].description+'");' ;
				
					}
				

			}
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	});
}
function formCB(data){
	var sqlstatement="";		
	
		if(data.forms.length>0){
				if(syncReferenceDetsUpdated){
					localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', Forms:'+String(data.forms.length));
				}else{
					localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'Forms:'+String(data.forms.length));
				}

				opMessage("Deleting Existing forms");
				sqlstatement+='DELETE FROM MyForms;';
				opMessage("Loading"+data.forms.length+" Existing forms");
				for(var cntx=0; cntx < data.forms.length ; cntx++)
					{	
					
					sqlstatement+='INSERT INTO MyForms (name , type , lastupdated , url , description) VALUES ('+ 
						'"'+data.forms[cntx].name +'",'+  
						'"'+data.forms[cntx].type +'",'+  
						'"'+data.forms[cntx].lastupdated +'",'+  
						'"'+data.forms[cntx].url+'",'+  
						'"'+data.forms[cntx].description+'");';			
					}	

				html5sql.process(sqlstatement,
					 function(){
							
					 },
					 function(error, statement){
						 opMessage("Error: " + error.message + " when processing " + statement);
					 }        
				);


		}
	}
function userCB(MyUsers){
var sqlstatement="";		
var MyEmployeeID=""
	if(MyUsers.user.length>0){
			if(syncReferenceDetsUpdated){
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', Users:'+String(MyUsers.user.length));
			}else{
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'Users:'+String(MyUsers.user.length));
			}

			opMessage("Deleting Existing Users");
			sqlstatement+='DELETE FROM MyRefUsers;';
			opMessage("Loading"+MyUsers.user.length+" Existing Users");
			for(var cntx=0; cntx < MyUsers.user.length ; cntx++)
				{	
				if(MyUsers.user[cntx].userid==localStorage.getItem('MobileUser')){
					localStorage.setItem('EmployeeID',MyUsers.user[cntx].employeeno)
				}
				sqlstatement+='INSERT INTO MyRefUsers (userid , scenario , plant , workcenter , plannergroup , plannergroupplant, storagegroup, storageplant, partner, partnerrole, funclocint, funcloc, compcode, employeeno, equipment, firstname, lastname, telno ) VALUES ('+ 
					'"'+MyUsers.user[cntx].userid +'",'+  
					'"'+MyUsers.user[cntx].scenario +'",'+   
					'"'+MyUsers.user[cntx].plant +'",'+   
					'"'+MyUsers.user[cntx].workcenter +'",'+  
					'"'+MyUsers.user[cntx].plannergroup +'",'+  
					'"'+MyUsers.user[cntx].plannergroupplant +'",'+   
					'"'+MyUsers.user[cntx].storagegroup +'",'+  
					'"'+MyUsers.user[cntx].storageplant +'",'+   
					'"'+MyUsers.user[cntx].partner +'",'+  
					'"'+MyUsers.user[cntx].partnerrole +'",'+  
					'"'+MyUsers.user[cntx].funclocint +'",'+  
					'"'+MyUsers.user[cntx].funcloc +'",'+  
					'"'+MyUsers.user[cntx].compcode +'",'+  
					'"'+MyUsers.user[cntx].employeeno +'",'+  
					'"'+MyUsers.user[cntx].equipment +'",'+  
					'"'+MyUsers.user[cntx].firstname +'",'+  
					'"'+MyUsers.user[cntx].lastname+'",'+  
					'"'+MyUsers.user[cntx].telno+'");';			
				}	

			html5sql.process(sqlstatement,
				 function(){
						sqlstatement="UPDATE MyUserDets SET employeeid = '"+localStorage.getItem('EmployeeID')+"' WHERE mobileuser = '"+localStorage.getItem('MobileUser')+"';";
						
						html5sql.process(sqlstatement,
						 function(){
						},
						 function(error, statement){
							opMessage("Error: " + error.message + " when updateing Pincode " + statement);
						 }        
						);
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
function vehicleCB(MyVehicles){
var sqlstatement="";	

var first=0;
	if(MyVehicles.vehicle.length>0){
		
			if(syncReferenceDetsUpdated){
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', Vehicles:'+String(MyVehicles.vehicle.length));
			}else{
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'Vehicles:'+String(MyVehicles.vehicle.length));
			}
			opMessage("Deleting Existing Vehicles");
			sqlstatement+='DELETE FROM MyVehicles;';
			opMessage("Loading"+MyVehicles.vehicle.length+" Vehicles");
			for(var cntx=0; cntx < MyVehicles.vehicle.length ; cntx++)
				{	
			if(MyVehicles.vehicle[cntx].level==1){
				if(first==0)
					{
					first=1;
					}else{
						sqlstatement+='");';	
					}
				sqlstatement+='INSERT INTO MyVehicles (id , reg , partner, description , mpoints ) VALUES ( '+
					'"'+MyVehicles.vehicle[cntx].equipment +'",'+ 
					'"'+MyVehicles.vehicle[cntx].vehicle +'",'+ 
					'"'+MyVehicles.vehicle[cntx].partner +'",'+ 
					'"'+MyVehicles.vehicle[cntx].description+'","'
			}else{
				
				sqlstatement+=MyVehicles.vehicle[cntx].mpoint+':';	
			}
					
			

				}	
			sqlstatement+='");';
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
function vehicleDefaultCB(MyVehicles){
	var sqlstatement="";	
		//alert("def"+MyVehicles.vehicle.length)
		if(MyVehicles.vehicle.length>0){
			
				if(syncReferenceDetsUpdated){
					localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', Vehicles:'+String(MyVehicles.vehicle.length));
				}else{
					localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'Vehicles:'+String(MyVehicles.vehicle.length));
				}
				opMessage("Deleting Existing VehiclesDefault");
				sqlstatement+='DELETE FROM MyVehiclesDefault;';
				opMessage("Loading"+MyVehicles.vehicle.length+" Vehicles");
				for(var cntx=0; cntx < MyVehicles.vehicle.length ; cntx++)
					{	
					//alert(cntx)
				if(MyVehicles.vehicle[cntx].level=="2"){
					//alert("lev2"+MyVehicles.vehicle[cntx].mpointdesc)
					sqlstatement+='INSERT INTO MyVehiclesDefault (equipment , reg , partner, level, sequence, description , mpoint, mpointdesc, mpointlongtext  ) VALUES ( '+
						'"'+MyVehicles.vehicle[cntx].equipment +'",'+ 
						'"'+MyVehicles.vehicle[cntx].vehicle +'",'+ 
						'"'+MyVehicles.vehicle[cntx].partner +'",'+ 
						'"'+MyVehicles.vehicle[cntx].level +'",'+ 
						'"'+MyVehicles.vehicle[cntx].sequence +'",'+ 
						'"'+MyVehicles.vehicle[cntx].description+'",'+ 
						'"'+MyVehicles.vehicle[cntx].mpoint+'",'+
						'"'+escape(MyVehicles.vehicle[cntx].mpointdesc)+'",'+
						'"'+escape(MyVehicles.vehicle[cntx].mpointLongtext)+'");';
				}
						

					}
				//alert("about to sql"+sqlstatement)
				html5sql.process(sqlstatement,
					 function(){
						 //alert("Success - Finished Loading Orders");
					 },
					 function(error, statement){
						 //alert("Error: " + error.message + " when processing " + statement);
						 opMessage("Error: " + error.message + " when processing " + statement);
					 }        
				);


		}
	}
function messageCB(MyMessages){
var sqlstatement="";


	if(MyMessages.messages.length>0){
			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Messages:'+String(MyMessages.messages.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Messages:'+String(MyMessages.messages.length));
			}

			opMessage("Deleting Existing Messages");
			sqlstatement+='DELETE FROM MyMessages where msgfromid <> "SENTMSG";';
			opMessage("Loading"+MyMessages.messages.length+" Messages");
            //alert("Loading"+MyMessages.messages.length+" Messages");
			for(var cntx=0; cntx < MyMessages.messages.length ; cntx++)
				{	

				 sqlstatement+='INSERT INTO MyMessages (msgid, type , date , time , msgfromid, msgfromname, msgtoid, msgtoname, msgsubject, msgtext, expirydate, state ) VALUES ('+ 
					'"'+MyMessages.messages[cntx].id +'",'+  
					'"'+MyMessages.messages[cntx].type +'",'+  
					'"'+MyMessages.messages[cntx].date +'",'+ 
					'"'+MyMessages.messages[cntx].time +'",'+ 
					'"'+MyMessages.messages[cntx].fromid +'",'+ 
					'"'+MyMessages.messages[cntx].fromname +'",'+ 
					'"'+MyMessages.messages[cntx].toid +'",'+ 
					'"'+MyMessages.messages[cntx].toname +'",'+ 
					'"'+MyMessages.messages[cntx].description +'",'+ 
					'"'+MyMessages.messages[cntx].body+'",'+  
					'"'+MyMessages.messages[cntx].expirydate+'",'+
					'"'+MyMessages.messages[cntx].read+'");'  ;

				}
					
			html5sql.process(sqlstatement,
				 function(){
					var x = window.location.href.split("/")
					if(x[x.length-1]=="Home.html"){
						setCounts()
					}
				 },
				 function(error, statement){
					 //opMessage("Error: " + error.message + " when processing " + statement);
					 //alert("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
function formsCB(data){
	var sqlstatement="";


		if(data.form.length>0){
				

				opMessage("Deleting Existing Forms");
				sqlstatement+='DELETE FROM MyForms;';
				opMessage("Loading"+data.form.length+" Forms");
	            //alert("Loading"+MyMessages.messages.length+" Messages");
				for(var cntx=0; cntx < data.form.length ; cntx++)
					{	

					 sqlstatement+='INSERT INTO MyForms ( name, type, lastupdated, description, url ) VALUES ('+ 
						
						'"'+data.form[cntx].Name +'",'+ 
						'"'+data.form[cntx].Type +'",'+ 
						'"'+data.form[cntx].Created+'",'+  
						'"'+data.form[cntx].Description+'",'+
						'"'+data.form[cntx].URL+'");'  ;

					}
						
				html5sql.process(sqlstatement,
					 function(){
						
					 },
					 function(error, statement){
						
					 }        
				);


		}
	}
function materialsearchCB(data){


	var n = 0;
	

var opTable = sap.ui.getCore().getElementById("MaterialsSearch");
if(data.material.length>0){

for(var cntx=0; cntx < data.material.length ; cntx++)
{	
	opTable.addItem (new sap.m.ColumnListItem({
		key:"RM:"+data.material[cntx].id+":"+data.material[cntx].depot+":"+data.material[cntx].desc+":"+data.material[cntx].available,
		cells : 
			[
			new sap.m.Text({text: data.material[cntx].id}),
            new sap.m.Text({text: data.material[cntx].depot}),
            new sap.m.Text({text: unescape(data.material[cntx].desc)}),
			new sap.m.Text({text: data.material[cntx].available})   
	 		]
		}));
	
}

}else{
alert("nothing found")
}
}
function tsnpjobsCB(jobs){
var sqlstatement="";		

	if(jobs.NPJOBSRECORD.length>0){


			opMessage("Deleting Existing TS NP Jobs");
			sqlstatement+='DELETE FROM TSNPJobs;';
			opMessage("Loading"+jobs.NPJOBSRECORD.length+" TS NPJobs");
			for(var cntx=0; cntx < jobs.NPJOBSRECORD.length ; cntx++)
				{	

				sqlstatement+='INSERT INTO TSNPJobs (jobno , subtype , description ) VALUES ('+ 
					'"'+jobs.NPJOBSRECORD[cntx].JOBNO +'",'+  
					'"'+jobs.NPJOBSRECORD[cntx].SUBTYPE+'",'+  
					'"'+jobs.NPJOBSRECORD[cntx].DESC+'");' ;
					
					

				}		
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
function tsactivitiesCB(activities){
var sqlstatement="";		

	if(activities.ACTIVITYRECORD.length>0){


			opMessage("Deleting Existing TS Activities");
			sqlstatement+='DELETE FROM TSActivities;';
			opMessage("Loading"+activities.ACTIVITYRECORD.length+" TS Activities");
			for(var cntx=0; cntx < activities.ACTIVITYRECORD.length ; cntx++)
				{	

				sqlstatement+='INSERT INTO TSActivities (code , skill , subskill, description ) VALUES ('+ 
					'"'+activities.ACTIVITYRECORD[cntx].CODE +'",'+  
					'"'+activities.ACTIVITYRECORD[cntx].SKILL+'",'+ 
					'"'+activities.ACTIVITYRECORD[cntx].SUBSKILL+'",'+  					
					'"'+activities.ACTIVITYRECORD[cntx].DESC+'");' ;
					
					

				}		
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);


	}
}
function existsInArray(array,val){
	
	retv=false;
	for(var cntx=0; cntx <   array.length ; cntx++){
		if(array[cntx]==val){
			retv=true;
			cntx=array.length;
		}
	}
	return retv
}
function orderobjectsCB(MyObjects){
var objectsArray=[];
var sqlstatement="";		

	if(MyObjects.orderobjects.length>0){

			if(syncTransactionalDetsUpdated){
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+', Order Objects:'+String(MyObjects.orderobjects.length));
			}else{
				localStorage.setItem('LastSyncTransactionalDetails',localStorage.getItem('LastSyncTransactionalDetails')+'Order Objects:'+String(MyObjects.orderobjects.length));
			}
			opMessage("Deleting Existing Assets");
			sqlstatement+='DELETE FROM Assets;';
			sqlstatement+='DELETE FROM AssetClassVals;';
			sqlstatement+='DELETE FROM AssetMeasurementPoints;';
			sqlstatement+='DELETE FROM AssetInstalledEquip;';
			opMessage("Loading "+MyObjects.orderobjects.length+" Assets");
			for(var cntx=0; cntx <   MyObjects.orderobjects.length ; cntx++){
			  if(!existsInArray(objectsArray,MyObjects.orderobjects[cntx].objtype+":"+MyObjects.orderobjects[cntx].objid))
				{
				objectsArray.push(MyObjects.orderobjects[cntx].objtype+":"+MyObjects.orderobjects[cntx].objid)
				objtype=MyObjects.orderobjects[cntx].objtype;
				objid=MyObjects.orderobjects[cntx].objid;
				objshorttext=MyObjects.orderobjects[cntx].shorttext; 
				objaddress=MyObjects.orderobjects[cntx].address;
				objswerk=MyObjects.orderobjects[cntx].swerk;

				sqlstatement+='INSERT INTO Assets (type , id , shorttext , address, workcenter ) VALUES ("'+objtype+'","'+  objid+'","'+ objshorttext+'","'+ objaddress+'","'+ objswerk+'");';
				//Loop and write Classvals to DB

				 opMessage("Loading "+MyObjects.orderobjects[cntx].classval.length+" Class Vals");
				
				for(var opscnt=0; opscnt < MyObjects.orderobjects[cntx].classval.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO AssetClassVals (type , id, charact , valuechar , valueto , valueneutral , description) VALUES ('+ 
						'"'+objtype+'",'+
						 '"'+objid+'",'+
						 '"'+MyObjects.orderobjects[cntx].classval[opscnt].charact+'",'+
						 '"'+MyObjects.orderobjects[cntx].classval[opscnt].valuechar+'",'+
						 '"'+MyObjects.orderobjects[cntx].classval[opscnt].valueto+'",'+
						 '"'+MyObjects.orderobjects[cntx].classval[opscnt].valueneutralv +'",'+
						 '"'+MyObjects.orderobjects[cntx].classval[opscnt].description+'");'
				
				 }
				//Loop and write Measurement Points to DB

				opMessage("Loading "+MyObjects.orderobjects[cntx].measpoint.length+" Mesurement Points");
				
				for(var opscnt=0; opscnt < MyObjects.orderobjects[cntx].measpoint.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO AssetMeasurementPoints (type , id, mpoint  , description) VALUES ( '+
						'"'+objtype+'",'+
						  '"'+objid+'",'+
						 '"'+MyObjects.orderobjects[cntx].measpoint[opscnt].mpoint+'",'+ 
						 '"'+MyObjects.orderobjects[cntx].measpoint[opscnt].description+'");'
				
					}
			
				//Loop and write Installed Equipment to DB

				opMessage("Loading "+MyObjects.orderobjects[cntx].installedquip.length+" Installed Equipment");
				
				 for(var opscnt=0; opscnt < MyObjects.orderobjects[cntx].installedquip.length ; opscnt++)
					{	
					
					sqlstatement+='INSERT INTO AssetInstalledEquip (type , id, eqno , description) VALUES ( '+
					 '"'+objtype+'",'+
						  '"'+objid+'",'+
						  '"'+MyObjects.orderobjects[cntx].installedquip[opscnt].eqno+'",'+ 
						  '"'+MyObjects.orderobjects[cntx].installedquip[opscnt].type+'");'
				
					 }
				
				} //End of if in array
			}	//end of the Objects Loop
							
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Loading Orders");
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
					
				 }        
			);


	}
}
	
function refdataCB(MyReference){
var sqlstatement="";

opMessage("Callback Reference Data triggured");
	    
	if(MyReference.scenario.length>0){
			if(syncReferenceDetsUpdated){
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', Scenarios:'+String(MyReference.scenario.length));
			}else{
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'Scenarios:'+String(MyReference.scenario.length));
			}
			opMessage("Deleting Existing Reference Data");
			sqlstatement+='DELETE FROM MyRefOrderTypes;';
			sqlstatement+='DELETE FROM MyRefNotifTypes;';
			sqlstatement+='DELETE FROM MyMenuBar;';
			sqlstatement+='DELETE FROM REFPAICODES;';
			sqlstatement+='DELETE FROM REFNOTIFICATIONTYPES;';
			sqlstatement+='DELETE FROM REFVARIANCESRFV;';
			sqlstatement+='DELETE FROM REFACTIVITY;';
			sqlstatement+='DELETE FROM MyRefPriorityTypes;';
			sqlstatement+='DELETE FROM MyRefUserStatusProfiles;';
			html5sql.process(sqlstatement,
					 function(){
						 
					
					
			
			for(var cntx=0; cntx < MyReference.scenario.length ; cntx++)
				{
				sqlstatement="";
				opMessage("Loading Scenario "+MyReference.scenario[cntx].scenario + " Reference Data");
				//Loop and write MenuBar to DB
		
				opMessage("Loading "+MyReference.scenario[cntx].appbar.length+" Menu Bar");
				for(var opscnt=0; opscnt < MyReference.scenario[cntx].appbar.length ; opscnt++)
					{	
				
					sqlstatement+='INSERT INTO MyMenuBar (scenario, level ,item, position, type ,subitem ,command, item2) VALUES ('+
						 '"'+MyReference.scenario[cntx].scenario+'",'+
						 '"'+MyReference.scenario[cntx].appbar[opscnt].level+'",'+
						 '"'+MyReference.scenario[cntx].appbar[opscnt].item+'",'+
						 '"'+MyReference.scenario[cntx].appbar[opscnt].position+'",'+
						 '"'+MyReference.scenario[cntx].appbar[opscnt].type+'",'+
						 '"'+MyReference.scenario[cntx].appbar[opscnt].subitem+'",'+
						 '"'+unescape(MyReference.scenario[cntx].appbar[opscnt].command)+'",'+
						 '"'+MyReference.scenario[cntx].appbar[opscnt].item2+'");';
					}
					//Loop and write ordertypes to DB

					opMessage("Loading "+MyReference.scenario[cntx].ordertype.length+" Order Types");
					for(var opscnt=0; opscnt < MyReference.scenario[cntx].ordertype.length ; opscnt++)
						{	
					
						sqlstatement+='INSERT INTO MyRefOrderTypes (scenario, type , description, statusprofile ,opstatusprofile ,priorityprofile) VALUES ('+
							 '"'+MyReference.scenario[cntx].scenario+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].type+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].description+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].statusprofile+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].opstatusprofile+'",'+
							 '"'+MyReference.scenario[cntx].ordertype[opscnt].priorityprofile+'");';
						}
						//Loop and write notiftypes to DB


						opMessage("Loading "+MyReference.scenario[cntx].notiftype.length+" Notif Types");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].notiftype.length ; opscnt++)
							{	
							
							sqlstatement+='INSERT INTO MyRefNotifTypes (scenario , type , description , statusprofile,	taskstatusprofile , priority_type ) VALUES  ('+
								 '"'+MyReference.scenario[cntx].scenario+'",'+
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].type+'",'+
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].description+'",'+
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].statusprofile+'",'+
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].taskstatusprofile+'",'+
								 '"'+MyReference.scenario[cntx].notiftype[opscnt].priority_type+'");';
						}
							
//Loop and write paicodes to DB


						opMessage("Loading "+MyReference.scenario[cntx].pai_codes.length+" PAI Codes");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].pai_codes.length ; opscnt++)
							{	
							y=unescape(MyReference.scenario[cntx].pai_codes[opscnt].kurztext_code)
							x=y.replace(/'/g, "");;
							x=x.replace(/"/g, "");;
							x=x.replace("\/", " ");;
							x=x.replace(/&/g, "");;	
							sqlstatement+='INSERT INTO REFPAICODES (scenario , userid , level , stsma,	plant, work_cntr , catalogue , codegrp , kurztext_group,	code , kurztext_code) VALUES  ('+
								 '"'+MyReference.scenario[cntx].scenario+'",'+
								 '"'+MyReference.scenario[cntx].pai_codes[opscnt].userid+'",'+
								 '"'+MyReference.scenario[cntx].pai_codes[opscnt].level+'",'+
								 '"'+MyReference.scenario[cntx].pai_codes[opscnt].stsma+'",'+
								 '"'+MyReference.scenario[cntx].pai_codes[opscnt].plant+'",'+
								 '"'+MyReference.scenario[cntx].pai_codes[opscnt].work_cntr+'",'+
								 '"'+MyReference.scenario[cntx].pai_codes[opscnt].catalogue+'",'+
								 '"'+MyReference.scenario[cntx].pai_codes[opscnt].codegrp+'",'+
								 '"'+MyReference.scenario[cntx].pai_codes[opscnt].kurztext_group+'",'+
								 '"'+MyReference.scenario[cntx].pai_codes[opscnt].code+'",'+
								 '"'+x+'");';
						}
//Loop and write Notification Types to DB


						opMessage("Loading "+MyReference.scenario[cntx].notification_types.length+" notification Types");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].notification_types.length ; opscnt++)
							{	
							
							sqlstatement+='INSERT INTO REFNOTIFICATIONTYPES (scenario , userid , level_number , notiftype,	notifdesc , notifprofile , priotype , priority,	prioritydesc ) VALUES  ('+
								 '"'+MyReference.scenario[cntx].scenario+'",'+
								 '"'+MyReference.scenario[cntx].notification_types[opscnt].userid+'",'+
								 '"'+MyReference.scenario[cntx].notification_types[opscnt].level_number+'",'+
								 '"'+MyReference.scenario[cntx].notification_types[opscnt].notiftype+'",'+
								 '"'+MyReference.scenario[cntx].notification_types[opscnt].notifdesc+'",'+
								 '"'+MyReference.scenario[cntx].notification_types[opscnt].notifprofile+'",'+
								 '"'+MyReference.scenario[cntx].notification_types[opscnt].priotype+'",'+
								 '"'+MyReference.scenario[cntx].notification_types[opscnt].priority+'",'+
								 '"'+unescape(MyReference.scenario[cntx].notification_types[opscnt].prioritydesc)+'");';
						}	
//Loop and write VariancesRFV to DB


						opMessage("Loading "+MyReference.scenario[cntx].variancesrfv.length+" VariancesRFV");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].variancesrfv.length ; opscnt++)
							{	
							
							sqlstatement+='INSERT INTO REFVARIANCESRFV (scenario , userid , plant , work_cntr,	job_activity , dev_reason , dev_reas_txt , mandate ) VALUES  ('+
								 '"'+MyReference.scenario[cntx].scenario+'",'+
								 '"'+MyReference.scenario[cntx].variancesrfv[opscnt].userid+'",'+
								 '"'+MyReference.scenario[cntx].variancesrfv[opscnt].plant+'",'+
								 '"'+MyReference.scenario[cntx].variancesrfv[opscnt].work_cntr+'",'+
								 '"'+MyReference.scenario[cntx].variancesrfv[opscnt].job_activity+'",'+
								 '"'+MyReference.scenario[cntx].variancesrfv[opscnt].dev_reason+'",'+
								 '"'+unescape(MyReference.scenario[cntx].variancesrfv[opscnt].dev_reas_txt)+'",'+
								 '"'+MyReference.scenario[cntx].variancesrfv[opscnt].mandate+'");';
						}
//Loop and write Activity to DB


						opMessage("Loading "+MyReference.scenario[cntx].activity.length+" Activity");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].activity.length ; opscnt++)
							{	
									y=MyReference.scenario[cntx].activity[opscnt].activity_desc
										x=y.replace(/'/g, "");;
										x=x.replace("\/", "");;
										x=x.replace(/&/g, "");;	
							sqlstatement+='INSERT INTO REFACTIVITY (scenario , work_center , activity , activity_desc,	action , deflt  ) VALUES  ('+
								 '"'+MyReference.scenario[cntx].scenario+'",'+
								 '"'+MyReference.scenario[cntx].activity[opscnt].work_center+'",'+
								 '"'+MyReference.scenario[cntx].activity[opscnt].activity+'",'+
								 '"'+x+'",'+
								 '"'+MyReference.scenario[cntx].activity[opscnt].action+'",'+
								 '"'+MyReference.scenario[cntx].activity[opscnt].deflt+'");';
						}						
							//Loop and write prioritytypes to DB

						opMessage("Loading "+MyReference.scenario[cntx].prioritytype.length+" Priority Types");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].prioritytype.length ; opscnt++)
							{	
							
							sqlstatement+='INSERT INTO MyRefPriorityTypes (scenario, type , priority, description ) VALUES  ('+
								 '"'+MyReference.scenario[cntx].scenario+'",'+
								 '"'+MyReference.scenario[cntx].prioritytype[opscnt].type+'",'+
								 '"'+MyReference.scenario[cntx].prioritytype[opscnt].priority+'",'+
								 '"'+MyReference.scenario[cntx].prioritytype[opscnt].description+'");';
							
							}
						//Loop and write prioritytypes to DB
						opMessage("Loading "+MyReference.scenario[cntx].userstatus.length+" Status Profiles");
						for(var opscnt=0; opscnt < MyReference.scenario[cntx].userstatus.length ; opscnt++)
							{	
								y=unescape(MyReference.scenario[cntx].userstatus[opscnt].statusdesc)
										x=y.replace(/'/g, "");;
										x=x.replace("\/", "");;
										x=x.replace(/&/g, "");;		
							sqlstatement+='INSERT INTO MyRefUserStatusProfiles (scenario, type , status, statuscode, statusdesc ) VALUES  ('+
									 '"'+MyReference.scenario[cntx].scenario+'",'+
									 '"'+MyReference.scenario[cntx].userstatus[opscnt].type+'",'+
									 '"'+MyReference.scenario[cntx].userstatus[opscnt].status+'",'+
									 '"'+MyReference.scenario[cntx].userstatus[opscnt].statuscode+'",'+
									 '"'+x +'");';
							
							}			



						html5sql.process(sqlstatement,
								 function(){
									 //alert("Success - Finished Loading Scenario");
								
								 },
							 function(error, statement){
									// alert("Error: " + error.message + " when processing " + statement);
									 opMessage("Error: " + error.message + " when processing " + statement);

								 }        
							);				
			}
	
			 },
			 function(error, statement){
				 opMessage("Error: " + error.message + " when processing " + statement);
			 }        
		);


	}
	
}
function refdatacodesCB(MyReference){
var sqlstatement="";


opMessage("Callback Reference Data Codes triggured");

	if(MyReference.catprofile.length>0){
			if(syncReferenceDetsUpdated){
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+', CatProfiles:'+String(MyReference.catprofile.length));
			}else{
				localStorage.setItem('LastSyncReferenceDetails',localStorage.getItem('LastSyncReferenceDetails')+'CatProfiles:'+String(MyReference.catprofile.length));
			}
			opMessage("Deleting Existing Reference Data");
			sqlstatement+='DELETE FROM RefNotifprofile;';
			sqlstatement+='DELETE FROM RefCodeGroups;';
			sqlstatement+='DELETE FROM RefCodes;';
			sqlstatement1="";
			//alert(MyReference.catprofile.length)
			html5sql.process(sqlstatement,
				 function(){
					
						sqlstatement='';
						rcgcnt=0;
						for(var cntx=0; cntx < MyReference.catprofile.length ; cntx++)
							{	
							
							sqlstatement+='INSERT INTO RefNotifprofile (scenario, profile , notif_type ) VALUES ('+
									 '"'+MyReference.catprofile[cntx].scenario+'",'+
									 '"'+MyReference.catprofile[cntx].notifcat_profile+'",'+
									 '"'+MyReference.catprofile[cntx].notifcat_type+'");';
								
								

								//Loop and write codegroups to DB
								
								sqlstatement+=prepLogMessage("Loading "+MyReference.catprofile[cntx].notifcat_profile+MyReference.catprofile[cntx].codegroup.length)+";";
								for(var opscnt=0; opscnt < MyReference.catprofile[cntx].codegroup.length ; opscnt++)
								{
									sqlstatement+='INSERT INTO RefCodeGroups (scenario, profile , catalog_type , code_cat_group , codegroup , codegroup_text  ) VALUES  ('+
										'"'+MyReference.catprofile[cntx].scenario+'",'+
										 '"'+MyReference.catprofile[cntx].notifcat_profile+'",'+
										 '"'+MyReference.catprofile[cntx].codegroup[opscnt].catalog_type+'",'+
										 '"'+MyReference.catprofile[cntx].codegroup[opscnt].code_cat_group+'",'+
										 '"'+MyReference.catprofile[cntx].codegroup[opscnt].codegroup+'",'+
										 '"'+unescape(MyReference.catprofile[cntx].codegroup[opscnt].codegroup_text)+'");';
									
									
									//Loop and write codes to DB
									
									sqlstatement+=prepLogMessage("Loading "+MyReference.catprofile[cntx].codegroup[opscnt].codes.length+" Codes")+";";
									for(var ccnt=0; ccnt < MyReference.catprofile[cntx].codegroup[opscnt].codes.length ; ccnt++)
										{	
										y=unescape(MyReference.catprofile[cntx].codegroup[opscnt].codes[ccnt].code_text)
										x=y.replace(/'/g, "");;
										x=x.replace(/"/g, "");;
										x=x.replace("\/", "");;
										x=x.replace(/&/g, "");;
										sqlstatement+='INSERT INTO RefCodes (scenario, profile , code_cat_group , code , code_text ) VALUES  ('+
											 '"'+MyReference.catprofile[cntx].scenario+'",'+
											 '"'+MyReference.catprofile[cntx].notifcat_profile+'",'+
											 '"'+MyReference.catprofile[cntx].codegroup[opscnt].code_cat_group+'",'+
											 '"'+MyReference.catprofile[cntx].codegroup[opscnt].codes[ccnt].code+'",'+
											 '"'+x+'");';
										}
								
									}
								}				 

										
			html5sql.process(sqlstatement,
				 function(){
					 //alert("Success - Finished Reference Codes");
				 },
				 function(error, statement){
					// alert("Error: " + error.message + " when processing " + statement);
				 }        
			);		
					rcgcnt=0;
				 },
				 function(error, statement){
					 opMessage("Error: " + error.message + " when processing " + statement);
				 }        
			);	
	


	}

}






function surveysCB(data){
	var sqlstatement="";
	var ret = [];
	var dependson;
	
	opMessage("Callback Surveys triggured");
	
		if(data.Surveys.length>0){

				opMessage("Deleting Existing Reference Data");
			
				sqlstatement+='DELETE FROM Survey;';
				sqlstatement+='DELETE FROM SurveyGroup;';
				sqlstatement+='DELETE FROM SurveyQuestion;';
				sqlstatement+='DELETE FROM SurveySubQuestion;';
				sqlstatement+='DELETE FROM  SurveyQuestionChildren;';
				sqlstatement1="";
			
				html5sql.process(sqlstatement,
					 function(){
						
							sqlstatement='';
							rcgcnt=0;
							for(var cntx=0; cntx < data.Surveys.length ; cntx++)
								{	
								
								sqlstatement+='INSERT INTO Survey (surveyid, name ) VALUES ('+
										 '"'+data.Surveys[cntx].SurveyID+'",'+
										 '"'+data.Surveys[cntx].SurveyName+'");';
								for(var cntg=0; cntg < data.Surveys[cntx].Group.length ; cntg++)
									{	
									
									sqlstatement+='INSERT INTO SurveyGroup (surveyid, groupid, name, title ) VALUES ('+
											 '"'+data.Surveys[cntx].SurveyID+'",'+
											 '"'+data.Surveys[cntx].Group[cntg].GroupID+'",'+
											 '"'+data.Surveys[cntx].Group[cntg].GroupName+'",'+
											 '"'+data.Surveys[cntx].Group[cntg].GroupDescription+'");';

									
									for(var cntq=0; cntq < data.Surveys[cntx].Group[cntg].Question.length ; cntq++)
										{	
										dependson=data.Surveys[cntx].Group[cntg].Question[cntq].QuestionDependsOn+": : ";
										ret=dependson.split(':');
										sqlstatement+='INSERT INTO SurveyQuestion (surveyid, groupid, questionid, questiontype, defaultvalue, name, title, dependsonid, dependsonval) VALUES ('+
												 '"'+data.Surveys[cntx].SurveyID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].GroupID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionType+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionDefaultValue+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionName+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionText+'",'+
												 '"'+ret[0]+'",'+	
												 '"'+ret[1]+'");';
										for(var cntsq=0; cntsq < data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion.length ; cntsq++)
										{	
										dependson=data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion[cntsq].SubQuestionDependsOn+": : ";
										ret=dependson.split(':');
										sqlstatement+='INSERT INTO SurveySubQuestion (surveyid, groupid, questionid, subquestionid, subquestiontype, name, title, dependsonid, dependsonval) VALUES ('+
												 '"'+data.Surveys[cntx].SurveyID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].GroupID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].QuestionID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion[cntsq].SubQuestionID+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion[cntsq].SubQuestionType+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion[cntsq].SubQuestionName+'",'+
												 '"'+data.Surveys[cntx].Group[cntg].Question[cntq].SubQuestion[cntsq].SubQuestionText+'",'+
												 '"'+ret[0]+'",'+	
												 '"'+ret[1]+'");';
											
											

											}																	
											

											}										
										

										}
								
								
								
									

									}				 

										
								html5sql.process(sqlstatement,
									 function(){
										//alert("Success - Finished Loading Survey Data");
									 },
									 function(error, statement){
										 //alert("Error: " + error.message + " when processing " + statement);
									 }        
								);	
				BuildQuestionChildren();
				},	
				 function(error, statement){
					 //alert("Error: " + error.message + " when processing " + statement);
				 }        
			);		

	}
	
}
function BuildQuestionChildren(){
	var sqlstatement="";
	var sqlstatement1="";
	var question = " ";
	var questionchildren='';
	var questionvalue="";
	
	opMessage("Building Survey Question Children");

			
				sqlstatement='Select * from SurveyQuestion where dependsonid > 0 order by dependsonid';

				html5sql.process(sqlstatement,
						function(transaction, results, rowsArray){
							if( rowsArray.length > 0) {
								for (var n = 0; n < rowsArray.length; n++) {
									item = rowsArray[n];
									//alert(item.questionid+"-"+item.name);
								
									if (item.dependsonid != question){
										if (question != ' '){								
										
											sqlstatement1+='INSERT INTO surveyquestionchildren (surveyid , groupid, questionid, questionvalue, childquestions ) VALUES ("'+
												item.surveyid+'", "'+item.groupid+'", "'+question+'", "'+questionvalue+'", "'+questionchildren+'");';
										}

									question=item.dependsonid;
									questionvalue=item.dependsonval;
									questionchildren =item.questionid;	
									}else{
										questionchildren += ":"+item.questionid;	
									}

									
								}
								
								
								html5sql.process(sqlstatement1,
										function(transaction, results, rowsArray){
											

										},
										 function(error, statement){
											 window.console&&console.log("Error: " + error.message + " when processing " + statement);
										 }   
									);									
					
							}

						},
						 function(error, statement){
							 window.console&&console.log("Error: " + error.message + " when processing " + statement);
						 }   
					);	

	
	
}
