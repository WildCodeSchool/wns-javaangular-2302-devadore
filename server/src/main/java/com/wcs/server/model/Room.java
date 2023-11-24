package com.wcs.server.model;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class Room {
    private String roomId;
    private String roomName;
    private Set<String> participants;

    public Room(String roomId, String roomName) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.participants = ConcurrentHashMap.newKeySet();
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

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
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
}
