# TropicalResort-Website
This is a web aplication based on a hotel management system built in WebStorm, using html and css(front-end), JavaScript and Express.js(back-end), linked in real time to a database (SQL Server Management System) to store essential information,

The website is created on a local server, so accessing the database won't be possible for other users. By creating themselves a local database server in SSMS and linking it trough the prompt command 'node server.js', every feature of the site should work perfectly. Still, minor adjustments have to be made in the server.js file, such as the name of the database and the username. These fields can be found under "//Database configuration" comment.

The website can be displayed by running the server.js file, or each .html file separately only for visual representation.

The admin account is: username: sava.mihnea, password: savamihnea. Accesing this account will redirect you to the admin page. On the admin page is displayed every booking ever made. The admin has the ability to delete or modify any booking. Other admin accounts can be created by inserting a new username and password in the scripts.js file under the "// Event listener for login form submission" comment.

If a booking is made on the same name the user account is created on, the booking will be displayed in the user's account. The user can choose to delete the booking from his account, while modifying it can only be possible if an admin is contacted.

For more information feel free to contact me. 
