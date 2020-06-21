/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utn.frd.fvm.utils;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.json.JSONObject;

/**
 *
 * @author federico
 */
public class HttpConnection {

    public String httpRequest(String urlParam, String method, JSONObject payload) {
        try {
            URL url = new URL(urlParam);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod(method);
            con.setDoOutput(true);
            if(payload.length() > 0) {
                con.setFixedLengthStreamingMode(payload.toString().getBytes().length);
            }
            con.setRequestProperty("Content-Type", "application/json;charset=utf-8");
            con.setRequestProperty("X-Requested-With", "XMLHttpRequest");
            con.connect();
            if(payload.length() > 0) {
                OutputStream os;
                os = new BufferedOutputStream(con.getOutputStream());
                os.write(payload.toString().getBytes());
                os.flush();
            }
            StringBuilder sBuilder;
            InputStream inputStream = con.getInputStream();
            BufferedReader bReader = new BufferedReader(new InputStreamReader(inputStream,"utf-8"),5);
            sBuilder = new StringBuilder();
            String line = null;
            while ((line = bReader.readLine()) != null) {
                sBuilder.append(line+"\n");
            }
            String texto = sBuilder.toString();
            return texto;
            
            
        } catch (ProtocolException ex) {
            Logger.getLogger(HttpConnection.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(HttpConnection.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }
    
    public String getURL() {
        return "http://localhost:8080/TP1-FVM/rest/";
    }
}
