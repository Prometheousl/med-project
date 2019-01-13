using System;
using System.Threading;
using System.Windows.Forms;

namespace WelchAllyn.VitalSigns
{
	static class Program
	{
		static string ApplicationMutexId = "{B6365701-68FA-4B85-A1DC-7839BE3CFE33}";

		/// <summary>
		/// The main entry point for the application.
		/// </summary>
		[STAThread]
		static void Main()
		{
			using (Mutex mutex = new Mutex(false, ApplicationMutexId))
			{
				// request the mutex
				if (mutex.WaitOne(TimeSpan.Zero))
				{
					try
					{
						// mutex obtained - run the application

						// Program.RunVisual();

						// Runs the command-line version of the application
          	DataScraper scraper = new DataScraper();
            scraper.Main();
            Console.WriteLine("Terminating the application...");
          }
					finally
					{
						mutex.ReleaseMutex();
					}
				}
				else
				{
					// could not obtain the mutex - application in use
					MessageBox.Show("Another copy of this application is currently running. The application will now exit.", string.Empty,
						MessageBoxButtons.OK, MessageBoxIcon.Warning, MessageBoxDefaultButton.Button1, 0);
					return;
				}
			}
		}
		/// <summary>
		/// Runs the Welch Allyn SDK version of displaying the data.
		/// It uses "Microsoft Forms"
		/// </summary>
		static void RunVisual()
		{
			Application.EnableVisualStyles();
			Application.SetCompatibleTextRenderingDefault(false);

			Application.Run(new FormMain());
		}
    }
}
