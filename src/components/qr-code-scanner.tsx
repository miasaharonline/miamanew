"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

interface QRCodeScannerProps {
  qrCode?: string;
  onSuccess?: () => void;
}

export default function QRCodeScanner({
  qrCode,
  onSuccess,
}: QRCodeScannerProps) {
  const [status, setStatus] = useState<{
    status: "disconnected" | "connecting" | "connected";
    qrCode: string | null;
    error: string | null;
  }>({ status: "disconnected", qrCode: null, error: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (qrCode) {
      setStatus((prev) => ({ ...prev, qrCode, status: "connecting" }));
      return;
    }

    checkStatus();
  }, [qrCode]);

  const initializeWhatsApp = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "init" }),
      });
      const data = await response.json();
      setStatus(data);

      if (data.status === "connected" && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error initializing WhatsApp:", error);
      setStatus((prev) => ({ ...prev, error: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status" }),
      });
      const data = await response.json();
      setStatus(data);

      if (data.status === "connected" && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  useEffect(() => {
    // Poll status every 5 seconds if connecting
    const interval = setInterval(() => {
      if (status.status === "connecting") {
        checkStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [status.status, onSuccess]);

  if (status.status === "connected") {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-green-600 font-medium mb-2">Connected!</div>
        <p className="text-sm text-gray-600 text-center">
          Your WhatsApp account is successfully connected. You can now use the
          AI assistant.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {status.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 w-full text-sm">
          {status.error}
        </div>
      )}

      {status.status === "disconnected" ? (
        <div className="flex flex-col items-center justify-center p-6">
          <p className="text-gray-600 mb-4 text-center">
            Connect your WhatsApp account to use the AI assistant
          </p>
          <Button
            onClick={initializeWhatsApp}
            className="bg-whatsapp-green hover:bg-whatsapp-darkgreen"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect WhatsApp"
            )}
          </Button>
        </div>
      ) : status.qrCode ? (
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div
              id="qrcode"
              className="w-64 h-64 flex items-center justify-center"
            >
              {/* Display QR code as text if image rendering fails */}
              <pre className="text-xs overflow-hidden">{status.qrCode}</pre>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center max-w-xs">
            Scan this QR code with your WhatsApp app to connect your account
          </p>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Open WhatsApp on your phone &gt; Menu &gt; Linked Devices &gt; Link
            a Device
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 text-whatsapp-darkgreen animate-spin" />
          <p className="text-sm text-gray-500 mt-4">
            Loading WhatsApp status...
          </p>
        </div>
      )}

      {status.status === "connecting" && (
        <Button
          variant="outline"
          size="sm"
          onClick={checkStatus}
          className="mt-4"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
      )}
    </div>
  );
}
