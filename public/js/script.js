function init() {
	initLogIn();
}

function initLogIn() {
	var logInBtn = document.getElementById('menu-login');
	var logInForm = document.getElementById('login-form');
	setTimeout(function() {
		logInForm.style.display = "block";
	}, 200);

	logInBtn.onclick = function(e) {
		if (logInForm.className.match(/(?:^|\s)active(?!\S)/)) 
			logInForm.className = logInForm.className.replace( /(?:^|\s)active(?!\S)/g , '' );
		else
			logInForm.className += " active";
	}
}

window.onload = init;