import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { CurrentContent } from './CurrentContent';

export default function ScreenHome({ session }) {
  const [currentContent, setCurrentContent] = useState('dashboard');

  const handleSidebarButtonClick = (buttonId) => {
    setCurrentContent(buttonId);
  };

  return (
    <>
    <div className="homecontainer">
      <Sidebar onButtonClick={handleSidebarButtonClick} />
      <CurrentContent contentId={currentContent} session={session} />
    </div>
    </>
  );
}
