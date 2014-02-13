import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * @author Dji_tuh_se_Nih
 */

public class FWriter {

    // ____________________________ATTRIBUTES____________________________

    private String zPath;
    private FileWriter fw;

    // ____________________________CONSTRUCTOR____________________________

    /**
     * 
     * @param compPath
     *            Complete file path, including filename and directory
     * @param append
     *            Wether to append to an potentially existing file
     */
    public FWriter(String compPath, boolean append) {
        this.zPath = compPath;
        this.createFile(append);
    }

    // ____________________________METHODS____________________________

    public void createFile(boolean append) {
        // compPath = zPath.toString() + "/" + fname;

        try {
            fw = new FileWriter(zPath, append);
        } catch (IOException e) {
            System.out.println("catch");
            e.printStackTrace();
        } finally {
            try {
                fw.close();
            } catch (IOException e) {
                System.out.println("dont close");
                e.printStackTrace();
            }
        }

    }

    public void writeToFile(String content) {
        // String compPath = zPath.toString() + "/" + fname;

        // File file = new File(compPath);
        try {
            fw = new FileWriter(zPath, true);
            fw.write(content);
            //fw.append('\r');
            fw.append('\n');
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                fw.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

    }

    public static void main(String[] args) {
        FWriter f = new FWriter("L:/Test.txt", false);
        // f.createFile();
        f.writeToFile("Penis1");
        f.writeToFile("penis2");

   //     FWriter f2 = new FWriter("L:/Test2.txt", true);
        f.writeToFile("todes");
        // f2.createFile();
//        f2.writeToFile("Penis1");
    } // end of main
}
