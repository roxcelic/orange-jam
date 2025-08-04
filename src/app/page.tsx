"use client"
import { useState, useEffect } from 'react'
import React from 'react';
import ReactDOM from "react-dom";
import Draggable from 'react-draggable';

import pageAboutMe, {exec as aboutMeExec} from './pages/aboutme';
import PageHome from './pages/home.md';

import MainPage from './comp/mainPage';

// pages
let pages = {
  "Home": [<PageHome />],
  "about me": [pageAboutMe(), () => aboutMeExec()]
}
// main
export default function Home() {
  const [currentPage, setLikes] = useState(Object.keys(pages)[0]);

  function changePage(page: string) {
    if (pages[currentPage].length > 2) pages[currentPage][2]();
    setLikes(page);
    if (pages[currentPage].length > 1) pages[currentPage][1]();
  }

  let content = pages[currentPage][0];
  let titlebar = Object.keys(pages).map((page) => {
    return (
      <button onClick={() => changePage(page)} key={page} className={page == currentPage ? "titleBarSelected" : "meh"}>
        {page}
      </button>
    );
  })
  
  return (
    <div>
      <MainPage 
        currentPage = {currentPage}
        titlebar = {titlebar}
        contnet = {content}
      />
    </div>
  );
}
