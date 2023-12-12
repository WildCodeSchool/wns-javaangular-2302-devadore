package com.wcs.server.model;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class Room {
    private int roomId;
    private String roomName;
    private Set<String> participants;
    private String creator;

    public Room(int roomId, String roomName) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.participants = ConcurrentHashMap.newKeySet();
    }

    public Room(String roomName, String creator) {
        this.creator = creator;
        this.roomName = roomName;
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

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
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
    
}
