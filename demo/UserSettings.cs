using System.Configuration;
using WelchAllyn.IWS;

namespace WelchAllyn.VitalSigns
{
	[SettingsProvider(typeof(RegistrySettingsProvider))]
	internal sealed class UserSettings : ApplicationSettingsBase
	{
		private const string RootSettingsKey = "SOFTWARE\\Welch Allyn\\Vital Signs\\Demo";

		private const string HeightDisplayUnitsCentimeters = "UNITS_CENTIMETRES";
		private const string HeightDisplayUnitsInches = "UNITS_INCHES";
		private const string NibpDisplayUnitsKpa = "NIBP_KPA";
		private const string NibpDisplayUnitsMmhg = "NIBP_MMHG";
		private const string TempDisplayUnitsCelsius = "DEG_C";
		private const string TempDisplayUnitsFahrenheit = "DEG_F";
		private const string WeightDisplayUnitsLbs = "UNITS_LBS";
		private const string WeightDisplayUnitsKg = "UNITS_KG";

		private static UserSettings defaultInstance = ((UserSettings)(ApplicationSettingsBase.Synchronized(new UserSettings())));

		private UserSettings()
			: base()
		{
			base.SettingsKey = RootSettingsKey;
		}

		public static UserSettings Default
		{
			get
			{
				return UserSettings.defaultInstance;
			}
		}

		[UserScopedSetting()]
		[DefaultSettingValue(HeightDisplayUnitsInches)]
		public HeightDisplayUnits HeightDisplayUnit
		{
			get 
			{
				return (HeightDisplayUnits)this["HeightDisplayUnit"];
			}
			set 
			{
				this["HeightDisplayUnit"] = value;
			}
		}

		[UserScopedSetting]
		[DefaultSettingValue(NibpDisplayUnitsMmhg)]
		public NIBPDisplayUnits NibpDisplayUnit
		{
			get 
			{
				return (NIBPDisplayUnits)this["NibpDisplayUnit"];
			}
			set 
			{
				this["NibpDisplayUnit"] = value;
			}
		}

		[UserScopedSetting()]
		[DefaultSettingValue(TempDisplayUnitsFahrenheit)]
		public TempDisplayUnits TempDisplayUnit
		{
			get
			{
				return (TempDisplayUnits)this["TempDisplayUnit"];
			}
			set
			{
				this["TempDisplayUnit"] = value;
			}
		}

		[UserScopedSetting()]
		[DefaultSettingValue(WeightDisplayUnitsLbs)]
		public WeightDisplayUnits WeightDisplayUnit
		{
			get
			{
				return (WeightDisplayUnits)this["WeightDisplayUnit"];
			}
			set
			{
				this["WeightDisplayUnit"] = value;
			}
		}
	}
}