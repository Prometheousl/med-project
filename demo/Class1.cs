using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WelchAllyn.VitalSigns
{
    class DataScraper
    {
        public static void ScrapeData(object source, ElapsedEventArgs e)
        {
            // code here will run every second
            Console.WriteLine("The Elapsed event was raised at {0:HH:mm:ss.fff}",
                                e.SignalTime);
            //VitalSigns.GetData()
            try
            {
                ClearStoredSessionValues();
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
    }
}
