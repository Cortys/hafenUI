import java.util.Hashtable;
import java.util.Scanner;

import org.jfree.util.WaitingImageObserver;

import sun.io.CharToByteASCII;

/**
 * @author Dji_tuh_se_Nih
 */

public class NXTProtocol extends Thread {

    // ____________________________ATTRIBUTES____________________________

    private Hashtable<String, NxtBluetoothConnection> clients;
    private FReader reader;
    private FWriter writer;

    // ____________________________CONSTRUCTOR____________________________

    public NXTProtocol(String pPath) {
        System.out.println(pPath);
        this.reader = new FReader(pPath + "/send.txt");
        this.writer = new FWriter(pPath + "/receive.txt", true);
        this.clients = new Hashtable<String, NxtBluetoothConnection>();
    }

    // ____________________________METHODS____________________________

    private void addClient(String ip, NxtBluetoothConnection conn) {
        this.clients.put(ip, conn);
    }

    private void deleteClient(String ip) {
        this.clients.remove(ip);
    }

    private NxtBluetoothConnection getClient(String ip) {
        return this.clients.get(ip);
    }

    private byte[] stringToByteArray(String s) {
        return s.getBytes();
    }

    private String interpret(String cmd) {
        String response = "Error";
        String[] splitted = cmd.split(":");
       

        //if(!splitted[0].equals("k")) {
        switch (splitted[1]) {
        case "c": // connect
            if (getClient(splitted[0]) == null) {
                addClient(splitted[0], new NxtBluetoothConnection(splitted[2], this.writer, splitted[0]));
                getClient(splitted[0]).connect(); // TODO server sagen, ob
                          try {
                            Thread.sleep(1000);
                        } catch (InterruptedException e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
                        }                        // connect geklappt hat
                getClient(splitted[0]).start();
            }
            break;
        case "d": // disconnect
            if (getClient(splitted[0]) != null) {
                getClient(splitted[0]).disconnect();
                this.deleteClient(splitted[1]);
            }
            break;
        case "s": // message
            if (getClient(splitted[0]) != null) {
                NxtBluetoothConnection tempConn = ((NxtBluetoothConnection) (this.clients.get(splitted[0])));
                for (byte b : stringToByteArray(splitted[2])) {
                    tempConn.send(b);
                }
                tempConn.send((byte) 1);
                tempConn.send((byte) 1);
            }
            break;
        case "k": // drop clients hashtable
            this.clients = new Hashtable<String, NxtBluetoothConnection>();
            break;
        
        }
        return response;

    }

    public void checkFile() {
        String s = reader.readAndDelete();
        if (s != null)
                interpret(s);
    }

    public static void main(String[] args) {
       NXTProtocol np = new NXTProtocol("C:/Users/ag-ddi/Documents/GitHub/HafenUI/bluetooth");
      // NXTProtocol np = new NXTProtocol("./bluetooth");

       
       
        while (true) {
            
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            np.checkFile();
        }
       
       
       

        /*
        NxtBluetoothConnection tempConn = new
        NxtBluetoothConnection("001653016143", np.writer, "0.0.0.0");
        tempConn.connect();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        for (byte b : np.stringToByteArray("i")) {
            tempConn.send(b);
        }
         tempConn.send((byte) 1);
         tempConn.send((byte) 1);
         
         try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
         
         for (byte b : np.stringToByteArray("r")) {
             tempConn.send(b);
         }
          tempConn.send((byte) 1);
          tempConn.send((byte) 1);
     */
    }
}
