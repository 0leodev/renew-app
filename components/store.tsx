import { create } from 'zustand';
import { RefObject } from 'react';
import { TextInput } from 'react-native';
import * as Localization from 'expo-localization'; // Import expo-localization

interface StoreState {
  title1: string;
  title2: string;
  title3: string;
  title4: string;
  title5: string;
  name: string;
  name2: string;
  name3: string;
  name4: string;
  name5: string;
  activeTextField: 'name' | 'name2' | 'name3' | 'name4' | 'name5';
  cursorPosition: number;
  textInputRef: RefObject<TextInput>;
  textInputRef2: RefObject<TextInput>;
  textInputRef3: RefObject<TextInput>;
  textInputRef4: RefObject<TextInput>;
  textInputRef5: RefObject<TextInput>;
  language: 'en' | 'es'; // Language property
  setTitle1: (value: string) => void;
  setTitle2: (value: string) => void;
  setTitle3: (value: string) => void;
  setTitle4: (value: string) => void;
  setTitle5: (value: string) => void;
  setName: (value: string) => void;
  setName2: (value: string) => void;
  setName3: (value: string) => void;
  setName4: (value: string) => void;
  setName5: (value: string) => void;
  setActiveTextField: (field: 'name' | 'name2' | 'name3' | 'name4' | 'name5') => void;
  setCursorPosition: (position: number) => void;
  setTextInputRefs: (
    ref: RefObject<TextInput>,
    ref2: RefObject<TextInput>,
    ref3: RefObject<TextInput>,
    ref4: RefObject<TextInput>,
    ref5: RefObject<TextInput>
  ) => void;
  setLanguage: (lang: 'en' | 'es') => void; // Set language function
}

// Detect the user's device language, default to 'en' if not 'es' or 'en'
const deviceLanguage = Localization.locale.startsWith('es') ? 'es' : 'en';

const useStore = create<StoreState>((set) => ({
  title1: deviceLanguage === 'en' ? 'How I see God' : 'Como veo a Dios',
  title2: deviceLanguage === 'en' ? 'What does God say to me?' : 'Que me dice Dios?',
  title3: deviceLanguage === 'en' ? 'Promise' : 'Promesa',
  title4: deviceLanguage === 'en' ? 'Application' : 'Aplicacion',
  title5: deviceLanguage === 'en' ? 'Acknowledgments' : 'Agradecimientos',
  name: '',
  name2: '',
  name3: '',
  name4: '',
  name5: '',
  activeTextField: 'name',
  cursorPosition: 0,
  textInputRef: { current: null },
  textInputRef2: { current: null },
  textInputRef3: { current: null },
  textInputRef4: { current: null },
  textInputRef5: { current: null },
  language: deviceLanguage, // Set default language based on device

  setTitle1: (value) => set({ title1: value }),
  setTitle2: (value) => set({ title2: value }),
  setTitle3: (value) => set({ title3: value }),
  setTitle4: (value) => set({ title4: value }),
  setTitle5: (value) => set({ title5: value }),

  setName: (value) => set({ name: value }),
  setName2: (value) => set({ name2: value }),
  setName3: (value) => set({ name3: value }),
  setName4: (value) => set({ name4: value }),
  setName5: (value) => set({ name5: value }),

  setActiveTextField: (field) => set({ activeTextField: field }),

  setCursorPosition: (position) => set({ cursorPosition: position }),

  setTextInputRefs: (ref, ref2, ref3, ref4, ref5) => set({
    textInputRef: ref,
    textInputRef2: ref2,
    textInputRef3: ref3,
    textInputRef4: ref4,
    textInputRef5: ref5,
  }),

  setLanguage: (lang) => set((state) => {
    const titles = lang === 'en' ? {
      title1: 'How I see God',
      title2: 'What does God say to me?',
      title3: 'Promise',
      title4: 'Application',
      title5: 'Acknowledgments',
    } : {
      title1: 'Como veo a Dios',
      title2: 'Que me dice Dios?',
      title3: 'Promesa',
      title4: 'Aplicacion',
      title5: 'Agradecimientos',
    };

    return {
      language: lang,
      ...titles,
    };
  }),
}));

export default useStore;
