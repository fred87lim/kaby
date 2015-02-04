/*
 * These error code will be exposed to user so they barely know what is going on.
 * For developers, there should be a log to give more meaningful error.
 */
function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("MONTHS", [{"name": "January", "value": 0}, {"name": "February", "value": 1}, {"name": "March", "value": 2}, 
	{"name": "April", "value": 3}, {"name": "May", "value": 4}, 
	{"name": "June", "value": 5}, {"name": "July", "value": 6}, 
	{"name": "August", "value": 7}, {"name": "September", "value": 8}, {"name": "October", "value": 9}, 
	{"name": "November", "value": 10}, {"name": "December", "value": 11}]);

define("EDUCATION_LEVEL", [{"name": "Undergraduate", "value": 0}, {"name": "Graduate", "value": 1},
	{"name": "Postgraduate", "value": 2}]);

define("LANGUAGE_PROFICIENCY", [
	{"name": "Proficiency...", "value": null}, 
	{"name": "Elementary proficiency", "value": "elementary"},
	{"name": "Limited working proficiency", "value": "limited_working"},
	{"name": "Professional working proficiency", "value": "professional_working"},
	{"name": "Full professional proficiency", "value": "full_professional"},
	{"name": "Native or bilingual proficiency", "value": "native_or_bilingual"}]);

define("PRIVACY", [
	{name: "PUBLIC", value: 1, description: "Everyone can see"},
	{name: 'EMPLOYERS', value: 2, description: 'My employer and the ones I apply for job'},
	{name: 'FRIENDS', value: 3, description: 'My friends'},
	{name: 'ME', value: 4, description: 'Only me'}
]);

/* Database error code */
define("ERROR2000", 'Something goes wrong with database connection. We will fix in a moment.');

/* User error code */
define("ERROR9000", 'This email has already been registered.');
define("ERROR9001", 'This username has already been registered.');
define("ERROR9002", 'Oops!! We are sorry. This user is not found in our database.');
define("ERROR9003", 'A username is required.');
define("ERROR9004", 'An email is required.');
define("ERROR9005", 'Doesn\'t look like a valid email.');
define("ERROR9006", 'A username must be in 5-16 character long.');
define("ERROR9007", 'Only alphanumeric is allowed.');
define("ERROR9008", 'Password is not correct.');
define("ERROR9009", 'This email is not registered yet.');
define("ERROR9010", 'Oops!! Something goes wrong. We can not log you out at the moment.');
define("ERROR9011", 'Erm... Your session is not associated to any account.');
define("ERROR9012", 'Password reset token is invalid or has expired. Please request a new one.');
define("ERROR9013", 'Your new password is too similar to your current password. Please try another password.');
define("ERROR9014", 'Your passwords do not match each other. Please check your password.');
define("ERROR9015", 'Your login token is invalid.');
define("ERROR9016", 'You have already followed this user.');
define("ERROR9017", 'There is no article found.');
define("ERROR9018", 'You already liked this article.');
define("ERROR9019", 'You did not like this article.');
define("ERROR9020", 'The page you are looking for is not found.');
define("ERROR9021", 'This reading list has already been created.');
define("ERROR9022", 'This reading list is not found.');
define("ERROR9023", 'The job you are applying is not found or has expired.');
define("ERROR9024", 'You have already applied for this job.');
define("ERROR9025", 'There are no job listing of this company.');
define("ERROR9026", 'This application is invalid.');
define("ERROR9027", 'This job is closed.');
define("ERROR9028", 'date ended must be after date started.');
define("ERROR9029", 'User is not found.');
define("ERROR9030", 'Title slug has already been use.');