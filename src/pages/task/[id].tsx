import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";

import { db } from "@/services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";

import { Textarea } from "@/components/textarea";

type TaskProps = {
    item: {
        id: string;
        user: string;
        created: string;
        task: string;
        public: boolean;
    }
}

export default function Task({ item }: TaskProps) {

    return (
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.task}>
                    <p>{item.task}</p> 
                </article>
            </main>

            <section className={styles.commentsContainer}>
                <h2>Deixar comentário</h2>
                <form>
                    <Textarea 
                        placeholder="Digite seu comentário..."
                    />
                    <button className={styles.button}>Enviar comentário</button>
                </form>
            </section>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const id = params?.id as string;

    const docRef = doc(db, "tasks", id);
    
    const snapshot = await getDoc(docRef);

    if(snapshot.data() === undefined) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    if(!snapshot.data()?.public) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    const milliseconds = snapshot.data()?.created?.seconds * 1000;

    const task = {
        taskId: id, 
        user: snapshot.data()?.user,
        created: new Date(milliseconds).toLocaleDateString(),
        task: snapshot.data()?.task,
        public: snapshot.data()?.public
    }

    return {
        props: {
            item: task
        }
    }
}