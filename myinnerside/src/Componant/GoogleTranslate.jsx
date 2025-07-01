import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Add Google Translate script to the document
    const addScript = () => {
      const script = document.createElement('script');
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    // Define the global callback function for Google Translate  

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        //   includedLanguages: 'en,hi',
        },
        'google_translate_element'
      );
    };

    if (!document.querySelector('script[src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]')) {
      addScript();
    } else {
      // If script already loaded, initialize directly
      window.googleTranslateElementInit();
    }
  }, []);

  // Language change handler
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div>
      

     
      <div id="google_translate_element"style={{display:"block"}} ></div>
    

    </div>
  );
};

export default GoogleTranslate;
