package com.wcs.server.model;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class Room {
    private int roomId;
    private String name;
    private Set<String> participants;
    private String creator;
    private String categorie;

    public Room(int roomId, String name) {
        this.roomId = roomId;
        this.name = name;
        this.participants = ConcurrentHashMap.newKeySet();
    }

    public Room(String name, String creator, String categorie) {
        this.creator = creator;
        this.name = name;
        this.categorie = categorie;
    }

    public Room(){
        
    }

    public void addParticipant(String participantId) {
        participants.add(participantId);
    }

    public void removeParticipant(String participantId) {
        participants.remove(participantId);
    }

    public boolean isParticipantInRoom(String participantId) {
        return participants.contains(participantId);
    }

    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<String> getParticipants() {
        return participants;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    
    
}
