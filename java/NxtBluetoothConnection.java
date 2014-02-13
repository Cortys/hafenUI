import lejos.pc.comm.*;
import java.io.*;


/**
 * Diese Klasse dient dazu, die Kommunikation für die Laptop-Datenbank mit dem Fahrzeug bereitzustellen.
 */
public class NxtBluetoothConnection extends Thread{

    public DataOutputStream dos;
    public DataInputStream dis;
    private FWriter fileWriter;
    private boolean connected;
    private String ip;

   // private final String NXT_NAME;
    private final String NXT_ADDRESS;

    public NxtBluetoothConnection(String address, FWriter fw, String ip){
    	//TODO formatieren
        NXT_ADDRESS = address;
        fileWriter = fw;
        this.ip = ip;
        connect();
    }

    /**
     * Diese Methode baut eine Verbindung mit dem vorgegebenen NXT auf
     * und weist die DataInupt- und DataOutputStreams zu.
     */
    public void connect(){
    	NXTConnector conn = new NXTConnector();
        connected = false;
    
        while(!connected){
            connected = conn.connectTo(null, NXT_ADDRESS, NXTCommFactory.BLUETOOTH);
        }
        System.out.println("CONNECTED");
        if (!connected) 
        {System.err.println("Failed to connect to NXT");}

        dos = new DataOutputStream(conn.getOutputStream());
        dis = new DataInputStream(conn.getInputStream()); 
    }




     /**
     * Diese Methode sendet ein Byte.
     *
     * @param i - Das zu sendende Byte
     */
    public void send(byte i) {
        try{
            dos.writeByte(i);
            dos.flush();
            System.out.println("sent");
        }
        catch (IOException ioe) {
            System.out.println("IO Exception sending int:");
            System.out.println(ioe.getMessage());
        }
    }



    /**
     * Diese Methode liest ein empfangenes Byte.
     *
     * @return - Das empfangene Byte
     */
    public byte receive() {
        byte i = 0;
        try {
            i = dis.readByte();
            System.out.println("received");
        }
        catch (IOException ioe) {
            System.out.println("IO Exception reading bytes:");
            System.out.println(ioe.getMessage());
        }
        
        return i;
    }
    
    public void run() {
        while(connected) {
            String msg = "";
            char r = (char) receive();
            if (r == 0) {
                //TODO diese Methode noch aufrufen
                fileWriter.writeToFile(this.ip + ":r:" + msg);
            }else {
                msg += r; 
            }
                
           
        }
            
    }
}
