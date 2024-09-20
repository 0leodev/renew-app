import React, { useState, useRef } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
import { StyleSheet, ActivityIndicator, View, Platform, Button, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as Clipboard from 'expo-clipboard';
import ButtonC from '@/components/ButtonCustom';
import useStore from '@/components/store';
import axios from 'axios';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1037738454909392/7716957151';

export default function TabTwoScreen() {
  const { name, name2, name3, name4, name5 } = useStore();
  const { title1, title2, title3, title4, title5 } = useStore();
  const [loading, setLoading] = useState(false);
  const bannerRef = useRef<BannerAd>(null);

  const { language, setLanguage } = useStore((state) => ({
    language: state.language,
    setLanguage: state.setLanguage,
  }));

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded (https://groups.google.com/g/google-admob-ads-sdk/c/rwBpqOUr8m8).
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  })

  const fetchBibleVerse = async (book: string, chapter: string, verse: string, range?: string) => {
    // Access global state or context for the language
    const idiom = language;
  
    // Determine the version based on the language
    const version = idiom === 'en' ? 'kjv' : 'rv1960';
    const url = range
      ? `https://bible-api.deno.dev/api/read/${version}/${book}/${chapter}/${verse}-${range}`
      : `https://bible-api.deno.dev/api/read/${version}/${book}/${chapter}/${verse}`;
  
    try {
      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        return response.data.map(verseObj => `<b>${verseObj.number}</b> ${verseObj.verse}`).join(' ');
      } else {
        return `<b>${response.data.number}</b> ${response.data.verse}`;
      }
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      return 'Error fetching verse';
    }
  };

  const parseBibleReferences = async (text: string) => {
    const bibleRefRegex = /(\w+[-\w]*|\d+[-\w]*|\d+)\s(\d+):(\d+)(?:-(\d+))?/g;
    const fetchedReferences: { [key: string]: string } = {};
    let match;
    let newText = text;

    while ((match = bibleRefRegex.exec(text)) !== null) {
      const [fullMatch, book, chapter, verse, range] = match;
      const refKey = `${book} ${chapter}:${verse}${range ? `-${range}` : ''}`;

      if (!fetchedReferences[refKey]) {
        const fetchedVerse = await fetchBibleVerse(book, chapter, verse, range);
        const styledFetchedVerse = 
          `<span style="background-color: rgb(173, 216, 230); color: black;">${fullMatch}</span>` +
          `<span style="background-color: rgba(173, 216, 230, 0.774); color: black;"> [ ${fetchedVerse} ]</span>`;
        fetchedReferences[refKey] = styledFetchedVerse;
        newText = newText.replace(fullMatch, styledFetchedVerse);
      } else {
        const styledRefOnly = `<span style="background-color: rgba(173, 216, 230, 0.3); color: black;">${fullMatch}</span>`;
        newText = newText.replace(fullMatch, styledRefOnly);
      }
    }

    return newText;
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const generatePdf = async () => {
    setLoading(true); // Show loading indicator
    try {
      const parsedName = await parseBibleReferences(name);
      const parsedName2 = await parseBibleReferences(name2);
      const parsedName3 = await parseBibleReferences(name3);
      const parsedName4 = await parseBibleReferences(name4);
      const parsedName5 = await parseBibleReferences(name5);

      const html = 
        `<html>
          <head>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
            <style>
              body {
                align-items: center;
                justify-content: center;
                background-color: rgb(32, 51, 62);
                font-family: 'Montserrat', sans-serif;
                margin: 50px;
              }
              h1 {
                background-color: rgba(0, 0, 0, 0.263);
                padding: 13px;
                align-items: center;
                color: rgba(255, 255, 255, 0.514);
                text-align: center;
                font-size: 35px;
                margin: 0px;
              }
              h2 {
                background-color:rgba(0, 0, 0, 0.475);
                padding: 13px;
                color: rgba(255, 255, 255, 0.514);
                font-size: 25px;
                margin: 0px;
              }
              p {
                background-color: rgba(0, 0, 0, 0.263);
                padding: 20px;
                color: white;
                overflow-wrap: break-word;
                font-size: 15px;
                margin: 0px;
              }
            </style>
          </head>
          <body>
            <h1>DEVOCIONAL</h1>
            <h2>${title1}</h2>
            <p>${parsedName}</p>
            <h2>${title2}</h2>
            <p>${parsedName2}</p>
            <h2>${title3}</h2>
            <p>${parsedName3}</p>
            <h2>${title4}</h2>
            <p>${parsedName4}</p>
            <h2>${title5}</h2>
            <p>${parsedName5}</p>
          </body>
        </html>`;

      if (Platform.OS === 'web') {
        // Web-specific logic: use an anchor element to download HTML as a PDF
        const blob = new Blob([html], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'devocional.html';
        link.click();
      } else {
        // Native-specific logic (Android/iOS)
        const file = await printToFileAsync({
          html: html,
          base64: false,
        });

        const newFilePath = FileSystem.documentDirectory + 'devocional.pdf';
        await FileSystem.moveAsync({
          from: file.uri,
          to: newFilePath,
        });

        await shareAsync(newFilePath);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const copyTextToClipboard = async () => {
    setLoading(true); // Show loading indicator
    try {
      const parsedName = stripHtmlTags(await parseBibleReferences(name));
      const parsedName2 = stripHtmlTags(await parseBibleReferences(name2));
      const parsedName3 = stripHtmlTags(await parseBibleReferences(name3));
      const parsedName4 = stripHtmlTags(await parseBibleReferences(name4));
      const parsedName5 = stripHtmlTags(await parseBibleReferences(name5));

      const text = 
        `*DEVOCIONAL*\n\n` +
        `> *${title1}*\n${parsedName}\n\n` +
        `> *${title2}*\n${parsedName2}\n\n` +
        `> *${title3}*\n${parsedName3}\n\n` +
        `> *${title4}*\n${parsedName4}\n\n` +
        `> *${title5}*\n${parsedName5}`;

      await Clipboard.setStringAsync(text);
    } catch (error) {
      console.error('Error copying text:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <>
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#111111', dark: '#111111' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{language === 'en' ? 'Share' : 'Compartir'}</ThemedText>
      </ThemedView>
      <ThemedText>{language === 'en' ? 'Download and share your devotional.' : 'Descarga y comparte tu devocional.'}</ThemedText>
      <ButtonC text={language === 'en' ? 'generate PDF' : 'generar PDF'} onPress={generatePdf} />
      <ButtonC text={language === 'en' ? 'copy text' : 'copiar texto'} onPress={copyTextToClipboard} />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <ThemedText>Procesando...</ThemedText>
        </View>
      )}

      <ThemedView style={styles.titleContainerIdiomas}>
        <ThemedText type="title">{language === 'en' ? 'Language' : 'Idioma'}</ThemedText>
      </ThemedView>  

        <ButtonC text='English' onPress={() => setLanguage('en')} />
        <ButtonC text='Español' onPress={() => setLanguage('es')} />

    </ParallaxScrollView>
    <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  titleContainerIdiomas: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

