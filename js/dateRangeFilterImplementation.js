/* Steps to implement date change
Add span with id's startDate, endDate, dateRangeText
*/
$(document).ready(function () {
    /** Temp fix: create id attributes out of rid */
    var ridElements = $('[rid]');
    for (var index = 0; index < ridElements.length; index++) {
        var element = ridElements[index];
        var ridVal = $(element).attr('rid');
        $(element).attr('id', ridVal);
    }
    /**Temp Fix: find the first select in the searchforms */
    var searchForms = $('[name="searchForm"]');
    var firstSelect = $($(searchForms)[0]).find('select')[0];
    $(firstSelect).attr('id', 'paramperiod0');

    /**rename paramstart_date --> paramstart_date1 (ie., add sequence) */
    seqid('paramstart_date');
    seqid('paramend_date');
    AddDatePickersToInputStartingWith('paramstart_date', true, 'paramend_date');
    //AddDatePickersToInputStartingWith('paramend_date');
    /** add id="paramperiod" to the select */
    var paramperiodElement = $('[name="paramperiod"]');
    if (paramperiodElement.length > 0) {
        $(paramperiodElement[0]).attr('id', 'paramperiod');
    }
    /** remove submit attribute and apply type button attribute */
    /** find all the submit types */
    var submitButtons = $('[type="submit"]');
    if (submitButtons.length > 0) {
        var applyButtonCount = 0;
        for (var index = 0; index < submitButtons.length; index++) {
            var element = submitButtons[index];
            $(element).attr("type", "button");
            if ($(element).text().toLowerCase() === 'apply') {
                $(element).attr('id', 'apply' + applyButtonCount);
                applyButtonCount++;
            }
        }
    }
    /** set values to be filled */
    var startDate, endDate, dateRangeText = null;
    /** Set default values in the page as 'Last 90 Days' */
    startDate = moment().subtract(90, 'days').format('MM/DD/YYYY');
    endDate = moment().format('MM/DD/YYYY');
    /** Select 'Last 90 Days' to be default in the select */
    $('#paramperiod').val('90');
    dateRangeText = 'Last 90 Days';
    /** update the same in the search form */
    updateStartAndEndDate(startDate, endDate, dateRangeText);
    /** apply the same to the sentence placeholders */
    applyStartAndEndDate(startDate, endDate, dateRangeText);
    /** cheange event for the select */
    $('#paramperiod').change(function (e) {
        var selectedText = $('#paramperiod option:selected').text();
        var selectedVal = $(this).val();
        dateRangeText = selectedText;
        if (selectedText.toLowerCase() === 'custom') {
            $('#paramstart_date1').removeAttr('disabled');
        } else {
            $('#paramstart_date1').attr('disabled', 'disabled');
            $('#paramend_date1').attr('disabled', 'disabled');
        }
        setDateRange(selectedVal);
        updateStartAndEndDate(startDate, endDate, selectedText);
    });
    /** Default values for dashboard data */
    $('#paramperiod0').val('90');
    $('#dateRangeTextTop').text($('#paramperiod0 option:selected').text());
    updateStartAndEndDateForDashBoard(startDate, endDate);
    $('#paramperiod0').change(function (e) {
        var selectedText = $('#paramperiod0 option:selected').text();
        var selectedVal = $(this).val();
        dateRangeText = selectedText;
        if (selectedText.toLowerCase() === 'custom') {
            $('#paramstart_date0').removeAttr('disabled');
        } else {
            $('#paramstart_date0').attr('disabled', 'disabled');
            $('#paramend_date0').attr('disabled', 'disabled');
        }
        setDateRange(selectedVal);
        updateStartAndEndDateForDashBoard(startDate, endDate, selectedText);
    });
    /** Create sequence id function */
    function seqid(id) {
        var paramstart_dateElements = $('[id^="' + id + '"]');
        // if (paramstart_dateElements.length > 1) {
        for (var index = 0; index < paramstart_dateElements.length; index++) {
            var element = paramstart_dateElements[index];
            $(element).attr('id', id + index);
        }
        // }
    }
    /** Datepicker implementation */
    /**
     * Add Datepicker widget to the input boxes
     */
    function AddDatePickersToInputStartingWith(id, AddChangeDateHandler, cascadeTarget) {
        var paramstart_dateElements = $('[id^="' + id + '"]');
        for (var index = 0; index < paramstart_dateElements.length; index++) {
            var element = paramstart_dateElements[index];
            if (AddChangeDateHandler) {
                var cascadeTargetId = cascadeTarget + index;
                // var parentId = id + index;
                $(element).attr('cascadeTargetId', cascadeTargetId);
                $(element).datepicker({
                    autoclose: true,
                    forceParse: true
                }).on('changeDate', function (e) {
                    var parentId = $(this).attr('id')
                    var cascadeTargetId = $(this).attr('cascadeTargetId')
                    AddDateCascadingFunctionality(cascadeTargetId, parentId);
                    updateDateValues(parentId, cascadeTargetId);
                });

            } else {
                $(element).datepicker({
                    autoclose: true,
                    forceParse: true
                });
            }
        }
    }

    function AddDateCascadingFunctionality(id, parentId) {
        $('#' + id).val($('#' + parentId).val());
        $('#' + id).removeAttr('disabled');
        /** assign a datepicker and set the start date 
         * from the parentId
         */
        var parentIdDate = $('#' + parentId).datepicker('getDate');
        $('#' + id).datepicker({
            autoclose: true,
            startDate: parentIdDate
        });
    }

    /**updateDateValues */
    function updateDateValues(startDateInputId, endDateInputId) {
        startDate = $('#' + startDateInputId).text();
        endDate = $('#' + endDateInputId).text();
    }

    /** Moving swith for date range into a function */
    function setDateRange(selectedVal) {
        switch (selectedVal) {
            case "U":
                /*Custom*/
                break;
            case "T":
                /*Today*/
                startDate = endDate = moment().format('MM/DD/YYYY');
                break;
            case "Y":
                /*Yesterday*/
                startDate = endDate = moment().subtract(1, 'days').format('MM/DD/YYYY');
                break;
            case "LW":
                /*Last Week*/
                startDate = moment().subtract(1, 'weeks').startOf('week').format('MM/DD/YYYY');
                endDate = moment().subtract(1, 'weeks').endOf('week').format('MM/DD/YYYY');
                break;
            case "LM":
                /*Last Month*/
                startDate = moment().subtract(1, 'months').startOf('months').format('MM/DD/YYYY');
                endDate = moment().subtract(1, 'months').endOf('months').format('MM/DD/YYYY');
                break;
            case "LY":
                /*Last Year*/
                startDate = moment().subtract(1, 'years').startOf('year').format('MM/DD/YYYY');
                endDate = moment().subtract(1, 'years').endOf('year').format('MM/DD/YYYY');
                break;
            case "30":
                /*Last 30 Days*/
                startDate = moment().subtract(30, 'days').format('MM/DD/YYYY');
                endDate = moment().format('MM/DD/YYYY');
                break;
            case "60":
                /*Last 60 Days*/
                startDate = moment().subtract(60, 'days').format('MM/DD/YYYY');
                endDate = moment().format('MM/DD/YYYY');
                break;
            case "90":
                /*Last 90 Days*/
                startDate = moment().subtract(90, 'days').format('MM/DD/YYYY');
                endDate = moment().format('MM/DD/YYYY');
                break;
            case "120":
                /*Last 120 Days*/
                startDate = moment().subtract(120, 'days').format('MM/DD/YYYY');
                endDate = moment().format('MM/DD/YYYY');
                break;
            case "180":
                /*Last 180 Days*/
                startDate = moment().subtract(180, 'days').format('MM/DD/YYYY');
                endDate = moment().format('MM/DD/YYYY');
                break;
            case "L12":
                /*Last 12 Months*/
                startDate = moment().subtract(365, 'days').format('MM/DD/YYYY');
                endDate = moment().format('MM/DD/YYYY');
                break;
            case "WTD":
                /*Week to Date*/
                startDate = moment().subtract(1, 'weeks').startOf('weeks').format('MM/DD/YYYY');
                endDate = moment().format('MM/DD/YYYY');
                break;
            case "MTD":
                /*Month to Date*/
                startDate = moment().subtract(1, 'months').startOf('months').format('MM/DD/YYYY');
                endDate = moment().format('MM/DD/YYYY');
                break;
            case "YTD":
                /*Year to Date*/
                startDate = moment().subtract(1, 'years').startOf('year').format('MM/DD/YYYY');
                endDate = moment().format('MM/DD/YYYY');
                break;

            default:
                break;
        }
    }

    $('#apply1').click(function (e) {
        $(this).closest('.dropdown-menu').find('.close').click();
        applyStartAndEndDate(startDate, endDate, $('#paramperiod option:selected').text());
    });

    $('#apply0').click(function (e) {
        $(this).closest('.dropdown-menu').find('.close').click();
        applyStartAndEndDateForDashBoard($('#paramperiod0 option:selected').text());
    });
});


function updateStartAndEndDate(startDate, endDate, dateRangeText) {
    $('#paramstart_date1').val(startDate);
    $('#paramend_date1').val(endDate);
    // if ($('[id^="paramend_date"]').length > 1) {
    //     $('#paramend_date0').val(endDate);
    // } else {
    //     //$($('[id^="paramend_date"]')[0]).attr('id','paramend_date');
    //     $('#paramend_date0').val(endDate);
    // }
}

function updateStartAndEndDateForDashBoard(startDate, endDate) {
    $('#paramstart_date0').val(startDate);
    $('#paramend_date0').val(endDate);
}

function applyStartAndEndDate(startDate, endDate, dateRangeText) {
    $('#dateRangeText').text(dateRangeText);
    $('#startDate').text(startDate);
    $('#endDate').text(endDate);
}

function applyStartAndEndDateForDashBoard(dateRangeText) {
    $('#dateRangeTextTop').text(dateRangeText);
}