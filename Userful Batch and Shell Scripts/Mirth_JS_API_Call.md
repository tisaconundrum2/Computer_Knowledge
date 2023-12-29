    var URLstring = 'https://xxxxxxxx';
    

    // Create url object
    var url = new java.net.URL(URLstring);

    // Open connection to url
    var conn = url.openConnection();

    //Set Headers
    conn.setDoOutput(true);
    conn.setDoInput(true);
    conn.setRequestMethod("POST");
    conn.setRequestProperty("Content-Type", "application/json");
    conn.setRequestProperty("Accept", "application/json, text/javascript, */*");
    //add more headers if needed.

    // Send request
    var outStream = conn.getOutputStream();
    var outWriter = new java.io.OutputStreamWriter(outStream);
    outWriter.write(payload);
    outWriter.close();

    //Capture Response
    var respCode = conn.getResponseCode();
    var inputStream = conn.getInputStream();
    var streamReader = new java.io.InputStreamReader(inputStream);
    var respStream = new java.io.BufferedReader(streamReader);
    var buffer = '';
    var line = null;
    while ((line = respStream.readLine()) != null) {
        buffer = buffer + line;
    }
    respStream.close();
    return buffer;
