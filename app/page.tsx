"use client";

import { useState, useRef, useEffect } from "react";
import ProductCard from "./components/ProductCard";
import BrandCard from "./components/BrandCard"; // 🔥 NUEVO: Importar BrandCard
import { ChatResponse, DisplayItem } from "./interfaces/types"; // 🔥 CAMBIADO: DisplayItem

interface ChatMessage {
  id: number;
  from: "user" | "bot";
  text?: string;
  products?: DisplayItem[]; // 🔥 CAMBIADO: Product[] → DisplayItem[]
  suggestions?: string[];
}

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: "bot", text: "Hola 👋 ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const CHAT_ENDPOINT = process.env.NEXT_PUBLIC_CHAT_ENDPOINT;
  const API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  if (!BACKEND_URL || !CHAT_ENDPOINT || !API_KEY) {
    throw new Error(
      "Falta la configuración de las variables de entorno"
    );
  }

  const CHAT_URL = `${BACKEND_URL}${CHAT_ENDPOINT}`;

  // Inicializar sessionId desde localStorage o generar uno nuevo
  useEffect(() => {
    const savedSessionId = localStorage.getItem("chat_session_id");
    if (savedSessionId) {
      setSessionId(savedSessionId);
      console.log("📝 Sesión recuperada:", savedSessionId);
    } else {
      const newSessionId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setSessionId(newSessionId);
      localStorage.setItem("chat_session_id", newSessionId);
      console.log("🆕 Nueva sesión creada:", newSessionId);
    }
  }, []);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() || loading || !sessionId) return;

    const userMsg: ChatMessage = { 
      id: Date.now(), 
      from: "user", 
      text: input 
    };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    const botTypingId = Date.now() + 1;
    setMessages((prev) => [...prev, { 
      id: botTypingId, 
      from: "bot", 
      text: "..." 
    }]);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 25000);

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          message: userMsg.text,
          userId: "web_user",
          sessionId: sessionId,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data: ChatResponse = await res.json();

      // Si el backend devuelve un sessionId diferente, usarlo
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("chat_session_id", data.sessionId);
        console.log("🔄 SessionId actualizado:", data.sessionId);
      }

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== botTypingId) return msg;

          return {
            ...msg,
            text: data.response || undefined,
            products: data.products || undefined,
            suggestions: data.suggestions || undefined,
          };
        })
      );
    } catch (err: any) {
      console.error(err);
      clearTimeout(timeout);

      if (err.name === "AbortError") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botTypingId
              ? { 
                  ...msg, 
                  text: "La plataforma está en mantenimiento, por favor intente más tarde." 
                }
              : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botTypingId
              ? { 
                  ...msg, 
                  text: "Error de conexión. Inténtalo más tarde." 
                }
              : msg
          )
        );
      }
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // Botón para reiniciar la conversación
  const resetConversation = () => {
    const newSessionId = `web_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSessionId);
    localStorage.setItem("chat_session_id", newSessionId);
    setMessages([
      { 
        id: 1, 
        from: "bot", 
        text: "Hola 👋 ¿En qué puedo ayudarte hoy?" 
      }
    ]);
    console.log("🔄 Conversación reiniciada con sessionId:", newSessionId);
  };

  // 🔥 NUEVA FUNCIÓN: Renderizar el tipo correcto de tarjeta
  const renderItemCard = (item: DisplayItem) => {
    console.log("OJO "+JSON.stringify(item))
    if (item.type === 'brand') {
      return <BrandCard key={item.id} brand={item} />;
    } else {
      return <ProductCard key={item.id} product={item} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Header con botón de reinicio */}
        <header className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Asistente de la Tienda</h1>
            <p className="text-sm opacity-90">Soporte con IA + OpenCart</p>
          </div>
          <button
            onClick={resetConversation}
            className="px-3 py-1 bg-white text-indigo-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
            title="Reiniciar conversación"
          >
            Nueva conversación
          </button>
        </header>

        {/* Indicador de sesión (solo en desarrollo) */}
        {process.env.NODE_ENV === "development" && sessionId && (
          <div className="px-5 py-2 bg-gray-100 text-xs text-gray-600 border-b">
            Sesión: {sessionId.substring(0, 20)}...
          </div>
        )}

        {/* Chat window */}
        <main className="p-5 h-[60vh] overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}
            >
              {m.text && (
                <div
                  className={`px-4 py-2 rounded-xl max-w-[70%] whitespace-pre-wrap
                    ${m.from === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"}`}
                >
                  {m.text}
                </div>
              )}

              {/* 🔥 MODIFICADO: Product/Brand cards */}
              {m.products && m.products.length > 0 && (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-[90%]">
                  {m.products.map((item) => renderItemCard(item))}
                </div>
              )}

              {/* Quick suggestions */}
              {m.suggestions && m.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 max-w-[70%]">
                  {m.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition"
                      onClick={() => setInput(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </main>

        {/* Input area */}
        <footer className="p-4 border-t bg-white">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={loading ? "Esperando respuesta..." : "Escribe tu mensaje..."}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition disabled:bg-gray-400"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}