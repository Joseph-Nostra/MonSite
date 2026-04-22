import { useEffect } from 'react';

const useDocTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | MonSite`;
  }, [title]);
};

export default useDocTitle;
