# Spot-React Project

This project takes medical data from the [Welch Allyn Spot Monitor](https://www.welchallyn.com/en/products/categories/patient-monitoring/vital-signs-devices/connex-spot-monitor.html) via Bluetooth, stores the data in a database, and displays the data via a React frontend.

## Using the Project

There are 3 components to this project that must be run in order for the project to work. The environment I use is Windows (to run the SDK), with the [Windows subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) installed.

1. The first is the [Welch Allyn Connectivity SDK](https://www.welchallyn.com/content/dam/welchallyn/documents/upload-docs/SDK/80019598B%20Welch%20Allyn%20Connectivity%20SDK%20Development%20Best%20Practices.pdf). It is a C# application that can be run from Visual Studio. It can be found in the **demo** folder.

2. To run the web-server, simply run the command `json-server --watch db.json` inside of the **json-server** folder.

3. To run the react frontend, simply run `npm start` from the **spotproject** folder. (In a separte terminal from the web-server)

Now, open http://localhost:3001 to view the medical data from the device being displayed via React.

*Note*: To view the JSON web-server, go to http://localhost:3000.

## Explanation of Code

### Scraping Data via Bluetooth

The [Welch Allyn Connectivity SDK](https://www.welchallyn.com/content/dam/welchallyn/documents/upload-docs/SDK/80019598B%20Welch%20Allyn%20Connectivity%20SDK%20Development%20Best%20Practices.pdf) was used to connect to the device and scrape data from it via Bluetooth. The Connectivity SDK is written in C#. In a console application, the data is extracted from the device in a [JSON](https://www.json.org/) format and then posted to a webserver.

This scraping of data occurs in the **demo** folder. **Program.cs** has been modified and **DataScraper.cs** has been added to the original connectivity SDK.

In **Program.cs**, the SDK has been changed to a console application as opposed to a C# forms application. Also, a DataScraper object is declared and the Main function of that object is executed.

In **DataScraper.cs**, the program first waits for the computer to connect to the device via Bluetooth (*LoadConnectivitySDK*). Once the device has connected, it scrapes the data from the device (in JSON format, *ScrapeData*) and then sends the data to the webserver (*SendData*).

### Web-Server

For now, this project uses [json-server](https://github.com/typicode/json-server) as its server. This project basically implements a REST API based on JSON. So, it allows for the data to be accessed and modified via GET and POST requests to the server. This can be found in the **json-server** folder. This part of the implementation will probably have to be updated eventually to allow for increased security.

### React Frontend

For now, the React frontend is fairly simple. It is found in the **spotproject** folder. **App.js** is the main entrypoint to the application. It instantiates an instance of *HealthData* found in HealthData.js. **HealthData.js** organizes the different health data displays on the screen and instantiates them. These include heart rate (**HeartRateChart.js**), pressure (**NibpData.js**), the patient's basic information (**PatientData**), the oxygen level in the blood (**Spo2Data.js**), and the temperature of the patient (**TemperatureData.js**). In each of these components, the data is updated from the web-server every second using [axios](https://www.npmjs.com/package/axios). This data is stored in state, which in-turn updates the DOM of the webpage.
