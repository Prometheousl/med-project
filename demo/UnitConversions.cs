namespace WelchAllyn.VitalSigns
{
	/*
	//Macros for Temperature conversion
#define TEMP_C_K 273.15F
#define ConvertK_C(TempK) \
	(TempK - TEMP_C_K)
#define ConvertK_F(TempK) \
	((TempK - TEMP_C_K) * (9.0F/5.0F) + 32)

//Macros for NIBP conversion
#define ConvertNIBP_KPa(BP) \
	((BP / 100.00F) * (101.325F / 760.000F))
#define ConvertNIBP_mmHg(BP) \
	(BP / 100.00F)

//Macros for Height conversion
#define Convert_mm_cm(Heightmm) \
	(Heightmm / 10.0F)
#define Convert_mm_in(Heightmm) \
	(Heightmm / 25.4F)
#define Convert_mm_ft(Heightmm) \
	(Heightmm / 25.4F / 12.0F)

//Macros for Weight conversion
#define Convert_g_kg(Weightg) \
	(Weightg / 1000.0F)
#define Convert_g_lb(Weightg) \
	(Weightg * 0.03527396194958F / 16.0F)
	*/
	internal static class UnitConversions
	{
		public static float ConvertKToC(float valueToConvert)
		{
			return valueToConvert - 273.15f;
		}

		public static float ConvertKToF(float valueToConvert)
		{
			return ConvertKToC(valueToConvert) * (9.0f / 5.0f) + 32;
		}

		public static float ConvertNibpToKpa(int valueToConvert)
		{
			return ((valueToConvert / 100.00F) * (101.325F / 760.000F));
		}

		public static float ConvertNibpToMmhg(int valueToConvert)
		{
			return (valueToConvert / 100.00F);
		}

		public static float ConvertMmToCm(int valueToConvert)
		{
			return valueToConvert / 10.0F;
		}

		public static float ConvertMmToIn(int valueToConvert)
		{
			return valueToConvert / 25.4F;
		}

		public static float ConvertMmToFt(int valueToConvert)
		{
			return valueToConvert / 25.4F / 12.0F;
		}

		public static float ConvertGToKg(int valueToConvert)
		{
			return valueToConvert / 1000.0F;
		}

		public static float ConvertGToLb(int valueToConvert)
		{
			return valueToConvert * 0.03527396194958F / 16.0F;
		}
	}
}