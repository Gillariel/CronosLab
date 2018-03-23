package com.example.Webhook;

public class Response {

    private String speech;
    private String displayText;
    private static final String source = "Pizza-Webhook";

    public Response(String speech) {
        this.speech = speech;
        this.displayText = speech;
    }

    public String getSpeech() {
        return speech;
    }
    
    public String getDisplayText() {
        return displayText;
    }

    public String getSource() {
        return source; 
    }
}