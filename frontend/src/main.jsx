import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";

import ModeWrap from "./components/modewrap.jsx";
import { data } from "./features/data.js";
import Accolade from "./routes/accolade.jsx";
import AccoList from "./routes/accolist.jsx";
import Identity from "./routes/identity.jsx";
import MainArea from "./routes/mainarea.jsx";
import Mistaken from "./routes/mistaken.jsx";
import Recently from "./routes/recently.jsx";
import UserPast from "./routes/userpast.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={data}>
    <ModeWrap>
      <BrowserRouter>
        <Routes>
          <Route element={<MainArea />} path="/">
            <Route element="" index />
            <Route element="" path="/rankings" />
            <Route element="" path="/profiles" />
            <Route element="" path="/userdata" />
            <Route element="" path="/operator" />
            <Route element="" path="/database" />
            <Route element="" path="/settings" />
            <Route path="/discover">
              <Route element="" index />
              <Route element="" path="category/:slugdata" />
              <Route element={<AccoList />} path="accolade" />
              <Route element={<Recently />} path="recently" />
              <Route element={<Accolade />} path="accolade/:slugdata" />
              <Route element={<Identity />} path="identity/:slugdata" />
              <Route element={<UserPast />} path="userpast/:slugdata" />
            </Route>
            <Route element={<Mistaken />} path="*" />
          </Route>
        </Routes>
      </BrowserRouter>
    </ModeWrap>
  </Provider>
);
