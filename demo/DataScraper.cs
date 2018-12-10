using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Timers;
using System.IO;
using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Globalization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Net;
using System.Net.Sockets;
using WebSocketSharp;

namespace WelchAllyn.VitalSigns
{
    class DataScraper
    {
        private static System.Timers.Timer timer;
        private BackgroundWorker backgroundWorkerMain = new System.ComponentModel.BackgroundWorker();
        const int GetAllSessions = -1;

        const int HeightPrecision = 1;
        const int NibpKpaPrecision = 1;
        const int NibpPrecision = 0;
        const int TempPrecision = 1;
        const int WeightPrecision = 1;

        private IContainer components = null;

        private static object deviceDataLock = new object();

        private WAConnectivityATLClass _WAConnectivityATLClass = null;
        private WADeviceData _WADeviceData = null;
        private WADevices _WADevices = null;
        private string deviceID;

        private static HttpClient client = new HttpClient();
        //System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
        
        public void Main()
        {
            // need to wait until SDK is connected first
            this.LoadConnectivitySDK();
            client.Timeout = Timeout.InfiniteTimeSpan;
            VitalSigns[] data = null;
            while(true)
            {
                lock (deviceDataLock)
                {
                    Console.WriteLine("While loop executed.");
                    if (_WADeviceData != null)
                    {
                        // Scrape Data from device
                        data = ScrapeData();
                        // Format and send data to websocket
                        SendData(data);
                    }
                    Thread.Sleep(2330);
                }
            }
        }
        private VitalSigns[] ScrapeData()
        {
            Console.WriteLine("Scraping data!");
            VitalSigns[] data = null;
            // code here will run every second
            try
            {
                data = GetVitalSignsData(GetAllSessions);
                
                //Console.WriteLine(String.Format("{0}",data[0].WeightData.Weight));
            }
            catch (Exception ex)
            {
                ex.Report(ex.ToString());
            }
            return data;
        }
        private void SendData(VitalSigns[] data)
        {
            Console.WriteLine("Sending data!");
            
            // Convert to JSON data
            string dataJson = JsonConvert.SerializeObject(data);
            // Trim leading and trailing brackets (JSONConvert adds them)
            dataJson = dataJson.TrimStart(new char[] { '[' }).TrimEnd(new char[] { ']' });
            Console.WriteLine("JSON version of data is...");
            Console.WriteLine(dataJson);

            var jo = JObject.Parse(dataJson);
            var endpoint = "http://127.0.0.1:3000/";
            string[] dataNames = {"HeightData", "PainData", "WeightData", "BMIData", "TemperatureData",
                "HeartRateData", "NibpData", "PatientData", "SessionDate", "Spo2Data" };

            for(int x = 0; x < dataNames.Length; x++)
            {
                postData(jo, dataNames[x], endpoint);
                Thread.Sleep(500);
            }
        }
        private void postData(JObject jo, string dataName, string endpoint)
        {
            var data = "";
            if (jo[dataName] != null)
                data = jo[dataName].ToString();

            // SessionDate is special because it isn't its own object in the json
            if(dataName == "SessionDate")
            {
                // 2018 - 11 - 26T09: 20:39
                data = data.Insert(0, "\"");
                data = data.Insert(data.Length, "\"");
                // "2018-11-26T09:20:39"
                data = data.Insert(0,"\"" + dataName + "\": ");
                // "SessionDate": "2018-11-26T09:20:39"
                data = data.Insert(0, "{");
                data = data.Insert(data.Length, "}");
                // {"SessionDate": "2018-11-26T09:20:39"}
            }

            if (data != "")
            {
                var content = new StringContent(data.ToString(), Encoding.UTF8, "application/json");
                Console.WriteLine("Posting " + data.ToString());
                var result = client.PostAsync(endpoint + dataName, content).Result;

                Console.WriteLine("Result of " + dataName + " is:");
                Console.WriteLine(result);
            }
        }
        private void LoadConnectivitySDK()
        {
            try
            {
                // locate the 'wasdkconfig.xml' config file - needed for connecting to the Connectivity SDK
                string configFilePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Welch Allyn");

                configFilePath = Path.Combine(configFilePath, "SDK Sample Application");
                configFilePath = Path.Combine(configFilePath, "wasdkconfig.xml");

                // if config file not found, check in the current directory
                if (!File.Exists(configFilePath))
                {
                    configFilePath = "wasdkconfig.xml";
                }

                _WAConnectivityATLClass = new WAConnectivityATLClass();
                _WADevices = _WAConnectivityATLClass.GetDevices();

                _WADevices.DeviceArrival += WADevices_DeviceArrival;

                Console.WriteLine("Attempting to connect to the device");
                _WAConnectivityATLClass.Connect(configFilePath);
            }
            catch (COMException ex)
            {
                ex.Report(string.Empty);
            }
        }
        private void WADevices_DeviceArrival(string bszDeviceID, WADeviceData pDevice)
        {
            Console.WriteLine("Device arrived");
            lock (deviceDataLock)
            {
                // unwire DeviceArrival and wire DeviceRemoval
                _WADevices.DeviceArrival -= WADevices_DeviceArrival;
                _WADevices.DeviceRemoval += WADevices_DeviceRemoval;

                // store the deviceID and WADeviceData object
                _WADeviceData = pDevice;
                deviceID = bszDeviceID;
                Console.WriteLine("Found Device. Device ID is %d", deviceID);
            }
        }
        private void WADevices_DeviceRemoval(string bszDeviceID)
        {
            lock (deviceDataLock)
            {
                if (0 != string.Compare(bszDeviceID, deviceID, StringComparison.OrdinalIgnoreCase))
                {
                    // device removed is not the one we are using - ignore the event
                    return;
                }

                // unwire DeviceRemoval and wire DeviceArrival
                _WADevices.DeviceRemoval -= WADevices_DeviceRemoval;
                _WADevices.DeviceArrival += WADevices_DeviceArrival;

                if (null != _WADeviceData)
                {
                    Marshal.FinalReleaseComObject(_WADeviceData);
                    _WADeviceData = null;
                }

                deviceID = string.Empty;
            }
        }
        private VitalSigns[] GetVitalSignsData(int index)
        {
            Console.WriteLine("Getting data");
            const uint Timeout = 0x80044019;

            VitalSigns[] retval = null;

            if (index < GetAllSessions)
            {
                throw new ArgumentOutOfRangeException("index");
            }

            // check for Rendezvous guid to determine support for IVitalsRecord
            IRendezvous _IRendezvous = (IRendezvous)_WADeviceData;
            if (!string.IsNullOrEmpty(_IRendezvous.RendezvousGuid))
            {
                // use IVitalsRecord
                IVitalsRecord _IVitalsRecord = (IVitalsRecord)_WADeviceData.GetDatum().Item(WASDKObjectID.WA_VitalsRecordID);
                ISessionMemoryParams _IVitalsRecordSessionMemoryParams = (ISessionMemoryParams)_IVitalsRecord.GetParams(WASDKParamSetID.WA_SessionMemoryParamsID);

                _IVitalsRecordSessionMemoryParams.Set(WASDKParamID.SessionMemorySpeciesParam, SessionSpecies.SS_VITALSRECORD);

                try
                {
                    if (index > GetAllSessions)
                    {
                        _IVitalsRecordSessionMemoryParams.Set(WASDKParamID.SessionMemoryIndexParam, index);
                        _IVitalsRecord.Request(_IVitalsRecordSessionMemoryParams);

                        retval = new VitalSigns[] { VitalSigns.GetData(_IVitalsRecord) };
                    }
                    else
                    {
                        retval = new VitalSigns[] { };
                        int count = _IVitalsRecord.GetCount();

                        // resize the array to include the stored readings and the current record
                        Array.Resize<VitalSigns>(ref retval, count + 1);

                        for (int i = 0; i <= count; i++)
                        {
                            _IVitalsRecordSessionMemoryParams.Set(WASDKParamID.SessionMemoryIndexParam, i);
                            _IVitalsRecord.Request(_IVitalsRecordSessionMemoryParams);

                            retval[i] = VitalSigns.GetData(_IVitalsRecord);
                        }
                    }

                    return retval;
                }
                catch (COMException ex)
                {
                    // timed out waiting for a response 
                    if (ex.ErrorCode == unchecked((int)Timeout))
                    {
                        throw;
                    }
                    else
                    {
                        // ignore this error and allow the code to attempt session data collection
                    }
                }
            }

            // get the session data from the device (either RendezvousGuid was empty or RendezvousGuid or IVitalsRecord.Request failed (not timeout)
            ISessionData _ISessionData = (ISessionData)_WADeviceData.GetDatum().Item(WASDKObjectID.WA_SessionDataID);
            ISessionMemoryParams _ISessionDataSessionMemoryParams = (ISessionMemoryParams)_ISessionData.GetParams(WASDKParamSetID.WA_SessionMemoryParamsID);

            _ISessionDataSessionMemoryParams.Set(WASDKParamID.SessionMemorySpeciesParam, SessionSpecies.ULTRARECORD);

            if (index > GetAllSessions)
            {
                _ISessionDataSessionMemoryParams.Set(WASDKParamID.SessionMemoryIndexParam, index);
                _ISessionData.Request(_ISessionDataSessionMemoryParams);

                retval = new VitalSigns[] { VitalSigns.GetData(_ISessionData) };
            }
            else
            {
                retval = new VitalSigns[] { };
                int count = _ISessionData.GetCount();

                // resize the array to include the stored readings and the current record
                Array.Resize<VitalSigns>(ref retval, count + 1);

                for (int i = 0; i <= count; i++)
                {
                    _ISessionDataSessionMemoryParams.Set(WASDKParamID.SessionMemoryIndexParam, i);
                    _ISessionData.Request(_ISessionDataSessionMemoryParams);

                    retval[i] = VitalSigns.GetData(_ISessionData);
                }
            }

            return retval;
        }
    }
}
