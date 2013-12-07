package com.xoom.research;

public interface Producer {
    void produce(Object o);

    void add(Consumer consumer);

    void start();
}
