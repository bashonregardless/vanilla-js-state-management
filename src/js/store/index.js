import actions from './actions.js';
import mutations from './mutations.js';
import state from '../../../stateJSON.json';
import Store from './store.js';

export default new Store({
    actions,
    mutations,
    state,
});
