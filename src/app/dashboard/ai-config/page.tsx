"use client";

import { Button } from "@/components/ui/button";
import { InfoIcon, Settings, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

export default function AIConfig() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 1000,
    responseDelay: 2,
    showTypingIndicator: true,
    autoPauseOnHuman: true,
    systemPrompt:
      "You are a helpful WhatsApp assistant that responds to user queries in a friendly, concise manner. You can help with scheduling, information lookup, and general conversation. When users send voice messages, you'll receive the transcribed text. If a message contains event details, extract the date, time, and description to create calendar entries.",
    openaiKey: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        fetchConfig(data.user.id);
      } else {
        window.location.href = "/sign-in";
      }
    };
    getUser();
  }, []);

  const fetchConfig = async (userId) => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ai_configurations")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching config:", error);
        return;
      }

      if (data) {
        setConfig({
          model: data.model || "gpt-4o",
          temperature: data.temperature || 0.7,
          maxTokens: data.max_tokens || 1000,
          responseDelay: data.response_delay || 2,
          showTypingIndicator: data.show_typing_indicator,
          autoPauseOnHuman: data.auto_pause_on_human,
          systemPrompt: data.system_prompt || config.systemPrompt,
          openaiKey: data.openai_key || "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const { error } = await supabase.from("ai_configurations").upsert({
        user_id: user.id,
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        response_delay: config.responseDelay,
        show_typing_indicator: config.showTypingIndicator,
        auto_pause_on_human: config.autoPauseOnHuman,
        system_prompt: config.systemPrompt,
        openai_key: config.openaiKey,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        toast({
          title: "Error saving configuration",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Configuration saved",
        description: "Your AI assistant settings have been updated.",
      });
    } catch (error) {
      console.error("Error saving config:", error);
      toast({
        title: "Error saving configuration",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-6 bg-whatsapp-gray">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-whatsapp-darkgreen" />
            <h2 className="text-xl font-semibold text-whatsapp-text">
              AI Assistant Configuration
            </h2>
          </div>

          <div className="bg-whatsapp-lightgreen text-sm p-3 px-4 rounded-lg text-whatsapp-darkgreen flex gap-2 items-center mb-6 bg-[#f2f2f2]">
            <InfoIcon size="14" />
            <span>
              Configure how your AI assistant behaves when responding to
              WhatsApp messages
            </span>
          </div>

          <Tabs defaultValue="model" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="model">Model Settings</TabsTrigger>
              <TabsTrigger value="response">Response Behavior</TabsTrigger>
              <TabsTrigger value="prompt">System Prompt</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
            </TabsList>

            <TabsContent value="model" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="model">AI Model</Label>
                  <select
                    id="model"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent"
                    value={config.model}
                    onChange={(e) => handleChange("model", e.target.value)}
                  >
                    <option value="gpt-4o">GPT-4o (Recommended)</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
                    <option value="gpt-3.5-turbo">
                      GPT-3.5 Turbo (Economy)
                    </option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="temperature">
                      Temperature: {config.temperature}
                    </Label>
                    <span className="text-sm text-whatsapp-darkgray">
                      Creativity vs Consistency
                    </span>
                  </div>
                  <div className="py-4">
                    <Slider
                      value={[config.temperature]}
                      max={1}
                      step={0.1}
                      onValueChange={(value) =>
                        handleChange("temperature", value[0])
                      }
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="max-tokens">
                      Max Tokens: {config.maxTokens}
                    </Label>
                    <span className="text-sm text-whatsapp-darkgray">
                      Response Length Limit
                    </span>
                  </div>
                  <div className="py-4">
                    <Slider
                      value={[config.maxTokens]}
                      max={4000}
                      step={100}
                      onValueChange={(value) =>
                        handleChange("maxTokens", value[0])
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="response" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="response-delay">
                      Response Delay (seconds): {config.responseDelay}
                    </Label>
                    <span className="text-sm text-whatsapp-darkgray">
                      Simulates typing time
                    </span>
                  </div>
                  <div className="py-4">
                    <Slider
                      value={[config.responseDelay]}
                      max={10}
                      step={1}
                      onValueChange={(value) =>
                        handleChange("responseDelay", value[0])
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="typing-indicator">
                    Show Typing Indicator
                  </Label>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="typing-indicator"
                      className="mr-2"
                      checked={config.showTypingIndicator}
                      onChange={(e) =>
                        handleChange("showTypingIndicator", e.target.checked)
                      }
                    />
                    <span className="text-sm text-whatsapp-darkgray">
                      Display "typing..." before sending messages
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="auto-pause">
                    Auto-Pause When Human Intervenes
                  </Label>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="auto-pause"
                      className="mr-2"
                      checked={config.autoPauseOnHuman}
                      onChange={(e) =>
                        handleChange("autoPauseOnHuman", e.target.checked)
                      }
                    />
                    <span className="text-sm text-whatsapp-darkgray">
                      Pause AI responses when a human operator replies
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prompt" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:border-transparent min-h-[200px]"
                    placeholder="You are a helpful WhatsApp assistant..."
                    value={config.systemPrompt}
                    onChange={(e) =>
                      handleChange("systemPrompt", e.target.value)
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    className="w-full mt-1"
                    placeholder="sk-..."
                    value={config.openaiKey}
                    onChange={(e) => handleChange("openaiKey", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button
              className="bg-whatsapp-darkgreen hover:bg-whatsapp-green text-white flex items-center gap-2"
              onClick={handleSaveConfig}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
