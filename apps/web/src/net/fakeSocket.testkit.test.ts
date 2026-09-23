import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  emittedOf,
  getConnectCallCount,
  getEmittedCalls,
  getSocket,
  hasListenerFor,
  resetFakeSocket,
  setSocketConnected,
  triggerSocketEvent,
} from "./fakeSocket.testkit.js";

describe("fakeSocket.testkit", () => {
  beforeEach(() => {
    resetFakeSocket();
  });

  it("gère l'état connecté/déconnecté via triggerSocketEvent", () => {
    const socket = getSocket();
    expect(socket.connected).toBe(false);

    triggerSocketEvent("connect");
    expect(socket.connected).toBe(true);

    triggerSocketEvent("disconnect", "transport close");
    expect(socket.connected).toBe(false);
  });

  it("gère connect() et connectCallCount", () => {
    const socket = getSocket();
    expect(getConnectCallCount()).toBe(0);

    socket.connect();
    expect(socket.connected).toBe(true);
    expect(getConnectCallCount()).toBe(1);

    socket.connect();
    expect(getConnectCallCount()).toBe(2);
  });

  it("permet de forcer connected via setSocketConnected", () => {
    const socket = getSocket();
    setSocketConnected(true);
    expect(socket.connected).toBe(true);
    setSocketConnected(false);
    expect(socket.connected).toBe(false);
  });

  it("enregistre et déclenche les écouteurs d'événements", () => {
    const socket = getSocket();
    const handler = vi.fn();

    expect(hasListenerFor("connect")).toBe(false);
    socket.on("connect", handler);
    expect(hasListenerFor("connect")).toBe(true);

    triggerSocketEvent("connect");
    expect(handler).toHaveBeenCalledTimes(1);

    socket.off("connect", handler);
    expect(hasListenerFor("connect")).toBe(false);
  });

  it("enregistre les émissions client et filtre par événement", () => {
    const socket = getSocket();
    const ackFn = vi.fn();

    socket.emit("room:join", { roomCode: "TEST", nickname: "Sacha" }, ackFn);

    expect(getEmittedCalls()).toHaveLength(1);
    const calls = emittedOf("room:join");
    expect(calls).toHaveLength(1);
    expect(calls[0]?.payload).toEqual({ roomCode: "TEST", nickname: "Sacha" });
    expect(calls[0]?.ack).toBe(ackFn);
  });

  it("resetFakeSocket réinitialise complètement l'état", () => {
    const socket = getSocket();
    socket.connect();
    socket.emit("round:answer", { roundIndex: 0, pokemonId: 25 }, () => {});
    socket.on("connect", () => {});

    resetFakeSocket();
    expect(socket.connected).toBe(false);
    expect(getConnectCallCount()).toBe(0);
    expect(getEmittedCalls()).toHaveLength(0);
    expect(hasListenerFor("connect")).toBe(false);
  });
});
