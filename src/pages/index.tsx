import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/home.module.css";

import heroImg from "../../public/assets/hero.png";
import { GetStaticProps } from "next";

import { getDocs, collection } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

type HomeProps = {
  posts: number;
  comments: number;
}

export default function Home({ posts, comments }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Na(Tasks)+ | Organize suas tarefas de forma fácil</title>
      </Head>
     
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image 
            className={styles.hero}
            alt="Logo Na(Tasks)+"
            src={heroImg}
            priority
          />
        </div>
        <h1 className={styles.title}>
          Sistema feito para você organizar<br/>
          seus estudos e tarefas
        </h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{posts} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{comments} comentários</span>
          </section>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {

  //Buscar do banco os números e mandar para o componente
  const commentRef = collection(db, "comments");
  const postsRef = collection(db, "tasks");

  const commentSnapshot = await getDocs(commentRef);
  const postsSnapshot = await getDocs(postsRef);

  return {
    props: {
      posts: postsSnapshot.size || 0,
      comments: commentSnapshot.size || 0
    },
    revalidate: 60 // Será revalidaddo a página estática a cada 60 segundos
  }
}