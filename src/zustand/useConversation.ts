import { create } from "zustand";

// interface ConversationState {
//   selectedConversation: any; // Replace 'any' with the type of your conversation object
//   messages: any[]; // Replace 'any' with the type of your message object
// }

// interface ConversationActions extends ConversationState {
//   setSelectedConversation: (selectedConversation: any) => void; // Replace 'any' with the type of your conversation object
//   setMessages: (messages: any[]) => void; // Replace 'any' with the type of your message object
// }

// const useConversation = create<ConversationState & ConversationActions>(
//   (set) => ({
//     selectedConversation: null,
//     setSelectedConversation: (selectedConversation) =>
//       set({ selectedConversation }),
//     messages: [],
//     setMessages: (messages) => set({ messages }),
//   })
// );

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation: any) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages: any) => set({ messages }),
}));

export default useConversation;
