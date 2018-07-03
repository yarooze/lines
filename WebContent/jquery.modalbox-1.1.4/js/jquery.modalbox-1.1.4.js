/*
* jQuery modalBox plugin v1.1.4 <http://code.google.com/p/jquery-modalbox-plugin/> 
* @requires jQuery v1.3.2 or later 
* is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
(function($){
	
	
	/*
		Example 1 / Show hidden content:
		------------------------------------
		<a class="openmodalbox" href="javascript:void(0);">
			Demolink / Content from &quot;span.modalboxContent&quot;
			<span class="modalboxContent">
				<!-- put HTML-Content here -->
			</span>
		</a>
		
		Example 2 / Show hidden content:
		------------------------------------
		<div id="yourOwnContentContainer" style="display:none;">
			<!-- put HTML-Content here -->
		</div>
		<a class="defineYoutOwnClassHere" href="javascript:void(0);">
			Demolink / Content from Custom Container &quot;div#yourOwnContentContainer&quot;
		</a>
		<script type="text/javascript">
			jQuery(document).ready(function(){
				jQuery("a.defineYoutOwnClassHere").modalBox({
					getStaticContentFrom : "#yourOwnContentContainer"
				});
			});
		</script>
		
		Example 3 / Ajax Link:
		------------------------------------
		<a class="openmodalbox" href="javascript:void(0);">
			Demolink / Ajax Link
			<input type="hidden" name="ajaxhref" value="yourcustomtemplate.html" />
		</a>
		
		Example 4 / Ajax Form:
		------------------------------------
		<form ction="" method="post">
			<input class="defaultInputsubmit openmodalbox" type="submit" value="open Form Content in modalBox" />
		</form>
		
		Example 5 / Direct Call, source:
		------------------------------------
		jQuery.fn.modalBox({ 
			directCall : {
				source : '<?php print $path_link."templates/modalbox/testinclude_1.php?test=tester" ?>'
			}
		});
		
		Example 5 / Direct Call, data:
		------------------------------------
		jQuery.fn.modalBox({ 
			directCall : {
				data : '<div class="testclass">test</div>'
			}
		});
		
		Example 5 / Direct Call, element:
		------------------------------------
		jQuery.fn.modalBox({ 
			directCall : {
				element : '#defineYourContentContainerHere'
			}
		});
		
		Example 6 / set custom localized strings:
		---------------------------------------
		<script type="text/javascript">
			var modalboxLocalizedStrings = {
				messageCloseWindow				: 'Fenster schliessen',
				messageAjaxLoader				: 'Bitte warten<br>Ihre Anfrage wird verarbeitet.',
				errorMessageIfNoDataAvailable	: '<strong>Keine Inhalte verf&uuml;gbar!</strong>',
				errorMessageXMLHttpRequest		: 'Ein technischer Fehler (XML-Http-Request Status "500") verhindert den Aufruf der Seite.<br /><br />Bitte versuchen Sie es sp&auml;ter noch einmal',
				errorMessageTextStatusError		: 'Ein technischer Fehler (AJAX-Anfrage fehlgeschlagen) verhindert den Aufruf der Seite.<br /><br />Bitte versuchen Sie es sp&auml;ter noch einmal'
			};
		</script>
	*/
	
	
	// Default options
	var defaults = {
		
		obsoleteIE678Browser 				: ((jQuery.browser.msie && parseInt(jQuery.browser.version) < 9) ? true : false ),
		
		setModalboxContainer				: '#modalBox',
		setModalboxBodyContainer			: '#modalBoxBody',
		setModalboxBodyContentContainer		: '.modalBoxBodyContent',
		setFaderLayer						: '#modalBoxFaderLayer',
		setAjaxLoader						: '#modalBoxAjaxLoader',
		setModalboxCloseButtonContainer 	: '#modalBoxCloseButton',
		getStaticContentFromInnerContainer	: '.modalboxContent',
		setNameOfHiddenAjaxInputField		: 'ajaxhref',
		setNameOfPreCacheContainer			: '#modalboxPreCacheContainer',
		setNameOfGalleryImage				: 'modalgallery',
		
		
		/*
			Layout Container:
			--------------------------------------------
			<div class="modalboxStyleContainer_surface_left">
				<div class="modalboxStyleContainer_surface_right">
					<div class="modalboxStyleContainerContent">
						<div class="modalBoxBodyContent">
							
							Content
							
						</div>
					</div>
				</div>
			</div>

			<div class="modalboxStyleContainer_corner_topLeft"><!-- - --></div>
			<div class="modalboxStyleContainer_corner_topRight"><!-- - --></div>

			<div class="modalboxStyleContainer_corner_bottomLeft"><!-- - --></div>
			<div class="modalboxStyleContainer_corner_bottomRight"><!-- - --></div>

			<div class="modalboxStyleContainer_surface_top"><div class="modalboxStyleContainer_surface_body"><!-- - --></div></div>
			<div class="modalboxStyleContainer_surface_bottom"><div class="modalboxStyleContainer_surface_body"><!-- - --></div></div>
		*/
		setModalboxLayoutContainer_Begin	: '<div class="modalboxStyleContainer_surface_left"><div class="modalboxStyleContainer_surface_right"><div class="modalboxStyleContainerContent"><div class="modalBoxBodyContent">',
		setModalboxLayoutContainer_End		: '</div></div></div></div><div class="modalboxStyleContainer_corner_topLeft"><!-- - --></div><div class="modalboxStyleContainer_corner_topRight"><!-- - --></div><div class="modalboxStyleContainer_corner_bottomLeft"><!-- - --></div><div class="modalboxStyleContainer_corner_bottomRight"><!-- - --></div><div class="modalboxStyleContainer_surface_top"><div class="modalboxStyleContainer_surface_body"><!-- - --></div></div><div class="modalboxStyleContainer_surface_bottom"><div class="modalboxStyleContainer_surface_body"><!-- - --></div></div>',
		
		
		setWidthOfModalLayer				: null,
		customClassName 					: null,
		positionLeft 						: null,
		positionTop 						: null,
		
		fadeInActive						: true,
		fadeInSpeed							: "fast", //options: string or integer ("fast" or 600)
		
		fadeOutActive						: true,
		fadeOutSpeed						: "fast", //options: string or integer ("fast" or 600)
		
		localizedStrings					: {
			messageCloseWindow					: 'Close Window',
			messageAjaxLoader					: 'Please wait',
			errorMessageIfNoDataAvailable		: '<strong>No content available!</strong>',
			errorMessageXMLHttpRequest			: 'Error: XML-Http-Request Status "500"',
			errorMessageTextStatusError			: 'Error: AJAX Request failed'
		},
		
		getStaticContentFrom				: null,
			
		killModalboxWithCloseButtonOnly		: false, // options: true, false (close the modal box with close button only)
		
		setTypeOfFadingLayer				: 'black', // options: white, black, custom, disable
		setStylesOfFadingLayer				: {// define the opacity and color of fader layer here
			white			: 'background-color:#fff; filter:alpha(opacity=60); -moz-opacity:0.6; opacity:0.6;',
			black			: 'background-color:#000; filter:alpha(opacity=40); -moz-opacity:0.4; opacity:0.4;',
			transparent 	: 'background-color:transparent;',
			custom			: null
		},
		
		minimalTopSpacingOfModalbox 		: 50, // sets the minimum space between modalbox and visible area in the browser window
		usejqueryuidragable					: false, //options: true, false (the modalbox is draggable, Requires jQuery v1.2.6 or later, jQuery UI  and components: jQuery UI Widget, jQuery UI Mouse, jQuery UI Draggable)
		
		callFunctionAfterSuccess			: function(){},
		
		directCall							: {
			source 	: null, // put url here like http://www.yourdomain.de/test?param=1&param=2
			data	: null, // put content here like data : '<div class="testclass">test</div>'
			element	: null // define identifyer of source container here to get html content, can be id or class like  like '#sourcecontainer'
		},
		
		ajax_type							: 'POST', // The type of request to make ("POST" or "GET"), default is "POST". Note: Other HTTP request methods, such as PUT and DELETE, can also be used here, but they are not supported by all browsers.
		ajax_contentType					: 'application/x-www-form-urlencoded; charset=utf-8' // examples : charset=utf-8, charset=ISO-8859-1
		
	};
	
	
	jQuery.fn.modalBox = function(globaloptions) {
		
		
		// merge the plugin defaults with custom options
		var globaloptions = jQuery.extend({}, defaults, globaloptions);
		
		
		// get current locales
		globaloptions.localizedStrings = jQuery.fn.modalBox.getlocales();
		
		
		/************ direct call without event binding - BEGIN ************/
		if( globaloptions.directCall ){
			if( globaloptions.directCall["source"] ){
				openModalBox({
					type	: 'ajax',
					source 	: globaloptions.directCall["source"],
					data	: ''
				});
			} else if ( globaloptions.directCall["data"] ){
				openModalBox({
					type	: 'static',
					source 	: '',
					data	: globaloptions.directCall["data"]
				});
			} else if ( globaloptions.directCall["element"] ){
				openModalBox({
					type	: 'static',
					source 	: '',
					data	: jQuery( globaloptions.directCall["element"] ).html()
				});
			}
		}
		/************ direct call without event binding - END ************/
		
		
		
		/************ initializeModalBox - BEGIN ************/
		var doNotBindEventsOnWindowResize = false;
		jQuery(window).resize(function(){
			centerModalBox({
				isResized : true
			});
			doNotBindEventsOnWindowResize = true;
		});
		
		if( !doNotBindEventsOnWindowResize ){
			
			jQuery(this).die("click").live("click", function(event){
				prepareModalbox({
					event 	: event,
					element : jQuery(this)
				});
			});
			
			jQuery(".closeModalBox", globaloptions.setModalboxContainer).die("click").live("click", function(){ 
				jQuery.fn.modalBox.close(); 
			});
		}
		/************ initializeModalBox - END ************/
		
		
		
		/************ prepareModalbox - END ************/
		function prepareModalbox(settings){
			
			
			var settings = jQuery.extend({// default settings
				event 	: null,
				element : null
			}, settings || {} );
			
			
			if( settings.event && settings.element ){
				
				var currentEvent 	=  settings.event;
				var elementObj		= settings.element;
				
				var doNotOpenModalBoxContent = false;
				var isFormSubmit = false;
				
				if( elementObj.is("input") ){
					var source 		= elementObj.parents('form').attr('action');
					var data		= elementObj.parents('form').serialize();
					var type		= 'ajax';
					isFormSubmit 	= true;
					currentEvent.preventDefault();
				} else if ( jQuery("input[name$='" + globaloptions.setNameOfHiddenAjaxInputField + "']", elementObj).length != 0 ) {
					var source 		= jQuery("input[name$='" + globaloptions.setNameOfHiddenAjaxInputField + "']", elementObj).val();
					var data		= '';
					var type		= 'ajax';
					currentEvent.preventDefault();
				} else if ( jQuery(globaloptions.getStaticContentFromInnerContainer, elementObj).length != 0 ) {
					if ( jQuery(globaloptions.getStaticContentFromInnerContainer + " img." + globaloptions.setNameOfGalleryImage, elementObj).length != 0 ) {
						var currentImageObj = jQuery(globaloptions.getStaticContentFromInnerContainer + " img." + globaloptions.setNameOfGalleryImage, elementObj);
					}
					var source 		= '';
					var data		= jQuery(globaloptions.getStaticContentFromInnerContainer, elementObj).html();
					var type		= 'static';
					currentEvent.preventDefault();
				} else if ( globaloptions.getStaticContentFrom ) {
					var source 		= '';
					var data		= jQuery(globaloptions.getStaticContentFrom).html();
					var type		= 'static';
					currentEvent.preventDefault();
				} else {
					doNotOpenModalBoxContent = true;
				}
				
				if( !doNotOpenModalBoxContent ){
					openModalBox({
						type				: type,
						element 			: elementObj,
						source 				: source,
						data				: data,
						loadImagePreparer 	: {
							currentImageObj 	: currentImageObj,
							finalizeModalBox 	: false
						}
					});
				}
				
				if( isFormSubmit ){
					return false;
				}
			}
		}
		/************ prepareModalbox - END ************/
		
		
		
		/************ simpleScrollTo - BEGIN ************/
		function simpleScrollTo(settings){
			
			/*
				Example:
				-----------------------------
				simpleScrollTo({
					targetElement : "#footer"
				});
			*/
			
			var settings = jQuery.extend({// default settings
				targetElement	: "a.modalBoxTopLink",
				typeOfAnimation	: 'swing', // options: linear, swing, easing
				animationSpeed	: 800,
				callAfterSuccess : function(){}
			}, settings || {} );
			
			
			if( settings.targetElement ){
				
				if( jQuery.browser.webkit ){
					var animateObj = jQuery("body");
				} else {
					var animateObj = jQuery("html");
				}
				
				animateObj.animate({ 
					scrollTop : jQuery(settings.targetElement).offset().top 
				}, settings.animationSpeed, settings.typeOfAnimation, function(){
					// Animation complete.
					settings.callAfterSuccess();
				});
				
			}
		}
		/************ initializeModalBox - BEGIN ************/
		
		
		
		/************ ajaxRedirect - BEGIN ************/
		function ajaxRedirect(settings){


			var settings = jQuery.extend({// default settings
				ar_XMLHttpRequest	: null,
				ar_textStatus		: null,
				ar_errorThrown		: null,
				targetContainer		: null,
				ar_enableDebugging	: false
			}, settings || {} );
			
			
			// ~~~~~~~~~ global settings - BEGIN ~~~~~~~~~ //
			var XMLHttpRequest 	= settings.ar_XMLHttpRequest;
			var textStatus 		= settings.ar_textStatus;
			var errorThrown 	= settings.ar_errorThrown;
			// ~~~~~~~~~ global settings - END ~~~~~~~~~ //
			
			
			if ( XMLHttpRequest && textStatus != "error" ) {
				
				if( XMLHttpRequest.status == 403 ){
					
					var redirect = XMLHttpRequest.getResponseHeader("Location");
					if( typeof redirect !== "undefined" ) {
						location.href = redirect;
					}
					
				} else if ( XMLHttpRequest.status == 500 && settings.targetContainer ){
					
					addErrorMessage({
						errorMessage 	: globaloptions.localizedStrings["errorMessageXMLHttpRequest"],
						targetContainer	: settings.targetContainer
					});
				}
				
				if( settings.ar_enableDebugging ){
					console.log( "XMLHttpRequest.status: " + XMLHttpRequest.status );
				}
				
				addCloseButtonFunctionality();
				
			} else if ( textStatus == "error" ) {
				
				if ( settings.targetContainer ){
					addErrorMessage({
						errorMessage 	: globaloptions.localizedStrings["errorMessageTextStatusError"],
						targetContainer	: settings.targetContainer
					});
				}
				
				if( settings.ar_enableDebugging ){
					console.log( "textStatus: " + textStatus );
				}
				
				addCloseButtonFunctionality();
				
			} else {
				// no errors
			}
			
			
			function addErrorMessage(settings){

				var settings = jQuery.extend({// default settings
					errorMessage 	: null,
					targetContainer	: null
				}, settings || {} );
				
				if( settings.errorMessage && settings.targetContainer ){
					
					var errorMessageContainer	= '';
					errorMessageContainer += '<div class="simleModalboxErrorBox"><div class="simleModalboxErrorBoxContent">';
					errorMessageContainer += settings.errorMessage;
					errorMessageContainer += '</div></div>';
					
					jQuery(settings.targetContainer).removeAttr("style").html( errorMessageContainer );
					if( jQuery(settings.targetContainer).parents(globaloptions.setModalboxContainer).length > 0 ){
						jQuery(globaloptions.setAjaxLoader).remove();
						centerModalBox();
					}
					
				}
			}
			
			
		}
		/************ ajaxRedirect - END ************/
		
		
		
		/************ addAjaxUrlParameter - BEGIN ************/
		function addAjaxUrlParameter(settings){


			var settings = jQuery.extend({// default settings
				currentURL 			: '',
				addParameterName 	: 'ajaxContent',
				addParameterValue 	: 'true'
			}, settings || {} );
			
			var currentURL = settings.currentURL;
				
			if( currentURL.indexOf(settings.addParameterName) != -1){
				currentURL = currentURL;
			} else {
				if( currentURL.indexOf("?") != -1){
					var currentSeparator = "&";
				} else {
					var currentSeparator = "?";
				}
				currentURL = currentURL + currentSeparator + settings.addParameterName + '=' + settings.addParameterValue;
			}
			
			return currentURL;
			
		}
		/************ addAjaxUrlParameter - END ************/
		
		
		
		/************ imagePreparer - END ************/
		function imagePreparer(settings){
		
			
			var settings = jQuery.extend({
				type				: settings.type,
				element 			: settings.element,
				source 				: settings.source,
				data				: settings.data,
				loadImagePreparer 	: {
					currentImageObj 	: settings.loadImagePreparer["currentImageObj"],
					finalizeModalBox 	: settings.loadImagePreparer["finalizeModalBox"]
				},
				nameOfImagePreloaderContainer 	: "imagePreparerLoader",
				wrapContainer :	'<div class="modalBoxCarouselItemContainer"></div>'
			}, settings || {} );
			
			
			var imageObj = settings.loadImagePreparer["currentImageObj"];
			
			
			if( imageObj ){
				
				jQuery(globaloptions.getStaticContentFromInnerContainer).css({ 
					display : "block",
					position : "absolute",
					left : "-9999px",
					top : "-9999px"
				});
				
				var getWidthOfCurrentImage 	= 0;
				var getHeightOfCurrentImage = 0;
				
				if( imageObj.length == 1 ){
					
					getWidthOfCurrentImage 	= parseInt( imageObj.width() );
					getHeightOfCurrentImage = parseInt( imageObj.height() );
					
				} else {
					
					imageObj.each(function(){
						
						var thisObj = jQuery(this);
						var imageWidth = parseInt( thisObj.width() );
						var imageHeight = parseInt( thisObj.height() );
						
						if( imageWidth > getWidthOfCurrentImage ){
							getWidthOfCurrentImage 	= imageWidth;
						}
						
						if( imageHeight > getHeightOfCurrentImage ){
							getHeightOfCurrentImage = imageHeight;
						}
					});
				}
				
				jQuery(globaloptions.getStaticContentFromInnerContainer).removeAttr("style");
				
				openModalBox({
					type				: settings.type,
					element 			: settings.element,
					source 				: settings.source,
					data				: settings.data,
					loadImagePreparer 	: {
						currentImageObj 				: imageObj,
						widthOfImage					: getWidthOfCurrentImage,
						heightOfImage					: getHeightOfCurrentImage,
						finalizeModalBox 				: true,
						nameOfImagePreloaderContainer 	: settings.nameOfImagePreloaderContainer
					}
				});
			}
		}
		/************ imagePreparer - END ************/
		
		
		
		/************ addCloseButtonFunctionality - END ************/
		function addCloseButtonFunctionality(){
			
			
		}
		/************ addCloseButtonFunctionality - END ************/
		
		
		
		/************ openModalBox - BEGIN ************/
		function openModalBox(settings){
		
			var settings = jQuery.extend({
				type				: null,
				element 			: null,
				source 				: null,
				data				: null,
				loadImagePreparer 	: {
					currentImageObj 				: null,
					widthOfImage					: null,
					heightOfImage					: null,
					finalizeModalBox 				: false,
					nameOfImagePreloaderContainer 	: null
				},
				eMessageNoData		: globaloptions.localizedStrings["errorMessageIfNoDataAvailable"]
			}, settings || {} );
			
			
			jQuery(globaloptions.setNameOfPreCacheContainer).remove();
			
			
			if( !settings.data && settings.eMessageNoData ){
				settings.data = settings.eMessageNoData;
			}
			
			
			if( settings.loadImagePreparer["currentImageObj"] && !settings.loadImagePreparer["finalizeModalBox"] ){
				
				imagePreparer({
					type				: settings.type,
					element 			: settings.element,
					source 				: settings.source,
					data				: settings.data,
					loadImagePreparer 	: settings.loadImagePreparer
				});
				
			} else {
			
				if( settings.type ){
					
					
					if( settings.source ){
						settings.source = addAjaxUrlParameter({
							currentURL : settings.source
						});
					}
					
					
					var prepareCustomWidthOfModalBox = "";
					var setModalboxClassName = "";
					
					if( settings.element ){
						
						if( jQuery(settings.element).hasClass("large") ){
							setModalboxClassName += 'large';
						} else if( jQuery(settings.element).hasClass("medium") ){
							setModalboxClassName += 'medium';
						} else if( jQuery(settings.element).hasClass("small") ){
							setModalboxClassName += 'small';
						} else if( settings.loadImagePreparer["nameOfImagePreloaderContainer"] ){
							setModalboxClassName += 'auto';
							//prepareCustomWidthOfModalBox += 'width:' + settings.loadImagePreparer["widthOfImage"] + 'px; ';
							//prepareCustomWidthOfModalBox += 'height:' + settings.loadImagePreparer["heightOfImage"] + 'px; ';
						}
						
						if( jQuery(settings.element).hasClass("emphasis") ){
							setModalboxClassName += ' emphasis';
						}
					}
					
					
					if( globaloptions.customClassName ){
						setModalboxClassName += ' ' + globaloptions.customClassName;
					}
					
					
					if( globaloptions.setWidthOfModalLayer ){
						prepareCustomWidthOfModalBox += 'width:' + parseInt( globaloptions.setWidthOfModalLayer ) + 'px; ';
					}
					
					
					//~~~~ create Modalbox first - BEGIN ~~~~//
					if( jQuery(globaloptions.setModalboxContainer).length == 0 ){
						
						showFadingLayer();
						
						var createModalboxContainer = modalboxBuilder({
							customStyles : 'class="' + setModalboxClassName + '" style="' + prepareCustomWidthOfModalBox + '"'
						});
						
						jQuery("body").append(createModalboxContainer);
						
						
					} else {
					
						var prepareNameOfAjaxLoader = jQuery.fn.modalBox.cleanupSelectorName({
							replaceValue : globaloptions.setAjaxLoader
						});
						
						jQuery.fn.modalBox.clean({
							setModalboxContentContainer	: globaloptions.setModalboxBodyContentContainer,
							setAjaxLoader 				: prepareNameOfAjaxLoader,
							localizedStrings 			: globaloptions.localizedStrings["messageAjaxLoader"]
						});
					}
					//~~~~ create Modalbox first - END ~~~~//
					
					
					switch (settings.type) {
						
						case 'static':{
							
							jQuery(globaloptions.setAjaxLoader).fadeOut("fast", function(){
								jQuery(globaloptions.setModalboxBodyContentContainer, globaloptions.setModalboxContainer).html(settings.data);
								centerModalBox();
							});
							
							break;
							
						} case 'ajax':{
						
							jQuery.ajax({
								type : globaloptions.ajax_type,
								url	: settings.source,
								data : settings.data,
								contentType : globaloptions.ajax_contentType,
								success	: function(data, textStatus){
									
									jQuery(globaloptions.setAjaxLoader).fadeOut("fast", function(){
										jQuery(globaloptions.setModalboxBodyContentContainer, globaloptions.setModalboxContainer).html(data);
										centerModalBox();
									});
									
								},
								error : function(XMLHttpRequest, textStatus, errorThrown){
									ajaxRedirect({ 
										ar_XMLHttpRequest	: XMLHttpRequest,
										ar_textStatus		: textStatus,
										ar_errorThrown		: errorThrown,
										targetContainer		: globaloptions.setModalboxContainer + " " + globaloptions.setModalboxBodyContentContainer
									});
								}
							});
							
							break;
						}
					}
					
				}
			}
		}
		/************ openModalBox - END ************/
		
		
		
		/************ centerModalBox - BEGIN ************/
		function centerModalBox(settings){
		
		
			var settings = jQuery.extend({
				isResized : false
			}, settings || {} );
			
			
			var modalboxContainerObj = jQuery(globaloptions.setModalboxContainer);
			
			
			if( jQuery(globaloptions.setNameOfPreCacheContainer).length == 0 && modalboxContainerObj.length != 0 ){
				
				
				if( jQuery("body a.modalBoxTopLink").length == 0 ){
					jQuery("body").prepend('<a class="modalBoxTopLink"></a>');
				}
				
				
				// default settings
				var scrollToTop = false;
				var positionAttr = 'absolute';
				var setPositionTop = 0;
				var getModalboxContainerWidth = modalboxContainerObj.width();
				var getModalboxContainerHeight = modalboxContainerObj.height();
				
				
				
				/*~~~ setPositionLeft / BEGIN ~~~*/
				var setPositionLeft = parseInt( jQuery(window).width() - getModalboxContainerWidth ) / 2;
				if( setPositionLeft <= 0 ){
					setPositionLeft = 0;
				}
				
				if( globaloptions.positionLeft ){
					setPositionLeft = globaloptions.positionLeft + 'px';
				} else {
					setPositionLeft = setPositionLeft + 'px';
				}
				/*~~~ setPositionLeft / END ~~~*/
				
				
				
				/*~~~ setPositionTop / BEGIN ~~~*/
				if( globaloptions.positionTop ){
					
					setPositionTop = parseInt( 
						jQuery(window).height() - getModalboxContainerHeight
					);
					
					if( setPositionTop > parseInt( globaloptions.positionTop ) ){
						positionAttr = 'fixed';
					}
					
					setPositionTop = globaloptions.positionTop + 'px';
				
				} else {
					
					setPositionTop = parseInt( jQuery(window).height() - getModalboxContainerHeight - 70 ) / 2;
					
					if( setPositionTop <= 0 ){
					
						setPositionTop = globaloptions.minimalTopSpacingOfModalbox + 'px';
						scrollToTop = true;
						
					} else {
						
						setPositionTop = setPositionTop + 'px';
						positionAttr = 'fixed';
					}
				}
				/*~~~ setPositionTop / END ~~~*/
				
				
				/*~~~ initPositioning / BEGIN ~~~*/
				function initPositioning(){
					
					
					if( globaloptions.fadeInActive && !globaloptions.obsoleteIE678Browser ){
							
						if( modalboxContainerObj.hasClass("modalboxFadingSuccessfully") ){
							
							modalboxContainerObj.css({
								position	: positionAttr,
								left		: setPositionLeft,
								top			: setPositionTop,
								display		: "block",
								visibility	: "visible"
							});
							
						} else {
							
							// classic fadeOut - transparency problems in ie browsers
							modalboxContainerObj.css({
								position	: positionAttr,
								left		: setPositionLeft,
								top			: setPositionTop,
								visibility	: "visible"
							}).fadeIn( globaloptions.fadeInSpeed, function(){
								jQuery(this).addClass("modalboxFadingSuccessfully");
							});
						}
						
					} else {
						
						modalboxContainerObj.css({
							position	: positionAttr,
							left		: setPositionLeft,
							top			: setPositionTop,
							display		: "block",
							visibility	: "visible"
						});
						
					}
					
					
					if( scrollToTop && !modalboxContainerObj.hasClass("modalboxScrollingSuccessfully") ){
						modalboxContainerObj.addClass("modalboxScrollingSuccessfully");
						simpleScrollTo();
					}
					
					
					if( !settings.isResized ){
						
						if( globaloptions.usejqueryuidragable ){
							modalboxContainerObj.draggable("destroy").draggable({ 
								opacity: false, 
								iframeFix: true, 
								refreshPositions: true 
							});
						}
						
						globaloptions.callFunctionAfterSuccess();
					}
				}
				/*~~~ initPositioning / END ~~~*/
				
				
				/*~~~ init showFadingLayer / BEGIN ~~~*/
				if( !settings.isResized ){
					
					showFadingLayer({
						callFunctionAfterFading : function(){
							initPositioning();
						}
					});
					
				} else {
					initPositioning();
				}
				/*~~~ init showFadingLayer / END ~~~*/
				
			}
		}
		/************ centerModalBox - END ************/
		
		
		
		/************ showFadingLayer - BEGIN ************/
		function showFadingLayer(settings){
			
			
			var settings = jQuery.extend({//defaults
				callFunctionAfterFading : function(){}
			}, settings || {} );
		
			
			if( globaloptions.setTypeOfFadingLayer == "white" ){
				var setStyleOfFadingLayer = globaloptions.setStylesOfFadingLayer["white"];
			} else if ( globaloptions.setTypeOfFadingLayer == "black" ){
				var setStyleOfFadingLayer = globaloptions.setStylesOfFadingLayer["black"];
			} else if ( globaloptions.setTypeOfFadingLayer == "custom" && globaloptions.setStylesOfFadingLayer["custom"] ){
				var setStyleOfFadingLayer = globaloptions.setStylesOfFadingLayer["custom"];
			} else {//globaloptions.setTypeOfFadingLayer == "disable"
				var setStyleOfFadingLayer = globaloptions.setStylesOfFadingLayer["transparent"];
			}
			
			
			var currentFaderObj = jQuery(globaloptions.setFaderLayer);
			
			
			if ( currentFaderObj.length == 0 ) {
				
				var prepareNameOfFadingLayer = jQuery.fn.modalBox.cleanupSelectorName({
					replaceValue : globaloptions.setFaderLayer
				});
				
				jQuery("body").append('<div id="' + prepareNameOfFadingLayer + '" style="' + setStyleOfFadingLayer + '"></div>');
				
				if( !globaloptions.killModalboxWithCloseButtonOnly ){
					jQuery(globaloptions.setFaderLayer).click(function(){
						jQuery.fn.modalBox.close();
					});
				}
				
				jQuery(window).resize(function(){
					if ( jQuery(globaloptions.setFaderLayer).is(':visible') ) {
						showFadingLayer();
					}
				});
				
			} else if ( currentFaderObj.length != 0 && !currentFaderObj.is(':visible') ){
				
				if( globaloptions.fadeInActive ){
					
					currentFaderObj.fadeIn( globaloptions.fadeInSpeed, function(){
						settings.callFunctionAfterFading();
					});
					
				} else {
					
					currentFaderObj.show("fast", function(){
						settings.callFunctionAfterFading();
					});
				}
			}
		}
		/************ showFadingLayer - END ************/
		
	};
	
	
	function modalboxBuilder(settings){
	
		
		var settings = jQuery.extend({
			customStyles : ''
		}, settings || {} );
	
		
		// merge the plugin defaults with custom options
		settings = jQuery.extend({}, defaults, settings);
		
		
		// get current locales
		settings.localizedStrings = jQuery.fn.modalBox.getlocales();
		
		
		var prepareNameOfModalboxContainer = jQuery.fn.modalBox.cleanupSelectorName({
			replaceValue : settings.setModalboxContainer
		});
		
		var prepareNameOfModalboxBodyContainer = jQuery.fn.modalBox.cleanupSelectorName({
			replaceValue : settings.setModalboxBodyContainer
		});
		
		var prepareNameOfModalboxContentContainer = jQuery.fn.modalBox.cleanupSelectorName({
			replaceValue : settings.setModalboxBodyContentContainer
		});
		
		var prepareNameOfCloseButtonContainer = jQuery.fn.modalBox.cleanupSelectorName({
			replaceValue : settings.setModalboxCloseButtonContainer
		});
		
		var prepareNameOfAjaxLoader = jQuery.fn.modalBox.cleanupSelectorName({
			replaceValue : settings.setAjaxLoader
		});
		
		
		var createModalboxContainer = '';
		createModalboxContainer += '<div id="' + prepareNameOfModalboxContainer + '"' + settings.customStyles + '>';
			createModalboxContainer += '<div id="' + prepareNameOfModalboxBodyContainer + '">';
				createModalboxContainer += settings.setModalboxLayoutContainer_Begin;
					
					createModalboxContainer += '<div class="' + prepareNameOfModalboxContentContainer + '">';
						createModalboxContainer += '<div id="' + prepareNameOfAjaxLoader + '">' + settings.localizedStrings["messageAjaxLoader"] + '</div>';
					createModalboxContainer += '</div>';
					
				createModalboxContainer += settings.setModalboxLayoutContainer_End;
				createModalboxContainer += '<div id="' + prepareNameOfCloseButtonContainer + '"><a href="javascript:void(0);" class="closeModalBox"><span class="closeModalBox">' + settings.localizedStrings["messageCloseWindow"] + '</span></a></div>';
			createModalboxContainer += '</div>';
		createModalboxContainer += '</div>';
		
		return createModalboxContainer;
	}
	
	
	jQuery.fn.modalBox.close = function(settings){
		
		// merge the plugin defaults with custom options
		var settings = jQuery.extend({}, defaults, settings);
		
		if( settings.setFaderLayer && settings.setModalboxContainer ){
			
			var containerObj = jQuery(settings.setFaderLayer + ', ' + settings.setModalboxContainer);
			
			if( settings.fadeOutActive ){
				
				if( settings.obsoleteIE678Browser ){
					
					// workaround for old ie browsers
					jQuery(settings.setModalboxContainer).remove()
					
					jQuery(settings.setFaderLayer).fadeOut( settings.fadeOutSpeed, function(){
						jQuery(this).remove();
					});
					
				} else {
					
					// classic fadeOut - transparency problems in ie browsers
					containerObj.fadeOut( settings.fadeOutSpeed, function(){
						jQuery(this).remove();
					});
					
				}
				
			} else {
				containerObj.remove();
			}
		}
	};
	
	
	jQuery.fn.modalBox.clean = function(settings){
		
		var settings = jQuery.extend({
			setModalboxContentContainer	: null,
			setAjaxLoader 				: null,
			localizedStrings 			: null
		}, settings || {} );
		
		
		if( settings.setModalboxContentContainer ){
			jQuery(settings.setModalboxContentContainer).html('<div id="' + settings.setAjaxLoader + '">' + settings.localizedStrings + '</div>');
		}
	};
	
	
	
	jQuery.fn.modalBox.cleanupSelectorName = function(settings){
	
		var settings = jQuery.extend({
			replaceValue : ''
		}, settings || {} );
		
		var currentReturnValue 	= settings.replaceValue;
		currentReturnValue 		= currentReturnValue.replace(/[#]/g, "");
		currentReturnValue 		= currentReturnValue.replace(/[.]/g, "");
		
		return currentReturnValue;
		
	};
	
	
	
	/************ get custom localized strings if available - BEGIN ************/
	jQuery.fn.modalBox.getlocales = function(settings){
	
		
		// merge the plugin defaults with custom settings
		var settings = jQuery.extend({}, defaults, settings);
		
		
		if( typeof(modalboxLocalizedStrings) !== "undefined" ){
			if( modalboxLocalizedStrings !== "" ){
				settings.localizedStrings = {
					messageCloseWindow				: modalboxLocalizedStrings["messageCloseWindow"],
					messageAjaxLoader				: modalboxLocalizedStrings["messageAjaxLoader"],
					errorMessageIfNoDataAvailable	: modalboxLocalizedStrings["errorMessageIfNoDataAvailable"],
					errorMessageXMLHttpRequest		: modalboxLocalizedStrings["errorMessageXMLHttpRequest"],
					errorMessageTextStatusError		: modalboxLocalizedStrings["errorMessageTextStatusError"]
				}
			}
		}
		
		return settings.localizedStrings;
		
	};
	/************ get custom localized strings if available - END ************/
	
	
	
	/************ precache modalBox - BEGIN ************/
	jQuery.fn.modalBox.precache = function(settings){
		
		// merge the plugin defaults with custom settings
		var settings = jQuery.extend({}, defaults, settings);
		
		if( settings.setNameOfPreCacheContainer ){
			if( jQuery(settings.setNameOfPreCacheContainer).length == 0 ){
				
				var prepareNameOfPreCacheContainer = jQuery.fn.modalBox.cleanupSelectorName({
					replaceValue : settings.setNameOfPreCacheContainer
				});
				
				var createModalboxContainer = modalboxBuilder();
				
				var preCacheContainer = '';
				preCacheContainer += '<div id="' + prepareNameOfPreCacheContainer + '" style="position:absolute; left:-9999px; top:-9999px;">';
					preCacheContainer += createModalboxContainer;
				preCacheContainer += '</div>';
				
				jQuery("body").append(preCacheContainer);
				
				jQuery(settings.setModalboxContainer).show();
			}
		}
	};
	/************ precache modalBox - END ************/
	
	
	jQuery(document).ready(function(){//default Initializing
		jQuery(".openmodalbox").modalBox();
		jQuery.fn.modalBox.precache();
	});
	
	
})(jQuery);