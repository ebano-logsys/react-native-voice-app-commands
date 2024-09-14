import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from '@react-native-voice/voice';

import {useCallback, useEffect, useState} from 'react';


const INITIAL_STATE = {
  recognized: false,
  pitch: '',
  error: '',
  end: false,
  started: false,
  results: '',
  partialResults: [],
  isRecording: false,
};
export const useVoiceRecognition = commands => {
  const [state, setState] = useState(INITIAL_STATE);

  const resetState = useCallback(() => setState(INITIAL_STATE), [setState]);

  const startRecognizing = useCallback(async () => {
    resetState();
    try {
      await Voice.start('es-MX', {continuous: true});
    } catch (e) {
      console.error(e);
    }
  }, [resetState]);

  const stopRecognizing = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const destroyRecognizer = useCallback(async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    resetState();
  }, [resetState]);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      setState(prevState => ({...prevState, started: true, isRecording: true}));
    };
    Voice.onSpeechRecognized = () => {
      setState(prevState => ({...prevState, recognized: true}));
    };
    Voice.onSpeechEnd = () => {
      setState(prevState => ({...prevState, end: true, isRecording: false}));
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setState(prevState => ({...prevState, error: JSON.stringify(e.error)}));
    };
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (!e.value) {
        return;
      }
      setState(prevState => ({...prevState, results: e.value[0]}));
    };
    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (!e.value) {
        return;
      }
      setState(prevState => ({
        ...prevState,
        partialResults: e.value,
      }));
    };
    Voice.onSpeechVolumeChanged = (e: any) => {
      setState(prevState => ({...prevState, pitch: e.value}));
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    commands.forEach(command => {
      if (command.command === state.results) {
        command.callback();
        destroyRecognizer().then(() => console.log('destroyed'));
      }
    });
  }, [state, destroyRecognizer, commands]);
  return {
    state,
    startRecognizing,
    stopRecognizing,
    destroyRecognizer,
  };
};
