
import MIDI_STATUS from "./MidiStatus.js";

export default class MidiStatusTranslator{
    translate(msg){
        if(msg instanceof Array){
            return this._getStatus(msg[0]);
        }
        return this._getStatus(msg);
    }

    _getStatus(code){
        if(code >= 128 && code <=143){
            return {
                status: MIDI_STATUS.NOTE_OFF,
                channel: code - 127,
            }
        } else if( code >= 144 && code <= 159){
            return {
                status: MIDI_STATUS.NOTE_ON,
                channel: code - 143,
            }
        } else if( code >= 160 && code <= 175){
            return {
                status: MIDI_STATUS.POLYPHONIC_AFTER_TOUCHE,
                channel: code - 159,
            }
        } else if( code >= 176 && code <= 191){
            return {
                status: MIDI_STATUS.CONTROL_CHANGE,
                channel: code - 175,
            }
        } else if( code >= 192 && code <= 207){
            return {
                status: MIDI_STATUS.PROGRAM_CHANGE,
                channel: code - 191,
            }
        } else if( code >= 208 && code <= 223){
            return {
                status: MIDI_STATUS.CHANNEL_AFTER_TOUCHE,
                channel: code - 207,
            }
        } else if( code >= 224 && code <= 239){
            return {
                status: MIDI_STATUS.PITCH_WHEEL_RANGE,
                channel: code - 223,
            }
        }else if( code === 240){
            return {
                status: MIDI_STATUS.SYSTEM_EXCLUSIVE,
            }
        }else if( code === 242){
            return {
                status: MIDI_STATUS.SONG_POSITION_POINTER,
            }
        }else if( code === 243){
            return {
                status: MIDI_STATUS.SONG_SELECT,
            }
        } else if([241, 244, 245].includes(code)){
            return {
                status: MIDI_STATUS.SYSTEM_COMMON,
            }
        }else if( code === 246){
            return {
                status: MIDI_STATUS.TUNE_REQUEST,
            }
        }else if( code === 247){
            return {
                status: MIDI_STATUS.END_SYSEX,
            }
        }else if( code === 248){
            return {
                status: MIDI_STATUS.TIMING_CLOCK,
            }
        }else if( code === 249){
            return {
                status: MIDI_STATUS.OTHER,
            }
        }else if( code === 250){
            return {
                status: MIDI_STATUS.START,
            }
        }else if( code === 251){
            return {
                status: MIDI_STATUS.CONTINUE,
            }
        }else if( code === 252){
            return {
                status: MIDI_STATUS.STOP,
            }
        }else if( code === 253){
            return {
                status: MIDI_STATUS.OTHER,
            }
        }else if( code === 254){
            return {
                status: MIDI_STATUS.ACTIVE_SENSING,
            }
        }else if( code === 255){
            return {
                status: MIDI_STATUS.RESET,
            }
        } else {
            throw new Error("Unrecognized midi message code")
        }
    }
}
