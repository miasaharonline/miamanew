"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QrCodeScanner } from "@/components/qr-code-scanner";
import {
  RefreshCw,
  Smartphone,
  Wifi,
  WifiOff,
  LogOut,
  Info,
} from "lucide-react";

interface ConnectionStatus {
  status: "disconnected" | "connecting" | "connected";
  qrCode: string | null;
  error: string | null;
}

export default function WhatsAppConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    status: "disconnected",
    qrCode: null,
    error: null,
  });
  const [batteryInfo, setBatteryInfo] = useState<any>(null);
  const [version, setVersion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

      // If connected, get additional info
      if (data.status === "connected") {
        fetchBatteryInfo();
        fetchWAVersion();
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  const fetchBatteryInfo = async () => {
    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getBatteryLevel" }),
      });
      const data = await response.json();
      setBatteryInfo(data.battery);
    } catch (error) {
      console.error("Error fetching battery info:", error);
    }
  };

  const fetchWAVersion = async () => {
    try {
      const response = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getWAVersion" }),
      });
      const data = await response.json();
      setVersion(data.version);
    } catch (error) {
      console.error("Error fetching WhatsApp version:", error);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      setStatus({
        status: "disconnected",
        qrCode: null,
        error: null,
      });
      setBatteryInfo(null);
      setVersion("");
    } catch (error) {
      console.error("Error logging out:", error);
      setStatus((prev) => ({ ...prev, error: error.message }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();

    // Poll status every 5 seconds if connecting
    const interval = setInterval(() => {
      if (status.status === "connecting") {
        checkStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [status.status]);

  const renderStatusBadge = () => {
    switch (status.status) {
      case "connected":
        return <Badge className="bg-green-500">Connected</Badge>;
      case "connecting":
        return <Badge className="bg-yellow-500">Connecting</Badge>;
      case "disconnected":
        return <Badge className="bg-red-500">Disconnected</Badge>;
      default:
        return null;
    }
  };

  const renderConnectionInfo = () => {
    if (status.status === "connected" && batteryInfo) {
      return (
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span>Device connected</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>WhatsApp Version: {version || "Unknown"}</span>
          </div>
          {batteryInfo && (
            <div className="flex items-center gap-2">
              <span>Battery: {batteryInfo.battery}%</span>
              <span>{batteryInfo.plugged ? "(Charging)" : ""}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>WhatsApp Connection</CardTitle>
          {renderStatusBadge()}
        </div>
        <CardDescription>
          Connect your WhatsApp account to use the AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{status.error}</AlertDescription>
          </Alert>
        )}

        {status.status === "disconnected" && (
          <div className="flex flex-col items-center justify-center py-6">
            <WifiOff className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-center text-gray-500 dark:text-gray-400">
              Not connected to WhatsApp
            </p>
            <Button
              onClick={initializeWhatsApp}
              className="mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>Connect to WhatsApp</>
              )}
            </Button>
          </div>
        )}

        {status.status === "connecting" && status.qrCode && (
          <div className="flex flex-col items-center justify-center py-4">
            <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Scan this QR code with your WhatsApp app to connect
            </p>
            <QrCodeScanner qrCode={status.qrCode} />
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Open WhatsApp on your phone &gt; Menu &gt; Linked Devices &gt;
              Link a Device
            </p>
          </div>
        )}

        {status.status === "connected" && (
          <div className="flex flex-col items-center justify-center py-4">
            <Wifi className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-center text-gray-700 dark:text-gray-300">
              Connected to WhatsApp
            </p>
            {renderConnectionInfo()}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={checkStatus}
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
        {status.status === "connected" && (
          <Button
            variant="destructive"
            size="sm"
            onClick={logout}
            disabled={loading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
