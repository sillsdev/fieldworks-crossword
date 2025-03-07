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
   2. Run "npm install" in both "crosswordPlayer" directory and "crosswordGenerator" directory in the terminal

# Usage

## To start up the web server
1. Download "mini-lcm-sdk-win-v2.zip" in the [Google Drive](https://drive.google.com/drive/folders/1xR8uiafXRHmiZ039AQASbh3HgxSHbOm0?usp=sharing) and unzip the file
2. Run "FwLiteWeb.exe" in a temrinal window and it should startup on port 49279
3. Settings are configured in appsettings.Production.json
4. Open a browser and go to http://localhost:49279/swagger, to view the swagger docs

## To start the developer server, use the following command:
1. Open a new terminal window and "cd" into "crosswordPlayer"
2. Run "npm install"
3. Run "npm run dev" and it should show
```bash
  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
4. "http://localhost:5174/" will lead you to the project website

## To run the back-end server, use the following command:
2. Run "node server.js" in a new terminal window
3. It should show "Server Listening on Port: 3000"

## License
This project is licensed under the [MIT License](LICENSE).

## Authors
- Lydia Bingamon
- Isabel Luke
- Hannah VanGeest
- Rebekah

## Acknowledgments
This open-source library gave the team inspirations for the back-end design: https://github.com/MichaelWehar/Crossword-Layout-Generator.git