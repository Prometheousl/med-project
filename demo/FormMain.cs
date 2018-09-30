using System;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;

namespace WelchAllyn.VitalSigns
{
	internal partial class FormMain : Form
	{
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

		private bool propertyChanged;

		public FormMain()
		{
			InitializeComponent();

			switch (UserSettings.Default.HeightDisplayUnit)
			{
				case HeightDisplayUnits.UNITS_CENTIMETRES:
					cmToolStripMenuItem.Checked = true;
					break;
				case HeightDisplayUnits.UNITS_FEET_INCHES:
					ftInToolStripMenuItem.Checked = true;
					break;
				case HeightDisplayUnits.UNITS_INCHES:
					inToolStripMenuItem.Checked = true;
					break;
			}

			switch (UserSettings.Default.NibpDisplayUnit)
			{
				case NIBPDisplayUnits.NIBP_KPA:
					kPaToolStripMenuItem.Checked = true;
					break;
				case NIBPDisplayUnits.NIBP_MMHG:
					mmHgToolStripMenuItem.Checked = true;
					break;
			}

			switch (UserSettings.Default.TempDisplayUnit)
			{
				case TempDisplayUnits.DEG_C:
					cToolStripMenuItem.Checked = true;
					break;
				case TempDisplayUnits.DEG_F:
					fToolStripMenuItem.Checked = true;
					break;
			}

			switch (UserSettings.Default.WeightDisplayUnit)
			{
				case WeightDisplayUnits.UNITS_KG:
					kgToolStripMenuItem.Checked = true;
					break;
				case WeightDisplayUnits.UNITS_LBS:
					lbToolStripMenuItem.Checked = true;
					break;
			}

			UserSettings.Default.PropertyChanged += Default_PropertyChanged;
			UserSettings.Default.SettingsSaving += Default_SettingsSaving;
		}

		private void Default_PropertyChanged(object sender, PropertyChangedEventArgs e)
		{
			propertyChanged = true;
		}

		private void Default_SettingsSaving(object sender, CancelEventArgs e)
		{
			if (DialogResult.No == MessageBox.Show("User settings have changed - do you wish to save the changes?", "Save Settings", MessageBoxButtons.YesNo,
				MessageBoxIcon.Question, MessageBoxDefaultButton.Button1, 0))
			{
				e.Cancel = true;
			}
		}

		private void FormMain_Load(object sender, EventArgs e)
		{
			this.Text = "Welch Allyn SDK Sample Application - Not for Clinical Use, Demonstration Only!";

			ClearCurrentSessionValues();

			this.btnAcquire.Enabled = false;

			foreach (Control control in this.panelMain.Controls)
			{
				control.Enabled = false;
			}

			this.UseWaitCursor = true;
			this.Cursor = Cursors.WaitCursor;

			this.Refresh();

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

				_WAConnectivityATLClass.Connect(configFilePath);
			}
			catch (COMException ex)
			{
				ex.Report(string.Empty);
				Close();
			}
		}

		private void FormMain_FormClosing(object sender, FormClosingEventArgs e)
		{
			if (null != _WADeviceData)
			{
				Marshal.FinalReleaseComObject(_WADeviceData);
				_WADeviceData = null;
			}

			if (propertyChanged)
				UserSettings.Default.Save();
		}

		private void aboutToolStripMenuItem_Click(object sender, EventArgs e)
		{
			using (FormAbout formAbout = new FormAbout())
			{
				formAbout.ShowDialog(this);
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
					if (this.tabControlMain.SelectedTab == tabPageCurrent)
					{
						ShowCurrentReading((VitalSigns[])e.Result);
					}
					else
					{
						ShowStoredReadings((VitalSigns[])e.Result);
					}
				}
			}
			catch (Exception ex)
			{
				ex.Report(string.Empty);
			}
			finally
			{
				this.tabControlMain.Enabled = true;
				this.btnAcquire.Enabled = true;

				this.UseWaitCursor = false;
				this.Cursor = Cursors.Default;

				this.Refresh();
			}
		}

		private void btnAcquire_Click(object sender, EventArgs e)
		{
			this.btnAcquire.Enabled = false;
			this.tabControlMain.Enabled = false;

			this.UseWaitCursor = true;
			this.Cursor = Cursors.WaitCursor;

			this.Refresh();

			try
			{
				if (this.tabControlMain.SelectedTab == tabPageCurrent)
				{
					ClearCurrentSessionValues();
					backgroundWorkerMain.RunWorkerAsync(0);
				}
				else
				{
					ClearStoredSessionValues();
					backgroundWorkerMain.RunWorkerAsync(GetAllSessions);
				}
			}
			catch (InvalidOperationException ex)
			{
				// background worker in use - go do something else
				ex.Report(string.Empty);
			}
			catch (Exception ex)
			{
				ex.Report(string.Empty);

				this.tabControlMain.Enabled = true;
				this.btnAcquire.Enabled = true;

				this.UseWaitCursor = false;
				this.Cursor = Cursors.Default;

				this.Refresh();
			}
		}

		private void exitToolStripMenuItem_Click(object sender, EventArgs e)
		{
			Close();
		}

		private void tvStoredReadings_KeyDown(object sender, KeyEventArgs e)
		{
			if (e.KeyData == (Keys.Control | Keys.C))
			{
				if (tvStoredReadings.SelectedNode != null)
				{
					Clipboard.SetText(tvStoredReadings.SelectedNode.Text);
				}

				e.SuppressKeyPress = true;
			}
		}

		private void WADevices_DeviceArrival(string bszDeviceID, WADeviceData pDevice)
		{
			if (InvokeRequired)
			{
				Invoke(new MethodInvoker(delegate { WADevices_DeviceArrival(bszDeviceID, pDevice); }));
			}
			else
			{
				lock (deviceDataLock)
				{
					// unwire DeviceArrival and wire DeviceRemoval
					_WADevices.DeviceArrival -= WADevices_DeviceArrival;
					_WADevices.DeviceRemoval += WADevices_DeviceRemoval;

					// store the deviceID and WADeviceData object
					_WADeviceData = pDevice;
					deviceID = bszDeviceID;

					btnAcquire.Enabled = true;

					foreach (Control control in this.panelMain.Controls)
					{
						control.Enabled = true;
					}

					this.UseWaitCursor = false;
					this.Cursor = Cursors.Default;

					this.Refresh();
				}
			}
		}

		private void WADevices_DeviceRemoval(string bszDeviceID)
		{
			if (InvokeRequired)
			{
				Invoke(new MethodInvoker(delegate { WADevices_DeviceRemoval(bszDeviceID); }));
			}
			else
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

					this.btnAcquire.Enabled = false;

					ClearCurrentSessionValues();
					ClearStoredSessionValues();

					foreach (Control control in this.panelMain.Controls)
					{
						control.Enabled = false;
					}

					this.UseWaitCursor = true;
					this.Cursor = Cursors.WaitCursor;

					this.Refresh();
				}
			}
		}

		private void ClearCurrentSessionValues()
		{
			this.lblNibpValue.Text = string.Empty;
			this.lblNibpUnits.Text = UserSettings.Default.NibpDisplayUnit.GetPlainText();
			this.lblNibpMap.Text = "(MAP)";

			this.lblPulseValue.Text = string.Empty;
			this.lblPulseSourceValue.Text = string.Empty;

			this.lblSpO2Value.Text = "??";

			this.lblTemperatureValue.Text = string.Empty;
			this.lblTemperatureUnits.Text = UserSettings.Default.TempDisplayUnit.GetPlainText();

			this.lblClinicianName.Text = string.Empty;
			this.lblClinicianNumber.Text = string.Empty;

			this.lblPatientName.Text = string.Empty;
			this.lblPatientNumber.Text = string.Empty;

			this.lblHeightValue.Text = string.Empty;
			this.lblHeightUnits.Text = UserSettings.Default.HeightDisplayUnit.GetPlainText();

			this.lblWeightValue.Text = string.Empty;
			this.lblWeightUnits.Text = UserSettings.Default.WeightDisplayUnit.GetPlainText();

			this.lblPainValue.Text = string.Empty;
			this.lblRespirationRateValue.Text = string.Empty;
		}

		private void ClearStoredSessionValues()
		{
			this.tvStoredReadings.BeginUpdate();

			this.tvStoredReadings.Nodes.Clear();

			this.tvStoredReadings.EndUpdate();
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

		private void RefreshCurrentReadingDisplay()
		{
			ClearCurrentSessionValues();

			VitalSigns vitalsSigns = this.Tag as VitalSigns;
			if (null != vitalsSigns)
			{
				ShowCurrentReading(new VitalSigns[] { vitalsSigns });
			}
		}

		private void ShowCurrentReading(VitalSigns[] vitalSignsArray)
		{
			string nibpMap = "MAP";

			if (vitalSignsArray.Length > 0)
			{
				VitalSigns vitalSigns = vitalSignsArray[0];

				this.lblNibpUnits.Text = UserSettings.Default.NibpDisplayUnit.GetPlainText();

				if (null != vitalSigns.NibpData)
				{
					if (vitalSigns.NibpData.DataStatus == DataStatus.DATA_COMPLETE)
					{
						if (0 != vitalSigns.NibpData.Systolic && 0 != vitalSigns.NibpData.Diastolic)
						{
							string diastolic = string.Empty;
							string systolic = string.Empty;

							switch (UserSettings.Default.NibpDisplayUnit)
							{
								case NIBPDisplayUnits.NIBP_KPA:
									diastolic = Math.Round(UnitConversions.ConvertNibpToKpa(vitalSigns.NibpData.Diastolic), NibpKpaPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", NibpKpaPrecision), CultureInfo.InvariantCulture);
									systolic = Math.Round(UnitConversions.ConvertNibpToKpa(vitalSigns.NibpData.Systolic), NibpKpaPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", NibpKpaPrecision), CultureInfo.InvariantCulture);
									break;

								case NIBPDisplayUnits.NIBP_MMHG:
									diastolic = Math.Round(UnitConversions.ConvertNibpToMmhg(vitalSigns.NibpData.Diastolic), NibpPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", NibpPrecision), CultureInfo.InvariantCulture);
									systolic = Math.Round(UnitConversions.ConvertNibpToMmhg(vitalSigns.NibpData.Systolic), NibpPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", NibpPrecision), CultureInfo.InvariantCulture);
									break;
							}

							this.lblNibpValue.Text = string.Format(CultureInfo.InvariantCulture, "{0}/{1}", systolic, diastolic);
						}

						if (0 != vitalSigns.NibpData.Map)
						{
							string map = string.Empty;

							switch (UserSettings.Default.NibpDisplayUnit)
							{
								case NIBPDisplayUnits.NIBP_KPA:
									map = Math.Round(UnitConversions.ConvertNibpToKpa(vitalSigns.NibpData.Map), NibpKpaPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", NibpKpaPrecision), CultureInfo.InvariantCulture);
									break;

								case NIBPDisplayUnits.NIBP_MMHG:
									map = Math.Round(UnitConversions.ConvertNibpToMmhg(vitalSigns.NibpData.Map), NibpPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", NibpPrecision), CultureInfo.InvariantCulture);
									break;
							}

							nibpMap = string.Format(CultureInfo.InvariantCulture, "MAP {0}", map);
						}
					}
				}

				this.lblNibpMap.Text = string.Format(CultureInfo.InvariantCulture, "({0})", nibpMap);

				if (null != vitalSigns.HeartRateData)
				{
					if (vitalSigns.HeartRateData.DataStatus == DataStatus.DATA_COMPLETE)
					{
						this.lblPulseValue.Text = vitalSigns.HeartRateData.Hr.ToString(CultureInfo.InvariantCulture);

						string heartRateSource = string.Empty;
						switch (vitalSigns.HeartRateData.Source)
						{
							case HeartRateSource.HRSOURCE_NIBP:
								heartRateSource = "NIBP";
								break;
							case HeartRateSource.HRSOURCE_SPO2:
								heartRateSource = "SpO2";
								break;
							default:
								heartRateSource = vitalSigns.HeartRateData.Source.ToString();
								break;
						}

						this.lblPulseSourceValue.Text = heartRateSource;
					}
				}

				if (null != vitalSigns.Spo2Data)
				{
					if (vitalSigns.Spo2Data.DataStatus == DataStatus.DATA_COMPLETE)
					{
						this.lblSpO2Value.Text = string.Format(CultureInfo.InvariantCulture, "{0}%", vitalSigns.Spo2Data.Sat);
					}
				}
				else
				{
					this.lblSpO2Value.Text = "??";
				}

				this.lblTemperatureUnits.Text = UserSettings.Default.TempDisplayUnit.GetPlainText();

				if (null != vitalSigns.TemperatureData)
				{
					if (vitalSigns.TemperatureData.DataStatus == DataStatus.DATA_COMPLETE)
					{
						switch (UserSettings.Default.TempDisplayUnit)
						{
							case TempDisplayUnits.DEG_C:
								this.lblTemperatureValue.Text = Math.Round(UnitConversions.ConvertKToC(vitalSigns.TemperatureData.Temperature), TempPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", TempPrecision), CultureInfo.InvariantCulture);
								break;

							case TempDisplayUnits.DEG_F:
								this.lblTemperatureValue.Text = Math.Round(UnitConversions.ConvertKToF(vitalSigns.TemperatureData.Temperature), TempPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", TempPrecision), CultureInfo.InvariantCulture);
								break;
						}
					}
				}

				if (null != vitalSigns.ClinicianData)
				{
					if (vitalSigns.ClinicianData.DataStatus == DataStatus.DATA_COMPLETE)
					{
						this.lblClinicianName.Text = vitalSigns.ClinicianData.FullName;
						this.lblClinicianNumber.Text = vitalSigns.ClinicianData.Number;
					}
				}

				if (null != vitalSigns.PatientData)
				{
					if (vitalSigns.PatientData.DataStatus == DataStatus.DATA_COMPLETE)
					{
						this.lblPatientName.Text = vitalSigns.PatientData.FullName;
						this.lblPatientNumber.Text = vitalSigns.PatientData.Number;
					}
				}

				this.lblHeightUnits.Text = UserSettings.Default.HeightDisplayUnit.GetPlainText();

				if (null != vitalSigns.HeightData)
				{
					if (vitalSigns.HeightData.DataStatus == DataStatus.DATA_COMPLETE)
					{
						switch (UserSettings.Default.HeightDisplayUnit)
						{
							case HeightDisplayUnits.UNITS_CENTIMETRES:
								this.lblHeightValue.Text = Math.Round(UnitConversions.ConvertMmToCm(vitalSigns.HeightData.Height), HeightPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", HeightPrecision), CultureInfo.InvariantCulture);
								break;

							case HeightDisplayUnits.UNITS_FEET_INCHES:
								this.lblHeightValue.Text = Math.Round(UnitConversions.ConvertMmToFt(vitalSigns.HeightData.Height), HeightPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", HeightPrecision), CultureInfo.InvariantCulture);
								break;

							case HeightDisplayUnits.UNITS_INCHES:
								this.lblHeightValue.Text = Math.Round(UnitConversions.ConvertMmToIn(vitalSigns.HeightData.Height), HeightPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", HeightPrecision), CultureInfo.InvariantCulture);
								break;
						}
					}
				}

				this.lblWeightUnits.Text = UserSettings.Default.WeightDisplayUnit.GetPlainText();

				if (null != vitalSigns.WeightData)
				{
					if (vitalSigns.WeightData.DataStatus == DataStatus.DATA_COMPLETE)
					{
						switch (UserSettings.Default.WeightDisplayUnit)
						{
							case WeightDisplayUnits.UNITS_KG:
								this.lblWeightValue.Text = Math.Round(UnitConversions.ConvertGToKg(vitalSigns.WeightData.Weight), WeightPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", WeightPrecision), CultureInfo.InvariantCulture);
								break;

							case WeightDisplayUnits.UNITS_LBS:
								this.lblWeightValue.Text = Math.Round(UnitConversions.ConvertGToLb(vitalSigns.WeightData.Weight), WeightPrecision, MidpointRounding.AwayFromZero).ToString(string.Format(CultureInfo.InvariantCulture, "F{0}", WeightPrecision), CultureInfo.InvariantCulture);
								break;
						}
					}
				}

				if (null != vitalSigns.PainData)
				{
					if (vitalSigns.PainData.DataStatus == DataStatus.DATA_COMPLETE)
					{
						this.lblPainValue.Text = vitalSigns.PainData.PainIndex.ToString(CultureInfo.InvariantCulture);
					}
				}

				if (null != vitalSigns.RespirationData)
				{
					if (vitalSigns.RespirationData.DataStatus == DataStatus.DATA_COMPLETE)
					{
						this.lblRespirationRateValue.Text = vitalSigns.RespirationData.Rate.ToString(CultureInfo.InvariantCulture);
					}
				}

				this.Tag = vitalSigns;
			}
		}

		private void ShowStoredReadings(VitalSigns[] vitalsSignsArray)
		{
			tvStoredReadings.BeginUpdate();
			tvStoredReadings.Nodes.Clear();

			int i = 0;

			try
			{
				// show device info / module info
				_WADeviceData.Request(null);

				tvStoredReadings.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Model Name: {0}", _WADeviceData.ModelName));
				tvStoredReadings.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Model Number: {0}", _WADeviceData.ModelNumber));
				tvStoredReadings.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Serial Number: {0}", _WADeviceData.SerialNumber));
				tvStoredReadings.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Firmware Version: {0}", _WADeviceData.GetFirmwareVersion()));

			}
			catch (COMException ex)
			{
				ex.Report(string.Empty);
			}

			foreach (VitalSigns item in vitalsSignsArray)
			{
				TreeNode treeNode = new TreeNode(string.Format(CultureInfo.InvariantCulture, "Record {0}", i));

				treeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "SessionTime: {0}", item.SessionDate));

				TreeNode subTreeNode = new TreeNode("NIBP");
				if (null != item.NibpData && item.NibpData.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Systolic: {0}", item.NibpData.Systolic));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Diastolic: {0}", item.NibpData.Diastolic));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "MAP: {0}", item.NibpData.Map));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "HR: {0}", item.NibpData.HR));

					if (null != item.NibpData.Modifiers)
					{
						TreeNode modifiers = new TreeNode("Modifiers");

						foreach (VitalSignsModifier vitalsSignsModifier in item.NibpData.Modifiers)
						{
							modifiers.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "{0}: {1}", vitalsSignsModifier.Name, vitalsSignsModifier.Value));
						}

						subTreeNode.Nodes.Add(modifiers);
					}
				}
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("Heart Rate");
				if (null != item.HeartRateData && item.HeartRateData.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Hr: {0}", item.HeartRateData.Hr));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Source: {0}", item.HeartRateData.Source));
				}
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("SpO2");
				if (null != item.Spo2Data && item.Spo2Data.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Sat: {0}", item.Spo2Data.Sat));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "HR: {0}", item.Spo2Data.HR));

					if (null != item.Spo2Data.Modifiers)
					{
						TreeNode modifiers = new TreeNode("Modifiers");

						foreach (VitalSignsModifier vitalsSignsModifier in item.Spo2Data.Modifiers)
						{
							modifiers.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "{0}: {1}", vitalsSignsModifier.Name, vitalsSignsModifier.Value));
						}

						subTreeNode.Nodes.Add(modifiers);
					}
				}
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("Temperature");
				if (null != item.TemperatureData && item.TemperatureData.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Mode: {0}", item.TemperatureData.Mode));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Temperature: {0}", item.TemperatureData.Temperature));
				}
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("Clinician");
				if (null != item.ClinicianData && item.ClinicianData.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "First Name: {0}", item.ClinicianData.FirstName));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Last Name: {0}", item.ClinicianData.LastName));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Middle Name: {0}", item.ClinicianData.MiddleName));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Number: {0}", item.ClinicianData.Number));
				}
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("Patient");
				if (null != item.PatientData && item.PatientData.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "First Name: {0}", item.PatientData.FirstName));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Last Name: {0}", item.PatientData.LastName));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Middle Name: {0}", item.PatientData.MiddleName));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Number: {0}", item.PatientData.Number));
				}
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("BMI");
				if (null != item.BMIData && item.BMIData.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Body Mass Index: {0}", item.BMIData.BodyMassIndex));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Height: {0}", item.BMIData.Height));
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Weight: {0}", item.BMIData.Weight));
				}
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("Height");
				if (null != item.HeightData && item.HeightData.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Height: {0}", item.HeightData.Height));
				}
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("Weight");
				if (null != item.WeightData && item.WeightData.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Weight: {0}", item.WeightData.Weight));
				} 
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("Pain");
				if (null != item.PainData && item.PainData.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Pain Index: {0}", item.PainData.PainIndex));
				}
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("Respiration");
				if (null != item.RespirationData && item.RespirationData.DataStatus == DataStatus.DATA_COMPLETE)
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Rate: {0}", item.RespirationData.Rate));
				}
				treeNode.Nodes.Add(subTreeNode);

				subTreeNode = new TreeNode("Custom");
				if (!string.IsNullOrEmpty(item.Custom))
				{
					subTreeNode.Nodes.Add(string.Format(CultureInfo.InvariantCulture, "Custom: {0}", item.Custom));
				}
				treeNode.Nodes.Add(subTreeNode);

				tvStoredReadings.Nodes.Add(treeNode);

				i++;
			}

			tvStoredReadings.EndUpdate();
		}

		private void kPaToolStripMenuItem_Click(object sender, EventArgs e)
		{
			ToolStripMenuItem control = sender as ToolStripMenuItem;
			if (null != control)
			{
				ToolStrip toolStrip = control.GetCurrentParent();
				foreach (ToolStripMenuItem item in toolStrip.Items)
				{
					item.Checked = false;
				}

				control.Checked = true;
			}

			UserSettings.Default.NibpDisplayUnit = NIBPDisplayUnits.NIBP_KPA;
			RefreshCurrentReadingDisplay();
		}

		private void mmHgToolStripMenuItem_Click(object sender, EventArgs e)
		{
			ToolStripMenuItem control = sender as ToolStripMenuItem;
			if (null != control)
			{
				ToolStrip toolStrip = control.GetCurrentParent();
				foreach (ToolStripMenuItem item in toolStrip.Items)
				{
					item.Checked = false;
				}

				control.Checked = true;
			}

			UserSettings.Default.NibpDisplayUnit = NIBPDisplayUnits.NIBP_MMHG;
			RefreshCurrentReadingDisplay();
		}

		private void cmToolStripMenuItem_Click(object sender, EventArgs e)
		{
			ToolStripMenuItem control = sender as ToolStripMenuItem;
			if (null != control)
			{
				ToolStrip toolStrip = control.GetCurrentParent();
				foreach (ToolStripMenuItem item in toolStrip.Items)
				{
					item.Checked = false;
				}

				control.Checked = true;
			}

			UserSettings.Default.HeightDisplayUnit = HeightDisplayUnits.UNITS_CENTIMETRES;
			RefreshCurrentReadingDisplay();
		}

		private void ftInToolStripMenuItem_Click(object sender, EventArgs e)
		{
			ToolStripMenuItem control = sender as ToolStripMenuItem;
			if (null != control)
			{
				ToolStrip toolStrip = control.GetCurrentParent();
				foreach (ToolStripMenuItem item in toolStrip.Items)
				{
					item.Checked = false;
				}

				control.Checked = true;
			}

			UserSettings.Default.HeightDisplayUnit = HeightDisplayUnits.UNITS_FEET_INCHES;
			RefreshCurrentReadingDisplay();
		}

		private void inToolStripMenuItem_Click(object sender, EventArgs e)
		{
			ToolStripMenuItem control = sender as ToolStripMenuItem;
			if (null != control)
			{
				ToolStrip toolStrip = control.GetCurrentParent();
				foreach (ToolStripMenuItem item in toolStrip.Items)
				{
					item.Checked = false;
				}

				control.Checked = true;
			}

			UserSettings.Default.HeightDisplayUnit = HeightDisplayUnits.UNITS_INCHES;
			RefreshCurrentReadingDisplay();
		}

		private void cToolStripMenuItem_Click(object sender, EventArgs e)
		{
			ToolStripMenuItem control = sender as ToolStripMenuItem;
			if (null != control)
			{
				ToolStrip toolStrip = control.GetCurrentParent();
				foreach (ToolStripMenuItem item in toolStrip.Items)
				{
					item.Checked = false;
				}

				control.Checked = true;
			}

			UserSettings.Default.TempDisplayUnit = TempDisplayUnits.DEG_C;
			RefreshCurrentReadingDisplay();
		}

		private void fToolStripMenuItem_Click(object sender, EventArgs e)
		{
			ToolStripMenuItem control = sender as ToolStripMenuItem;
			if (null != control)
			{
				ToolStrip toolStrip = control.GetCurrentParent();
				foreach (ToolStripMenuItem item in toolStrip.Items)
				{
					item.Checked = false;
				}

				control.Checked = true;
			}

			UserSettings.Default.TempDisplayUnit = TempDisplayUnits.DEG_F;
			RefreshCurrentReadingDisplay();
		}

		private void kgToolStripMenuItem_Click(object sender, EventArgs e)
		{
			ToolStripMenuItem control = sender as ToolStripMenuItem;
			if (null != control)
			{
				ToolStrip toolStrip = control.GetCurrentParent();
				foreach (ToolStripMenuItem item in toolStrip.Items)
				{
					item.Checked = false;
				}

				control.Checked = true;
			}

			UserSettings.Default.WeightDisplayUnit = WeightDisplayUnits.UNITS_KG;
			RefreshCurrentReadingDisplay();
		}

		private void lbToolStripMenuItem_Click(object sender, EventArgs e)
		{
			ToolStripMenuItem control = sender as ToolStripMenuItem;
			if (null != control)
			{
				ToolStrip toolStrip = control.GetCurrentParent();
				foreach (ToolStripMenuItem item in toolStrip.Items)
				{
					item.Checked = false;
				}

				control.Checked = true;
			}

			UserSettings.Default.WeightDisplayUnit = WeightDisplayUnits.UNITS_LBS;
			RefreshCurrentReadingDisplay();
		}

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (!this.IsDisposed)
			{
				if (disposing)
				{
					if (components != null)
					{
						{
							components.Dispose();
						}
					}

					base.Dispose(disposing);
				}

				// clean up unmanaged resources
				if (null != _WAConnectivityATLClass)
				{
					try
					{
						if (null != _WADevices)
						{
							_WADevices.DeviceArrival -= WADevices_DeviceArrival;

							Marshal.FinalReleaseComObject(_WADevices);
							_WADevices = null;
						}

						if (_WAConnectivityATLClass.IsConnected())
						{
							_WAConnectivityATLClass.Disconnect();
						}
					}
					finally
					{
						Marshal.FinalReleaseComObject(_WAConnectivityATLClass);
						_WAConnectivityATLClass = null;
					}
				}
			}
		}
	}
}