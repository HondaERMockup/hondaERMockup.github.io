function toggler(divId) {
    $("#" + divId).toggle();
    $('.moresymbol .fa').toggleClass('fa-minus');
}

function Expand(divId) {
    $("#" + divId).show();
    $('.moresymbol .fa').addClass('fa fa-minus');
    $('#lessDetailLink').text('Less Detail');
}

function Collapse(divId) {
    $("#" + divId).hide();
    $('.moresymbol .fa').addClass('fa fa-plus');
    $('#lessDetailLink').text('More Detail');
}

function detailsToggelr(obj) {
    var control = obj;
    if (obj.text == 'Less Detail') {
        $('#winbackLess').hide();
        $('#lessDetailLink').text('More Detail');

    }
    else {
        $('#winbackLess').show();
        $('.moresymbol .fa').addClass('fa fa-plus').removeClass('fa-minus');
        $('#lessDetailLink').text('Less Detail');
    }
}

function toggleDashboardButtons() {
    $('#exportlink').toggle();
    $('#filterLink').toggle();
    $('#notesLink').toggle();
}