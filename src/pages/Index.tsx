import { useState } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatArea } from '@/components/ChatArea';
import { SettingsDialog } from '@/components/SettingsDialog';
import { useConversations } from '@/hooks/useConversations';
import { useChat } from '@/hooks/useChat';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    deleteConversation,
    addMessage,
    updateMessage,
    clearAllConversations,
  } = useConversations();

  const {
    isStreaming,
    isConnected,
    agents,
    sendMessage,
    cancelStream,
    testConnection,
    getSettings,
    saveSettings,
  } = useChat(addMessage, updateMessage);

  const settings = getSettings();

  const handleSendMessage = (content: string) => {
    let conversationId = activeConversationId;
    
    // Create new conversation if none exists
    if (!conversationId) {
      const newConv = createConversation();
      conversationId = newConv.id;
    }
    
    sendMessage(conversationId, content);
  };

  const handleNewConversation = () => {
    createConversation();
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      {/* Cosmic Background */}
      {settings.animationsEnabled && <CosmicBackground />}

      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={handleNewConversation}
        onDeleteConversation={deleteConversation}
        onOpenSettings={() => setSettingsOpen(true)}
        isConnected={isConnected}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <ChatArea
          messages={activeConversation?.messages || []}
          isStreaming={isStreaming}
          agents={agents}
          animationsEnabled={settings.animationsEnabled}
          onSend={handleSendMessage}
          onCancel={cancelStream}
        />
      </main>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        getSettings={getSettings}
        saveSettings={saveSettings}
        testConnection={testConnection}
        onClearHistory={clearAllConversations}
      />
    </div>
  );
};

export default Index;
