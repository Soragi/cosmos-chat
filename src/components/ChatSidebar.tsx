import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, MessageSquare, Trash2, Settings, Wifi, WifiOff, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';
import { NvidiaLogo } from './NvidiaLogo';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onOpenSettings: () => void;
  isConnected: boolean | null;
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onOpenSettings,
  isConnected,
}: ChatSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <NvidiaLogo className="w-6 h-6" />
            <span className="font-semibold text-sidebar-foreground">AIQ Research</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewConversation}
          className={cn(
            'w-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground border border-sidebar-border',
            isCollapsed && 'px-0'
          )}
        >
          <Plus size={18} className={cn(!isCollapsed && 'mr-2')} />
          {!isCollapsed && 'New Chat'}
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                activeConversationId === conv.id
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'hover:bg-sidebar-accent text-sidebar-foreground'
              )}
              onClick={() => onSelectConversation(conv.id)}
            >
              <MessageSquare size={18} className="flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {format(conv.updatedAt, 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {/* Connection Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
                isConnected === true && 'text-primary',
                isConnected === false && 'text-destructive',
                isConnected === null && 'text-muted-foreground'
              )}
            >
              {isConnected ? (
                <Wifi size={18} className="flex-shrink-0" />
              ) : (
                <WifiOff size={18} className="flex-shrink-0" />
              )}
              {!isCollapsed && (
                <span>
                  {isConnected === true && 'Connected'}
                  {isConnected === false && 'Disconnected'}
                  {isConnected === null && 'Unknown'}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Backend connection status</p>
          </TooltipContent>
        </Tooltip>

        {/* Settings Button */}
        <Button
          variant="ghost"
          onClick={onOpenSettings}
          className={cn(
            'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent',
            isCollapsed && 'justify-center px-0'
          )}
        >
          <Settings size={18} className={cn(!isCollapsed && 'mr-2')} />
          {!isCollapsed && 'Settings'}
        </Button>
      </div>
    </div>
  );
}
