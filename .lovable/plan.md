

# AIQ Research Assistant Web UI

A stunning ChatGPT-style interface for the NVIDIA AIQ Research Assistant with an animated cosmic background and agent orchestration visualization.

---

## 🎨 Design & Visual Identity

### Cosmic Universe Background
- **Animated dark space background** with slowly drifting stars and nebula effects
- Subtle particle movement creating depth and a sense of the infinite
- Deep space color palette: dark blues, purples, with subtle green NVIDIA accents

### NVIDIA Branding
- NVIDIA logo positioned in the top-left corner
- NVIDIA green (#76B900) as the primary accent color
- Clean, modern dark theme matching NVIDIA's design language

---

## 💬 Chat Interface

### Main Chat Area (Center)
- **Streaming responses** with real-time text rendering
- Markdown support for formatted responses (headers, code blocks, lists)
- Message bubbles with clear distinction between user/AI messages
- Smooth scroll behavior with auto-scroll during streaming

### Agent Orchestration Animation (Bottom Center)
- **Particle/constellation visualization** during streaming
- Central orchestrator agent represented as a glowing core
- Satellite agents appear as particles that connect and flow
- Dynamic lines show communication between agents in real-time
- Agents "pulse" and "spark" when actively processing
- Animation fades gracefully when response completes

### Input Area
- Modern text input with placeholder guidance
- Send button with NVIDIA green accent
- Keyboard shortcut support (Enter to send)

---

## 📂 Sidebar (Left Panel)

### Header Section
- Logo and app title
- "New Chat" button with prominent styling

### Conversation List
- Previous conversations with auto-generated titles
- Timestamps for each conversation
- Active conversation highlighting
- Delete/rename options on hover

### Footer Section
- Settings button for configuration
- User profile section
- Backend connection status indicator

---

## ⚙️ Settings & Configuration

### Backend Connection
- Configurable backend URL input
- Connection status indicator (connected/disconnected)
- Test connection button

### Display Settings
- Animation toggle (for performance)
- Theme variations (if desired)

---

## 💾 Data Management

### Local Storage Persistence
- Conversations saved in browser localStorage
- Automatic conversation history loading on return
- Clear history option in settings

---

## 🔧 Technical Implementation

### API Integration
- Connect to your running backend (configurable URL)
- Streaming response handling via Server-Sent Events or fetch streaming
- Error handling with user-friendly messages

### Animation Library
- React Three Fiber for 3D cosmic background
- Custom particle system for agent visualization
- Smooth 60fps animations optimized for performance

### Responsive Design
- Works on desktop and tablet
- Collapsible sidebar for more space
- Mobile-friendly input area

