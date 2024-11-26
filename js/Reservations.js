//Fuction to validate the user entered phone number
//If the entered phone number does not match the regex pattern the user will get an
//alert that they will need to match the valid pattern set for the field
function validatePhoneNumber(){
	let phoneNumber = document.getElementById("phoneNum").value;
	var format = /^\d{3}-?\d{3}-?\d{4}$/;
	if(!format.test(phoneNumber)){
		alert("Please enter a valid phone number. Ex: 000-000-0000");
		return false;
	}

	return true;
}

//Fuction to validate the user entered email
//If the entered email does not match the regex pattern the user will get an
//alert that they will need to match the valid pattern set for the field
function validateEmail(){
	let email = document.getElementById("emailAdd").value;
	var format =  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	if(!format.test(email)){
		alert("Please enter a valid email address. Ex: yourname@email.com")
		return false;
	}

	return true;
}

//initializing a new object 'bookedTimes' to store the user chosen times to
//each key in this object is a date and the values are the booked times
let bookedTimes = {};

//Function to disable times on the select list for the users
//All the options are initally reset
//The booked time is stored within the bookedTimes{} object
//The chosen time on the chosen date will then be compared to the already booked times on a specific date
//If the time is already booked on the specific date, the time will be disabled from the options 
function disableTime(){

	let dateSelected = document.getElementById("dateSelected");
	let time = document.getElementById("time");
	const userDate = dateSelected.value;

	localStorageBookedTimes();

	Array.from(time.options).forEach(option => option.disabled = false);

	(bookedTimes[userDate] || []).forEach(bookedTime => {
		const timeToDisable = time.querySelector(`option[value="${bookedTime}"]`);
		if(timeToDisable) timeToDisable.disabled = true;
	});

}

//Function to book the reservation
//gets the values of both the time and date the user has chosen
//adds the chosen time to the bookedTimes{} object 
//if this is the first booking for the chosen date, it creates an array to store the values within
//the time and date then get added to the array
//The disableTime() function is then called to disable that time on that date so that there is no double bookings
//A confirmaton message is then printed for the user at the bottom of the page
//The reservation form is then reset
function bookReservation(){
	let dateSelected = document.getElementById("dateSelected");
	let time = document.getElementById("time");
	const userDate = dateSelected.value;
	const userTime = time.value;

	if(!bookedTimes[userDate]){
		bookedTimes[userDate] = [];
	}

	bookedTimes[userDate].push(userTime);

	disableTime();
	saveLocally();

	const reservationConfirmation = document.getElementById("reservationConfirmation");
	reservationConfirmation.textContent = `Reservation booked for ${userDate} at ${userTime}`;
	document.getElementById("reservationForm").reset();
}

//Adding an event listener to apply the disableTime() function to the selected date 
document.getElementById("dateSelected").addEventListener("change", disableTime);

//Adding an event listener to submit the reservation form
//Preventing the default form from being submitted
//And only submits when the email and phone number match the regex pattern 
//User will recieve and alert to correct their information entered into the fields before 
//booking
document.getElementById("reservationForm").addEventListener("submit", function(event){
	event.preventDefault();

	if(validateEmail() && validatePhoneNumber()){
		bookReservation()
	}else{
		alert("Please correct the fields before booking");
	}
});


//Function to save booked times locally 
function saveLocally(){
	localStorage.setItem("bookedTimes", JSON.stringify(bookedTimes));
}

//Function to load booked times that have been saved locally 
function localStorageBookedTimes(){
	const timesBooked = localStorage.getItem("bookedTimes");
	
}

//Adding an event listener to persist/load local storage (previously booked times) when the user loads the page/if the user refreshes the page
window.addEventListener("load", (event) => {
	localStorageBookedTimes();
	console.log("Booked reservation times from local storage: ", bookedTimes);
	disableTime();
});
