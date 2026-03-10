import { getChatResponse } from '../services/aiService';
import { getRunners } from '../services/runnerService'; // Assuming this exists

class ActionProvider {
  createChatBotMessage: any;
  setState: any;

  constructor(createChatBotMessage: any, setStateFunc: any) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleUserMessage = async (message: string) => {
    // 1. Get AI Response
    const aiResponse = await getChatResponse(message);

    // 2. Check if AI wants to show runners
    if (aiResponse.includes("[SHOW_RUNNERS]")) {
      const runnersData = await getRunners(); // Fetch from your backend/DB
      const botMessage = this.createChatBotMessage(
        aiResponse.replace("[SHOW_RUNNERS]", ""), 
        {
          widget: 'quickRunners',
          payload: { runners: runnersData.slice(0, 3) } // Show top 3
        }
      );
      this.updateChatbotState(botMessage);
    } else {
      // 3. Regular text response
      const botMessage = this.createChatBotMessage(aiResponse);
      this.updateChatbotState(botMessage);
    }
  };

  updateChatbotState = (message: any) => {
    this.setState((prev: any) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default ActionProvider;