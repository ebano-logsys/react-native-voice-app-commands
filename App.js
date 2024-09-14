/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import type {Node} from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {useVoiceRecognition} from './useVoiceRecognition';
import Tts from 'react-native-tts';

const App: () => Node = () => {
  const {state, startRecognizing, stopRecognizing, destroyRecognizer} =
    useVoiceRecognition([
      {
        command: 'Juan confirma mi viaje',
        callback: () => {
          Tts.speak('Tu viaje ha sido confirmado', {
            androidParams: {
              KEY_PARAM_PAN: -1,
              KEY_PARAM_VOLUME: 0.5,
              KEY_PARAM_STREAM: 'STREAM_MUSIC',
            },
          });
        },
      },
    ]);

  useEffect(() => {
    Tts.getInitStatus().then(() => {
      Tts.speak('Hola, ¿Cómo puedo ayudarte hoy?');
    });
  }, []);
  useEffect(() => {
    return () => {
      destroyRecognizer().then(r => console.log('destroyed'));
    };
  }, []);
  return (
    <SafeAreaView>
      <Text>Comandos disponibles para usar: </Text>
      <Text>1. Juan Confirma mi viaje</Text>
      <Text>Comando: {state.results}</Text>
      <TouchableOpacity
        style={{marginTop: 30}}
        onPress={state.isRecording ? stopRecognizing : startRecognizing}>
        <Text>
          {state.isRecording ? 'Stop Recognition' : ' Start Recognition'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;
