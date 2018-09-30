using System;
using System.Threading;
using System.Windows.Forms;
using System.Timers;

namespace WelchAllyn.VitalSigns
{
	static class Program
	{
		static string ApplicationMutexId = "{B6365701-68FA-4B85-A1DC-7839BE3CFE33}";
        private static System.Timers.Timer timer;

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
						//Application.EnableVisualStyles();
						//Application.SetCompatibleTextRenderingDefault(false);

						//Application.Run(new FormMain());
                        SetTimer();
                        Console.WriteLine("\nPress the Enter key to exit the application...\n");
                        Console.WriteLine("The application started at {0:HH:mm:ss.fff}", DateTime.Now);
                        Console.ReadLine();
                        timer.Stop();
                        timer.Dispose();

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
        private static void SetTimer()
        {
            // Create a timer w/ 1 second interval
            timer = new System.Timers.Timer(1000);
            // Hook up an elapsed event to the timer
            timer.Elapsed += DataScraper.ScrapeData;
            timer.AutoReset = true;
            timer.Enabled = true;
        }
    }
}