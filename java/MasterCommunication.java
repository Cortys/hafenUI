import lejos.pc.comm.*;
import java.io.*;


/**
 * Diese Klasse dient dazu, die Kommunikation für die Laptop-Datenbank mit dem Fahrzeug bereitzustellen.
 */
public class MasterCommunication {

    public DataOutputStream dos;
    public DataInputStream dis;

    private final String NXT_NAME;
    private final String NXT_ADDRESS;

    public MasterCommunication(String name, String address){
    	NXT_NAME = name;
        NXT_ADDRESS = address;
    }

    /**
     * Diese Methode baut eine Verbindung mit dem vorgegebenen NXT auf
     * und weist die DataInupt- und DataOutputStreams zu.
     */
    public void connect(){ 
    	NXTConnector conn = new NXTConnector();

        boolean connected = false;
    
        while(!connected)
        {connected = conn.connectTo(NXT_NAME, NXT_ADDRESS, NXTCommFactory.BLUETOOTH);}

        if (!connected) 
        {System.err.println("Failed to connect to any NXT");}

        dos = new DataOutputStream(conn.getOutputStream());
        dis = new DataInputStream(conn.getInputStream()); 
    }


    /**
     * Diese Methode sendet einen Integerwert.
     *
     * @param i - Der zu sendende Integerwert
     */
    public void sendLong(long i) {
        try{
            dos.writeLong(i);
            dos.flush();
        }
        catch (IOException ioe) {
            System.out.println("IO Exception sending int:");
            System.out.println(ioe.getMessage());
        }
    }


     /**
     * Diese Methode sendet ein Byte.
     *
     * @param i - Das zu sendende Byte
     */
    public void send(byte i) {
        try{
            dos.writeInt(i);
            dos.flush();
        }
        catch (IOException ioe) {
            System.out.println("IO Exception sending int:");
            System.out.println(ioe.getMessage());
        }
    }


    /**
     * Diese Methode liest einen empfangenen Integerwert.
     *
     * @return - Der empfangene Integerwert
     */
    public int receiveInt() {
        int i = 0;
        try {
            i = dis.readInt();
        }
        catch (IOException ioe) {
            System.out.println("IO Exception reading bytes:");
            System.out.println(ioe.getMessage());
        }
        return i;
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
        }
        catch (IOException ioe) {
            System.out.println("IO Exception reading bytes:");
            System.out.println(ioe.getMessage());
        }
        return i;
    }
}
