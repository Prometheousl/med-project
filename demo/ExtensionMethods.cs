using System;
using System.Windows.Forms;

namespace WelchAllyn.VitalSigns
{
	internal static class ExtensionMethods
	{
		public static object CheckedValue(this INumeric _INumeric)
		{
			// one range bit and one alarm bit must be set if the data is good
			if ((0 != (1 << (int)NumericStatusBits.SB_ValidRange & (int)_INumeric.StatusBits) ||
				0 != (1 << (int)NumericStatusBits.SB_OverRange & (int)_INumeric.StatusBits) ||
				0 != (1 << (int)NumericStatusBits.SB_UnderRange & (int)_INumeric.StatusBits) ||
				0 != (1 << (int)NumericStatusBits.SB_UndeterminedRange & (int)_INumeric.StatusBits)) &&
				(0 != (1 << (int)NumericStatusBits.SB_NoAlarm & (int)_INumeric.StatusBits) ||
				0 != (1 << (int)NumericStatusBits.SB_UpperLimitAlarm & (int)_INumeric.StatusBits) ||
				0 != (1 << (int)NumericStatusBits.SB_LowerLimitAlarm & (int)_INumeric.StatusBits) ||
				0 != (1 << (int)NumericStatusBits.SB_OtherAlarm & (int)_INumeric.StatusBits)))
			{
				return _INumeric.Value;
			}

			return null;
		}

		public static string GetFirmwareVersion(this WADeviceData deviceData)
		{
			if (null == deviceData)
				return string.Empty;

			IModuleData _IModuleData = (IModuleData)deviceData.GetModules().Item(WASDKObjectID.WA_ModuleDataID);
			ISDKParams _ISDKParams = (ISDKParams)_IModuleData.GetParams(WASDKParamSetID.WA_ModuleIndexerParamsID);

			_ISDKParams.Set(WASDKParamID.ModuleIndexerSpeciesParam, ModuleSpecies.DEVICE_FIRMWARE);

			_IModuleData.Request(_ISDKParams);

			return _IModuleData.Version;
		}

		public static string GetPlainText(this Enum enumType)
		{
			if (enumType.GetType() == typeof(HeightDisplayUnits))
			{
				switch (((HeightDisplayUnits)enumType))
				{
					case HeightDisplayUnits.UNITS_CENTIMETRES:
						return "cm";

					case HeightDisplayUnits.UNITS_FEET_INCHES:
						return "ft in";

					case HeightDisplayUnits.UNITS_INCHES:
						return "in";

					default:
						return ((HeightDisplayUnits)enumType).ToString();
				}
			}
			else if (enumType.GetType() == typeof(NIBPDisplayUnits))
			{
				switch (((NIBPDisplayUnits)enumType))
				{
					case NIBPDisplayUnits.NIBP_KPA:
						return "kPa";

					case NIBPDisplayUnits.NIBP_MMHG:
						return "mmHg";

					default:
						return ((NIBPDisplayUnits)enumType).ToString();
				}
			}
			else if (enumType.GetType() == typeof(TempDisplayUnits))
			{
				switch (((TempDisplayUnits)enumType))
				{
					case TempDisplayUnits.DEG_C:
						return "°C";

					case TempDisplayUnits.DEG_F:
						return "°F";

					default:
						return ((TempDisplayUnits)enumType).ToString();
				}
			}
			else if (enumType.GetType() == typeof(WeightDisplayUnits))
			{
				switch (((WeightDisplayUnits)enumType))
				{
					case WeightDisplayUnits.UNITS_KG:
						return "kg";

					case WeightDisplayUnits.UNITS_LBS:
						return "lb";

					default:
						return ((WeightDisplayUnits)enumType).ToString();
				}
			}
			else
			{
				throw new NotImplementedException();
			}
		}

		public static void Report(this Exception exception, string caption)
		{
			MessageBox.Show(exception.Message, caption, MessageBoxButtons.OK, MessageBoxIcon.Error, MessageBoxDefaultButton.Button1, 0);
		}
	}
}