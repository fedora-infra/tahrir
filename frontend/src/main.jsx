import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";

import ModeWrap from "./components/modewrap.jsx";
import { data } from "./features/data.js";
import Accolade from "./routes/accolade.jsx";
import AccoList from "./routes/accolist.jsx";
import Addendum from "./routes/addendum.jsx";
import Callback from "./routes/callback.jsx";
import Campaign from "./routes/campaign.jsx";
import Category from "./routes/category.jsx";
import FindPage from "./routes/findpage.jsx";
import Governor from "./routes/governor.jsx";
import Homepage from "./routes/homepage.jsx";
import Identity from "./routes/identity.jsx";
import MainArea from "./routes/mainarea.jsx";
import Mistaken from "./routes/mistaken.jsx";
import Rankings from "./routes/rankings.jsx";
import Rarities from "./routes/rarities.jsx";
import Recently from "./routes/recently.jsx";
import UserPast from "./routes/userpast.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={data}>
    <ModeWrap>
      <BrowserRouter>
        <Routes>
          <Route element={<Callback />} path="/callback" />
          <Route element={<MainArea />} path="/">
            <Route element={<Homepage />} index />
            <Route element={<Addendum />} path="addendum" />
            <Route element="" path="/profiles" />
            <Route element="" path="/userdata" />
            <Route element="" path="/operator" />
            <Route element="" path="/database" />
            <Route element="" path="/settings" />
            <Route element={<AccoList />} path="assembly" />
            <Route element={<Recently />} path="recently" />
            <Route path="rankings">
              <Route element={<Rankings />} index />
              <Route element={<Rankings />} path="range" />
              <Route path="y/:y">
                <Route element={<Rankings />} index />
                <Route path="m/:m">
                  <Route element={<Rankings />} index />
                  <Route path="d/:d">
                    <Route element={<Rankings />} index />
                    <Route element={<Rankings />} path="week" />
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route element={<Category />} path="category/:slugdata" />
            <Route element={<FindPage />} path="discover/:slugdata" />
            <Route element={<Accolade />} path="accolade/:slugdata" />
            <Route element={<Identity />} path="identity/:slugdata" />
            <Route element={<UserPast />} path="userpast/:slugdata" />
            <Route element={<Rarities />} path="rarities/:slugdata" />
            <Route element={<Campaign />} path="campaign" />
            <Route element={<Governor />} path="governor" />
            <Route element={<Mistaken />} path="*" />
          </Route>
        </Routes>
      </BrowserRouter>
    </ModeWrap>
  </Provider>
);
