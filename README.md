The hafenUI project
===================

Simulation of a Container terminal.

---

## Installation ##

- Get the source code from here
- Install [Node.js](http://www.nodejs.org)
- For debugging install nodemon via `npm install -g nodemon` (not neccessary)
- Set up a MySQL server. Could be [XAMPP](http://www.apachefriends.org)
- Set up the MySQL server to use user "root" with password "root" (you should change this for productive envirorments later `server/core/connectivity/dbData.js`)
- Import database from `server/containerhafen.sql` and add some robots to `robots` with a correct binary Bluetooth-MAC. The `image` field refers to png-files (without suffix) in `imgs/robots`
- Add a `bluetooth`-folder to the root directory of this project with these empty files:
	- `send.txt`
	- `receive.txt`
- Start the MySQL server
- Start the Node.js server: Navigate to the `hafenUI` folder in your command line, then run `nodemon -w server -w pages index.js` (if you decided to use nodemon)
- If you add or modify robots in the database, you have to restart the Node server


** That's it. Everything should be up and running now. **