import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./components/AuthProvider.jsx";
import createStore from "./Store/store.jsx";
import { Provider } from "react-redux";

const store = createStore();
console.log("Store", store.getState());
store.subscribe(() => {
  console.log("Updated store", store.getState());
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </BrowserRouter>
);
