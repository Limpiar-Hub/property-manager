
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createChatThread, fetchChatMessages, sendChatMessage } from "@/redux/features/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import type { RootState } from "@/redux/store";

export function useChat() {
  const dispatch = useDispatch();
  const router = useRouter();
 const { user, token } = useAppSelector((state) => state.auth);
  const { chats, selectedChatId, loading, error } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    // If we have a user and token, we can fetch chats
    if (user && token) {
      // gotta implement an API call to fetch all chats for the user
      // This would be another async thunk in the chatSlice
    }
  }, [user, token, dispatch]);

  const startChatWithCleaner = async (cleanerId: string, bookingId: string) => {
    if (!user || !token) {
      console.error("User not authenticated");
      return;
    }

    try {
      // Create a chat thread between property manager and cleaner
      await dispatch(
        createChatThread({
          participantIds: [user._id, cleanerId],
          taskId: bookingId,
          token,
        }) as any
      );

      // Navigate to inbox page
      router.push("/inbox");
    } catch (error) {
      console.error("Error creating chat thread:", error);
    }
  };

  const sendMessage = async (receiverId: string, text: string, chatId: string) => {
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    try {
      await dispatch(
        sendChatMessage({
          receiverId,
          text,
          chatId,
          token,
        }) as any
      );
      
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  };

  const loadChatMessages = async (chatId: string) => {
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    try {
      await dispatch(
        fetchChatMessages({
          chatId,
          token,
        }) as any
      );
    } catch (error) {
      console.error("Error loading chat messages:", error);
    }
  };

  return {
    chats,
    selectedChatId,
    loading,
    error,
    startChatWithCleaner,
    sendMessage,
    loadChatMessages,
  };
}