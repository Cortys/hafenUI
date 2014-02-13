import java.util.Hashtable;

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
//        for(String s : splitted)
//            System.out.println(s);

        switch (splitted[1]) {
        case "c": // connect
           if (getClient(splitted[0]) == null) {
                addClient(splitted[0], new NxtBluetoothConnection(splitted[2], this.writer, splitted[0] ));
                
            }
            break;
        case "d": // disconnect
            if (getClient(splitted[0]) != null) {
                this.deleteClient(splitted[1]);
            }
            break;
        case "s": // message
            if (getClient(splitted[0]) != null) {
                NxtBluetoothConnection tempConn = ((NxtBluetoothConnection) (this.clients.get(splitted[0])));
                for (byte b : stringToByteArray(splitted[2])) {
                    tempConn.send(b);
                }
                tempConn.send((byte) 0);
                tempConn.send((byte) 0);
           }
            break;
        }
        return response;

    }

    
    private String receive() {
        
    }
    
    
    public void checkFile(){
        interpret(reader.readAndDelete());
    }

    public static void main(String[] args) {
       NXTProtocol np = new NXTProtocol("./send.txt");
//        while(true)
//            np.checkFile();
       
//        np.interpret("test:c:001653016143");
//        np.interpret("test:s:r");
//        
        
       
       NxtBluetoothConnection tempConn = new NxtBluetoothConnection("0.0.0.0", np.writer, "001653016143");
       for (byte b : np.stringToByteArray("r")) {
           tempConn.send(b);
       }
       tempConn.send((byte) 1);
       tempConn.send((byte) 1);
       
       while(true) {
           System.out.println(tempConn.receive());
       }
    }
}
