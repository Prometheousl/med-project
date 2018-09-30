using System;
using System.Globalization;
using System.Windows.Forms;

namespace WelchAllyn.VitalSigns
{
	internal partial class FormAbout : Form
	{
		public FormAbout()
		{
			InitializeComponent();

			this.Text = String.Format(CultureInfo.InvariantCulture, "About {0}", StaticMethods.AssemblyTitle);
			this.labelProductName.Text = StaticMethods.AssemblyProduct;
			this.labelVersion.Text = String.Format(CultureInfo.InvariantCulture, "Version {0}", StaticMethods.AssemblyVersion);
			this.labelCopyright.Text = StaticMethods.AssemblyCopyright;
			this.labelCompanyName.Text = StaticMethods.AssemblyCompany;
			this.textBoxDescription.Text = StaticMethods.AssemblyDescription;
		}
	}
}