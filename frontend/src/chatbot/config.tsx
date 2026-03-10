import React from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';
import QuickRunnersWidget from './widgets/QuickRunnersWidget';

const config = {
  botName: 'ConnectUs AI',
  initialMessages: [
    createChatBotMessage(`👋 Hi! I'm your assistant. How can I help you find a Runner today?`, {})
  ],
  customStyles: {
    botMessageBox: { backgroundColor: '#2D531A' },
    chatButton: { backgroundColor: '#2D531A' },
  },
  widgets: [
    {
      widgetName: 'quickRunners',
      widgetFunc: (props: any) => <QuickRunnersWidget {...props} />,
    },
  ],
};

export default config;