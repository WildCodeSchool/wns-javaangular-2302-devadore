package com.wcs.server.websocket;

import org.atmosphere.config.service.WebSocketHandlerService;
import org.atmosphere.websocket.WebSocket;
import org.atmosphere.websocket.WebSocketHandlerAdapter;
import org.json.JSONArray;
import org.json.JSONObject;

import com.wcs.server.model.Room;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@WebSocketHandlerService(path = "/websocket/room")
public class RoomWebSocketHandler extends WebSocketHandlerAdapter {

    private final ConcurrentHashMap<String, Room> rooms = new ConcurrentHashMap<>();
    private final Map<String, Set<WebSocket>> roomConnections = new ConcurrentHashMap<>();
    private final Set<WebSocket> allConnectedClients = Collections.newSetFromMap(new ConcurrentHashMap<WebSocket, Boolean>());
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
        System.out.println("Connexion fermée");
    }

    @Override
    public void onTextMessage(WebSocket webSocket, String message) throws IOException {

        JSONObject jsonMessage = new JSONObject(message);
        String messageType = jsonMessage.get("messageType").toString();
        System.out.println("jsonMessage"+ jsonMessage);

        if ("CREATE_ROOM".equals(messageType)) {
            String roomName = jsonMessage.get("roomName").toString();
            String creator = jsonMessage.get("creator").toString();
            String categorie = jsonMessage.get("categorie").toString();
            userWebSocketMap.put(creator, webSocket);
            roomUserMap.computeIfAbsent(roomName, k -> new HashSet<>()).add(creator);
            System.out.println("CREATE_ROOM");
            createRoom(roomName, creator, categorie, webSocket);
        }

        if("FETCH_ROOM".equals(messageType)) {
            fetchingRoomList(webSocket);
            System.out.println("FETCHING ROOM");
        }

        // if("GET_ROOM_INFOS".equals(messageType)) {
        //     getRoomInfos(webSocket);
        //     System.out.println("GET_ROOM_INFOS");
        // }

        if ("JOIN_ROOM".equals(messageType)) {
            String roomName = jsonMessage.get("roomName").toString();
            String username = jsonMessage.get("username").toString();
            userWebSocketMap.put(username, webSocket);
            roomUserMap.computeIfAbsent(roomName, k -> new HashSet<>()).add(username);
            joinRoom(roomName, webSocket, username);
        }
    }

    private void fetchingRoomList(WebSocket requesterWebSocket) throws IOException {
        String message = createRoomListUpdateMessage();
    
        requesterWebSocket.write(message);
    
        for (WebSocket clientWebSocket : allConnectedClients) {
            clientWebSocket.write(message);
        }
    }

    private String createRoomListUpdateMessage() {
        JSONObject message = new JSONObject();
        message.put("type", "FETCHING_ROOM_LIST");

        JSONArray roomsList = new JSONArray();
        for (Map.Entry<String, Room> entry : rooms.entrySet()) {
            JSONObject roomDetails = new JSONObject();
            roomDetails.put("creator", entry.getValue().getCreator());
            roomDetails.put("name", entry.getValue().getRoomName());
            roomDetails.put("categorie", entry.getValue().getCategorie());
            roomsList.put(roomDetails);
        }

        message.put("rooms", roomsList);

        return message.toString();
    }

    private void createRoom(String roomName, String creator, String categorie, WebSocket creatorWebSocket) throws IOException {
        if (!rooms.containsKey(roomName)) {
            Room newRoom = new Room(roomName, creator, categorie);
            rooms.put(roomName, newRoom);

            Set<WebSocket> connections = Collections.synchronizedSet(new HashSet<>());
            connections.add(creatorWebSocket);
            roomConnections.put(roomName, connections);

            System.out.println("TOUTES LES ROOMS" + rooms);

            joinRoom(roomName, creatorWebSocket, creator);
            System.out.println("Nouvelle room créée: " + roomName);
        } else {
            System.out.println("Room déjà existante: " + roomName);
        }
    }

    private void joinRoom(String roomName, WebSocket webSocket, String username) throws IOException {
        if (rooms.containsKey(roomName)) {
            Set<WebSocket> roomMembers = roomConnections.computeIfAbsent(roomName, k -> new HashSet<>());
            
            // Ajouter le nouveau joueur
            roomMembers.add(webSocket);
    
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
