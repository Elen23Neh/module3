import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

public class MainServlet extends HttpServlet {

    private final String folder = "c:\\temp\\module\\";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        PrintWriter out = resp.getWriter();

        String tableName = req.getParameter("table");

        if (tableName == null || tableName.length() == 0) {
            ArrayList<String> res = new ArrayList<String>();

            File f = new File(folder);
            if (f.exists()) {
                for (File file : f.listFiles()) {
                    if (!file.isDirectory())
                        res.add(file.getName());
                }

                Gson gson = new Gson();
                out.print(gson.toJson(res));
            }
        } else {
            String tableContent = new String(Files.readAllBytes(Paths.get(folder + tableName)));

            out.print(tableContent);
        }
    }

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }

        String payload = buffer.toString();
        Gson gson = new Gson();
        RequestModel req = gson.fromJson(payload, RequestModel.class);

        PrintWriter file = new PrintWriter(folder + req.table);
        file.println(req.content);
        file.close();
    }
}
