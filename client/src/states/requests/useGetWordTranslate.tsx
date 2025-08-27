import { create } from "zustand/react";
import { secureFetch } from "@/lib/secureFetch";
import { useUserSettingsStore } from "@/states/requests/useUserSettings";

type translatedWord = {
  translate: string[];
  phonetic: string;
  audio: string;
  phoneticUS: string;
  audioUS: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      synonyms: string[];
      antonyms: string[];
      example?: string;
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
};
const emptyTranslatedWord: translatedWord = {
  translate: [],
  phonetic: "",
  audio: "",
  phoneticUS: "",
  audioUS: "",
  meanings: [
    {
      partOfSpeech: "",
      definitions: [
        {
          definition: "",
          synonyms: [],
          antonyms: [],
          example: "",
        },
      ],
      synonyms: [],
      antonyms: [],
    },
  ],
};

type TranslateInfoRequest = {
  data: translatedWord;
  clearTranslatedData: () => void;
  fetch: (text: string) => Promise<void>;
};
export const useGetWordTranslate = create<TranslateInfoRequest>((set, get) => ({
  data: emptyTranslatedWord,
  clearTranslatedData: () => set({ data: emptyTranslatedWord }),
  fetch: async (text) => {
    const params = new URLSearchParams({
      text: text,
      from: useUserSettingsStore.getState().settings.current_language,
      to: "UA",
    });
    const url = `/api/translate/info?${params}`;
    try {
      const response = await secureFetch(url);
      const data = await response.json();
      set({ data: data });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  },
}));
