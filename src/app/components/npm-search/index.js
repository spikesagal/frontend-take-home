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
  const [simulateBadResponse, setSimulateBadResponse] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const url = simulateBadResponse ? 'https://api.npms.io/v2/oops' : `https://api.npms.io/v2/search/suggestions?q=${debouncedQueryText}`;
        const resp = await fetch(url);
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
      <label>Simulate bad response</label>
      <input
        type="checkbox"
        checked={simulateBadResponse}
        onChange={() => setSimulateBadResponse(!simulateBadResponse)}
      />
      <br/>

      <input
        data-testid="search"
        type="text"
        value={queryText}
        placeholder="Search npm modules..."
        onChange={(evt) => setQueryText(evt.target.value)}
      />
      <ul className={styles.Results}>
        {error && (
          <li
            data-testid="error"
            key="error"
            className={styles.Error}
          >
            {error}
          </li>
        )}
        {results.map(result => {
          // Assuming name is always present and unique, can be used as key
          // Description and links are optional
          const {name, description = '', version, links: {npm = ''} = {npm: ''}} = result.package;
          return (
            <li
              data-testid="result"
              key={name}
            >
              <a href={npm}>
                <div>
                  <span data-testid="package">
                    {name}
                  </span>
                  <span data-testid="version">
                    {version}
                  </span>
                </div>
                <div data-testid="description">
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
