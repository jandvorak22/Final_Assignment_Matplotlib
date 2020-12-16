﻿var gbl_subNationalHierarchyData = []; // global variable used to merge and keep the data of each expanding hierarchies
var gbl_subNationalData; // Global variable used to keep the data of first load/Serach/Filter results
var gbl_controlId;
var gbl_targetId;
var gbl_selectedMembers;
var gbl_fromSearch;// true when result is loaded after search

function openSubNationalTab(evt, tabName,hierarchy) { //On calling this function html content will be over written to reflect the selection from the other tabs
    var i, tabcontent, tablinks;
    var varPerCol;
    var loopStart = 0;
    var loopEnd;
    var scounter = 0;
    var sHtml = "";
    var selectedchecked = "";
    var isSelected = false;
    var hierarchyName = "";
    var alphabet;
    var jumptolist = [];
    var length;   
    var pageStart;
    var pageEnd;
    var tabdata;
    gbl_selectedMembers = gbl_array_member_selected[gbl_controlId];

    tabcontent = $('.SubnationalAvailableView .tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = $('#SubNAtionalButtonGrp label');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    if ($('.SubnationalAvailableView #' + tabName) && $('.SubnationalAvailableView #' + tabName).length > 0)
        $('.SubnationalAvailableView #' + tabName )[0].style.display = "block";

    if(evt)
        evt.currentTarget.className += " active";
    else if (tabName == "All")
        $('#defaultSubnationalTab').addClass("active");
    else {
        var currentLevel = $("#SubNAtionalButtonGrp label[level=" + tabName + "]");
        if (currentLevel && currentLevel.length > 0)
            currentLevel.addClass("active");
    }

    if (tabName !== "All") {
        var tabLevel = tabName.split('_')[1];
        tabLevel = parseInt(tabLevel);
        if (gbl_subnational_pagination)
        {
            if (!gbl_SubnationalLevelData[tabLevel]) {// Data is not available in the global variable "gbl_array_data"
                tabdata = LoadSubNationalChildren(gbl_controlId, hierarchy, tabLevel, "", "","");
                gbl_SubnationalLevelData[tabLevel] = true;
                if (tabLevel !== 0 && tabdata.length > 0)// lavel 0 will be present in gbl_array_data already 
                {
                    gbl_array_data[gbl_controlId + '_' + hierarchy].Members = gbl_array_data[gbl_controlId + '_' + hierarchy].Members.concat(tabdata);                    
                }
            }
            else {//Data is already loaded and available in the global variable "gbl_array_data"
                var subData = gbl_array_data[gbl_controlId + '_' + hierarchy].Members;
                tabdata = $.grep(subData, function (subData) { return subData['Level'] === tabLevel; });
            }

            if (gbl_fromSearch) { // if user has performed a search do the search filtering for the tab level data
                tabdata = OrderSubnationalData(gbl_subNationalData, tabLevel);                   
            }
        }
        else
            tabdata = $.grep(gbl_subNationalData, function (gbl_subNationalData) { return gbl_subNationalData['Level'] === tabLevel; });

        if (tabdata.length > 0) {
            tabdata.sort(function (a, b) {
                var compA = $(a).attr('HierarchyName');
                var compB = $(b).attr('HierarchyName');
                return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
            });
        }
        length = tabdata.length;
        varPerCol = tabdata.length / 2;
        var loopEndC = tabdata.length;        
        var counter = 0;
        var cHtml = "";
        selectedchecked = "";
        isSelected = false;        
        document.getElementById(tabName).innerHTML = "";
        cHtml = cHtml + "<ul class='ulSub'>";

        if (length < threshold) {
            loopStart = 0;
            loopEnd = length;
            $("#selectedDimension_" + gbl_controlId + " .customPagination").hide();
        }
        else {

            loopStart = gbl_start_var;
            loopEnd = gbl_end_var;
            $("#selectedDimension_" + gbl_controlId + " .customPagination").show();
            $("#selectedDimension_" + gbl_controlId + " .totalCount").text(length);

            if (gbl_start_var <= 1) {
                $("#selectedDimension_" + gbl_controlId + " .showPrev").attr("disabled", "disabled");
                loopStart = 0;
            }
            else {
                $("#selectedDimension_" + gbl_controlId + " .showPrev").attr("disabled", false);
            }

            if (gbl_end_var < length) {
                $("#selectedDimension_" + gbl_controlId + " .showNext").attr("disabled", false);
            }
            else {
                gbl_end_var = length;
                $("#selectedDimension_" + gbl_controlId + " .showNext").attr("disabled", "disabled");
                loopEnd = length;
            }
        }

        $("#selectedDimension_" + gbl_controlId + " .start").text(loopStart + 1);
        $("#selectedDimension_" + gbl_controlId + " .end").text(loopEnd);

        if(evt)// Recreate the pager drop down only on tab click
            createPagerDropdown(gbl_controlId, tabdata);

        for (var i = loopStart; i < loopEnd; i++) {
            var record = tabdata[i];
            if (record['Level'] === 0 && record["S_LC"] !== null && record["S_LC"].toUpperCase() !== "NULL") {                
                continue;
            }
            isSelected = gbl_selectedMembers[record['ID']] != null;
            if (isSelected)
                selectedchecked = "checked='checked'";
            else
                selectedchecked = "";

            if (record['HierarchyName'] !== null && record['HierarchyName'] !== "") {
                hierarchyName = record['HierarchyName'].replace(">", "-");
            }
            else {
                hierarchyName = record['Name'];
            }

            alphabet = hierarchyName.charAt(0);
            jumptolist.push(alphabet);

            liChtml = "<li parent = '" + record['Code'] + "'" + "alphabet='" + alphabet + "'" +  " uniqueId='" + record['ID'].replace(/\'/g, "%27") + "'>";
            liChtml += "<span class='glyphicon glyphicon-plus-sign plusIcon' title='Add to Custom Group'> </span>";
            liChtml += "<input type='checkbox' id='chk" + record['ID'] + "' class='chkSelectElement' " + selectedchecked + "/>";
            liChtml += "<span class='value bookunit' >" + hierarchyName + "</span>";
            liChtml += "</li>";

            cHtml += liChtml;
            liChtml = "";            
        }
        cHtml = cHtml + "</ul>";
        counter++;

        $('#ulJumpToList_' + gbl_controlId).html('');
        if (jumptolist != null && jumptolist.length > 0) {
            jumptolist = $.unique(jumptolist);
            $.each(jumptolist, function (index, value) {
                $('#ulJumpToList_' + gbl_controlId).append('<li class="jumpTo"><a href="javascript:void(0)">' + value + '</a></li>');
            });
        }

        document.getElementById(tabName).innerHTML = cHtml;
        $('.SubnationalAvailableView .tabcontent span.bookunit').draggable({
            appendTo: "body",
            helper: "clone",
            cursor: "move", cursorAt: { top: 0, left: 0 }
        });
    }
    else {
        $('div.availableViewTools div.alphabet-C').show();
        $("#selectedDimension_" + gbl_controlId + " .customPagination").hide();
        buildControl(gbl_subNationalData, gbl_controlId, gbl_targetId);

        $('.metadataIcon').off('click');
        $('.metadataIcon').on('click', function () {
            var code = $(this).attr('data-value-code');
            var name;
            if ($(this).closest('li').find('span.value')[0])
                name = $($(this).closest('li').find('span.value')[0]).text();
            var dimtype = $($(this).parents('.SubnationalAvailableView')).attr('data-type');
            var dimname = $($(this).parents('.SubnationalAvailableView')).attr('data-text');
            loadMetaDataVariable(name, code, dimtype, dimname);
        });
        $('.SubnationalAvailableView .tabcontent span.bookunit').draggable({
            appendTo: "body",
            helper: "clone",
            cursor: "move", cursorAt: { top: 0, left: 0 }
        });
    }
    TrackFeature("Variables->Country->Subnational->Open Tab->" + tabName);
}

function ShowSubnationalList($this, controlid, hierarchy) {
    var subnationaldata;
    var level;
    if ($this.parent('li').attr('level')) {
        level = parseInt($this.parent('li').attr('level'));
        level = level + 1;
    }
    var parent;
    if (!$this[0].classList.contains("caret-n-open")) {
        parent = $this.parents("li").attr('parent');        
        $this[0].classList.add("caret-n-open"); 
        
        if ($this.parents("li").find("div[id = '" + parent + "']")) {
            $this.parents("li").find("div[id = '" + parent + "']")[0].style.display = '';
        }
        if ($this.parents("li").find("div[id = '" + parent + "']").html() === '') {
            if (gbl_subnational_pagination) {// check with in the gbl_subNationalData for the childs. If does not exist make an ajax call and find the child members and append to the gbl_subNationalData.
                if (gbl_fromSearch) {
                    subnationaldata = $.grep(gbl_subNationalData, function (gbl_subNationalData) {
                        return gbl_subNationalData['S_LC'] === parent;
                    });
                    if (subnationaldata.length <= 0) {
                        subnationaldata = LoadSubNationalChildren(controlid, hierarchy, level, parent, "","");
                        gbl_subNationalData = gbl_subNationalData.concat(subnationaldata);
                    }
                }
                else {
                    subnationaldata = $.grep(gbl_subNationalHierarchyData, function (gbl_subNationalHierarchyData) {
                        return gbl_subNationalHierarchyData['S_LC'] === parent;
                    });
                    if (subnationaldata.length <= 0) {
                        subnationaldata = LoadSubNationalChildren(controlid, hierarchy, level, parent, "","");
                        gbl_subNationalHierarchyData = gbl_subNationalHierarchyData.concat(subnationaldata);
                    }
                }
            }
            else {
                subnationaldata = $.grep(gbl_subNationalData, function (gbl_subNationalData) {
                    return gbl_subNationalData['S_LC'] === parent;
                });
            }
            buildSubNationalList(subnationaldata, parent);
            $('.SubnationalAvailableView .tabcontent span.bookunit').draggable({
                appendTo: "body",
                helper: "clone",
                cursor: "move", cursorAt: { top: 0, left: 0 }
            }); 
        }
    }
    else {        
        parent = $this.parents("li").attr('parent');       
        $this[0].classList.remove("caret-n-open");       
        if ($this.parents("li").find("div[id = '" + parent + "']")) {
            $this.parents("li").find("div[id = '" + parent + "']")[0].style.display = 'none';
        }
    }
} 

function SubnationalOnload(data, controlId, targetId,fromSearch,fromClassification) {
    gbl_controlId = controlId;
    gbl_targetId = targetId;
    gbl_selectedMembers = gbl_array_member_selected[controlId]; 
    gbl_subNationalData = data;
    gbl_fromSearch = fromSearch;        
    
    $(".tabcontent li").off("click");

    $(".tabcontent").on("change", "ul input:checkbox", function () { 
        if ($('#SubNAtionalButtonGrp label.active').text() == "All") {
            var level = $(this).attr('level');
            if (level > 0) {
                var level2 = parseInt(level) - 1;
                var totalCount = $($(this).parents("ul[level = '" + level + "']")[0]).find("input[level='" + level + "']").length;
                var checkedCount = $($(this).parents("ul[level = '" + level + "']")[0]).find("input[level='" + level + "']:checked").length;
                var subBadge = ((checkedCount < 10 ? '0' : '') + checkedCount) + ' / ' + ((totalCount < 10 ? '0' : '') + totalCount);
                $($(this).parents("li[level = '" + level2 + "']")[0]).children('.subopt').find('.gobtn').attr('badge', subBadge);
            }
        }        
    });   

    $(".tabcontent").on("click", "ul li span.glyphicon-check", function ()
    { 
        var level = $($(this).parents('ul li')[0]).attr('level');
        var childLevel = parseInt(level) + 1;

        var parent = $(this).parents("li").attr('parent');
        if ($(this).parents("li").find("div[id = '" + parent + "']").html() === '') {            
            var subnationaldata = $.grep(gbl_subNationalData, function (gbl_subNationalData) {
                return gbl_subNationalData['S_LC'] === parent;
            });
            if (gbl_subnational_pagination && !gbl_fromSearch && subnationaldata.length <= 0) { // In case of subnational exception load data from server
                subnationaldata = LoadSubNationalChildren(gbl_controlId, gbl_subnationalHierarchy, childLevel, parent, "","");
                gbl_subNationalHierarchyData = gbl_subNationalHierarchyData.concat(subnationaldata);
            }
            buildSubNationalList(subnationaldata, parent);
            $('.SubnationalAvailableView .tabcontent span.bookunit').draggable({
                appendTo: "body",
                helper: "clone",
                cursor: "move", cursorAt: { top: 0, left: 0 }
            }); 
        }
        
        $($(this).parents('ul li')[0]).children().find("input[level='" + childLevel + "']").prop("checked", true);
        $($(this).parents('ul li')[0]).children().find("input[level='" + childLevel + "'].chkSelectElement").addClass("selected"); 
        $($(this).parents('ul li')[0]).children().find("input[level='" + childLevel + "'].chkSelectElement").trigger("change");  
        setSelectionsBadge(this);
        TrackFeature("Select all Subnational->" + parent);
    });

    $(".tabcontent").on("click", "ul li span.glyphicon-remove", function () {  
        var level = $($(this).parents('ul li')[0]).attr('level');
        var childLevel = parseInt(level) + 1;

        var parent = $(this).parents("li").attr('parent');
        if ($(this).parents("li").find("div[id = '" + parent + "']").html() == '') {
            var subnationaldata = $.grep(gbl_subNationalData, function (gbl_subNationalData) {
                return gbl_subNationalData['S_LC'] == parent;
            });    
            if (gbl_subnational_pagination && !gbl_fromSearch && subnationaldata.length <= 0) { // In case of subnational exception load data from server
                subnationaldata = LoadSubNationalChildren(gbl_controlId, gbl_subnationalHierarchy, childLevel, parent, "","");
                gbl_subNationalHierarchyData = gbl_subNationalHierarchyData.concat(subnationaldata);
            }
            buildSubNationalList(subnationaldata, parent);
        }

        $($(this).parents('ul li')[0]).children().find("input[level='" + childLevel + "']").prop("checked", false);
        $($(this).parents('ul li')[0]).children().find("input[level='" + childLevel + "'].chkSelectElement").removeClass("selected");
        $($(this).parents('ul li')[0]).children().find("input[level='" + childLevel + "'].chkSelectElement").trigger("change");
        setSelectionsBadge(this);
        TrackFeature("Remove subnational Selection->" + parent);
    }); 

    $('#newSelection_' + gbl_controlId + ' .SubnationalAvailableView li').draggable({
        appendTo: "body",
        helper: "clone",
        cursor: "move", cursorAt: { top: 0, left: 0 }
    });  
    openSubNationalTab(null, "All");
} 

function buildControl(data, controlid, targetId) {  
    var jumptolist = [];
    if (gbl_subnational_pagination && !gbl_fromSearch) {
        if (gbl_subNationalHierarchyData.length === 0) gbl_subNationalHierarchyData = data;
        data = gbl_subNationalHierarchyData;
    }

    gbl_selectedMembers = gbl_array_member_selected[controlid]; 
    var source =
        {
            datatype: "json",
            dataFields: [
                { name: 'ChildCount', type: 'int'},
                { name: 'ID', type: 'string' },
                { name: 'Code', type: 'string' },
                { name: 'Name', type: 'string' },
                { name: 'JTC', type: 'string' },
                { name: 'SM', type: 'boolean' },
                { name: 'IsPublic', type: 'string' },
                { name: 'S_LC', type: 'string' },
                { name: 'Level', type: 'int' },
                { name: 'S_Cat', type: 'string' },
                { name: 'S_GC', type: 'string' },
                { name: 'HierarchyName', type: 'string' }
            ],
            id: 'id',
            localdata: data
        };
    var dataAdapter = new $.jqx.dataAdapter(source, {
        loadComplete: function (records) {
            var records = dataAdapter.records;
            var length = records.length;
            var loopStart = 0;
            var loopEnd = length;
            var selectedIds = Object.keys(gbl_selectedMembers);
            var childMembers;
            var selectedCount;
            var classname = "";
            document.getElementById("All").innerHTML = "";//Clear the current html content
            var html = "<ul level = '0' class='nationalList'>";

            for (var i = loopStart; i < loopEnd; i++) {
                selectedCount = 0;
                var record = records[i];
                var alphabet = record['JTC'];
                var lihtml = "";
                var selectedchecked = "";
                var isSelected = gbl_selectedMembers[record['ID']] != null;
                if (isSelected)
                    selectedchecked = "checked='checked'";
                else
                    selectedchecked = "";

                if (record['S_LC'] == null || (record['S_LC'] != null && record['S_LC'].toUpperCase() == 'NULL') || record['S_LC'] == '') {                    
                    jumptolist.push(alphabet);
                    var count;
                    count = $.grep(data, function (data) { return data['S_LC'] == record['Code'] }).length;

                    if (gbl_subnational_pagination)
                        count = record['ChildCount'];                    
                    
                    childMembers = $.grep(data, function (data) { return data['S_LC'] === record['Code']});
                    if (selectedIds !== null && childMembers !== null && selectedIds.length > 0 && childMembers.length > 0) {
                        for (var k = 0; k < childMembers.length; k++) {
                            if (selectedIds.includes(childMembers[k].ID))
                                selectedCount = selectedCount + 1;
                        }
                    }
                    
                    var subBadge = ((selectedCount < 10 ? '0' : '') + selectedCount) + ' / ' + ((count < 10 ? '0' : '') + count);                    
                    classname = "";
                    if (count <= 0) {
                        classname = " class='liHierarchy' ";
                    }
                    lihtml = "<li level= '" + record['Level'] + "' style='height:23px' alphabet= '" + alphabet + "' " + classname + "parent = '" + record['Code'] + "'" + " uniqueId='" + record['ID'].replace(/\'/g, "%27") + "'>";
                    if (record['SM']) {
                        lihtml += "<a data-text=\"Metadata for " + record['Name'] + "\" href='#divMetadataCtl' data-toggle='modal' data-target='#divMetadataCtl'><span title='View Metadata' class='metadataIcon sprite icon-info' data-value-code='" + record['Code'] + "'></span></a>";
                    }
                    lihtml += "<span class='glyphicon glyphicon-plus-sign plusIcon' title='Add to Custom Group'></span>";
                    if (count > 0) {
                        lihtml += "<span class='closed caret-n' title='Click here to view subnationals'></span>";
                    }
                    if (!gbl_subnational_singleView)
                        lihtml += "<input type='checkbox' level= '" + record['Level'] + "' id='chk" + record['ID'] + "' class='chkSelectElement valCountry' " + selectedchecked + "/>";

                    lihtml += "<span class='value bookunit' >" + record['Name'] + "</span>";
                    lihtml += "<div class='btn-group subopt nationalopts pull-right'>";
                    if (count > 0) {
                        lihtml += "<button type='button' class='gobtn' badge='" + subBadge + "'></button>";
                        lihtml += "<button type='button' class='btn pull-right'><span class='glyphicon glyphicon-remove'></span></button>";
                        lihtml += "<button type='button' class='btn pull-right'><span class='glyphicon glyphicon-check'></span></button></div> ";
                    }
                    lihtml += "<div id='" + record['Code'] + "' style='height:auto;width:380px;display:none;'></div>";
                    lihtml += "</li>";
                    html += lihtml;                    
                }
            }
            html += "</ul>"
            document.getElementById("All").innerHTML = html;
        }
    },
        {
            loadError: function (jqXHR, status, error) {
            }
        },
        {
            beforeLoadComplete: function (records) {
            }

        });    
    dataAdapter.dataBind();

    $('#ulJumpToList_' + gbl_controlId).html('');
    if (jumptolist != null && jumptolist.length > 0) {
        jumptolist = $.unique(jumptolist);
        $.each(jumptolist, function (index, value) {
            $('#ulJumpToList_' + gbl_controlId).append('<li class="jumpTo"><a href="javascript:void(0)">' + value + '</a></li>');
        });
    }

    var length = data.length;

    if (gbl_subnational_pagination) {
        if ($(targetId).parents(".panel").hasClass('modal-body'))
            $(targetId).parents(".modal-content").find(".availableCount").text(gbl_subnationalTotalCount);
        else
            $(targetId).parents(".panel").find(".availableCount").text(gbl_subnationalTotalCount);
    }
    else{
        if ($(targetId).parents(".panel").hasClass('modal-body'))
            $(targetId).parents(".modal-content").find(".availableCount").text(length);
        else
            $(targetId).parents(".panel").find(".availableCount").text(length);
    }
}

function buildSubNationalList(subnationaldata, parent) {
    var ulLevel;
    var varPerCol = subnationaldata.length;
    var loopStartS = 0;
    var selectedchecked = "";
    var isSelected = false;
    var selectedCount;
    var parentSelectedCount = 0;
    var parentBadge = '';
    var totalCount = subnationaldata.length;
    var loopEndS = subnationaldata.length;
    var childMembers;
    var classname = "";
    var count;
    gbl_selectedMembers = gbl_array_member_selected[gbl_controlId]; 
    if (subnationaldata !== null)
        ulLevel = subnationaldata[0]['Level'];

    var sHtml = "<div style='margin-top:8px;margin-bottom:8px;border-bottom:1px solid #e4e8eb;'><ul level = '" + ulLevel + "' class='subNationalList'>";    
    var selectedIds = Object.keys(gbl_selectedMembers);

    for (var i = loopStartS; i < loopEndS; i++) {
        selectedCount = 0;
        var record = subnationaldata[i];
        isSelected = gbl_selectedMembers[record['ID']] != null;
        if (isSelected) {
            selectedchecked = "checked='checked'";
            parentSelectedCount = parentSelectedCount + 1;
        }
        else
            selectedchecked = "";        

        if (gbl_subnational_pagination && !gbl_fromSearch) {
            count = record['ChildCount'];
            childMembers = $.grep(gbl_subNationalHierarchyData, function (gbl_subNationalHierarchyData) { return gbl_subNationalHierarchyData['S_LC'] === record['Code'] });
        }
        else
        {
            count = $.grep(gbl_subNationalData, function (gbl_subNationalData) { return gbl_subNationalData['S_LC'] === record['Code'] }).length; 
            childMembers = $.grep(gbl_subNationalData, function (gbl_subNationalData) { return gbl_subNationalData['S_LC'] === record['Code'] });
        }       
            

        if (selectedIds != null && childMembers != null && selectedIds.length > 0 && childMembers.length > 0) {
            for (var k = 0; k < childMembers.length; k++) {
                if (selectedIds.includes(childMembers[k].ID))
                    selectedCount = selectedCount + 1;
            }
        }
        
        var subBadge = ((selectedCount < 10 ? '0' : '') + selectedCount) + ' / ' + ((count < 10 ? '0' : '') + count);
        var liChtml = "";
        if (!(record['S_LC'] === null || record['S_LC'].toUpperCase() === 'NULL' || record['S_LC'] === '')) {
            classname = "";
            if (count <= 0) {
                classname = " liHierarchy";
            }
            liChtml = "<li class='subli" + classname + "' level= '" + record['Level'] + "' code = '" + record['Code'] + "' parent = '" + record['Code'] + "'" + " uniqueId='" + record['ID'].replace(/\'/g, "%27") + "'>";
            
            if (count > 0) {
                liChtml += "<span class='closed caret-n' title='Click here to view cities'></span>";
                liChtml += "<div class='btn-group subopt pull-right'>";
                liChtml += "<button type='button' class='gobtn' badge='" + subBadge + "'></span></button>";
                liChtml += "<button type='button' class='btn pull-right'><span class='glyphicon glyphicon-remove'></span></button>";
                liChtml += "<button type='button' class='btn pull-right'><span class='glyphicon glyphicon-check'></span></button>";
                liChtml += "</div> ";
            }
            liChtml += "<span class='glyphicon glyphicon-plus-sign plusIcon' title='Add to Custom Group'> </span>";
            liChtml += "<input type='checkbox' id='chk" + record['ID'] + "' level= '" + record['Level'] + "' class='chkSelectElement' " + selectedchecked + "/>";
            liChtml += "<span class='value bookunit' >" + record['Name'] + "</span>";
            liChtml += "<div id='" + record['Code'] + "' style='height:auto;width:380px;display:none;'></div>";
            liChtml += "</li>";
        }
        sHtml += liChtml;        
    }
    
    sHtml + '</ul></div>';  
    $(document.getElementById(parent)).html(sHtml);

    if (gbl_subnational_pagination) {
        var badgeElement;
        var badge;
        var Count; 
        if ($("li[parent='" + parent + "'] button.gobtn:first-child").length > 0) {
            badgeElement = $("li[parent='" + parent + "'] button.gobtn:first-child")[0];
            badge = $(badgeElement).attr('badge');
            Count = badge.split("/").length > 0 ? badge.split("/")[1].trim() : 0;
            Count = parseInt(Count);
            subBadge = ((parentSelectedCount < 10 ? '0' : '') + parentSelectedCount) + ' / ' + ((Count < 10 ? '0' : '') + Count);
            $(badgeElement).attr('badge', subBadge);
        }
    }
}

function FindSubnationalParents(filterList,data) {
    var subNationalData = data;    
    for (var i = 0; i < filterList.length; i++) {
        FindParent(subNationalData, filterList[i], filterList);        
    }
}

function FindParent(subNationalData, member, filterList) { 
    var count;
    if (member.ParentMember != null) {
        count = $.grep(filterList, function (filterList) { return filterList['Code'] === member.ParentMember['Code'] }).length;
        if(count <= 0)
            filterList.push(member.ParentMember);
        if (member.ParentMember['S_LC'] !== null) {
            count = $.grep(subNationalData, function (subNationalData) { return subNationalData['Code'] === member.ParentMember['Code'];}).length;
            if (count > 0)
                FindParent(subNationalData, member.ParentMember, filterList);
        }       
    }    
}

function FindSubNationalChilds(subNationalData, searchedData)
{
    var childMembers;
    var record;
    var ResultData = searchedData;
    for (var i = 0; i < ResultData.length; i++)
    {
        record = ResultData[i];
        if (record['S_LC'] === null || record['S_LC'].toUpperCase() === 'NULL' || record['S_LC'] === '')
        {
            childMembers = $.grep(subNationalData, function (subNationalData) { return subNationalData['S_LC'] === record['Code'] });
            if (childMembers.length > 0)
                searchedData = searchedData.concat(childMembers);
        }
    }
    return searchedData;
}

function OrderSubnationalData(filtermembers, tabLevel)//if tab level is not present, seperate level 0 data from other levels and sort it out. Then combine with other levels.
{
    var otherlevelData = [];  
    var result = filtermembers;
    //var keyword = $('#tbl_' + gbl_controlId).parents(".panel").find('input.searchInput').val();   
    if (tabLevel)
        result = $.grep(result, function (result) { return result['Level'] === tabLevel; });
    else {
        result = $.grep(result, function (result) { return result['Level'] === 0; });
        otherlevelData = $.grep(filtermembers, function (filtermembers) { return filtermembers['Level'] !== 0; });
    }

    var jumptolist = $(result).map(function (i, opt) { return opt.JTC; });
    jumptolist = $.unique(jumptolist);
    result.sort(function (a, b) {
        var compA = $(a).attr('Name');
        var compB = $(b).attr('Name');        
        return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
    });

    $('#ulJumpToList_' + gbl_controlId).html('');
    if (jumptolist !== null) {
        $.each(jumptolist, function (index, value) {
            $('#ulJumpToList_' + gbl_controlId).append('<li class="jumpTo"><a href="javascript:void(0)">' + value + '</a></li>');
        });
    }

    if (tabLevel)
        return result;
    else {
        return result.concat(otherlevelData);
    }
}

function fillHierarchy(data)// Iterate through each member and retrieve the whole hierachy
{
    var filteredList = [];
    for (var i = 0; i < data.length; i++) {
        FetchParent(data[i], filteredList, data);
    }

    return filteredList;
}

function FetchParent(member, filteredList, data)
{
    var count1 = 0;
    var count2 = 0;
    if (member.ParentMember) {
        count1 = $.grep(filteredList, function (filteredList) { return filteredList['Code'] === member.ParentMember['Code']; }).length; // Check in the parent list created so far
        count2 = $.grep(data, function (data) { return data['Code'] === member.ParentMember['Code']; }).length;// check in the main list
        if (count1 <= 0 && count2 <=0) {
            filteredList.push(member.ParentMember);
            FetchParent(member.ParentMember, filteredList, data);
        }
    }
    else
        return;
}