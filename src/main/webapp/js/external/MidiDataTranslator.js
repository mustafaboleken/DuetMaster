import MIDI_STATUS from "./MidiStatus.js";

export default class MidiDataTranslator{

    translateFirstByte(status, data){
        if(data < 0 || data > 127)
            throw new Error("Unrecognized midi message code");

        if([MIDI_STATUS.NOTE_ON,
            MIDI_STATUS.NOTE_OFF,
            MIDI_STATUS.POLYPHONIC_AFTER_TOUCHE].includes(status)){
            return {
                note : data,
            }
        } else if(status === MIDI_STATUS.CONTROL_CHANGE){
            return {
                controller : data
            }
        } else if(status === MIDI_STATUS.PROGRAM_CHANGE){
            return {
                program : data
            }
        } else if(status === MIDI_STATUS.CHANNEL_AFTER_TOUCHE){
            return {
                pressure : data,
            }
        } else if(status === MIDI_STATUS.PITCH_WHEEL_RANGE){
            return {
                value : data,
                lsb: data,
            }
        }else if(MIDI_STATUS.SYSTEM_EXCLUSIVE === status){
            return {
                vendorId: data,
            }
        }else if(MIDI_STATUS.SONG_POSITION_POINTER === status){
            return {
                lsb: data,
            }
        }else if(MIDI_STATUS.SONG_SELECT === status){
            return {
                song: data,
            }
        } else {
            return {
                data1 : data,
            }
        }
    }
    translateSecondByte(status, data){
        if(data < 0 || data > 127)
            throw new Error("Unrecognized midi message code");

        if([MIDI_STATUS.NOTE_ON,
            MIDI_STATUS.NOTE_OFF].includes(status)){
            return {
                velocity : data,
            }
        } else if(MIDI_STATUS.POLYPHONIC_AFTER_TOUCHE === status){
            return {
                pressure : data,
            }
        } else if(status === MIDI_STATUS.CONTROL_CHANGE){
            let res = {
                value : data,
                min: false,
                max: false,
                increment: 0,
                decrement: 0,
            }
            if(data > 64){
                res.increment =  data - 64;
                if(data === 127){
                    res.max = true;
                }
            } else {
                res.decrement = data;
                if(data === 63){
                    res.min = true;
                }
            }
            return res;
        } else if(
            [MIDI_STATUS.PROGRAM_CHANGE,
             MIDI_STATUS.CHANNEL_AFTER_TOUCHE].includes(status)){
            return {}
        } else if(MIDI_STATUS.PITCH_WHEEL_RANGE=== status){
            return {
                msb : data,
            }
        } else if(MIDI_STATUS.SYSTEM_EXCLUSIVE === status){
            return {
                eox: data,
                data: data,
            }
        } else if(MIDI_STATUS.SONG_POSITION_POINTER === status){
            return {
                msb: data,
            }
        } else {
            return {
                data2 : data,
            }
        }
    }
}

