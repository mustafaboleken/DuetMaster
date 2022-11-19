import MidiDataTranslator from "./MidiDataTranslator.js";
import MidiStatusTranslator from "./MidiStatusTranslator.js";
import MIDI_STATUS from "./MidiStatus.js";

export default class MidiTranslator{
    constructor(statusTranslator = new MidiStatusTranslator(), dataTranslator = new MidiDataTranslator()) {
        this.statusTranslator = statusTranslator;
        this.dataTranslator = dataTranslator;
    }

    translate(msg){
        if(!msg || !Array.isArray(msg)){
            if(!msg || !msg.data || !Array.isArray(msg.data))
                throw new Error("Unrecognized message data format, MidiTranslator expects to get array with three values in range 0 - 255");
            msg = msg.data;
        }
        if(msg.length !== 3 || msg.some(byte => isNaN(+byte))){
            throw new Error("MidiTranslator translate() argument bad format expects array <0 - 255>[3]");
        }

        const status = this.statusTranslator.translate(msg[0]);
        const data1 = this.dataTranslator.translateFirstByte(status.status, msg[1]);
        const data2 = this.dataTranslator.translateSecondByte(status.status, msg[2]);

        const translated =  {
            ...status,
            ...data1,
            ...data2,
            original : msg,
        }
        translated.id = this._buildId(translated);
        return translated;
    }

    _buildId(translated){
        let msg = translated;
        let id = ""
        id += "CH:" + msg.channel;
        switch (msg.status){
            case MIDI_STATUS.NOTE_ON : {
                id += "-N_ON:" + msg.note;
                break;
            }
            case MIDI_STATUS.NOTE_OFF : {
                id += "-N_OFF:" + msg.note;
                break;
            }
            case MIDI_STATUS.CONTROL_CHANGE : {
                id += "-CC:" + msg.controller;
                break;
            }
            case MIDI_STATUS.PITCH_WHEEL_RANGE : {
                id += "-PW";
                break;
            }
            case MIDI_STATUS.POLYPHONIC_AFTER_TOUCHE: {
                id += "-PA:" + msg.note;
                break;
            }
            case MIDI_STATUS.PROGRAM_CHANGE:{
                id += "-PC";
                break;
            }
            case MIDI_STATUS.CHANNEL_AFTER_TOUCHE: {
                id += "-CA";
                break;
            }
            default: return id;
        }

        return id;
    }
}
