import styles from './page.module.css';
import NpmSearchComponent from './components/npm-search';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <NpmSearchComponent/>
      </div>
    </main>
  );
}
