function doGridMenuActionEx(n,t){if(g_crnt_row==null||g_crnt_obj_type==null)return!1;switch(t.item.name){case"insb":case"insa":doInsertRow(t.item.name);break;case"del":doDeleteRow();break;case"style":doChangeStyle(!($.inArray(g_crnt_cell,g_dragcells)>=0&&g_dragcells.length>1));break;case"reset":doReset(!($.inArray(g_crnt_cell,g_dragcells)>=0&&g_dragcells.length>1));break;case"resetall":doResetAll(!1,!0);break;case"remsort":confirm("Can we clear the sort?")&&grid.PerformCallback("REMSORT")}}function initCustomStyles(){$("#cellstyle-tcolor").jPicker({window:{expandable:!0,liveUpdate:!1},color:{alphaSupport:!0,active:new $.jPicker.Color({hex:"000000"})},position:{x:"center",y:"center"}});$("#cellstyle-bgcolor").jPicker({window:{expandable:!0,liveUpdate:!1},color:{alphaSupport:!0,active:new $.jPicker.Color({hex:"FFFFFF"})},position:{x:"center",y:"center"}});$("#dlgInsertRow").mousedown(function(){$("div.jPicker").hide()});$("#dlgInsertRow").bind("dialogclose",function(){$("div.jPicker").hide()})}function initCustomizations(){var t,n,i;g_grdtbl=$("#"+getGridName()+"_DXMainTable");g_grdtbl_hdr=$("#"+getGridName()+"_DXHeaderTable");g_grdtbl_hdr.length==0&&(g_grdtbl_hdr=g_grdtbl);t=$("tr.dxgvDataRow_GridDefaultTheme:first",g_grdtbl).find("td.dxgvIndentCell").length;t>0&&($("tr",g_grdtbl).find("td:lt("+t+")").css("width","0px").css("padding-left","0px").css("padding-right","0px").css("border-right-width","0px").css("background-color","transparent"),g_grdtbl_hdr!=g_grdtbl&&$("tr",g_grdtbl_hdr).find("td:lt("+t+")").css("width","0px").css("padding-left","0px").css("padding-right","0px").css("border-right-width","0px"));g_cols_total=$("tr.dxgvDataRow_GridDefaultTheme:first td",g_grdtbl).length-($("#"+getGridName()+"_DXFixedColumnsDiv").length>0?1:0);g_cols_indent=$("tr.dxgvDataRow_GridDefaultTheme:first",g_grdtbl).find("td.dxgvIndentCell").length;g_dragstarted=!1;$g_grdmaintbl=$("#"+getGridName());$g_grdmaintbl.mousedown(function(n){n.button==0&&doMouseDown(n)}).mousemove(function(n){n.button==0&&g_dragstarted&&doMouseMove(n)}).mouseup(function(n){n.button==0&&g_dragstarted&&doMouseUp(n)});n=$("#"+getGridName()+"_DXHeadersRow0 td:last");n.length>0&&n.prop("id")==""&&n.prop("class")=="dxgvTable_GridDefaultTheme"&&(n=$("#"+getGridName()+"_DXHeadersRow0").parent().children("tr:first").find("td:last"),n.css("width","0px"),g_grdtbl_hdr!=g_grdtbl&&(n=$("#"+getGridName()+"_DXMainTable tr:first td:last"),n.css("width","0px")),i=$("#"+getGridName()+"_DXFixedColumnsContentDiv"),i.length>0&&i.width($("#"+getGridName()+"_DXMainTable").width()))}function aspxDDPCustomContextMenu(n,t,i){var r=aspxGetControlCollection().Get(getGridName());return r&&r.RaiseContextMenu(n,t,i),!1}function showContextMenu(n,t){var i,r,e,u,f,o,s,h;if(g_crnt_obj_type=null,g_crnt_customid=null,g_crnt_row=null,g_crnt_cell=null,g_crnt_hdr_span=null,g_crnt_hdr_cell=null,g_crnt_row_idx=-1,t.objectType=="row"||t.objectType=="grouprow"||t.objectType=="customrow"||t.objectType=="header"){if($($.browser.msie?t.htmlEvent.srcElement:t.htmlEvent.target).hasClass("dxgvIndentCell"))return;if(i=ASPxClientUtils.GetEventX(t.htmlEvent),r=ASPxClientUtils.GetEventY(t.htmlEvent),$("#pMenuGrid_DXMST_").css("border-top-width","0px").css("border-bottom-width","0px").find("tr td:nth-child(2)").css("border-bottom-width","0px"),t.objectType=="header"?(g_crnt_row_idx=-1,g_crnt_cell=$.browser.msie?t.htmlEvent.srcElement:t.htmlEvent.target,g_crnt_cell.tagName.toUpperCase()=="SPAN"&&(g_crnt_cell=$(g_crnt_cell).parent()[0]),$(g_crnt_cell).hasClass("dxgvHeader_GridDefaultTheme")==!1&&g_crnt_cell.tagName.toUpperCase()=="TD"&&(g_crnt_cell=$(g_crnt_cell).parents("td").first()[0]),g_crnt_row=$(g_crnt_cell).parent()[0],e=$(g_crnt_cell).find("span"),e.length>0&&(g_crnt_hdr_span=e[0],g_crnt_hdr_cell=$(g_crnt_hdr_span).parent()[0],g_crnt_customid=$(g_crnt_hdr_span).attr("customid"))):t.objectType=="customrow"?(g_crnt_row_idx=t.index,g_crnt_cell=$.browser.msie?t.htmlEvent.srcElement:t.htmlEvent.target,g_crnt_cell.tagName.toUpperCase()=="DIV"&&(g_crnt_cell=$(g_crnt_cell).parent()[0]),g_crnt_row=$(g_crnt_cell).parent()[0],g_crnt_customid=$(g_crnt_cell).attr("customid")):(g_crnt_row_idx=t.index,g_crnt_cell=$.browser.msie?t.htmlEvent.srcElement:t.htmlEvent.target,g_crnt_row=$(g_crnt_cell).parent()[0],g_crnt_customid=$(g_crnt_cell).attr("customid")),g_crnt_obj_type=t.objectType,g_crnt_customid==null||g_crnt_customid==""||g_crnt_customid=="undefined")return;if(g_crnt_customid.indexOf("G")==0||g_crnt_customid.indexOf("H")==0)return;u=!0;isCustomRow()||(f=$(g_crnt_row).next("tr").attr("customid"),f!=null||isLastPage()||(u=!1),f!=null&&(f.indexOf("G")==0||f.indexOf("H")==0)&&(u=!1));o=!0;s=t.objectType=="customrow";$.inArray(g_crnt_cell,g_dragcells)>=0&&g_dragcells.length>1?(u=!1,o=!1,s=!1):unselectCells(!0);pMenuGrid.GetItem(0).SetEnabled(o);pMenuGrid.GetItem(1).SetEnabled(u);pMenuGrid.GetItem(2).SetEnabled(s);h=$("#bannerStrip").height()+$(".secondaryHeader").height()+$(".language").height();r+$(pMenuGrid.mainElement).height()>getDisplayHeight()+h&&(r=r-$(pMenuGrid.mainElement).height());i+$(pMenuGrid.mainElement).width()>getDisplayWidth()+$("#leftmainpanel").width()&&(i=i-$(pMenuGrid.mainElement).width());pMenuGrid.ShowAtPos(i,r)}}function doCustomizations(n){return g_gridname=n,initCustomizations(),g_grdtbl!=null&&g_grdtbl.length>0&&($("tr",g_grdtbl).css("height","auto").children().css("height","auto"),$("tr:first",g_grdtbl).css("height","0px").css("padding","0px 2px 0px 2px").children().css("height","0px").css("padding","0px 2px 0px 2px")),g_grdtbl_hdr!=null&&g_grdtbl_hdr.length>0&&($("tr",g_grdtbl_hdr).css("height","auto").children().css("height","auto"),$("tr:first",g_grdtbl_hdr).css("height","0px").css("padding","0px 2px 0px 2px").children().css("height","0px").css("padding","0px 2px 0px 2px")),doInsertAllRows(),doChangeAllStyles(),setTableScroll(),!0}function doSetRowHeight(n){return g_gridname=n,initCustomizations(),g_grdtbl!=null&&g_grdtbl.length>0&&($("tr",g_grdtbl).css("height","auto").children().css("height","auto"),$("tr:first",g_grdtbl).css("height","0px").css("padding","0px 2px 0px 2px").children().css("height","0px").css("padding","0px 2px 0px 2px")),g_grdtbl_hdr!=null&&g_grdtbl_hdr.length>0&&($("tr",g_grdtbl_hdr).css("height","auto").children().css("height","auto"),$("tr:first",g_grdtbl_hdr).css("height","0px").css("padding","0px 2px 0px 2px").children().css("height","0px").css("padding","0px 2px 0px 2px")),doChangeAllStyles(),setTableScroll(),!0}function doColumnSorting(n,t){return event.srcElement.tagName.toLowerCase()=="img"&&(t.cancel=!0),!0}function doTableVerticalScroll(){return setTableScroll(),!0}function doMouseDown(n){n.target.tagName=="TD"&&($g_grdmaintbl.css("cursor","crosshair"),n.preventDefault(),g_dragstarted=!0,g_dragstartevent=n,g_dragstartcell=$.browser.msie?n.srcElement:n.target,g_dragendevent=null,g_dragendcell=null)}function doMouseMove(n){if(g_dragstartcell==null||g_dragstartevent==null){resetMouseSettings();return}g_dragendevent=n;g_dragendcell=$.browser.msie?n.srcElement:n.target;selectCells()}function doMouseUp(n){if(g_dragstarted=!1,g_dragstartcell==null||g_dragstartevent==null){resetMouseSettings();return}g_dragendevent=n;g_dragendcell=$.browser.msie?n.srcElement:n.target;selectCells();resetMouseSettings()}function selectCells(){var t,i,e,r,o,n;unselectCells(!0);var h=$(g_dragstartcell).parent().parent(),u=$(g_dragstartcell).parent()[0].sectionRowIndex,f=$(g_dragendcell).parent()[0].sectionRowIndex,s=u;for(f<u&&(u=f,f=s),t=g_dragstartcell.cellIndex,i=g_dragendcell.cellIndex,s=t,i<t&&(t=i,i=s),e=u;e<=f;e++)if((r=$("tr:nth-child("+(e+1)+")",h),!r.hasClass("dxgvGroupRow_GridDefaultTheme"))&&r.attr("id")!=null&&!(r.attr("id").indexOf(getGridName()+"_DXHeadersRow")>=0))for(g_dragrows.push(r[0]),o=t;o<=i;o++)n=$("td:nth-child("+(o+1)+")",r),n.addClass("custom-cell-selection"),n.hasClass(("custstylebg"+n.attr("customid")).toLowerCase())&&(n.removeClass(("custstylebg"+n.attr("customid")).toLowerCase()),n.addClass(("custstylebgdis"+n.attr("customid")).toLowerCase())),g_dragcells.push(n[0]);g_dragrowstartprev=u;g_dragrowendprev=f;g_dragcellstartprev=t;g_dragcellendprev=i}function unselectCells(n){var t=$(g_dragstartcell).parent().parent();$(g_dragcells).each(function(){var i=$(this,t);i.hasClass("custom-cell-selection")&&i.removeClass("custom-cell-selection");i.hasClass(("custstylebgdis"+i.attr("customid")).toLowerCase())&&(i.removeClass(("custstylebgdis"+i.attr("customid")).toLowerCase()),n&&i.addClass(("custstylebg"+i.attr("customid")).toLowerCase()))});g_dragrowstartprev=-1;g_dragrowendprev=-1;g_dragcellstartprev=-1;g_dragcellendprev=-1;g_dragrows=[];g_dragcells=[]}function resetMouseSettings(){$g_grdmaintbl.css("cursor","default");g_dragstarted=!1;g_dragstartevent=null;g_dragstartcell=null;g_dragendevent=null;g_dragendcell=null}function doInsertRow(n){$("#rowLabel").css("display","");$("#txtInsertText").val("");$("#lstFonts").val("");$("#lstFontSize").val("");$("#lstFontStyle").val("");$("#txtIndent").val("");$("#txtHeight").val("");$("#lstHAlign").val("");$("#lstVAlign").val("");$("#cellstyle-tcolor")[0].color.active.val("ahex",null);$("#cellstyle-bgcolor")[0].color.active.val("ahex",null);$("#dlgInsertRow").dialog({minWidth:550,modal:!0,autoOpen:!1,hide:"fade",title:"Insert Row",buttons:{"Insert Row":function(){var r=$("#txtInsertText").val(),t,e,h,u,i,s,f,o;if(r==""&&(r=" "),$("#txtIndent").val()!=""&&!is_integer($("#txtIndent").val()))return alert("Enter a numeric value for Indent"),!1;if($("#txtHeight").val()!=""){if(!is_integer($("#txtHeight").val()))return alert("Enter a numeric value between 10 and 99 for Height."),!1;if($("#txtHeight").val()<10||$("#txtHeight").val()>99)return alert("Enter a value between 10 and 99 for Height."),!1}if(t="",isCustomRow()?t=g_crnt_customid.split("Sub")[0]:(i=g_crnt_customid,insafter(n)&&(i=$(g_crnt_row).next("tr").attr("customid")),i==null&&isLastRow(g_crnt_row,isCustomRow(),insafter(n))?t="D2":i!=null&&i.indexOf("C")==0?t="D1":i!=null&&i.indexOf("D1")==0?t=i:i!=null&&i.indexOf("R")==0&&(t=i.split("C")[0])),t=="")return alert("Insert row failed to generate new row!!!"),!1;if(e=0,t+="Sub",h=g_custom_rows==null?null:$.grep(g_custom_rows,function(n){if(n.rowid.indexOf(t)==0){var i=parseInt(n.rowid.replace(t,""));i>e&&(e=i)}return n.rowid.indexOf(t)==0}),t+=e+1,u=g_crnt_row_idx+1,g_custom_rows!=null)for(isCustomRow()?(i=getCustomRowID(),s=$.grep(h,function(n){return n.rowid==i}),s.length>0&&(u=s[0].rowindex+(insbefore(n)?0:1))):u+=$.grep(g_custom_rows,function(t){return t.permrowindex<=g_crnt_row_idx+(insbefore(n)?0:1)}).length,f=0;f<g_custom_rows.length;f++)g_custom_rows[f].rowindex>=u&&g_custom_rows[f].rowindex++;createCustomRowObject(!0,t,u,g_crnt_row_idx+1);o="";o=t.indexOf("D1")==0?'<tr id="'+t+'" customid="'+t+'" class="dxgvCustomRow_GridDefaultTheme" oncontextmenu="aspxDDPCustomContextMenu(\'customrow\','+g_crnt_row_idx+',event); return false;" style="font-weight:bold;"><td class="dxgv" style="white-space: normal;" colspan="'+g_cols_total+'" id="cell_'+t+'" customid="'+t+'"><div>'+r+"<\/div><\/td><\/tr>":'<tr id="'+t+'" customid="'+t+'" class="dxgvCustomRow_GridDefaultTheme" oncontextmenu="aspxDDPCustomContextMenu(\'customrow\','+g_crnt_row_idx+',event); return false;" style="font-weight:bold;"><td class="dxgv" style="white-space: normal;" colspan="'+g_cols_total+'" id="cell_'+t+'" customid="'+t+'">'+r+"<\/td><\/tr>";insbefore(n)?$(g_crnt_row).before(o):$(g_crnt_row).after(o);createCellStyleObject(!0,t,r,$("#lstFonts").val(),$("#lstFontSize").val(),$("#lstFontStyle").val(),$("#txtIndent").val(),$("#txtHeight").val(),$("#lstHAlign").val(),$("#lstVAlign").val(),$("#cellstyle-tcolor")[0].color.active.val("hex"),$("#cellstyle-bgcolor")[0].color.active.val("hex"));setCellStyle(t,$("#"+t+" td").first(),null);setTableScroll();$(this).dialog("close")},Cancel:function(){$(this).dialog("close")}}});$("#dlgInsertRow").dialog("open")}function doInsertAllRows(){var t,n,e,i,u,f,r;if(createCustomRowObjects(),g_custom_rows==null||g_custom_rows.length<=0)return!0;for(t=g_custom_rows.sort(function(n,t){return n.rowindex-t.rowindex}),n=0;n<t.length;n++)(e=$("#"+t[n].rowid,g_grdtbl),e.length>0)||(i=null,u=!1,t[n].rowid.indexOf("D1")==0?i=$("#"+getGridName()+"_DXHeadersRow0",g_grdtbl_hdr):t[n].rowid.indexOf("D2")==0&&isLastPage()?(i=$(g_grdtbl).find("tr").last(),u=!0):(i=$("tr[customid='"+t[n].rowid.split("Sub")[0]+"']",g_grdtbl),i.length<=0&&(i=$("td[customid='"+t[n].rowid.split("Sub")[0]+"']",g_grdtbl).parent())),i.length>0&&(f="..",r="",r=t[n].rowid.indexOf("D1")==0?'<tr id="'+t[n].rowid+'" customid="'+t[n].rowid+'" class="dxgvCustomRow_GridDefaultTheme" oncontextmenu="aspxDDPCustomContextMenu(\'customrow\','+(g_custom_rows[n].permrowindex-1)+',event); return false;" style="font-weight:bold;"><td class="dxgv" style="white-space: normal;" id="cell_'+t[n].rowid+'" customid="'+t[n].rowid+'" colspan="'+g_cols_total+'"><div>'+f+"<\/div><\/td><\/tr>":'<tr id="'+t[n].rowid+'" customid="'+t[n].rowid+'" class="dxgvCustomRow_GridDefaultTheme" oncontextmenu="aspxDDPCustomContextMenu(\'customrow\','+(g_custom_rows[n].permrowindex-1)+',event); return false;" style="font-weight:bold;"><td class="dxgv" style="white-space: normal;" id="cell_'+t[n].rowid+'" customid="'+t[n].rowid+'" colspan="'+g_cols_total+'">'+f+"<\/td><\/tr>",u?$(i[0]).after(r):$(i[0]).before(r)));return!0}function doDeleteRow(){var t,n;if(isCustomRow()){for(t=$.grep(g_custom_rows,function(n){return n.rowid==getCustomRowID()})[0],g_custom_rows=$.grep(g_custom_rows,function(n){return n.rowid!=t.rowid}),n=0;n<g_custom_rows.length;n++)g_custom_rows[n].rowindex>t.rowindex&&g_custom_rows[n].rowindex--;g_custom_styles=$.grep(g_custom_styles,function(n){return n.rowid!=t.rowid});$(g_crnt_row).remove();resetCustomRowTags();resetCellStyleTags();resizeTable();setTableScroll()}else alert("Permanent rows can't be deleted. Only the rows which are inserted by the user can be deleted.")}function doChangeStyle(n){var r,i,t;$("#txtInsertText").val("");$("#lstFonts").val("");$("#lstFontSize").val("");$("#lstFontStyle").val("");$("#txtIndent").val("");$("#txtHeight").val("");$("#lstHAlign").val("");$("#lstVAlign").val("");$("#cellstyle-tcolor")[0].color.active.val("ahex",null);$("#cellstyle-bgcolor")[0].color.active.val("ahex",null);r=$(g_crnt_cell);n&&(isRowHeader()||isCustomRow()||isGroupRow())?($("#rowLabel").css("display",""),$("#txtInsertText").val($("td",g_crnt_row).not(".dxgvIndentCell").first().text())):n&&isColHeader()?(r=$(g_crnt_hdr_cell),$("#rowLabel").css("display",""),i=$(g_crnt_hdr_span).text(),i=$.trim(i),$("#txtInsertText").val(i)):$("#rowLabel").css("display","none");n&&(t=null,g_custom_styles!=null&&(t=$.grep(g_custom_styles,function(n){return n.rowid==g_crnt_customid})),t!=null&&t.length>0&&(t=t[0],t.font!=null&&t.font!=""&&$("#lstFonts").val(t.font.toLowerCase()),t.size!=null&&t.size!=""&&$("#lstFontSize").val(t.size),t.style!=null&&t.style!=""&&$("#lstFontStyle").val(t.style.toLowerCase()),t.indent!=null&&t.indent!=""&&$("#txtIndent").val(t.indent),t.height!=null&&t.height!=""&&$("#txtHeight").val(t.height),t.align!=null&&t.align!=""&&$("#lstHAlign").val(t.align.toLowerCase()),t.valign!=null&&t.valign!=""&&$("#lstVAlign").val(t.valign.toLowerCase()),t.color!=null&&t.color!=""&&$("#cellstyle-tcolor")[0].color.active.val("hex",t.color),t.bgColor!=null&&t.bgColor!=""&&$("#cellstyle-bgcolor")[0].color.active.val("hex",t.bgColor)));$("#dlgInsertRow").dialog({minWidth:550,modal:!0,autoOpen:!1,hide:"fade",title:"Change Cell Style",buttons:{Apply:function(){var t="";if($("#txtIndent").val()!=""&&!is_integer($("#txtIndent").val()))return alert("Enter a numeric value for Indent."),!1;if($("#txtHeight").val()!=""){if(!is_integer($("#txtHeight").val()))return alert("Enter a numeric value for Height."),!1;if($("#txtHeight").val()<10||$("#txtHeight").val()>99)return alert("Enter a numeric value between 10 and 99 for Height."),!1}if(n&&(isRowHeader()||isColHeader()||isCustomRow()||isGroupRow())&&(t=$("#txtInsertText").val(),t=t.replace(/  /g,"&nbsp;&nbsp;"),t==""&&(t=" "),isColHeader()?$(g_crnt_hdr_span).text(t):r.text(t)),n)createCellStyleObject(!0,g_crnt_customid,t,$("#lstFonts").val(),$("#lstFontSize").val(),$("#lstFontStyle").val(),$("#txtIndent").val(),$("#txtHeight").val(),$("#lstHAlign").val(),$("#lstVAlign").val(),$("#cellstyle-tcolor")[0].color.active.val("hex"),$("#cellstyle-bgcolor")[0].color.active.val("hex")),setCellStyle(g_crnt_customid,g_crnt_cell,g_crnt_hdr_cell);else{var i=$("#lstFonts").val(),u=$("#lstFontSize").val(),f=$("#lstFontStyle").val(),e=$("#txtIndent").val(),o=$("#txtHeight").val(),s=$("#lstHAlign").val(),h=$("#lstVAlign").val(),c=$("#cellstyle-tcolor")[0].color.active.val("hex"),l=$("#cellstyle-bgcolor")[0].color.active.val("hex");$(g_dragcells).each(function(){var n=$(this).attr("customid");n!=null&&n!=""&&(createCellStyleObject(!1,n,"",i,u,f,e,o,s,h,c,l),setCellStyle(n,this,null))});resetCellStyleTags();unselectCells(!0)}$(this).dialog("close")},Cancel:function(){$(this).dialog("close")}}});$("#dlgInsertRow").dialog("open")}function doChangeAllStyles(){var n,t,i;if(createCellStyleObjects(),g_custom_styles==null||g_custom_styles.length<=0)return!0;for(n=0;n<g_custom_styles.length;n++)t=null,i=null,g_custom_styles[n].rowid=="D1"||g_custom_styles[n].rowid.indexOf("C")==0?(i=$('span[customid="'+g_custom_styles[n].rowid+'"]',g_grdtbl_hdr).parent(),t=$(i).parents("td:first")):t=g_custom_styles[n].rowid.indexOf("D1")==0?$('td[customid="'+g_custom_styles[n].rowid+'"]',g_grdtbl_hdr):$('td[customid="'+g_custom_styles[n].rowid+'"]',g_grdtbl),setCellStyle(g_custom_styles[n].rowid,t,i);return!0}function doReset(n){if(g_custom_styles!=null){var t=!1;n?(resetCellStyle(g_crnt_customid,g_crnt_cell),(isRowHeader()||isColHeader()||isGroupRow())&&(t=!0)):($(g_dragcells).each(function(){var n=$(this).attr("customid");n!=null&&n!=""&&(t?resetCellStyle(n,this):t=resetCellStyle(n,this))}),unselectCells(!1));resetCellStyleTags();t&&grid.PerformCallback()}}function setCellStyle(n,t,i){var r=$.grep(g_custom_styles,function(t){return t.rowid==n}),c,s,h,a;if(r.length==0)return!1;r=r[0];var e=("custstyle"+n).toLowerCase(),o=("custstylebg"+n).toLowerCase(),f=remCellStyleClass(e,o),l="."+e,u="{";r.font!=null&&r.font!=""&&(u+="font-family: "+r.font.replace(/\ /g,"-")+" !important;");r.size!=null&&r.size!=""&&(u+="font-size: "+r.size+"px !important;");r.style!=null&&r.style!=""&&(u+="font-weight: "+(r.style.toLowerCase().indexOf("bold")>=0?"bold":"normal")+" !important;");r.style!=null&&r.style!=""&&(u+="font-style: "+(r.style.toLowerCase().indexOf("italic")>=0?"italic":"normal")+" !important;");r.indent!=null&&r.indent!=""&&(u+="padding-left: "+r.indent+"px !important;");r.align!=null&&r.align!=""&&(u+="text-align: "+r.align+" !important;");r.valign!=null&&r.valign!=""&&(u+="vertical-align: "+r.valign+" !important;");u+="}";c="."+o;s="{";r.color!=null&&r.color!=""&&(s+="color: "+r.color+" !important;");r.bgColor!=null&&r.bgColor!=""&&(s+="background-color: "+(r.bgColor==null?"transparent":r.bgColor)+" !important;");s+="}";h=$.browser.msie&&document.documentMode<=8?f.rules:f.cssRules;f.insertRule?(f.insertRule(l+u,h.length),f.insertRule(c+s,h.length)):f.addRule&&(f.addRule(l,u,h.length),f.addRule(c,s,h.length));a=$.trim(r.text);i!=null&&a!=""?$(i).find("span").text(r.text):n.indexOf("D1")==0?$(t).find("div").text(r.text):r.text!=""&&$(t).text(r.text);$(t).hasClass(e)||$(t).addClass(e);$(t).hasClass(o)||$(t).addClass(o);i!=null?$(i).height(r.height):r.height>0&&$(t).height(r.height);i==null||$(i).hasClass(e)||$(i).addClass(e);i==null||$(i).hasClass(o)||$(i).addClass(o)}function resetCellStyle(n,t){var i=("custstyle"+n).toLowerCase(),r=("custstylebg"+n).toLowerCase();if(n.indexOf("Sub")>0)createCellStyleObject(!1,n,$(t).text(),"","","","","","","",null,null),setCellStyle(n,t,null);else if(cellstyle=$.grep(g_custom_styles,function(t){return t.rowid==n}),cellstyle.length>0&&((g_custom_styles=$.grep(g_custom_styles,function(t){return t.rowid!=n}),$(t).hasClass(i)&&$(t).removeClass(i),$(t).hasClass(r)&&$(t).removeClass(r),remCellStyleClass(i,r),$(t).hasClass("dxgvHeader_GridDefaultTheme"))||$(t).hasClass("colhead")||$(t).parent().hasClass("dxgvGroupRow_GridDefaultTheme")))return!0;return!1}function remCellStyleClass(n,t){for(var u,f=$("#customstyles")[0],i=i=$.browser.msie&&document.documentMode<=8?f.styleSheet:f.sheet,e=$.browser.msie&&document.documentMode<=8?i.rules:i.cssRules,r=0;r<e.length;r++)u=e[r].selectorText.toLowerCase(),(u=="."+n||u=="."+t)&&(i.deleteRule?(i.deleteRule(r),r--):i.removeRule&&(i.removeRule(r),r--));return i}function doResetAll(n,t){var i,e;if(g_custom_rows==null&&g_custom_styles==null&&$("#hdnTableFormatRows").val()==""&&$("#hdnTableFormatStyles").val()==""||!n&&!confirm("This will clear all your customizations in the table. Proceed?"))return!1;$("#hdnTableFormatRows").val("");$("#hdnTableFormatStyles").val("");g_custom_rows=null;g_custom_styles=null;var u=$("#customstyles")[0],r=$.browser.msie&&document.documentMode<=8?u.styleSheet:u.sheet,f=$.browser.msie&&document.documentMode<=8?r.rules:r.cssRules;for(i=0;i<f.length;i++)e=f[i].selectorText.toLowerCase(),e.indexOf(".custstyle")==0&&(r.deleteRule?(r.deleteRule(i),i--):r.removeRule&&(r.removeRule(i),i--));t&&grid.PerformCallback()}function resetCustomRowTags(){for(var n="",t=0;t<g_custom_rows.length;t++)n!=""&&(n+="~"),n+=g_custom_rows[t].rowid+"|"+g_custom_rows[t].rowindex;$("#hdnTableFormatRows").val(n)}function createCustomRowObjects(){var r,t,n,i;if(g_custom_rows=null,$("#hdnTableFormatRows").val()!="")for(r=$("#hdnTableFormatRows").val().split("~"),t=0;t<r.length;t++)r[t]!=""&&(n=r[t].split("|"),i=0,n[0].indexOf("R")==0?i=parseInt(n[0].replace("R","").split("Sub")[0]):n[0].indexOf("D1")==0?i=parseInt(n[0].replace("D","").split("Sub")[0])-1:n[0].indexOf("D2")==0&&(i=parseInt($("#hdnTotalRows").val())),createCustomRowObject(!1,n[0],parseInt(n[1]),i))}function createCustomRowObject(n,t,i,r){var u={rowid:t,rowindex:i,permrowindex:r};g_custom_rows==null?g_custom_rows=[u]:g_custom_rows.push(u);n&&resetCustomRowTags()}function resetCellStyleTags(){for(var t="",n=0;n<g_custom_styles.length;n++)t!=""&&(t+="~"),t+=g_custom_styles[n].rowid+"|0|",t+=g_custom_styles[n].height+"|",t+=g_custom_styles[n].indent+"|false|",t+=g_custom_styles[n].align+"|",t+=g_custom_styles[n].valign+"|",t+=g_custom_styles[n].font+"|",t+=g_custom_styles[n].style+"|",t+=g_custom_styles[n].size+"|",t+=(g_custom_styles[n].color==null?"":g_custom_styles[n].color)+"|",t+=(g_custom_styles[n].bgColor==null?"":g_custom_styles[n].bgColor)+"|",t+=htmlEncode(g_custom_styles[n].text);$("#hdnTableFormatStyles").val(t)}function createCellStyleObjects(){var i,t,n;if(g_custom_styles=null,$("#hdnTableFormatStyles").val()!="")for(i=$("#hdnTableFormatStyles").val().split("~"),t=0;t<i.length;t++)i[t]!=""&&(n=i[t].split("|"),createCellStyleObject(!1,n[0],n[12],n[7],n[9],n[8],n[3],n[2],n[5],n[6],n[10]!=""?n[10]:null,n[11]!=""?n[11]:null))}function createCellStyleObject(n,t,i,r,u,f,e,o,s,h,c,l){c!=null&&c.indexOf("#")<0&&(c="#"+c);l!=null&&l.indexOf("#")<0&&(l="#"+l);o!=""&&(o=parseInt(o));e!=""&&(e=parseInt(e));var a=null;g_custom_styles!=null&&(a=$.grep(g_custom_styles,function(n){return n.rowid==t}));a==null||a.length==0?(a={rowid:t,text:htmlDecode(i),font:r,size:u,style:f,height:o,indent:e,align:s,valign:h,color:c,bgColor:l},g_custom_styles==null?g_custom_styles=[a]:g_custom_styles.push(a)):(a=a[0],a.text=htmlDecode(i),a.font=r,a.size=u,a.style=f,a.indent=e,a.height=o,a.align=s,a.valign=h,a.color=c,a.bgColor=l);n&&resetCellStyleTags()}function setColorPickerColor(n,t,i){var u=$(i).css(t),r=null;u.search("rgba")>=0?(r=u.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/),r[1]==0&&r[2]==0&&r[3]==0&&r[4]==0?$(n)[0].color.active.val("hex","#FFFFFF"):$(n)[0].color.active.val("rgba",{r:r[1],g:r[2],b:r[3],a:r[4]})):u.search("rgb")>=0?(r=u.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),$(n)[0].color.active.val("rgba",{r:r[1],g:r[2],b:r[3],a:255})):u=="transparent"?$(n)[0].color.active.val("hex","#FFFFFF"):$(n)[0].color.active.val("hex",u)}function getHexFromRGB(n){if(n.search("rgb")==-1)return n;n=n.search("rgba")>=0?n.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/):n.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);function t(n){return("0"+parseInt(n).toString(16)).slice(-2)}return"#"+t(n[1])+t(n[2])+t(n[3])}function htmlEncode(n){return $("<div/>").text(n).html()}function htmlDecode(n){return $("<div/>").html(n).text()}function insbefore(n){return n=="insb"}function insafter(n){return n=="insa"}function isGroupRow(){return g_crnt_obj_type=="grouprow"}function isCustomRow(){return g_crnt_obj_type=="customrow"}function isColHeader(){return $(g_crnt_cell).hasClass("dxgvHeader_GridDefaultTheme")}function isRowHeader(){return $(g_crnt_cell).hasClass("colhead")}function isLastRow(n,t,i){if(t&&$(n).attr("customid").indexOf("D2")==0)return!0;if(!t&&i&&isLastPage()){var r=$(g_grdtbl).find("tr.dxgvDataRow_GridDefaultTheme").last();if(r.length>0&&n.className==r[0].className)return!0}return!1}function isLastPage(){var n=$(".dxgvPagerBottomPanel_GridDefaultTheme");return n.length==0?!0:$(n).find(".dxWeb_pNextDisabled_GridDefaultTheme").length>0?!0:!1}function getCustomRowID(){return $(g_crnt_row).attr("customid")}function is_integer(n){return parseFloat(n)==parseInt(n)&&!isNaN(n)}function getTableMaxHeight(){var n=0;return $(".report-view-tools-PageDim").each(function(){n+=$(this).height()}),$(".chartHeaderFooteralign").each(function(){n+=$(this).height()}),n+=$("#MainContent_spanFooter").height(),n+=28,n=$(".main-body").height()-n}function setTableScroll(){var n=getTableMaxHeight(),t;n<=0||(t=$(".dxgvHSDC").height(),t+=$("#grdTableView_DXFixedColumnsDiv").height(),t+=$(".dxgvPagerBottomPanel_GridDefaultTheme").height(),$("#grdTableView_DXMainTable").height()>n-t?($(g_grdtbl).parent("div").css("overflow-y","scroll"),grid.SetHeight(n),$("#"+getGridName()).height(n),n-t>0&&$("#grdTableView_DXMainTable").parent().height(n-t)):($(g_grdtbl).parent("div").css("overflow-y","scroll"),$(g_grdtbl).parent("div").height("auto"),$("#grdTableView").height("auto")))}function getDisplayWidth(){return $("#divReportContent").width()}function getDisplayHeight(){return 0+$("#divReportContent").height()}function getIntValue(n,t){var i=0;return(i=parseInt($(n).css(t)),isNaN(i)||i<0)?0:i}function isBold(n){return n.css("font-weight").toLowerCase()=="bold"?!0:n.css("font-weight").toLowerCase()=="700"?!0:!1}function getGridName(){return g_gridname==null||g_gridname==""?"grdTableView":g_gridname}var g_crnt_obj_type=null,g_crnt_customid=null,g_crnt_row=null,g_crnt_cell=null,g_crnt_hdr_span=null,g_crnt_hdr_cell=null,g_crnt_row_idx=-1,g_custom_styles=null,g_custom_rows=null,g_gridname="grdTableView",$g_grdmaintbl=null,g_grdtbl=null,g_grdtbl_hdr=null,g_cols_total=0,g_cols_indent=0,g_dragstarted=!1,g_dragstartevent=null,g_dragstartcell=null,g_dragendevent=null,g_dragendcell=null,g_dragrowstartprev=-1,g_dragrowendprev=-1,g_dragcellstartprev=-1,g_dragcellendprev=-1,g_dragrows=[],g_dragcells=[];$(function(){})