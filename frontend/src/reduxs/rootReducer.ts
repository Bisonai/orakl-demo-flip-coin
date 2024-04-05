import { combineReducers } from '@reduxjs/toolkit'
import { accountReducer } from './accounts/account.reducers';

const rootReducer = combineReducers({
    account: accountReducer,
})

export default rootReducer;