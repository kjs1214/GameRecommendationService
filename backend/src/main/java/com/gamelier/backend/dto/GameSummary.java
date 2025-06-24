package com.gamelier.backend.dto;

public class GameSummary {
    private String gameid;
    private String title;
    private String summary;

    // Getters & Setters
    public String getGameid() { return gameid; }
    public void setGameid(String gameid) { this.gameid = gameid; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
}
