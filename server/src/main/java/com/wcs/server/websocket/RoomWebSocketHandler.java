package com.wcs.server.websocket;

import org.atmosphere.config.service.WebSocketHandlerService;
import org.atmosphere.websocket.WebSocket;
import org.atmosphere.websocket.WebSocketHandlerAdapter;
import org.json.JSONArray;
import org.json.JSONObject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wcs.server.model.Room;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@WebSocketHandlerService(path = "/websocket/room")
public class RoomWebSocketHandler extends WebSocketHandlerAdapter {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final ConcurrentHashMap<String, Room> rooms = new ConcurrentHashMap<>();
    private final Map<String, Set<WebSocket>> roomConnections = new ConcurrentHashMap<>();
    private final Set<WebSocket> allConnectedClients = Collections.newSetFromMap(new ConcurrentHashMap<WebSocket, Boolean>());
    private final Set<WebSocket> allClientOnRoomListComponent = Collections.newSetFromMap(new ConcurrentHashMap<WebSocket, Boolean>());
    private final ConcurrentHashMap<String, WebSocket> userWebSocketMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Set<String>> roomUserMap = new ConcurrentHashMap<>();

    @Override
    public void onOpen(WebSocket webSocket) throws IOException {
        webSocket.write("{\"message\":\"Connexion établie\"}");
        allConnectedClients.add(webSocket);
    }

    @Override
    public void onClose(WebSocket webSocket) {
        allConnectedClients.remove(webSocket);
        allClientOnRoomListComponent.remove(webSocket);

        System.out.println("Utilisateur : " + findUsernameByWebSocket(webSocket) + " déconnecté");
    }

    @Override
    public void onTextMessage(WebSocket webSocket, String message) throws IOException {
        JSONObject jsonMessage = new JSONObject(message);
        String messageType = jsonMessage.get("messageType").toString();
        System.out.println("jsonMessage: " + jsonMessage);

        String username = jsonMessage.get("username").toString();
        if(username != "") {
            userWebSocketMap.put(username, webSocket);
        }

        switch (messageType) {
            case "CREATE_ROOM":
                System.out.println("-------------------- CREATE_ROOM --------------------");
                Room newRoom = objectMapper.readValue(jsonMessage.get("room").toString(), Room.class);
                String creator = newRoom.getCreator();
                userWebSocketMap.put(creator, webSocket);
                createRoom(newRoom, webSocket);
                break;

            case "FETCH_ROOM":
                System.out.println("-------------------- FETCH_ROOM --------------------");
                fetchingRoomList(webSocket);
                break;

            case "JOIN_ROOM":
                System.out.println("-------------------- JOIN_ROOM --------------------");
                String roomName = jsonMessage.get("roomName").toString();
                roomUserMap.computeIfAbsent(roomName, k -> new HashSet<>()).add(username);
                joinRoom(roomName, webSocket, username);
                break;

            default:
                System.out.println("Type de message non reconnu :" + messageType);
        }
    }

    private void fetchingRoomList(WebSocket requesterWebSocket) throws IOException {
        
        JSONObject message = new JSONObject();
        message.put("type", "FETCHING_ROOM_LIST");        
        String roomsList = objectMapper.writeValueAsString(rooms.values());    
        message.put("rooms", new JSONArray(roomsList));
    
        requesterWebSocket.write(message.toString());

        // On envoie les données uniquement à ceux qui sont dans le composant room-list
        allClientOnRoomListComponent.add(requesterWebSocket);
    
        for (WebSocket clientWebSocket : allClientOnRoomListComponent) {
            clientWebSocket.write(message.toString());
        }
    }

    private void createRoom(Room newRoom, WebSocket creatorWebSocket) throws IOException {
        String roomName = newRoom.getName();
        if (!rooms.containsKey(roomName)) {

            String creator = newRoom.getCreator();

            rooms.put(roomName, newRoom); // Permet un lien nom de room <-> room
            roomUserMap.computeIfAbsent(roomName, k -> new HashSet<>()).add(creator); // Permet un lien nom de room <-> 

            // On ajoute la connexion du createur à sa room 
            Set<WebSocket> connections = Collections.synchronizedSet(new HashSet<>());
            connections.add(creatorWebSocket);
            roomConnections.put(roomName, connections);
            
            System.out.println("TOUTES LES ROOMS" + rooms);
            System.out.println("RoomUserMap" + roomUserMap);
            System.out.println("roomConnections" + roomConnections);

            joinRoom(newRoom.getName(), creatorWebSocket, newRoom.getCreator());
            System.out.println("Nouvelle room créée: " + newRoom.getName());
        } else {
            System.out.println("Room déjà existante: " + newRoom.getName());
        }
    }

    private void joinRoom(String roomName, WebSocket webSocket, String username) throws IOException {
        if (rooms.containsKey(roomName)) {

            // Le client n'est plus dans le composant room-list donc on le retire
            allClientOnRoomListComponent.remove(webSocket);
            
            Set<WebSocket> roomMembers = roomConnections.computeIfAbsent(roomName, k -> new HashSet<>());
            
            // Ajouter le nouveau joueur
            roomMembers.add(webSocket);
            System.out.println(roomConnections);
    
            // Préparer la liste des joueurs pour la notification
            JSONArray players = new JSONArray();
            for (WebSocket member : roomMembers) {
                String memberUsername = findUsernameByWebSocket(member);
                players.put(memberUsername);
            }
    
            // Envoyer la liste mise à jour des joueurs à tous les membres
            for (WebSocket member : roomMembers) {
                JSONObject notification = new JSONObject();
                notification.put("type", "UPDATED_PLAYER_LIST");
                notification.put("username", players);
                member.write(notification.toString());
            }
            System.out.println(username + " a rejoint la room: " + roomName);
        } else {
            System.out.println("La room " + roomName + " n'existe pas");
        }
    }    

    private String findUsernameByWebSocket(WebSocket webSocket) {
        return userWebSocketMap.entrySet().stream()
            .filter(entry -> entry.getValue().equals(webSocket))
            .map(Map.Entry::getKey)
            .findFirst()
            .orElse(null);
    }
    
}
