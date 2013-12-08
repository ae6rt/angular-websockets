package org.petrovic.angws;

import com.google.gson.Gson;

import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ProducerImpl implements Producer {
    private final Set<Consumer> consumers = Collections.synchronizedSet(new HashSet<Consumer>());
    private final ScheduledExecutorService scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
    private final BlockingQueue<String> queue = new LinkedBlockingQueue<String>();

    @Override
    public void start() {
        scheduledExecutorService.scheduleAtFixedRate(new Worker(), 2, 5, TimeUnit.SECONDS);
        new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        produce(queue.take());
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }, "fake data provider").start();
    }

    @Override
    public void produce(Object o) {
        for (Consumer consumer : consumers) {
            consumer.consume(o.toString());
        }
    }

    @Override
    public void add(Consumer consumer) {
        consumers.add(consumer);
    }

    private class Worker implements Runnable {
        @Override
        public void run() {
            DateMessage m = new DateMessage();
            m.message = new Date().toString();
            String json = new Gson().toJson(m);
            try {
                queue.put(json);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static class DateMessage {
        public String message;
    }
}
