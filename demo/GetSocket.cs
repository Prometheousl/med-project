using System;
using System.Text;
using System.IO;
using System.Net;
using System.Net.Sockets;

namespace WelchAllyn.VitalSigns
{
    internal class GetSocket
    {
        private static Socket ConnectSocket(string server, int port)
        {
            Socket s = null;
            IPHostEntry hostEntry = null;

            // Get host related information.
            hostEntry = Dns.GetHostEntry(server);

            // Loop through the AddressList to obtain the supported AddressFamily. This is to avoid
            // an exception that occurs when the host IP Address is not compatible with the address family
            // (typical in the IPv6 case).
            foreach (IPAddress address in hostEntry.AddressList)
            {
                IPEndPoint ipe = new IPEndPoint(address, port);
                Socket tempSocket =
                    new Socket(ipe.AddressFamily, SocketType.Stream, ProtocolType.Tcp);

                tempSocket.Connect(ipe);

                if (tempSocket.Connected)
                {
                    s = tempSocket;
                    break;
                }
                else
                {
                    continue;
                }
            }
            return s;
        }

        // This method requests the home page content for the specified server.
        internal static string SocketSend(string server, int port, string json)
        {
            Byte[] bytesSent = Encoding.ASCII.GetBytes(json);
            Byte[] bytesReceived = new Byte[256];

            // Create a socket connection with the specified server and port.
            using (Socket s = ConnectSocket(server, port))
            {

                if (s == null)
                    return ("Connection failed");

                // Send json to the server.
                s.Send(bytesSent, bytesSent.Length, 0);
            }

            return ("Json sent");
        }
    }
}