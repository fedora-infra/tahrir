import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { data } from "./features/data.js";
import ModeWrap from "./components/modewrap.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";
import MainArea from "./components/mainarea.jsx";
import Accolade from "./components/accolade.jsx";
import Identity from "./components/identity.jsx";
import AccoList from "./components/accolist.jsx";
import Mistaken from "./components/mistaken.jsx";
import Recently from "./components/recently.jsx";
import UserPast from "./components/userpast.jsx";

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
