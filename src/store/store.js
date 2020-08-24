import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import rootReducer from "./rootReducer";
const persistConfig = {
  key: "todo-test",
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export default () => {
  let configureStore = createStore(persistedReducer);
  let persistor = persistStore(configureStore);
  return { configureStore, persistor };
};
