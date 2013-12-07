package org.petrovic.angws;

public interface Producer {
    void produce(Object o);

    void add(Consumer consumer);

    void start();
}
