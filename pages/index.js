import Head from "next/head";
import Link from "next/link";
import { getDatabase } from "../lib/notion";
import { Text } from "./[id].js";
import styles from "./index.module.css";

export const databaseId = process.env.NOTION_DATABASE_ID;

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>せんべろブログ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.container}>
        <header className={styles.header}>
          <h1>せんべろブログ</h1>
          <p>ご覧いただきありがとうございます。本ブログは不定期に更新されます。</p>
        </header>

        <h2 className={styles.heading}>全ての投稿</h2>
        <ol className={styles.posts}>
          {posts.map((post) => {
            // Dateが存在する場合にのみ日付をフォーマットする
            const date = post.properties.Date?.date?.start
            ? new Date(post.properties.Date.date.start).toLocaleDateString("ja", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "日付未定";
            if(post.properties.Status.select.name !== '公開' || !post.properties.Title.title[0]) {
              return <div />
            }
            return (
              <li key={post.id} className={styles.post}>
                <Link href={`/${post.id}`}>
                  <a>
                    {/* Display title */}
                    <h3>  
                      <Text text={post.properties.Title.title} />
                    </h3>
                    <p className={styles.postDescription}>
                      {/* Display poting day */}
                      <div className={styles.postDate}>
                        <span>投稿日: </span>
                        {date}
                      </div>
                      {/* Display tags */}
                      <div className={styles.postTags}>
                        <span className={styles.postTagsTitle}>タグ:</span>
                        {post.properties.Tag.multi_select.map((tag) => (
                          <>
                            {' '}
                            <span key={tag.id} className={styles.tag}>
                              {tag.name}
                            </span>
                            {','}
                          </>
                        ))}
                      </div>
                    </p>
                    <p>続きを読む →</p>
                </a>
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}

//ISRを追加
export const getStaticProps = async () => {
  const database = await getDatabase(databaseId);

  return {
    props: {
      posts: database,
    },
    revalidate: 1,
  };
};
