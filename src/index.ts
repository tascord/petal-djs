import Petal from './classes/Petal';
import PetalEvent from './classes/PetalEvent';
import PetalButton from './classes/PetalButton';
import PetalSelect from './classes/PetalSelect';

import PetalCommand, { PetalCommandResponse } from './classes/PetalCommand';
import { Store, get_all_database_values, get_database } from './classes/PetalStorage';

const PetalStorage = {
    Store, get_all_database_values, get_database
}

export {

    Petal,
    PetalCommand,
    PetalEvent,
    PetalCommandResponse,
    PetalButton,
    PetalSelect,
    PetalStorage,

}