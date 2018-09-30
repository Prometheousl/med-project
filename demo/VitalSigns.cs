using System;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.InteropServices;
using System.Text;
using System.Xml;

namespace WelchAllyn.VitalSigns
{
	internal class VitalSigns
	{
		private string custom;
		private DateTime sessionDate;

		private BMIData bmiData;
		private ClinicianData clinicianData;
		private HeartRateData heartRateData;
		private HeightData heightData;
		private NibpData nibpData;
		private PainData painData;
		private PatientData patientData;
		private RespirationData respirationData;
		private Spo2Data spo2Data;
		private TemperatureData temperatureData;
		private WeightData weightData;

		internal VitalSigns()
		{ }

		public static VitalSigns GetData(ISessionData sessionData)
		{
			VitalSigns retval = new VitalSigns();

			retval.sessionDate = sessionData.STime;

			try
			{
				retval.clinicianData = new ClinicianData();

				retval.clinicianData.Number = sessionData.Clinician.Identifier;
				retval.clinicianData.DataStatus = sessionData.Clinician.Status;
			}
			catch (COMException)
			{
				// Clinician not supported - move on to the next field 
			}

			try
			{
				retval.heightData = new HeightData();

				retval.heightData.Height = sessionData.HeightData.HEIGHT;
				retval.heightData.DataStatus = sessionData.HeightData.Status;
			}
			catch (COMException)
			{
				// Height not supported - move on to the next field 				
			}

			try
			{
				retval.nibpData = new NibpData();

				retval.nibpData.Diastolic = sessionData.NIBPData.Diastolic;
				retval.nibpData.Map = sessionData.NIBPData.MAP;
				retval.nibpData.Systolic = sessionData.NIBPData.Systolic;
				retval.nibpData.HR = sessionData.NIBPData.HR;

				if (0 != sessionData.NIBPData.HR && sessionData.NIBPData.Status == DataStatus.DATA_COMPLETE)
				{
					if (null == retval.heartRateData)
					{
						retval.heartRateData = new HeartRateData();
					}

					retval.heartRateData.Hr = sessionData.NIBPData.HR;
					retval.heartRateData.Source = HeartRateSource.HRSOURCE_NIBP;
					retval.heartRateData.DataStatus = sessionData.NIBPData.Status;
				}

				retval.nibpData.DataStatus = sessionData.NIBPData.Status;
			}
			catch (COMException)
			{
				// NIBP not supported - move on to the next field 
			}

			try
			{
				retval.painData = new PainData();

				retval.painData.PainIndex = sessionData.PainData.PainIndex;
				retval.painData.DataStatus = sessionData.PainData.Status;
			}
			catch (COMException)
			{
				// Pain not supported - move on to the next field 
			}

			try
			{
				retval.patientData = new PatientData();

				retval.patientData.Number = sessionData.Patient.Identifier;
				retval.patientData.DataStatus = sessionData.Patient.Status;
			}
			catch (COMException)
			{
				// Patient not supported - move on to the next field 
			}

			try
			{
				retval.respirationData = new RespirationData();

				retval.respirationData.Rate = sessionData.RespData.Respiration;
				retval.respirationData.DataStatus = sessionData.RespData.Status;
			}
			catch (COMException)
			{
				// Respiration not supported - move on to the next field 
			}

			try
			{
				retval.spo2Data = new Spo2Data();

				retval.spo2Data.Sat = sessionData.SpO2Data.Sat;
				retval.spo2Data.HR = sessionData.SpO2Data.HR;

				if (0 != sessionData.SpO2Data.HR && sessionData.SpO2Data.Status == DataStatus.DATA_COMPLETE)
				{
					if (null == retval.heartRateData)
					{
						retval.heartRateData = new HeartRateData();
					}

					retval.heartRateData.Hr = sessionData.SpO2Data.HR;
					retval.heartRateData.Source = HeartRateSource.HRSOURCE_SPO2;
					retval.heartRateData.DataStatus = sessionData.SpO2Data.Status;
				}

				retval.spo2Data.DataStatus = sessionData.SpO2Data.Status;
			}
			catch (COMException)
			{
				// SpO2 not supported - move on to the next field 
			}

			try
			{
				retval.temperatureData = new TemperatureData();

				retval.temperatureData.Mode = sessionData.TempData.Mode;
				retval.temperatureData.Temperature = sessionData.TempData.TEMPERATURE;

				retval.temperatureData.DataStatus = sessionData.TempData.Status;
			}
			catch (COMException)
			{
				// Temperature not supported - move on to the next field 
			}

			try
			{
				retval.weightData = new WeightData();

				retval.weightData.Weight = sessionData.WeightData.WEIGHT;
				retval.weightData.DataStatus = sessionData.WeightData.Status;
			}
			catch (COMException)
			{
				// Weight not supported - move on to the next field 
			}

			// no more fields!!
			return retval;
		}

		public static VitalSigns GetData(IVitalsRecord vitalsRecord)
		{
			const string Bmi = "BMI";
			const string Clinician = "Clinician";
			const string Custom = "Custom";
			const string HeartRate = "HeartRate";
			const string Height = "Height";
			const string NIBP = "NIBP";
			const string Pain = "Pain";
			const string Patient = "Patient";
			const string Respiration = "Respiration";
			const string SpO2 = "SpO2";
			const string Temperature = "Temperature";
			const string Weight = "Weight";

			VitalSigns retval = new VitalSigns();
			bool useCustomModifiers = false;

			retval.sessionDate = vitalsRecord.get_TestDate(TimeFormat.TF_LocalTime);

			XmlWriter xmlWriter = null;

			try
			{
				int i = 0;
				string cIndex = string.Format(CultureInfo.InvariantCulture, "{0}{1}", Custom, i);

				ICustomData _ICustomData = vitalsRecord.Container[cIndex] as ICustomData;
				if (null != _ICustomData)
				{
					useCustomModifiers = true;

					StringBuilder stringBuilder = new StringBuilder();
					xmlWriter = XmlWriter.Create(stringBuilder);

					xmlWriter.WriteStartDocument();
					xmlWriter.WriteStartElement("Modifiers");
					xmlWriter.WriteRaw(_ICustomData.Value);

					while (0 < ++i)
					{
						cIndex = string.Format(CultureInfo.InvariantCulture, "{0}{1}", Custom, i);

						try
						{
							_ICustomData = vitalsRecord.Container[cIndex] as ICustomData;
							if (null != _ICustomData)
							{
								xmlWriter.WriteRaw(_ICustomData.Value);
							}
						}
						catch (ArgumentException)
						{
							if (null != xmlWriter)
							{
								xmlWriter.WriteEndElement();
								xmlWriter.Flush();
							}

							retval.custom = stringBuilder.ToString();
							break;
						}
					}
				}
			}
			catch (ArgumentException)
			{
				// Custom not found in the container - move on to the next field
			}
			finally
			{
				if (null != xmlWriter)
				{
					xmlWriter.Close();
					xmlWriter = null;
				}
			}

			try
			{
				IClinicianData2 _IClinicianData2 = vitalsRecord.Container[Clinician] as IClinicianData2;
				if (null != _IClinicianData2)
				{
					retval.clinicianData = new ClinicianData();

					retval.clinicianData.FirstName = _IClinicianData2.FirstName;
					retval.clinicianData.MiddleName = _IClinicianData2.MiddleName;
					retval.clinicianData.LastName = _IClinicianData2.LastName;

					retval.clinicianData.Number = string.IsNullOrEmpty(_IClinicianData2.IdentifierExt) ?
						_IClinicianData2.Identifier : _IClinicianData2.IdentifierExt;

					retval.clinicianData.DataStatus = _IClinicianData2.Status;
				}
				else
				{
					IClinicianData _IClinicianData = vitalsRecord.Container[Clinician] as IClinicianData;

					if (null != _IClinicianData)
					{
						retval.clinicianData = new ClinicianData();

						retval.clinicianData.FirstName = string.Empty;
						retval.clinicianData.MiddleName = string.Empty;
						retval.clinicianData.LastName = string.Empty;

						retval.clinicianData.Number = _IClinicianData.Identifier;

						retval.clinicianData.DataStatus = _IClinicianData.Status;
					}
				}
			}
			catch (ArgumentException)
			{
				// Clinican not found in the container - move on to the next field
			}

			try
			{
				IHeartRateNumericData _IHeartRateNumericData = vitalsRecord.Container[HeartRate] as IHeartRateNumericData;
				if (null != _IHeartRateNumericData)
				{
					retval.heartRateData = new HeartRateData();

					retval.heartRateData.BestHr = true;
					retval.heartRateData.Hr = Convert.ToInt32(_IHeartRateNumericData.HR.CheckedValue(), CultureInfo.InvariantCulture);
					retval.heartRateData.Source = _IHeartRateNumericData.Source;

					retval.heartRateData.DataStatus = _IHeartRateNumericData.Status;
				}
			}
			catch (ArgumentException)
			{
				// HeartRate not found in the container - move on to the next field
			}

			try
			{
				IHeightData _IHeightData = vitalsRecord.Container[Height] as IHeightData;
				if (null != _IHeightData)
				{
					retval.heightData = new HeightData();

					retval.heightData.Height = _IHeightData.HEIGHT;

					retval.heightData.DataStatus = _IHeightData.Status;
				}
			}
			catch (ArgumentException)
			{
				// Height not found in the container - move on to the next field
			}

			try
			{
				INIBPDataModifiers _INIBPDataModifiers = vitalsRecord.Container[NIBP] as INIBPDataModifiers;
				if (null != _INIBPDataModifiers)
				{
					retval.nibpData = new NibpData();

					// if custom modifiers exist, they will take place of the standard modifiers
					// skip the standard modifiers in this case, they will be set to none
					if (!useCustomModifiers)
					{
						retval.nibpData.Modifiers = new List<VitalSignsModifier>();

						retval.nibpData.Modifiers.Add(new VitalSignsModifier("CuffLocation", _INIBPDataModifiers.CuffLocation));
						retval.nibpData.Modifiers.Add(new VitalSignsModifier("CuffSize", _INIBPDataModifiers.CuffSize));
						retval.nibpData.Modifiers.Add(new VitalSignsModifier("PatientPosition", _INIBPDataModifiers.PatientPosition));
					}

					retval.nibpData.Diastolic = Convert.ToInt32(_INIBPDataModifiers.NIBPData.Diastolic.CheckedValue(), CultureInfo.InvariantCulture);
					retval.nibpData.Map = Convert.ToInt32(_INIBPDataModifiers.NIBPData.MAP.CheckedValue(), CultureInfo.InvariantCulture);
					retval.nibpData.Systolic = Convert.ToInt32(_INIBPDataModifiers.NIBPData.Systolic.CheckedValue(), CultureInfo.InvariantCulture);
					retval.nibpData.HR = Convert.ToInt32(_INIBPDataModifiers.NIBPData.PR.CheckedValue(), CultureInfo.InvariantCulture);

					if (0 != retval.nibpData.HR && _INIBPDataModifiers.Status == DataStatus.DATA_COMPLETE)
					{
						if (null == retval.heartRateData)
						{
							retval.heartRateData = new HeartRateData();
						}

						if (!retval.heartRateData.BestHr)
						{
							retval.heartRateData.Hr = retval.nibpData.HR;
							retval.heartRateData.Source = HeartRateSource.HRSOURCE_NIBP;
						}
					}

					retval.nibpData.DataStatus = _INIBPDataModifiers.Status;
				}
				else
				{
					INIBPNumericData _INIBPNumericData = vitalsRecord.Container[NIBP] as INIBPNumericData;
					if (null != _INIBPNumericData)
					{
						retval.nibpData = new NibpData();

						retval.nibpData.Diastolic = Convert.ToInt32(_INIBPNumericData.Diastolic.CheckedValue(), CultureInfo.InvariantCulture);
						retval.nibpData.Map = Convert.ToInt32(_INIBPNumericData.MAP.CheckedValue(), CultureInfo.InvariantCulture);
						retval.nibpData.Systolic = Convert.ToInt32(_INIBPNumericData.Systolic.CheckedValue(), CultureInfo.InvariantCulture);
						retval.nibpData.HR = Convert.ToInt32(_INIBPNumericData.PR.CheckedValue(), CultureInfo.InvariantCulture);

						if (0 != retval.nibpData.HR)
						{
							if (null == retval.heartRateData)
							{
								retval.heartRateData = new HeartRateData();
							}

							if (!retval.heartRateData.BestHr)
							{
								retval.heartRateData.Hr = retval.nibpData.HR;
								retval.heartRateData.Source = HeartRateSource.HRSOURCE_NIBP;
							}
						}

						// INIBPNumericData lacks the DataStatus property - assume that it is DATA_COMPLETE
						retval.nibpData.DataStatus = DataStatus.DATA_COMPLETE;
					}
					else
					{
						INIBPData _INIBPData = vitalsRecord.Container[NIBP] as INIBPData;
						if (null != _INIBPData)
						{
							retval.nibpData = new NibpData();

							retval.nibpData.Diastolic = _INIBPData.Diastolic;
							retval.nibpData.Map = _INIBPData.MAP;
							retval.nibpData.Systolic = _INIBPData.Systolic;
							retval.nibpData.HR = _INIBPData.HR;

							if (0 != retval.nibpData.HR && _INIBPData.Status == DataStatus.DATA_COMPLETE)
							{
								if (null == retval.heartRateData)
								{
									retval.heartRateData = new HeartRateData();
								}

								if (!retval.heartRateData.BestHr)
								{
									retval.heartRateData.Hr = retval.nibpData.HR;
									retval.heartRateData.Source = HeartRateSource.HRSOURCE_NIBP;
								}
							}

							retval.nibpData.DataStatus = _INIBPData.Status;
						}
					}
				}
			}
			catch (ArgumentException)
			{
				// NIBP not found in the container - move on to the next field
			}

			try
			{
				IPainData _IPainData = vitalsRecord.Container[Pain] as IPainData;
				if (null != _IPainData)
				{
					retval.painData = new PainData();

					retval.painData.PainIndex = _IPainData.PainIndex;
					retval.painData.DataStatus = _IPainData.Status;
				}
			}
			catch (ArgumentException)
			{
				// Pain not found in the container - move on to the next field
			}

			try
			{
				IPatientEthnic _IPatientEthnic = vitalsRecord.Container[Patient] as IPatientEthnic;
				if (null != _IPatientEthnic)
				{
					retval.patientData = new PatientData();

					retval.patientData.Number = _IPatientEthnic.Identifier;

					retval.patientData.FirstName = _IPatientEthnic.FirstName;
					retval.patientData.MiddleName = _IPatientEthnic.MiddleInitial;
					retval.patientData.LastName = _IPatientEthnic.LastName;

					// IPatientEthnic lacks the DataStatus property - assume that it is DATA_COMPLETE
					retval.patientData.DataStatus = DataStatus.DATA_COMPLETE;
				}
				else
				{
					IPatientData _IPatientData = vitalsRecord.Container[Patient] as IPatientData;

					if (null != _IPatientData)
					{
						retval.patientData = new PatientData();

						retval.patientData.Number = _IPatientData.Identifier;
						retval.patientData.DataStatus = _IPatientData.Status;
					}
				}
			}
			catch (ArgumentException)
			{
				// Patient not found in the container - move on to the next field
			}

			try
			{
				IRespNumericData _IRespNumericData = vitalsRecord.Container[Respiration] as IRespNumericData;
				if (null != _IRespNumericData)
				{
					retval.respirationData = new RespirationData();

					retval.respirationData.Rate = Convert.ToByte(_IRespNumericData.Respiration.CheckedValue(), CultureInfo.InvariantCulture);
					retval.respirationData.DataStatus = _IRespNumericData.Status;
				}
				else
				{
					IRespData _IRespData = vitalsRecord.Container[Respiration] as IRespData;
					if (null != _IRespData)
					{
						retval.respirationData = new RespirationData();

						retval.respirationData.Rate = _IRespData.Respiration;
						retval.respirationData.DataStatus = _IRespData.Status;
					}
				}
			}
			catch (ArgumentException)
			{
				// Respiration not found in the container - move on to the next field
			}

			try
			{
				ISpO2DataModifiers _ISpO2DataModifiers = vitalsRecord.Container[SpO2] as ISpO2DataModifiers;
				if (null != _ISpO2DataModifiers)
				{
					retval.spo2Data = new Spo2Data();

					// if custom modifiers exist, they will take place of the standard modifiers
					// skip the standard modifiers in this case, they will be set to none
					if (!useCustomModifiers)
					{
						retval.spo2Data.Modifiers = new List<VitalSignsModifier>();

						retval.spo2Data.Modifiers.Add(new VitalSignsModifier("Location", _ISpO2DataModifiers.Location));
						retval.spo2Data.Modifiers.Add(new VitalSignsModifier("O2Method", _ISpO2DataModifiers.O2Method));
						retval.spo2Data.Modifiers.Add(new VitalSignsModifier("O2FlowRate", _ISpO2DataModifiers.O2FlowRate));
					}

					retval.spo2Data.Sat = Convert.ToInt32(_ISpO2DataModifiers.SpO2Data.Sat.CheckedValue(), CultureInfo.InvariantCulture);
					retval.spo2Data.HR = Convert.ToInt32(_ISpO2DataModifiers.SpO2Data.HR.CheckedValue(), CultureInfo.InvariantCulture);

					if (0 != retval.spo2Data.HR && _ISpO2DataModifiers.SpO2Data.Status == DataStatus.DATA_COMPLETE)
					{
						if (null == retval.heartRateData)
						{
							retval.heartRateData = new HeartRateData();
						}

						if (!retval.heartRateData.BestHr)
						{
							retval.heartRateData.Hr = retval.spo2Data.HR;
							retval.heartRateData.Source = HeartRateSource.HRSOURCE_SPO2;
						}
					}

					retval.spo2Data.DataStatus = _ISpO2DataModifiers.SpO2Data.Status;
				}
				else
				{
					ISpO2NumericData _ISpO2NumericData = vitalsRecord.Container[SpO2] as ISpO2NumericData;
					if (null != _ISpO2NumericData)
					{
						retval.spo2Data = new Spo2Data();

						retval.spo2Data.Sat = Convert.ToInt32(_ISpO2NumericData.Sat.CheckedValue(), CultureInfo.InvariantCulture);
						retval.spo2Data.HR = Convert.ToInt32(_ISpO2NumericData.HR.CheckedValue(), CultureInfo.InvariantCulture);

						if (0 != retval.spo2Data.HR && _ISpO2NumericData.Status == DataStatus.DATA_COMPLETE)
						{
							if (null == retval.heartRateData)
							{
								retval.heartRateData = new HeartRateData();
							}

							if (!retval.heartRateData.BestHr)
							{
								retval.heartRateData.Hr = retval.spo2Data.HR;
								retval.heartRateData.Source = HeartRateSource.HRSOURCE_SPO2;
							}
						}

						retval.spo2Data.DataStatus = _ISpO2NumericData.Status;
					}
					else
					{
						ISpO2Data _ISpO2Data = vitalsRecord.Container[SpO2] as ISpO2Data;
						{
							if (null != _ISpO2Data)
							{
								retval.spo2Data = new Spo2Data();

								retval.spo2Data.Sat = _ISpO2Data.Sat;
								retval.spo2Data.HR = _ISpO2Data.HR;

								if (0 != retval.spo2Data.HR && _ISpO2Data.Status == DataStatus.DATA_COMPLETE)
								{
									if (null == retval.heartRateData)
									{
										retval.heartRateData = new HeartRateData();
									}

									if (!retval.heartRateData.BestHr)
									{
										retval.heartRateData.Hr = retval.spo2Data.HR;
										retval.heartRateData.Source = HeartRateSource.HRSOURCE_SPO2;
									}
								}

								retval.spo2Data.DataStatus = _ISpO2Data.Status;
							}
						}
					}
				}
			}
			catch (ArgumentException)
			{
				// SpO2 not found in the container - move on to the next field
			}

			try
			{
				ITempNumericData _ITempNumericData = vitalsRecord.Container[Temperature] as ITempNumericData;
				if (null != _ITempNumericData)
				{
					retval.temperatureData = new TemperatureData();

					retval.temperatureData.Temperature = Convert.ToSingle(_ITempNumericData.TEMPERATURE.CheckedValue(), CultureInfo.InvariantCulture);
					retval.temperatureData.Mode = _ITempNumericData.Mode;

					retval.temperatureData.DataStatus = _ITempNumericData.Status;
				}
				else
				{
					ITempData _ITempData = vitalsRecord.Container[Temperature] as ITempData;
					{
						if (null != _ITempData)
						{
							retval.temperatureData = new TemperatureData();

							retval.temperatureData.Temperature = _ITempData.TEMPERATURE;
							retval.temperatureData.Mode = _ITempData.Mode;

							retval.temperatureData.DataStatus = _ITempData.Status;
						}
					}
				}
			}
			catch (ArgumentException)
			{
				// Temperature  not found in the container - move on to the next field
			}

			try
			{
				IWeightData _IWeightData = vitalsRecord.Container[Weight] as IWeightData;
				if (null != _IWeightData)
				{
					retval.weightData = new WeightData();

					retval.weightData.Weight = _IWeightData.WEIGHT;
					retval.weightData.DataStatus = _IWeightData.Status;
				}
			}
			catch (ArgumentException)
			{
				// Weight not found in the container - move on to the next field
			}

			try
			{
				IBMIData _IBMIData = vitalsRecord.Container[Bmi] as IBMIData;
				if (null != _IBMIData)
				{
					// Collect BMI from the device
					retval.bmiData = new BMIData();

					retval.bmiData.BodyMassIndex = _IBMIData.BodyMassIndex;
					retval.bmiData.Height = _IBMIData.HEIGHT;
					retval.bmiData.Weight = _IBMIData.WEIGHT;

					retval.bmiData.DataStatus = _IBMIData.Status;
				}

			}
			catch (ArgumentException)
			{
				// BMI not found in the container - obtain from height and weight
				if (null != retval.heightData && null != retval.weightData)
				{
					if (retval.heightData.DataStatus == DataStatus.DATA_COMPLETE && retval.weightData.DataStatus == DataStatus.DATA_COMPLETE)
					{
						retval.bmiData = new BMIData();

						retval.bmiData.Height = retval.heightData.Height;
						retval.bmiData.Weight = retval.weightData.Weight;

						// avoid dividing by zero by checking that height != 0
						if (retval.bmiData.Height != 0)
						{
							retval.bmiData.BodyMassIndex = (float)Math.Round(retval.bmiData.Weight * .001f / ((retval.bmiData.Height * .001f) * (retval.bmiData.Height * .001f)), 1, MidpointRounding.AwayFromZero);
							retval.bmiData.DataStatus = DataStatus.DATA_COMPLETE;
						}
					}
				}
			}

			// no more fields!!
			return retval;
		}

		public string Custom
		{
			get { return custom; }
		}

		public HeightData HeightData
		{
			get { return heightData; }
		}

		public PainData PainData
		{
			get { return painData; }
		}

		public WeightData WeightData
		{
			get { return weightData; }
		}

		public BMIData BMIData
		{
			get { return bmiData; }
		}

		public ClinicianData ClinicianData
		{
			get { return clinicianData; }
		}

		public HeartRateData HeartRateData
		{
			get { return heartRateData; }
		}

		public NibpData NibpData
		{
			get { return nibpData; }
		}

		public PatientData PatientData
		{
			get { return patientData; }
		}

		public RespirationData RespirationData
		{
			get { return respirationData; }
		}

		public DateTime SessionDate
		{
			get { return sessionDate; }
		}

		public Spo2Data Spo2Data
		{
			get { return spo2Data; }
		}

		public TemperatureData TemperatureData
		{
			get { return temperatureData; }
		}
	}

	internal class BMIData
	{
		float bodyMassIndex;
		int height;
		int weight;

		DataStatus dataStatus;

		public float BodyMassIndex
		{
			get { return bodyMassIndex; }
			set { bodyMassIndex = value; }
		}

		public int Height
		{
			get { return height; }
			set { height = value; }
		}

		public int Weight
		{
			get { return weight; }
			set { weight = value; }
		}

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}
	}

	internal class ClinicianData
	{
		private string firstName;
		private string lastName;
		private string middleName;
		private string number;

		private DataStatus dataStatus;

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}

		public string FirstName
		{
			get { return firstName; }
			set { firstName = value; }
		}

		public string LastName
		{
			get { return lastName; }
			set { lastName = value; }
		}

		public string MiddleName
		{
			get { return middleName; }
			set { middleName = value; }
		}

		public string FullName
		{
			get
			{
				string format = string.Empty;
				string fullName = string.Empty;

				if (!string.IsNullOrEmpty(lastName))
				{
					format = "{0}";

					if (string.IsNullOrEmpty(firstName))
					{
						fullName = string.Format(CultureInfo.InvariantCulture, format, lastName);
					}
					else
					{
						format = "{0}, {1}";

						if (string.IsNullOrEmpty(middleName))
						{
							fullName = string.Format(CultureInfo.InvariantCulture, format, lastName, firstName);
						}
						else
						{
							format = "{0}, {1} {2}";

							fullName = string.Format(CultureInfo.InvariantCulture, format, lastName, firstName, middleName);
						}
					}
				}

				return fullName;
			}
		}

		public string Number
		{
			get { return number; }
			set { number = value; }
		}
	}

	internal class HeartRateData
	{
		private bool bestHr;
		private int hr;
		private HeartRateSource source;

		private DataStatus dataStatus;

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}

		public bool BestHr
		{
			get { return bestHr; }
			set { bestHr = value; }
		}

		public int Hr
		{
			get { return hr; }
			set { hr = value; }
		}

		public HeartRateSource Source
		{
			get { return source; }
			set { source = value; }
		}
	}

	internal class HeightData
	{
		private int height;

		private DataStatus dataStatus;

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}

		public int Height
		{
			get { return height; }
			set { height = value; }
		}
	}

	internal class NibpData
	{
		private ICollection<VitalSignsModifier> modifiers;

		private int systolic;
		private int diastolic;
		private int map;
		private int hr;

		private DataStatus dataStatus;

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}

		public int Systolic
		{
			get { return systolic; }
			set { systolic = value; }
		}

		public int Diastolic
		{
			get { return diastolic; }
			set { diastolic = value; }
		}

		public int Map
		{
			get { return map; }
			set { map = value; }
		}

		public int HR
		{
			get { return hr; }
			set { hr = value; }
		}

		public ICollection<VitalSignsModifier> Modifiers
		{
			get { return modifiers; }
			set { modifiers = value; }
		}
	}

	internal class PainData
	{
		private int painIndex;

		private DataStatus dataStatus;

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}

		public int PainIndex
		{
			get { return painIndex; }
			set { painIndex = value; }
		}
	}

	internal class PatientData
	{
		private string firstName;
		private string lastName;
		private string middleName;
		private string number;

		private DataStatus dataStatus;

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}

		public string FirstName
		{
			get { return firstName; }
			set { firstName = value; }
		}

		public string LastName
		{
			get { return lastName; }
			set { lastName = value; }
		}

		public string MiddleName
		{
			get { return middleName; }
			set { middleName = value; }
		}

		public string FullName
		{
			get
			{
				string format = string.Empty;
				string fullName = string.Empty;

				if (!string.IsNullOrEmpty(lastName))
				{
					format = "{0}";

					if (string.IsNullOrEmpty(firstName))
					{
						fullName = string.Format(CultureInfo.InvariantCulture, format, lastName);
					}
					else
					{
						format = "{0}, {1}";

						if (string.IsNullOrEmpty(middleName))
						{
							fullName = string.Format(CultureInfo.InvariantCulture, format, lastName, firstName);
						}
						else
						{
							format = "{0}, {1} {2}";

							fullName = string.Format(CultureInfo.InvariantCulture, format, lastName, firstName, middleName);
						}
					}
				}

				return fullName;
			}
		}

		public string Number
		{
			get { return number; }
			set { number = value; }
		}
	}

	internal class RespirationData
	{
		private byte rate;

		private DataStatus dataStatus;

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}

		public byte Rate
		{
			get { return rate; }
			set { rate = value; }
		}
	}

	internal class Spo2Data
	{
		private ICollection<VitalSignsModifier> modifiers;
		private int sat;
		private int hr;

		private DataStatus dataStatus;

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}

		public int Sat
		{
			get { return sat; }
			set { sat = value; }
		}

		public int HR
		{
			get { return hr; }
			set { hr = value; }
		}

		public ICollection<VitalSignsModifier> Modifiers
		{
			get { return modifiers; }
			set { modifiers = value; }
		}
	}

	internal class TemperatureData
	{
		private TempMode mode;
		private float temperature;

		private DataStatus dataStatus;

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}

		public TempMode Mode
		{
			get { return mode; }
			set { mode = value; }
		}

		public float Temperature
		{
			get { return temperature; }
			set { temperature = value; }
		}
	}

	internal class VitalSignsModifier
	{
		private string name;
		private object value;

		public VitalSignsModifier(string name, object value)
		{
			this.name = name;
			this.value = value;
		}

		public string Name
		{
			get { return name; }
		}

		public object Value
		{
			get { return this.value; }
		}
	}

	internal class WeightData
	{
		private int weight;

		private DataStatus dataStatus;

		public DataStatus DataStatus
		{
			get { return dataStatus; }
			set { dataStatus = value; }
		}

		public int Weight
		{
			get { return weight; }
			set { weight = value; }
		}
	}
}