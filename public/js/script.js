function init() {
	initLogIn();
	initLoggedIn();
}

function initLogIn() {
	var logInBtn = document.getElementById('menu-login');
	var logInForm = document.getElementById('login-form');
	setTimeout(function() {
		logInForm.style.display = "block";
	}, 200);

	if (logInBtn) {
		logInBtn.onclick = function(e) {
			if (logInForm.className.match(/(?:^|\s)active(?!\S)/)) 
				logInForm.className = logInForm.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			else
				logInForm.className += " active";
		}
	}
}
function initLoggedIn() {
	var menuUser = document.getElementById('menu-user');
	if (menuUser) {
		menuUser.onclick = function(e) {
			if (menuUser.className.match(/(?:^|\s)active(?!\S)/)) 
				menuUser.className = menuUser.className.replace( /(?:^|\s)active(?!\S)/g , '' );
			else
				menuUser.className += " active";
		}
	}
}

window.onload = init;