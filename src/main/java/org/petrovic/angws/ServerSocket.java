package org.petrovic.angws;

import javax.websocket.CloseReason;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@ServerEndpoint(value = "/events")
public class ServerSocket implements Consumer {
    private final Set<Session> sessions = Collections.synchronizedSet(new HashSet<Session>());

    @OnOpen
    public void onWebSocketConnect(Session session) throws IOException, EncodeException {
        sessions.add(session);
    }

    @OnMessage
    public void onWebSocketText(String message) throws IOException, EncodeException {
    }

    @OnClose
    public void onWebSocketClose(CloseReason reason) {
        System.out.printf("close reason: %s\n", reason.getReasonPhrase());
        System.out.printf("close code: %d\n", reason.getCloseCode().getCode());
    }

    @OnError
    public void onWebSocketError(Throwable cause) {
        System.out.printf("websocket error: %s\n", cause.getMessage());
    }

    @Override
    public void consume(Object o) {
        for (final Session session : sessions) {
            try {
                session.getBasicRemote().sendObject(o.toString());
            } catch (IOException e) {
                sessions.remove(session);
                System.out.printf("Session closed (%s, %s)\n", e.getMessage(), e.getCause());
            } catch (EncodeException e) {
                e.printStackTrace();
            }
        }
    }

    public Set<Session> getSessions() {
        return sessions;
    }
}

