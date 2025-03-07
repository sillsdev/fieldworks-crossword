# Minority Language Crossword Generator

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)


# About
 Online dictionaries are being created for many languages and there is a desire for word games. These word games will help people engage with their language and build literacy. This project uses an API to access dictionary data and generate crosswords for these languages with fewer speakers.

# Installation
 ## Clone the repository:
  Git clone https://github.com/sillsdev/fieldworks-crossword.git

 ## Install dependencies:
   1. Open the repository in Visual Studio Code
   2. The repository includes the directories /crosswordGenerator and /crosswordPlayer. You will need to install the packages in both directories
   2. Open a terminal and navigate into /crosswordPlayer
   3. Run "npm install" in /crosswordPlayer and the packages should be installed
   4. Navigate up a directory and into /crosswordGenerator
   5. Run "npm install" in /crosswordGenerator and the packages should be installed

# Usage

## To start up the web server
1. Download "mini-lcm-sdk-win-v2.zip" in the [Google Drive](https://drive.google.com/drive/folders/1xR8uiafXRHmiZ039AQASbh3HgxSHbOm0?usp=sharing)
2. Unzip the file, and in a new terminal window navigate into "\mini-lcm-sdk-win-v2\release_win-x64" where "FwLiteWeb.exe" is located
2. Run "FwLiteWeb.exe" in the temrinal window, it should start up on port 49279
3. Settings are configured in appsettings.Production.json
4. Open a browser and go to http://localhost:49279/swagger to view the swagger docs

## To run the server side, use the following command:
1. Open up a new terminal window and navigate to where the repository was cloned
2. Navigate into /crosswordGenerator where the file server.js is located
3. Run "node server.js" in the new terminal
4. The terminal should show "Server Listening on Port: 3000"

## To start the UI, use the following command:
1. In a new terminal window, navigate into where the repository was cloned
2. Once you are in the repository, navigate into /crosswordPlayer
3. Run "npm install" to make sure that all packages are installed
4. Run "npm run dev" and it should show
```bash
  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
5. Hover over and control click on "http://localhost:5174/" and it will lead you to the project website

## License
This project is licensed under the [MIT License](LICENSE).

## Authors
- Lydia Bingamon
- Isabel Luke
- Hannah VanGeest
- Rebekah

## Acknowledgments
This open-source library gave the team inspirations for the back-end design: https://github.com/MichaelWehar/Crossword-Layout-Generator.git