'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import styles from './styles.module.css';

const ERROR_MESSAGE = 'We\'re having trouble connecting to npm.';

export default function NpmSearchComponent() {
  const [queryText, setQueryText] = useState('');
  const [debouncedQueryText] = useDebounce(queryText, .5 * 1000);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const resp = await fetch(`https://api.npms.io/v2/search/suggestions?q=${debouncedQueryText}`);
        if (resp.status === 200) {
          setError(null);
          setResults(await resp.json());
        } else {
          setError(ERROR_MESSAGE);
        }
      } catch (e) {
        setError(ERROR_MESSAGE);
      }
    }

    if (debouncedQueryText) {
      fetchModules();
    }

  }, [debouncedQueryText]);

  return (
    <div className={styles.NpmSearch}>
      <input
        type="text"
        value={queryText}
        placeholder="Search npm modules..."
        onChange={(evt) => setQueryText(evt.target.value)}
      />
      <ul className={styles.Results}>
        {error && (
          <li key="error" className={styles.Error}>{error}</li>
        )}
        {results.map(result => {
          // Assuming name is always present and unique, can be used as key
          // Description and links are optional
          const {name, description = '', version, links: {npm = ''} = {npm: ''}} = result.package;
          return (
            <li key={name}>
              <a href={npm}>
                <div>
                  <span>
                    {name}
                  </span>
                  <span>
                    {version}
                  </span>
                </div>
                <div>
                  {description}
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  );
}
