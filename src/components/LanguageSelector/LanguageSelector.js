import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import withHover from '../../withHover';
// import { useHover } from '../../useHover';

const LanguageSelector = () => {
  const [title, setTitle] = useState('ua');
  const ref = useRef();
  // const on = useHover(ref.current);

  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    const title = event.target.title;
    const language = title === 'ua' ? 'gb' : 'ua';
    const change = title === 'ua' ? 'ua' : 'gb';

    setTitle(language);
    i18n.changeLanguage(change);
  };
  // console.log('on', on);
  return (
    <div ref={ref}>
      <img
        alt={title}
        src={`https://flagcdn.com/16x12/${title}.png`}
        data-testid="change-language"
        title={title}
        onClick={(event) => {
          changeLanguage(event);
        }}
      />
    </div>
  );
};

export default LanguageSelector;
// export default withHover(LanguageSelector);
