using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.IO;
using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Globalization;

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
        public void Main()
        {
            this.LoadConnectivitySDK();
            this.SetTimer();            // Calls ScrapeData every second
            Console.WriteLine("\nPress the Enter key to exit the application...\n");
            Console.WriteLine("The application started at {0:HH:mm:ss.fff}", DateTime.Now);
            Console.ReadLine();
            timer.Stop();
            timer.Dispose();
        }
        private void ScrapeData(object source, ElapsedEventArgs e)
        {
            // code here will run every second
            Console.WriteLine("The Elapsed event was raised at {0:HH:mm:ss.fff}",
                                e.SignalTime);
            try
            {
                backgroundWorkerMain.RunWorkerAsync(GetAllSessions);
            }
            catch (InvalidOperationException ex)
            {
                // background worker in use - go do something else
                ex.Report(string.Empty);
            }
            catch (Exception ex)
            {
                ex.Report(string.Empty);
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
        private void backgroundWorkerMain_DoWork(object sender, DoWorkEventArgs e)
        {
            BackgroundWorker backgroundWorker = sender as BackgroundWorker;
            if (null != backgroundWorker)
            {
                e.Result = GetVitalSignsData((int)e.Argument);

                if (backgroundWorker.CancellationPending)
                    e.Cancel = true;
            }
        }

        private void backgroundWorkerMain_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            try
            {
                if (e.Error != null)
                {
                    throw e.Error;
                }
                else if (e.Cancelled)
                {
                    throw new OperationCanceledException("The user has cancelled the operation.");
                }
                else
                {
                    // fill the form with the data retrieved
                    /*if (this.tabControlMain.SelectedTab == tabPageCurrent)
                    {
                        ShowCurrentReading((VitalSigns[])e.Result);
                    }
                    else
                    {
                        ShowStoredReadings((VitalSigns[])e.Result);
                    }*/
                    Console.WriteLine((VitalSigns[])e.Result);
                }
            }
            catch (Exception ex)
            {
                ex.Report(string.Empty);
            }
        }
        private void WADevices_DeviceArrival(string bszDeviceID, WADeviceData pDevice)
        {
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
        private void SetTimer()
        {
            // Create a timer w/ 1 second interval
            timer = new System.Timers.Timer(1000);
            // Hook up an elapsed event to the timer
            timer.Elapsed += this.ScrapeData;
            timer.AutoReset = true;
            timer.Enabled = true;
        }
        private VitalSigns[] GetVitalSignsData(int index)
        {
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
