package com.wcs.server.websocket;

import org.atmosphere.config.service.WebSocketHandlerService;
import org.atmosphere.websocket.WebSocket;
import org.atmosphere.websocket.WebSocketHandlerAdapter;

import com.wcs.server.model.Room;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@WebSocketHandlerService(path = "/websocket/room")
public class RoomWebSocketHandler extends WebSocketHandlerAdapter {

    private final ConcurrentHashMap<String, Room> rooms = new ConcurrentHashMap<>();

    @Override
    public void onOpen(WebSocket webSocket) throws IOException {
        webSocket.write("{\"message\":\"Connexion établie\"}");
    }

    @Override
    public void onClose(WebSocket webSocket) {
        System.out.println("Connexion fermée");
    }

    @Override
    public void onTextMessage(WebSocket webSocket, String message) {
    }
}
