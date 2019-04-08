$(document).ready(function() {
    //getting firebase
    var config = {
        apiKey: "AIzaSyB1oUHSiO9EqY6UMygGd9inPdiUaRQATiw",
        authDomain: "hogwartsexpress-trainsch-e1190.firebaseapp.com",
        databaseURL: "https://hogwartsexpress-trainsch-e1190.firebaseio.com",
        projectId: "hogwartsexpress-trainsch-e1190",
        storageBucket: "hogwartsexpress-trainsch-e1190.appspot.com",
        messagingSenderId: "822180069987"
    };
    firebase.initializeApp(config);
    
    //variables
    var database = firebase.database();
    var minsAway = 0;

    const dbRefSchedule = database.ref('/train');

    console.log(dbRefSchedule);

    //time update realtime
    var now24hr = moment().format("HH:mm");
    var now12hr = moment().format("[Standard Time is:] LT");
    $("#current-time").html("The Current time is: " + now24hr + " (" + now12hr + ")");

    // train additions
    dbRefSchedule.on("child_added", function(snapshot) {
        // gets the trains in firebase database

        var sv = snapshot.val();

        console.log("train freq: " + sv.freq);

        console.log("first train time: " + sv.firstTrain);

        var compareTrain = moment(sv.firstTrain, "HH:mm").subtract(1, "years");

        console.log("converted first train time: " + compareTrain); 

        var timeDiff = moment().diff(compareTrain, "minutes");

        var remains = timeDiff % sv.freq;

        console.log("time difference: " + timeDiff);

        console.log("remainder: " + remains);

        minsAway = sv.freq - remains;

        console.log("Mins Away: " + minsAway);

        // updates HTML table and adds new train to bottom
        $("#train-schedule").append(
            "<tr><td>" + sv.train + 
            "</td><td>" + sv.dest + 
            "</td><td>" + sv.freq +
            "</td><td>" + sv.firstTrain + 
            "</td><td class='mins-away'>" + minsAway + 
            "</td></tr>");

        //sets the item in the schedule to burgandy if train is less than 5 minutes away
        if (minsAway > 5){
          $("mins-away").addClass("outOfTime");
        } else {
          $("mins-away").removeClass("outOfTime");
        };

    });


    //submits a new train
    $("#new-train").on("click", function() {
        event.preventDefault();

        var trainName = $("#add-train").val().trim();
        var trainDest = $("#add-destination").val().trim();
        var trainFreq = $("#add-freq").val().trim();
        var train1st = $("#add-1st-train").val().trim();

        var newTrain = dbRefSchedule.push();
        newTrain.set({
            train: trainName,
            dest: trainDest,
            freq: trainFreq,
            firstTrain: train1st
        });

        $("#add-train").text("");
        $("#add-destination").text("");
        $("#add-freq").text("");
        $("#add-1st-train").text("");
    });
});