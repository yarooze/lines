/*
* jQuery modalBox plugin v1.1.4 <http://code.google.com/p/jquery-modalbox-plugin/> 
* @requires jQuery v1.3.2 or later 
* is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
(function(b){var c={obsoleteIE678Browser:((jQuery.browser.msie&&parseInt(jQuery.browser.version)<9)?true:false),setModalboxContainer:"#modalBox",setModalboxBodyContainer:"#modalBoxBody",setModalboxBodyContentContainer:".modalBoxBodyContent",setFaderLayer:"#modalBoxFaderLayer",setAjaxLoader:"#modalBoxAjaxLoader",setModalboxCloseButtonContainer:"#modalBoxCloseButton",getStaticContentFromInnerContainer:".modalboxContent",setNameOfHiddenAjaxInputField:"ajaxhref",setNameOfPreCacheContainer:"#modalboxPreCacheContainer",setNameOfGalleryImage:"modalgallery",setModalboxLayoutContainer_Begin:'<div class="modalboxStyleContainer_surface_left"><div class="modalboxStyleContainer_surface_right"><div class="modalboxStyleContainerContent"><div class="modalBoxBodyContent">',setModalboxLayoutContainer_End:'</div></div></div></div><div class="modalboxStyleContainer_corner_topLeft"><!-- - --></div><div class="modalboxStyleContainer_corner_topRight"><!-- - --></div><div class="modalboxStyleContainer_corner_bottomLeft"><!-- - --></div><div class="modalboxStyleContainer_corner_bottomRight"><!-- - --></div><div class="modalboxStyleContainer_surface_top"><div class="modalboxStyleContainer_surface_body"><!-- - --></div></div><div class="modalboxStyleContainer_surface_bottom"><div class="modalboxStyleContainer_surface_body"><!-- - --></div></div>',setWidthOfModalLayer:null,customClassName:null,positionLeft:null,positionTop:null,fadeInActive:true,fadeInSpeed:"fast",fadeOutActive:true,fadeOutSpeed:"fast",localizedStrings:{messageCloseWindow:"Close Window",messageAjaxLoader:"Please wait",errorMessageIfNoDataAvailable:"<strong>No content available!</strong>",errorMessageXMLHttpRequest:'Error: XML-Http-Request Status "500"',errorMessageTextStatusError:"Error: AJAX Request failed"},getStaticContentFrom:null,killModalboxWithCloseButtonOnly:false,setTypeOfFadingLayer:"black",setStylesOfFadingLayer:{white:"background-color:#fff; filter:alpha(opacity=60); -moz-opacity:0.6; opacity:0.6;",black:"background-color:#000; filter:alpha(opacity=40); -moz-opacity:0.4; opacity:0.4;",transparent:"background-color:transparent;",custom:null},minimalTopSpacingOfModalbox:50,usejqueryuidragable:false,callFunctionAfterSuccess:function(){},directCall:{source:null,data:null,element:null},ajax_type:"POST",ajax_contentType:"application/x-www-form-urlencoded; charset=utf-8"};jQuery.fn.modalBox=function(k){var k=jQuery.extend({},c,k);k.localizedStrings=jQuery.fn.modalBox.getlocales();if(k.directCall){if(k.directCall["source"]){m({type:"ajax",source:k.directCall["source"],data:""});}else{if(k.directCall["data"]){m({type:"static",source:"",data:k.directCall["data"]});}else{if(k.directCall["element"]){m({type:"static",source:"",data:jQuery(k.directCall["element"]).html()});}}}}var i=false;jQuery(window).resize(function(){j({isResized:true});i=true;});if(!i){jQuery(this).die("click").live("click",function(o){d({event:o,element:jQuery(this)});});jQuery(".closeModalBox",k.setModalboxContainer).die("click").live("click",function(){jQuery.fn.modalBox.close();});}function d(q){var q=jQuery.extend({event:null,element:null},q||{});if(q.event&&q.element){var p=q.event;var u=q.element;var r=false;var w=false;if(u.is("input")){var o=u.parents("form").attr("action");var s=u.parents("form").serialize();var t="ajax";w=true;p.preventDefault();}else{if(jQuery("input[name$='"+k.setNameOfHiddenAjaxInputField+"']",u).length!=0){var o=jQuery("input[name$='"+k.setNameOfHiddenAjaxInputField+"']",u).val();var s="";var t="ajax";p.preventDefault();}else{if(jQuery(k.getStaticContentFromInnerContainer,u).length!=0){if(jQuery(k.getStaticContentFromInnerContainer+" img."+k.setNameOfGalleryImage,u).length!=0){var v=jQuery(k.getStaticContentFromInnerContainer+" img."+k.setNameOfGalleryImage,u);}var o="";var s=jQuery(k.getStaticContentFromInnerContainer,u).html();var t="static";p.preventDefault();}else{if(k.getStaticContentFrom){var o="";var s=jQuery(k.getStaticContentFrom).html();var t="static";p.preventDefault();}else{r=true;}}}}if(!r){m({type:t,element:u,source:o,data:s,loadImagePreparer:{currentImageObj:v,finalizeModalBox:false}});}if(w){return false;}}}function e(p){var p=jQuery.extend({targetElement:"a.modalBoxTopLink",typeOfAnimation:"swing",animationSpeed:800,callAfterSuccess:function(){}},p||{});if(p.targetElement){if(jQuery.browser.webkit){var o=jQuery("body");}else{var o=jQuery("html");}o.animate({scrollTop:jQuery(p.targetElement).offset().top},p.animationSpeed,p.typeOfAnimation,function(){p.callAfterSuccess();});}}function f(p){var p=jQuery.extend({ar_XMLHttpRequest:null,ar_textStatus:null,ar_errorThrown:null,targetContainer:null,ar_enableDebugging:false},p||{});var q=p.ar_XMLHttpRequest;var t=p.ar_textStatus;var r=p.ar_errorThrown;if(q&&t!="error"){if(q.status==403){var s=q.getResponseHeader("Location");if(typeof s!=="undefined"){location.href=s;}}else{if(q.status==500&&p.targetContainer){o({errorMessage:k.localizedStrings["errorMessageXMLHttpRequest"],targetContainer:p.targetContainer});}}if(p.ar_enableDebugging){console.log("XMLHttpRequest.status: "+q.status);}g();}else{if(t=="error"){if(p.targetContainer){o({errorMessage:k.localizedStrings["errorMessageTextStatusError"],targetContainer:p.targetContainer});}if(p.ar_enableDebugging){console.log("textStatus: "+t);}g();}else{}}function o(u){var u=jQuery.extend({errorMessage:null,targetContainer:null},u||{});if(u.errorMessage&&u.targetContainer){var v="";v+='<div class="simleModalboxErrorBox"><div class="simleModalboxErrorBoxContent">';v+=u.errorMessage;v+="</div></div>";jQuery(u.targetContainer).removeAttr("style").html(v);if(jQuery(u.targetContainer).parents(k.setModalboxContainer).length>0){jQuery(k.setAjaxLoader).remove();j();}}}}function h(o){var o=jQuery.extend({currentURL:"",addParameterName:"ajaxContent",addParameterValue:"true"},o||{});var q=o.currentURL;if(q.indexOf(o.addParameterName)!=-1){q=q;}else{if(q.indexOf("?")!=-1){var p="&";}else{var p="?";}q=q+p+o.addParameterName+"="+o.addParameterValue;}return q;}function l(p){var p=jQuery.extend({type:p.type,element:p.element,source:p.source,data:p.data,loadImagePreparer:{currentImageObj:p.loadImagePreparer["currentImageObj"],finalizeModalBox:p.loadImagePreparer["finalizeModalBox"]},nameOfImagePreloaderContainer:"imagePreparerLoader",wrapContainer:'<div class="modalBoxCarouselItemContainer"></div>'},p||{});var r=p.loadImagePreparer["currentImageObj"];if(r){jQuery(k.getStaticContentFromInnerContainer).css({display:"block",position:"absolute",left:"-9999px",top:"-9999px"});var o=0;var q=0;if(r.length==1){o=parseInt(r.width());q=parseInt(r.height());}else{r.each(function(){var u=jQuery(this);var t=parseInt(u.width());var s=parseInt(u.height());if(t>o){o=t;}if(s>q){q=s;}});}jQuery(k.getStaticContentFromInnerContainer).removeAttr("style");m({type:p.type,element:p.element,source:p.source,data:p.data,loadImagePreparer:{currentImageObj:r,widthOfImage:o,heightOfImage:q,finalizeModalBox:true,nameOfImagePreloaderContainer:p.nameOfImagePreloaderContainer}});}}function g(){}function m(p){var p=jQuery.extend({type:null,element:null,source:null,data:null,loadImagePreparer:{currentImageObj:null,widthOfImage:null,heightOfImage:null,finalizeModalBox:false,nameOfImagePreloaderContainer:null},eMessageNoData:k.localizedStrings["errorMessageIfNoDataAvailable"]},p||{});jQuery(k.setNameOfPreCacheContainer).remove();if(!p.data&&p.eMessageNoData){p.data=p.eMessageNoData;}if(p.loadImagePreparer["currentImageObj"]&&!p.loadImagePreparer["finalizeModalBox"]){l({type:p.type,element:p.element,source:p.source,data:p.data,loadImagePreparer:p.loadImagePreparer});}else{if(p.type){if(p.source){p.source=h({currentURL:p.source});}var s="";var o="";if(p.element){if(jQuery(p.element).hasClass("large")){o+="large";}else{if(jQuery(p.element).hasClass("medium")){o+="medium";}else{if(jQuery(p.element).hasClass("small")){o+="small";}else{if(p.loadImagePreparer["nameOfImagePreloaderContainer"]){o+="auto";}}}}if(jQuery(p.element).hasClass("emphasis")){o+=" emphasis";}}if(k.customClassName){o+=" "+k.customClassName;}if(k.setWidthOfModalLayer){s+="width:"+parseInt(k.setWidthOfModalLayer)+"px; ";}if(jQuery(k.setModalboxContainer).length==0){n();var q=a({customStyles:'class="'+o+'" style="'+s+'"'});jQuery("body").append(q);}else{var r=jQuery.fn.modalBox.cleanupSelectorName({replaceValue:k.setAjaxLoader});jQuery.fn.modalBox.clean({setModalboxContentContainer:k.setModalboxBodyContentContainer,setAjaxLoader:r,localizedStrings:k.localizedStrings["messageAjaxLoader"]});}switch(p.type){case"static":jQuery(k.setAjaxLoader).fadeOut("fast",function(){jQuery(k.setModalboxBodyContentContainer,k.setModalboxContainer).html(p.data);j();});break;case"ajax":jQuery.ajax({type:k.ajax_type,url:p.source,data:p.data,contentType:k.ajax_contentType,success:function(t,u){jQuery(k.setAjaxLoader).fadeOut("fast",function(){jQuery(k.setModalboxBodyContentContainer,k.setModalboxContainer).html(t);j();});},error:function(t,v,u){f({ar_XMLHttpRequest:t,ar_textStatus:v,ar_errorThrown:u,targetContainer:k.setModalboxContainer+" "+k.setModalboxBodyContentContainer});}});break;}}}}function j(q){var q=jQuery.extend({isResized:false},q||{});var o=jQuery(k.setModalboxContainer);if(jQuery(k.setNameOfPreCacheContainer).length==0&&o.length!=0){if(jQuery("body a.modalBoxTopLink").length==0){jQuery("body").prepend('<a class="modalBoxTopLink"></a>');}var p=false;var u="absolute";var s=0;var t=o.width();var r=o.height();var w=parseInt(jQuery(window).width()-t)/2;if(w<=0){w=0;}if(k.positionLeft){w=k.positionLeft+"px";}else{w=w+"px";}if(k.positionTop){s=parseInt(jQuery(window).height()-r);if(s>parseInt(k.positionTop)){u="fixed";}s=k.positionTop+"px";}else{s=parseInt(jQuery(window).height()-r-70)/2;if(s<=0){s=k.minimalTopSpacingOfModalbox+"px";p=true;}else{s=s+"px";u="fixed";}}function v(){if(k.fadeInActive&&!k.obsoleteIE678Browser){if(o.hasClass("modalboxFadingSuccessfully")){o.css({position:u,left:w,top:s,display:"block",visibility:"visible"});}else{o.css({position:u,left:w,top:s,visibility:"visible"}).fadeIn(k.fadeInSpeed,function(){jQuery(this).addClass("modalboxFadingSuccessfully");});}}else{o.css({position:u,left:w,top:s,display:"block",visibility:"visible"});}if(p&&!o.hasClass("modalboxScrollingSuccessfully")){o.addClass("modalboxScrollingSuccessfully");e();}if(!q.isResized){if(k.usejqueryuidragable){o.draggable("destroy").draggable({opacity:false,iframeFix:true,refreshPositions:true});}k.callFunctionAfterSuccess();}}if(!q.isResized){n({callFunctionAfterFading:function(){v();}});}else{v();}}}function n(p){var p=jQuery.extend({callFunctionAfterFading:function(){}},p||{});if(k.setTypeOfFadingLayer=="white"){var o=k.setStylesOfFadingLayer["white"];}else{if(k.setTypeOfFadingLayer=="black"){var o=k.setStylesOfFadingLayer["black"];}else{if(k.setTypeOfFadingLayer=="custom"&&k.setStylesOfFadingLayer["custom"]){var o=k.setStylesOfFadingLayer["custom"];}else{var o=k.setStylesOfFadingLayer["transparent"];}}}var q=jQuery(k.setFaderLayer);if(q.length==0){var r=jQuery.fn.modalBox.cleanupSelectorName({replaceValue:k.setFaderLayer});jQuery("body").append('<div id="'+r+'" style="'+o+'"></div>');if(!k.killModalboxWithCloseButtonOnly){jQuery(k.setFaderLayer).click(function(){jQuery.fn.modalBox.close();});}jQuery(window).resize(function(){if(jQuery(k.setFaderLayer).is(":visible")){n();}});}else{if(q.length!=0&&!q.is(":visible")){if(k.fadeInActive){q.fadeIn(k.fadeInSpeed,function(){p.callFunctionAfterFading();});}else{q.show("fast",function(){p.callFunctionAfterFading();});}}}}};function a(g){var g=jQuery.extend({customStyles:""},g||{});g=jQuery.extend({},c,g);g.localizedStrings=jQuery.fn.modalBox.getlocales();var f=jQuery.fn.modalBox.cleanupSelectorName({replaceValue:g.setModalboxContainer});var e=jQuery.fn.modalBox.cleanupSelectorName({replaceValue:g.setModalboxBodyContainer});var j=jQuery.fn.modalBox.cleanupSelectorName({replaceValue:g.setModalboxBodyContentContainer});var d=jQuery.fn.modalBox.cleanupSelectorName({replaceValue:g.setModalboxCloseButtonContainer});var i=jQuery.fn.modalBox.cleanupSelectorName({replaceValue:g.setAjaxLoader});var h="";h+='<div id="'+f+'"'+g.customStyles+">";h+='<div id="'+e+'">';h+=g.setModalboxLayoutContainer_Begin;h+='<div class="'+j+'">';h+='<div id="'+i+'">'+g.localizedStrings["messageAjaxLoader"]+"</div>";h+="</div>";h+=g.setModalboxLayoutContainer_End;h+='<div id="'+d+'"><a href="javascript:void(0);" class="closeModalBox"><span class="closeModalBox">'+g.localizedStrings["messageCloseWindow"]+"</span></a></div>";h+="</div>";h+="</div>";return h;}jQuery.fn.modalBox.close=function(d){var d=jQuery.extend({},c,d);if(d.setFaderLayer&&d.setModalboxContainer){var e=jQuery(d.setFaderLayer+", "+d.setModalboxContainer);if(d.fadeOutActive){if(d.obsoleteIE678Browser){jQuery(d.setModalboxContainer).remove();jQuery(d.setFaderLayer).fadeOut(d.fadeOutSpeed,function(){jQuery(this).remove();});}else{e.fadeOut(d.fadeOutSpeed,function(){jQuery(this).remove();});}}else{e.remove();}}};jQuery.fn.modalBox.clean=function(d){var d=jQuery.extend({setModalboxContentContainer:null,setAjaxLoader:null,localizedStrings:null},d||{});if(d.setModalboxContentContainer){jQuery(d.setModalboxContentContainer).html('<div id="'+d.setAjaxLoader+'">'+d.localizedStrings+"</div>");}};jQuery.fn.modalBox.cleanupSelectorName=function(d){var d=jQuery.extend({replaceValue:""},d||{});var e=d.replaceValue;e=e.replace(/[#]/g,"");e=e.replace(/[.]/g,"");return e;};jQuery.fn.modalBox.getlocales=function(d){var d=jQuery.extend({},c,d);if(typeof(modalboxLocalizedStrings)!=="undefined"){if(modalboxLocalizedStrings!==""){d.localizedStrings={messageCloseWindow:modalboxLocalizedStrings["messageCloseWindow"],messageAjaxLoader:modalboxLocalizedStrings["messageAjaxLoader"],errorMessageIfNoDataAvailable:modalboxLocalizedStrings["errorMessageIfNoDataAvailable"],errorMessageXMLHttpRequest:modalboxLocalizedStrings["errorMessageXMLHttpRequest"],errorMessageTextStatusError:modalboxLocalizedStrings["errorMessageTextStatusError"]};}}return d.localizedStrings;};jQuery.fn.modalBox.precache=function(d){var d=jQuery.extend({},c,d);if(d.setNameOfPreCacheContainer){if(jQuery(d.setNameOfPreCacheContainer).length==0){var g=jQuery.fn.modalBox.cleanupSelectorName({replaceValue:d.setNameOfPreCacheContainer});var f=a();var e="";e+='<div id="'+g+'" style="position:absolute; left:-9999px; top:-9999px;">';e+=f;e+="</div>";jQuery("body").append(e);jQuery(d.setModalboxContainer).show();}}};jQuery(document).ready(function(){jQuery(".openmodalbox").modalBox();jQuery.fn.modalBox.precache();});})(jQuery);