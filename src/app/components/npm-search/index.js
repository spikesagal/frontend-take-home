'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import styles from './styles.module.css';

export default function NpmSearchComponent() {
  const [queryText, setQueryText] = useState('');
  const [debouncedQueryText] = useDebounce(queryText, .5 * 1000);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      console.log(debouncedQueryText);
      const resp =  await fetch(`https://api.npms.io/v2/search/suggestions?q=${debouncedQueryText}`);
      setResults(await resp.json());
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
        {results.map(result => {
          const {name, description, version, links: {npm}} = result.package;
          return (
            <li>
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

      <button type="submit">Search</button>
    </div>
  );
}
