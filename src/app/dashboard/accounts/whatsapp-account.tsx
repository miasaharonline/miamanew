"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WhatsAppConnection from "@/components/whatsapp-connection";

export default function WhatsAppAccount() {
  const [activeTab, setActiveTab] = useState("connection");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">WhatsApp Account Management</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="info">Account Info</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="mt-6">
          <WhatsAppConnection />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Settings will be available once you connect your WhatsApp
                account.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 dark:text-gray-400">
                Account information will be displayed once you connect your
                WhatsApp account.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
