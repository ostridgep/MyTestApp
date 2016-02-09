var oLayout1 = new sap.ui.layout.form.GridLayout();
var oLayout1a = new sap.ui.layout.form.GridLayout();
              var oLayout2 = new sap.ui.layout.form.ResponsiveLayout();
              var oLayout3 = new sap.ui.layout.form.ResponsiveGridLayout();

              var oForm1 = new sap.ui.layout.form.Form("DG51F1",{
                     
                     editable: true,
                     layout: oLayout1a,
                     formContainers: [

                           new sap.ui.layout.form.FormContainer("DG51F1C1",{
                                  
                                  formElements: [
                                         new sap.ui.layout.form.FormElement({
                                                label: "Functional Location",
                                                fields: [new sap.m.Input("Close_FunctionalLocation",{type: sap.m.InputType.Input, enabled: true})
                                                ]
                                         }),
                                         new sap.ui.layout.form.FormElement({
                                                label: "Equipment ID",
                                                fields: [new sap.m.Input("Close_Equipment",{type: sap.m.InputType.Input, enabled: true})
                                                ]
                                         }),
                                         new sap.ui.layout.form.FormElement({
                                                label: "",
                                                fields: [                         new sap.m.Button( {
                                                    text: "Select Asset",
                                                    type:     sap.m.ButtonType.Success,
                                                    tap: [ function(oEvt) {  
                                                    	SearchMode="CLOSE"
                                                    		
                                                    	formSearchAsset.open() 
                                                    
                                                    	
                                                                } ]
                                                })
                                                ]
                                         }),
                                         new sap.ui.layout.form.FormElement({
                                             label: "In Shift Time",
                                             fields: [new sap.m.DateTimeInput("Close_InShiftTime",{
                        							placeholder : "Time Picker",
                           							type : "Time",
                           							valueFormat : "HH:mm",
                           							value : "0:0",
                           							displayFormat : "H'h' m'm'",
                           							
                           						})
                              
                                             ]
                                      }),
                                        
                                         
                                      new sap.ui.layout.form.FormElement({
                                          label: "Out Of Shift Time",
                                          fields: [new sap.m.DateTimeInput("Close_OutOfShiftTime",{
                  							placeholder : "Time Picker",
                   							type : "Time",
                   							valueFormat : "HH:mm",
                   							value : "0:0",
                   							displayFormat : "H'h' m'm'",
                   							
                   						})
                           
                                        ]
                                      }),
                                         ],
                                  layoutData: new sap.ui.core.VariantLayoutData({
                                                multipleLayoutData: [new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, minWidth: 400}),
                                                                         new sap.ui.layout.form.GridContainerData({halfGrid: true}),
                                                                         new sap.ui.layout.GridData({linebreakL: true})]
                                                })
                           }),
                           new sap.ui.layout.form.FormContainer("DG51F1C2",{
                               
                               formElements: [
                                              new sap.ui.layout.form.FormElement({
                                                  label: "Problem Group",
                                                  fields: [new sap.m.Select('Close_ProblemGroup',{
                                                         
                                                         items: [
                                                                
                                                         ],

                                                         change: function(oControlEvent) {
                                                                
                                                                BuildCloseProblemCodes(oControlEvent.getParameter("selectedItem").getKey());
                                                         }
                                                  }),
                                                  ]
                                           }) ,                                    
                                      new sap.ui.layout.form.FormElement({
                                             label: "Problem Code",
                                             fields: [new sap.m.Select('Close_ProblemCode',{
                                                    
                                                    items: [
                                                           
                                                    ],

                                                    change: function(oControlEvent) {
                                                           
                                                           //BuildPriorities(oControlEvent.getParameter("selectedItem").getKey());
                                                    }
                                             }),
                                             ]
                                      }),
                                      new sap.ui.layout.form.FormElement({
                                          label: "Action Group",
                                          fields: [new sap.m.Select('Close_ActionGroup',{
                                                 
                                                 items: [
                                                        
                                                 ],

                                                 change: function(oControlEvent) {
                                                        
                                                	 BuildCloseActionCodes(oControlEvent.getParameter("selectedItem").getKey());
                                                 }
                                          }),
                                          ]
                                   }),
                                      new sap.ui.layout.form.FormElement({
                                             label: "Action Code",
                                             fields: [new sap.m.Select('Close_ActionCode',{
                                                    
                                                    items: [
                                                           
                                                    ],

                                                    change: function(oControlEvent) {
                                                           
                                                           //BuildPriorities(oControlEvent.getParameter("selectedItem").getKey());
                                                    }
                                             }),
                                             ]
                                      }),
                                      new sap.ui.layout.form.FormElement({
                                          label: "Impact Group",
                                          fields: [new sap.m.Select('Close_ImpactGroup',{
                                                 
                                                 items: [
                                                        
                                                 ],

                                                 change: function(oControlEvent) {
                                                        
                                                	 BuildCloseImpactCodes(oControlEvent.getParameter("selectedItem").getKey());
                                                 }
                                          }),
                                          ]
                                   }),
                                      new sap.ui.layout.form.FormElement({
                                             label: "Impact Code",
                                             fields: [new sap.m.Select('Close_ImpactCode',{
                                                    
                                                    items: [
                                                           
                                                    ],

                                                    change: function(oControlEvent) {
                                                           
                                                           
                                                    }
                                             }),
                                             ]
                                      })
                                      ],
                               layoutData: new sap.ui.core.VariantLayoutData({
                                             multipleLayoutData: [new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, minWidth: 400}),
                                                                      new sap.ui.layout.form.GridContainerData({halfGrid: true}),
                                                                      new sap.ui.layout.GridData({linebreakL: true})]
                                             })
                        }),
                        new sap.ui.layout.form.FormContainer("DG51F1C3",{
                            
                            formElements: [
                                 
                                  
                                   new sap.ui.layout.form.FormElement("FEClose_LongText",{
                                  	 label: "Long Text",
                                          fields: [new sap.m.TextArea("Close_LongText",{ rows: 5})
                                          ]
                                   })
                     
                                   ],
                            layoutData: new sap.ui.core.VariantLayoutData({
                                          multipleLayoutData: [new sap.ui.layout.ResponsiveFlowLayoutData({linebreak: true, minWidth: 400}),
                                                                   new sap.ui.layout.form.GridContainerData({halfGrid: true}),
                                                                   new sap.ui.layout.GridData({linebreakL: true})]
                                          })
                     })
                           ]

              });

                           var oForm2 = new sap.ui.layout.form.Form("DG52F1",{
                               
                               editable: true,
                               layout: oLayout1,
                               formContainers: [

                           new sap.ui.layout.form.FormContainer("DG52F1C1",{
                                  
                                  
                                  formElements: [

                                         new sap.ui.layout.form.FormElement({
                                                label: "Additional Work Required",
                                                fields: [ new sap.m.Switch("Close_Work",{
                                                state:false,
                                                change:[function(evt){
                                                       
                                                    	   sap.ui.getCore().getElementById("FEClose_Variance").setVisible(this.getState())   
                                                    	   sap.ui.getCore().getElementById("FEClose_Reason").setVisible(this.getState())   
                                                       
                                                       
                                                }],
                                                type: sap.m.SwitchType.AcceptReject
                                         })
                                                ]
                                         }),
                                         new sap.ui.layout.form.FormElement("FEClose_Variance",{
                                                label: "Variance",
                                                fields: [new sap.m.Select('Close_Variance',{
                                                       
                                                       items: [
                                                              
                                                       ],

                                                       change: function(oControlEvent) {
                                                              
                                                              //BuildPriorities(oControlEvent.getParameter("selectedItem").getKey());
                                                       }
                                                }),
                                                ]
                                         }),
                                         new sap.ui.layout.form.FormElement("FEClose_Reason",{
                                                label: "Reason",
                                                fields: [new sap.m.Input("Close_Reason",{type: sap.m.InputType.Input, enabled: true})
                                                ]
                                         }),

                                  ],
                                  layoutData: new sap.ui.core.VariantLayoutData({
                                         multipleLayoutData: [new sap.ui.layout.form.GridContainerData({halfGrid: true}),
                                                                    new sap.ui.layout.ResponsiveFlowLayoutData({minWidth: 150}),
                                                                                                                                  new sap.ui.layout.GridData({linebreakL: false})]
                                         })
                           })

                     ]
              });

              

function buildDG5Tabs(){
       var tabBar  = new sap.m.IconTabBar('DG5tabBar',
                     {
                           expanded:'{device>/isNoPhone}',

                           select:[function(oEvt) {   
                                  currentPage=window.location.href

                                         
                                    if(oEvt.getParameters().key=="DG51"){}
                                    if(oEvt.getParameters().key=="DG52"){}

                                  
                                  }
                           ],
                           
                           items: [
                                         new sap.m.IconTabFilter( {
                                             key:'DG51',
                                             tooltip: 'Close Job Details',
                                             text: "Close",
                                             content:[oForm1
                                                      ]
                                         }),
                                         new sap.m.IconTabFilter( {
                                                    key:'DG52',
                                                    tooltip: 'Follow On Work',
                                                    text: "Follow On Work",
                                                    content:[oForm2
                                                                           
                                                             ]
                                                })
                                  ]
                     })
       return tabBar;

       }


