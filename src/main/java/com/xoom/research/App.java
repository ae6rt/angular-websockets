
package com.xoom.research;

import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.xoom.oss.feathercon.FeatherCon;
import com.xoom.oss.feathercon.ServletConfiguration;
import com.xoom.oss.feathercon.WebSocketEndpointConfiguration;
import org.eclipse.jetty.servlet.DefaultServlet;

import javax.websocket.server.ServerEndpointConfig;

public class App implements Consumer {
    private final Injector injector = Guice.createInjector(new AbstractModule() {
        @Override
        protected void configure() {
            bind(Producer.class).to(ProducerImpl.class);
        }
    });

    private Configurator serverEndpointConfigurator;

    public static void main(String[] args) throws Exception {
        new App().run();
    }

    private void run() throws Exception {
        serverEndpointConfigurator = injector.getInstance(Configurator.class);
        ServerEndpointConfig config = ServerEndpointConfig.Builder
                .create(ServerSocket.class, "/events")
                .configurator(serverEndpointConfigurator)
                .build();

        WebSocketEndpointConfiguration wsconfig = new WebSocketEndpointConfiguration.Builder()
                .withServerEndpointConfig(config)
                .build();

        // Need this to deliver the initial html/javascript to the browser:  http://localhost:8080/index.html
        ServletConfiguration staticContentConfig = new ServletConfiguration.Builder()
                .withServletClass(DefaultServlet.class)
                .withPathSpec("/*")
                .withInitParameter("resourceBase", "html")
                .build();

        FeatherCon server = new FeatherCon.Builder()
                .withPort(8080)
                .withWebSocketConfiguration(wsconfig)
                .withServletConfiguration(staticContentConfig)
                .build();

        Producer producer = injector.getInstance(Producer.class);
        producer.add(this);
        producer.start();

        server.start();
        server.join();
    }

    @Override
    public void consume(Object o) {
        for (ServerSocket socket : serverEndpointConfigurator.getSockets()) {
            socket.consume(o);
        }
    }

}
