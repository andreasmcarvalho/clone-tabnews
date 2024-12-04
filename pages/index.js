import Head from 'next/head';
import styles from './index.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Para Gabrielle ❤️</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={styles.card}>
        <h1 className={styles.title}>Gabrielle, eu te amo! ❤️</h1>
        <p className={styles.text}>Você é a pessoa mais especial do meu mundo.</p>
        <div className={styles.heart}>❤️</div>
      </div>
    </div>
  );
}
