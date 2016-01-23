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

    $("#dialog-next").click(function() {
        if (!makingSelection) return;

        if (timeInInputted) {
            if (timeOutInputted) {
                age = $("#age").val();
                calculate();
            } else {
                timeOutInputted = true;
                timeOut = $("#hour").val() + ":" + $("#minute").val();
                timeOutHalf = $("#half").val();
                $(".time-selection").hide("fast");
                $("#age").show("fast");
            }
        } else {
            timeInInputted = true;
            timeIn = $("#hour").val() + ":" + $("#minute").val();
            timeInHalf = $("#half").val();
            $('#time-label').html("What time did you wake up?");
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

    $(".input").hide("fast");
    $(".total-sleep").html("Slept from <b>" + timeIn + " " + (timeInHalf == 0 ? "PM" : "AM") + " to " + timeOut + " " + (timeOutHalf == 0 ? "PM" : "AM") + "</b> with a total sleep duration of <b>" + duration(timeIn, timeOut, timeInHalf, timeOutHalf) + "</b>.");
    $('.total-sleep').show();

    $('.age-category').each(function() {
        $(this).hide();
    });

    $('.info #' + age).show();
    $('.info').show();
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
