var timeInInputted = false;
var timeOutInputted = false;
var makingSelection = true;
var timeIn = "11:00";
var timeOut = "8:00";
var timeInHalf = 0;
var timeOutHalf = 1;
var age = 7;

$(document).ready(function() {
    // Setup hour select
    for (i = 1; i < 13; i++) {
        $('#hour').append($('<option>', { value : i }).text(i));
    }
    $('#hour option[value="11"]').attr('selected', 'selected');

    // Setup minute select
    for (i = 0; i < 60; i++) {
        if (i < 10) {
            $('#minute').append($('<option>', { value : "0" + i }).text("0" + i));
        } else {
            $('#minute').append($('<option>', { value : i }).text(i));
        }
    }
    $('#minute option[value="0"]').attr('selected', 'selected');

    $('#time-out').hide();
    $('#age').hide();
    $('.info').hide();

    $(document).keypress(function(e) {
        if (!makingSelection) return;

        if (e.which == 13) {
            if (timeInInputted) {
                $("#dialog-next").click();
            } else {
                if ($("#time-in").val()) {
                    $("#dialog-next").click();
                }
            }
        }
    });

    $("#time-in, #time-out").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }

        // Ensure that it is a number and stop the keypress and stop incorrect time format
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) || $(this).val().length > 4) {
            e.preventDefault();
        }

        // Add colon
        if ($(this).val().length == 2) {
            $(this).val($(this).val() + ":");
        }

        if (parseInt($(this).val().substr(0, 2)) > 12) {
            $(this).val("0" + $(this).val().substr(1, 1) + $(this).val().substr(2));
        } else if (parseInt($(this).val().substr(3)) > 59) {
            $(this).val($(this).val().substr(0, 3) + "00");
        }
    });

    $("#time-in").keyup(function() {
        if (!makingSelection) return;

        if ($("#time-in").val()) {
            $("#dialog-next").show("fast");
        } else {
            $("#dialog-next").hide("fast");
        }
    });

    $("#dialog-next").click(function() {
        if (!makingSelection) return;

        if (timeInInputted) {
            if (timeOutInputted) {
                age = $("#age").val();
                calculate();
            } else {
                timeOutInputted = true;
                timeOut = $("#time-out").val();
                timeOutHalf = $("#half").val();
                $("#time-out").hide("fast");
                $("#half").hide();
                $("#age").show("fast");
            }
        } else {
            timeInInputted = true;
            timeIn = $("#time-in").val();
            timeInHalf = $("#half").val();
            $("#time-in").hide("fast");
            $("#time-out").show("fast");
            $("#pm").attr("selected", null);
            $("#am").attr("selected", "selected");
        }
    });
});

function calculate() {
    if (parseInt(timeIn.substr(0, 2)) > 12) {
        timeIn = "0" + timeIn.substr(1, 1) + timeIn.substr(2);
    } else if (parseInt(timeIn.substr(3)) > 59) {
        timeIn = timeIn.substr(0, 3) + "00";
    }

    if (parseInt(timeOut.substr(0, 2)) > 12) {
        timeOut = "0" + timeIn.substr(1, 1) + timeOut.substr(2);
    } else if (parseInt(timeOut.substr(3)) > 59) {
        timeOut = timeOut.substr(0, 3) + "00";
    }

    makingSelection = false;
    var height = $(document).height() - 200;
    $(".main .container").animate({
        top:"-" + height
    }, 200);

    $("#time-in").val("Slept from " + $("#time-in").val() + " " + (timeInHalf == 0 ? "PM" : "AM") + " to " + $("#time-out").val() + " " + (timeOutHalf == 0 ? "PM" : "AM"));
    $("#time-in").attr("readonly", "true");
    $("#time-in").css({
        "border-top": "4px solid #db3340",
        "border-right": "4px solid #e8b71a",
        "border-bottom": "4px solid #1fda9a",
        "border-left": "4px solid #28abe3"
    });

    $("#age").hide("fast");
    $("#dialog-next").hide("fast");
    $("#time-in").show("fast");

    $('.age-category').each(function() {
        $(this).hide();
    });

    $('.total-sleep').html("The total sleep duration is <b>" + duration(timeIn, timeOut, timeInHalf, timeOutHalf) + "</b>.");
    $('.total-sleep').show();

    $('.info #' + age).show();
    $('.info').show();

    $(".footer").css("bottom", "100%");
}

function duration(start, finish, startHalf, finishHalf) {
    var startHrs = parseInt(start.substr(0, 2));
    var finishHrs = parseInt(finish.substr(0, 2));
    var startMin = parseInt(start.substr(3));
    var finishMin = parseInt(finish.substr(3));
    var durationHrs = 0;
    var durationMin = finishMin - startMin;

    if (startHalf != finishHalf) {
        durationHrs += 12 - startHrs;
        startHrs = 0;
    }

    for (i = startHrs; i < finishHrs; i++) {
        durationHrs++;
    }

    if (durationMin < 0) {
        durationHrs--;
        durationMin = 60 + durationMin;
    }
    if (durationMin.length == 1) durationMin = "0" + durationMin;

    return durationHrs + " hours and " + durationMin + " minutes";
}
