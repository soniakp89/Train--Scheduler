$(document).ready(function() {
	var firebaseConfig = {
		apiKey: "AIzaSyCkWp6_GmuI7ZFkOFYmgS-tSJ8TFTazibM",
		authDomain: "train-scheduler-495c3.firebaseapp.com",
		databaseURL: "https://train-scheduler-495c3.firebaseio.com",
		projectId: "train-scheduler-495c3",
		storageBucket: "train-scheduler-495c3.appspot.com",
		messagingSenderId: "745038101078",
		appId: "1:745038101078:web:3506f34c25155c0ad899f7",
		measurementId: "G-1D4ZGB5MD5"
	  };
	  
	  // Initialize Firebase
	  firebase.initializeApp(firebaseConfig);

	var database = firebase.database(); 

	var name;
    var destination;
    var firstTrain;
    var frequency = 0;


	$("#submitBtn").on("click", function(event) {
  		event.preventDefault();

	 // Storing input
	  var trainName = $("#name").val().trim();
	  var trainDest = $("#destination").val().trim();
	  var firstTrain = $("#firstTrain").val().trim();
	  var trainFreq = $("#frequency").val().trim();

	 // local for holding train data
	    var newTrain = {
	  	name: trainName,
	  	destination: destination,
	  	start: firstTrain,
		frequency: trainFreq
	  };
       $("form")[0].reset();
	});
	
	 //pushing on to database
	 database.ref('users/' + name).push({
		name: trainName,
		destination: destination,
		start: firstTrain,
	    frequency: trainFreq
    })

    database.ref().on("child_added", function(childSnapshot) {
        var next;
        var minAway;
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var remainder = diffTime % childSnapshot.val().frequency;
        var minAway = childSnapshot.val().frequency - remainder;
        var nextTrain = moment().add(minAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minAway + "</td></tr>");
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
        $("#name-display").html(snapshot.val().name);
        $("#destination-display").html(snapshot.val().destination);
        $("#firstTrain-display").html(snapshot.val().Train);
        $("#frequency-display").html(snapshot.val().frequency);
    });
});

	


	   