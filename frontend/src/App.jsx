import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import GetAllBooks from "./api/GetAllBooks";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LanmanChapterPage from "./pages/lanman/LanmanChapterPage";
import LanmanTableOfContents from "./pages/lanman/LanmanTableOfContents";

import MacdonnellChapterPage from "./pages/macdonnell/MacdonnellChapterPage";
import MacdonnellTableOfContents from "./pages/macdonnell/MacdonnellTableOfContents";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Transliterate from "./pages/Transliterate";
import DictionarySearch from "./pages/DictionarySearch";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* home route */}
          <Route path="/" element={<Home />} />
          {/* lanman routes */}
          <Route
            path="lanman/chapter/:chapterNo"
            element={<LanmanChapterPage />}
          />
          <Route path="/lanman/toc" element={<LanmanTableOfContents />} />

          {/* macdonnell routes */}
          <Route
            path="/macdonnell/chapter/:chapterNo"
            element={<MacdonnellChapterPage />}
          />
          <Route
            path="/macdonnell/toc"
            element={<MacdonnellTableOfContents />}
          />

          {/* resources and other pages route */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/transliterate" element={<Transliterate />} />
          <Route path="/dictionary" element={<DictionarySearch />} />

          {/* not found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>

      {/* <GetAllBooks/> */}
    </>
  );
}

export default App;
