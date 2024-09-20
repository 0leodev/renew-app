import React, { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
import { Image, StyleSheet, Switch, TextInput, View, TouchableOpacity, Modal, ScrollView, Text, NativeSyntheticEvent, TextInputSelectionChangeEventData, ActivityIndicator } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useStore from '@/components/store';
import 'expo-dev-client';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1037738454909392/7716957151';

interface Book {
  name: string;
  chapters: number;
}

interface Verse {
  verse: string;
  number: number;
  study?: string;
  id: number;
}

// interface Chapter {
//   book: string;
//   chapter: number;
//   verses: Verse[];
// }

// import { getLocales } from 'expo-localization';
// import { I18n } from 'i18n-js';
// import { en, es } from './localizations';

export default function HomeScreen() {
  const { name, name2, name3, name4, name5, setName, setName2, setName3, setName4, setName5 } = useStore();
  const { title1, title2, title3, title4, title5, setTitle1, setTitle2, setTitle3, setTitle4, setTitle5 } = useStore();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [chaptersVisible, setChaptersVisible] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [view, setView] = useState<'books' | 'chapters' | 'verses'>('books');
  const [loading, setLoading] = useState<boolean>(false); // Add this state
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query state
  const [isEditing, setIsEditing] = useState(false);
  const bannerRef = useRef<BannerAd>(null);

  const language = useStore((state) => state.language);

  const booksOfTheBible: Book[] = [
    // Old Testament
    { name: (language === 'en' ? 'Genesis' : 'Genesis'), chapters: 50 },
    { name: (language === 'en' ? 'Exodus' : 'Exodo'), chapters: 40 },
    { name: (language === 'en' ? 'Leviticus' : 'Levitico'), chapters: 27 },
    { name: (language === 'en' ? 'Numbers' : 'Numeros'), chapters: 36 },
    { name: (language === 'en' ? 'Deuteronomy' : 'Deuteronomio'), chapters: 34 },
    { name: (language === 'en' ? 'Joshua' : 'Josue'), chapters: 24 },
    { name: (language === 'en' ? 'Judges' : 'Jueces'), chapters: 21 },
    { name: (language === 'en' ? 'Ruth' : 'Rut'), chapters: 4 },
    { name: (language === 'en' ? '1-Samuel' : '1-Samuel'), chapters: 31 },
    { name: (language === 'en' ? '2-Samuel' : '2-Samuel'), chapters: 24 },
    { name: (language === 'en' ? '1-Kings' : '1-Reyes'), chapters: 22 },
    { name: (language === 'en' ? '2-Kings' : '2-Reyes'), chapters: 25 },
    { name: (language === 'en' ? '1-Chronicles' : '1-Cronicas'), chapters: 29 },
    { name: (language === 'en' ? '2-Chronicles' : '2-Cronicas'), chapters: 36 },
    { name: (language === 'en' ? 'Ezra' : 'Esdras'), chapters: 10 },
    { name: (language === 'en' ? 'Nehemiah' : 'Nehemias'), chapters: 13 },
    { name: (language === 'en' ? 'Esther' : 'Ester'), chapters: 10 },
    { name: (language === 'en' ? 'Job' : 'Job'), chapters: 42 },
    { name: (language === 'en' ? 'Psalms' : 'Salmos'), chapters: 150 },
    { name: (language === 'en' ? 'Proverbs' : 'Proverbios'), chapters: 31 },
    { name: (language === 'en' ? 'Ecclesiastes' : 'Eclesiastes'), chapters: 12 },
    { name: (language === 'en' ? 'Song of Solomon' : 'Cantares'), chapters: 8 },
    { name: (language === 'en' ? 'Isaiah' : 'Isaias'), chapters: 66 },
    { name: (language === 'en' ? 'Jeremiah' : 'Jeremias'), chapters: 52 },
    { name: (language === 'en' ? 'Lamentations' : 'Lamentaciones'), chapters: 5 },
    { name: (language === 'en' ? 'Ezekiel' : 'Ezequiel'), chapters: 48 },
    { name: (language === 'en' ? 'Daniel' : 'Daniel'), chapters: 12 },
    { name: (language === 'en' ? 'Hosea' : 'Oseas'), chapters: 14 },
    { name: (language === 'en' ? 'Joel' : 'Joel'), chapters: 3 },
    { name: (language === 'en' ? 'Amos' : 'Amos'), chapters: 9 },
    { name: (language === 'en' ? 'Obadiah' : 'Abdias'), chapters: 1 },
    { name: (language === 'en' ? 'Jonah' : 'Jonas'), chapters: 4 },
    { name: (language === 'en' ? 'Micah' : 'Miqueas'), chapters: 7 },
    { name: (language === 'en' ? 'Nahum' : 'Nahum'), chapters: 3 },
    { name: (language === 'en' ? 'Habakkuk' : 'Habacuc'), chapters: 3 },
    { name: (language === 'en' ? 'Zephaniah' : 'Sofonias'), chapters: 3 },
    { name: (language === 'en' ? 'Haggai' : 'Hageo'), chapters: 2 },
    { name: (language === 'en' ? 'Zechariah' : 'Zacarias'), chapters: 14 },
    { name: (language === 'en' ? 'Malachi' : 'Malaquias'), chapters: 4 },
    
    // New Testament
    { name: (language === 'en' ? 'Matthew' : 'Mateo'), chapters: 28 },
    { name: (language === 'en' ? 'Mark' : 'Marcos'), chapters: 16 },
    { name: (language === 'en' ? 'Luke' : 'Lucas'), chapters: 24 },
    { name: (language === 'en' ? 'John' : 'Juan'), chapters: 21 },
    { name: (language === 'en' ? 'Acts' : 'Hechos'), chapters: 28 },
    { name: (language === 'en' ? 'Romans' : 'Romanos'), chapters: 16 },
    { name: (language === 'en' ? '1-Corinthians' : '1-Corintios'), chapters: 16 },
    { name: (language === 'en' ? '2-Corinthians' : '2-Corintios'), chapters: 13 },
    { name: (language === 'en' ? 'Galatians' : 'Galatas'), chapters: 6 },
    { name: (language === 'en' ? 'Ephesians' : 'Efesios'), chapters: 6 },
    { name: (language === 'en' ? 'Philippians' : 'Filipenses'), chapters: 4 },
    { name: (language === 'en' ? 'Colossians' : 'Colosenses'), chapters: 4 },
    { name: (language === 'en' ? '1-Thessalonians' : '1-Tesalonicenses'), chapters: 5 },
    { name: (language === 'en' ? '2-Thessalonians' : '2-Tesalonicenses'), chapters: 3 },
    { name: (language === 'en' ? '1-Timothy' : '1-Timoteo'), chapters: 6 },
    { name: (language === 'en' ? '2-Timothy' : '2-Timoteo'), chapters: 4 },
    { name: (language === 'en' ? 'Titus' : 'Tito'), chapters: 3 },
    { name: (language === 'en' ? 'Philemon' : 'Filemon'), chapters: 1 },
    { name: (language === 'en' ? 'Hebrews' : 'Hebreos'), chapters: 13 },
    { name: (language === 'en' ? 'James' : 'Santiago'), chapters: 5 },
    { name: (language === 'en' ? '1-Peter' : '1-Pedro'), chapters: 5 },
    { name: (language === 'en' ? '2-Peter' : '2-Pedro'), chapters: 3 },
    { name: (language === 'en' ? '1-John' : '1-Juan'), chapters: 5 },
    { name: (language === 'en' ? '2-John' : '2-Juan'), chapters: 1 },
    { name: (language === 'en' ? '3-John' : '3-Juan'), chapters: 1 },
    { name: (language === 'en' ? 'Jude' : 'Judas'), chapters: 1 },
    { name: (language === 'en' ? 'Revelation' : 'Apocalipsis'), chapters: 22 }
];







  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  })

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
    setView('chapters');
  };

  const handleChapterPress = async (chapter: number) => {
    if (selectedBook) {
      setLoading(true); // Start loading
              const response = await fetch(
          language === 'en'
            ? `https://bible-api.deno.dev/api/read/kjv/${selectedBook.name.toLowerCase()}/${chapter}`
            : `https://bible-api.deno.dev/api/read/rv1960/${selectedBook.name.toLowerCase()}/${chapter}`
        );
      const data = await response.json();
      setVerses(data.vers);
      setSelectedChapter(chapter);
      setView('verses');
      setLoading(false); // Stop loading
    }
  };

  const { setCursorPosition, setActiveTextField } = useStore();

  const handleSelectionChange = (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    setCursorPosition(e.nativeEvent.selection.start);
  };

  const handleVersePress = (verseNumber: number) => {
    if (!selectedBook || selectedChapter === null) return;

    const verseReference = `${selectedBook.name} ${selectedChapter}:${verseNumber}`;
    const {
      activeTextField,
      setName,
      setName2,
      setName3,
      setName4,
      setName5,
      cursorPosition,
    } = useStore.getState();

    const currentText = {
      name: useStore.getState().name,
      name2: useStore.getState().name2,
      name3: useStore.getState().name3,
      name4: useStore.getState().name4,
      name5: useStore.getState().name5,
    }[activeTextField];

    const beforeCursorText = currentText?.substring(0, cursorPosition) || '';
    const afterCursorText = currentText?.substring(cursorPosition) || '';
    const newText = `${beforeCursorText}${verseReference}${afterCursorText}`;

    switch (activeTextField) {
      case 'name':
        setName(newText);
        break;
      case 'name2':
        setName2(newText);
        break;
      case 'name3':
        setName3(newText);
        break;
      case 'name4':
        setName4(newText);
        break;
      case 'name5':
        setName5(newText);
        break;
    }

    setModalVisible(false);
  };

  const handleBackPress = () => {
    if (view === 'verses') {
      setView('chapters');
      setSelectedChapter(null);
    } else if (view === 'chapters') {
      setView('books');
      setSelectedBook(null);
    }
  };

  const filteredBooks = booksOfTheBible.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#222222', dark: '#222222' }}
        headerImage={
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">{language === 'en' ? 'Devotional' : 'Devocional'}</ThemedText>
          <HelloWave />
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
    <View>
      {isEditing ? (
        <TextInput
          value={title1}
          onChangeText={setTitle1}
          onSubmitEditing={() => setIsEditing(false)}
          style={styles.textInput}
        />
      ) : (
        <Text style={styles.title}>{title1}</Text>
      )}
    </View>
          <TextInput onSelectionChange={handleSelectionChange} value={name} placeholder='' multiline={true} style={styles.textInput} onChangeText={setName} onFocus={() => useStore.getState().setActiveTextField('name')}/>
        </ThemedView>
        <ThemedView style={styles.stepContainer}>
              <View>
      {isEditing ? (
        <TextInput
          value={title2}
          onChangeText={setTitle2}
          onSubmitEditing={() => setIsEditing(false)}
          style={styles.textInput}
        />
      ) : (
        <Text style={styles.title}>{title2}</Text>
      )}
    </View>
          <TextInput onSelectionChange={handleSelectionChange} value={name2} placeholder='' multiline={true} style={styles.textInput} onChangeText={setName2} onFocus={() => useStore.getState().setActiveTextField('name2')}/>
        </ThemedView>
        {/* PROMESA */}
        <ThemedView style={styles.stepContainer}>
    <View>
      {isEditing ? (
        <TextInput
          value={title3}
          onChangeText={setTitle3}
          onSubmitEditing={() => setIsEditing(false)}
          style={styles.textInput}
        />
      ) : (
        <Text style={styles.title}>{title3}</Text>
      )}
    </View>
          <TextInput onSelectionChange={handleSelectionChange} value={name3} placeholder='' multiline={true} style={styles.textInput} onChangeText={setName3} onFocus={() => useStore.getState().setActiveTextField('name3')}/>
        </ThemedView>
        {/* APLICACION */}
  <ThemedView style={styles.stepContainer}>
    <View>
      {isEditing ? (
        <TextInput
          value={title4}
          onChangeText={setTitle4}
          onSubmitEditing={() => setIsEditing(false)}
          style={styles.textInput}
        />
      ) : (
        <Text style={styles.title}>{title4}</Text>
      )}
    </View>
          <TextInput onSelectionChange={handleSelectionChange} value={name4} placeholder='' multiline={true} style={styles.textInput} onChangeText={setName4} onFocus={() => useStore.getState().setActiveTextField('name4')}/>
  </ThemedView>
        {/* AGRADECIMIENTOS */}
        <ThemedView style={styles.stepContainerLast}>
        <View>
      {isEditing ? (
        <TextInput
          value={title5}
          onChangeText={setTitle5}
          onSubmitEditing={() => setIsEditing(false)}
          style={styles.textInput}
        />
      ) : (
        <Text style={styles.title}>{title5}</Text>
      )}
    </View>
          <TextInput  onSelectionChange={handleSelectionChange} value={name5} placeholder='' multiline={true} style={styles.textInput} onChangeText={setName5} onFocus={() => useStore.getState().setActiveTextField('name5')}/>
        </ThemedView>
      </ParallaxScrollView>


      <View style={styles.buttonHomeContainer}>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>
          {selectedBook ? selectedBook.name : (language === 'en' ? 'Choose reference' : 'Escojer referencia')}
        </Text>
      </TouchableOpacity>

  <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
    <Text style={styles.switchContainer}>
      {isEditing ? (language === 'en' ? 'Edit titles 🟢' : 'Editar titulos 🟢') : (language === 'en' ? 'Edit titles ❌' : 'Editar titulos ❌')}
    </Text>
  </TouchableOpacity>


      </View>

      <Modal
  visible={modalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => {
    setModalVisible(false);
    setChaptersVisible(false);
  }}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {view === 'books' && (
        <TextInput
          style={styles.searchBar}
          placeholder={language === 'en' ? 'Search' : 'Buscar'}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery} // This updates searchQuery in real-time
        />
      )}

      {loading ? ( // Show loading spinner if data is being fetched
        <ActivityIndicator size="large" color="#ffffff" />
      ) : view === 'chapters' && selectedBook ? (
        <ScrollView>
          <Text style={styles.bookTitle}>{selectedBook.name}</Text>
          {[...Array(selectedBook.chapters)].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleChapterPress(index + 1)}>
              <Text style={styles.chapterItem}>Capítulo {index + 1}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : view === 'verses' && selectedChapter && selectedBook ? (
        <ScrollView>
          <Text style={styles.bookTitle}>{`${selectedBook.name} - Capítulo ${selectedChapter}`}</Text>
          {verses.map((verse) => (
            <TouchableOpacity key={verse.id} onPress={() => handleVersePress(verse.number)}>
              <Text style={styles.chapterItem}><Text style={styles.verseID}>{verse.number}</Text> {verse.verse}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView>
          {filteredBooks.map((book, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleBookPress(book)}
            >
              <Text style={styles.bookItem}>{book.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <View style={styles.buttonContainer}>
        {view !== 'books' && (
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>{language === 'en' ? 'Back' : 'Atras'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>{language === 'en' ? 'Close' : 'Cerrar'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

<BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />

    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  stepContainerLast: {
    gap: 8,
    marginBottom: 70,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  textInput: {
    backgroundColor: 'black',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    flexWrap: 'wrap',
    lineHeight: 21,
    fontSize: 17,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    marginTop: 80,
    marginBottom: 80,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 20,
  },
  bookItem: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 10,
  },
  bookTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chapterItem: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 10,
  },
  closeButton: {
    // marginTop: 20,
    backgroundColor: '#222222',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  backButton: {
    // marginBottom: 10,
    backgroundColor: '#222222',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',  // Places the buttons side by side
    justifyContent: 'space-between',  // Adjusts the space between the buttons
  },
  verseID: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  switchContainer: {
    backgroundColor: '#222222',
    padding: 14,
    borderRadius: 50,
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
    
  },
  buttonHomeContainer: {
    paddingTop: 7,
    paddingBottom: 7, 
    backgroundColor: '#0c0c0c',
    gap: 10,
    // marginLeft: 20,
    // marginRight: 20, 
    flexDirection: 'row',  // Places the buttons side by side
    justifyContent: 'center',  // Adjusts the space between the buttons
  },
  button: {
    // position: 'absolute',
    // bottom: 10,
    // left: 80,
    // right: 80,
    backgroundColor: '#222222',
    padding: 14,
    borderRadius: 50,
    // alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 17,
  },
  searchBar: {
    backgroundColor: '#222',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
});