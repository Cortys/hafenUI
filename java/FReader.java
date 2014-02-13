import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.LinkedList;

/**
 * @author Dji_tuh_se_Nih
 */

public class FReader {

    // ____________________________ATTRIBUTES____________________________
   
    private String zPath;

    // ____________________________CONSTRUCTOR____________________________

    public FReader(String compPath) {
        this.zPath = compPath;
    }

    // ____________________________METHODS____________________________

    public String readAndDelete() {
        BufferedReader buffdabuff = null;
        String content = "initisalaized";

        // Initialize BufferedReader
        try {
            buffdabuff = new BufferedReader(new FileReader(zPath));
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Read the first line
        try {
            content = buffdabuff.readLine();
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (content != null) {
            LinkedList<String> ls = new LinkedList<>();
            String currLine = "alsooinititlaizaed";

            try {
                while ((currLine = buffdabuff.readLine()) != null) {
                    ls.add(currLine);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            FWriter fw = new FWriter(zPath, false);
            for (String line : ls) {
                fw.writeToFile(line);
            }
        } else { // File only has one line and just gets initialized again
            new FWriter(zPath, false);
        }

        try {
            buffdabuff.close();
        } catch (IOException e) {
        }

        
        System.out.println(content);
        return content;
    }

}
