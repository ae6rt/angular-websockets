package com.xoom.research;

import com.google.inject.Injector;

import javax.inject.Inject;
import javax.websocket.server.ServerEndpointConfig;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class Configurator extends ServerEndpointConfig.Configurator {
    private final Injector injector;
    private final Set<ServerSocket> sockets = Collections.synchronizedSet(new HashSet<ServerSocket>());

    @Inject
    public Configurator(Injector injector) {
        this.injector = injector;
    }

    @Override
    public <T> T getEndpointInstance(Class<T> endpointClass) throws InstantiationException {
        T instance = injector.getInstance(endpointClass);
        sockets.add((ServerSocket) instance);
        return instance;
    }

    public Set<ServerSocket> getSockets() {
        return sockets;
    }
}
