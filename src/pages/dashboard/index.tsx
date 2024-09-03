import { getSession }  from "next-auth/react";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import styles from "./styles.module.css";
import Head from "next/head";
import { GetServerSideProps } from "next";

import { Textarea } from "@/components/textarea";
import { FiShare2 } from "react-icons/fi"
import { FaTrash } from "react-icons/fa"

import { db } from "@/services/firebaseConnection";
import { collection, addDoc, getDocs, query, orderBy, where, onSnapshot, deleteDoc, doc, getDoc } from "firebase/firestore";
import Link from "next/link";

type DashboardProps = {
  user: {
    email: string
  }
}

type TaskProps = {
  id: string;
  task: string;
  public: boolean;
  user: string;
  created: Date;
}

export default function Dashboard({ user }: DashboardProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if(input === "") return;

    try {
      await addDoc(collection(db, "tasks"), {
        task: input,
        public: publicTask,
        user: user?.email,
        created: new Date()
      })

      setInput("");
      setPublicTask(false);

    }
    catch(error) {
      console.log(error);
    }
    
  }

  async function handleDeleteCommentsFromTask(id: string) {
      const commentsDeleteRef = doc(db, "comments", id)
      await deleteDoc(commentsDeleteRef); 
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tasks", id);

    // pegando a tarefa que quero excluir para verificar se ela é pública
    const taskDoc = await getDoc(docRef);
    const taskData = taskDoc.data();

    // Removendo comentários das tarefas públicas excluidas
    if(taskData?.public) {
      const commentsRef = collection(db, "comments");
      const queryComment = query(commentsRef, where("taskId", "==", id));
      const snapshotComments = await getDocs(queryComment);
      snapshotComments.forEach(async (item) => {
        handleDeleteCommentsFromTask(item.id);
      });
    }
    

    // Por fim excui a tarefa
    await deleteDoc(docRef);
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/task/${id}`);

    alert("URL COPIADA COM SUCESSO!");
  }

  useEffect(() => {
    async function loadTasks() {
      const tasksRef = collection(db, "tasks");
      const taskQuery = query(
        tasksRef, 
        orderBy("created", "desc"),
        where("user", "==", user?.email),
      )

      onSnapshot(taskQuery, (snapshot) => {
        const list = [] as TaskProps[];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            task: doc.data().task,
            public: doc.data().public,
            user: doc.data().user,
            created: doc.data().created,
          });
        })

        setTasks(list);
      })
    }

    loadTasks();
  }, [user?.email])

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>

            <form onSubmit={handleRegisterTask}>
              <Textarea 
                placeholder="Digite qual sua tarefa..."
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  id="checkbox"
                  className={styles.checkbox} 
                  checked={publicTask}
                  onChange={ handleChangePublic }
                />
                <label htmlFor="checkbox">Deixar tarefa pública?</label>
              </div>

              <button className={styles.button} type="submit">
                Registrar
              </button>

            </form>

          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>

          {tasks.length === 0 && (
            <span>Você não possui tarefas cadastradas!</span>
          )}

          {tasks.map((taskItem) => (
            <article className={styles.task} key={taskItem.id}>

              {taskItem.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PÚBLICO</label>
                  <button className={styles.shareButton} onClick={() => handleShare(taskItem.id)}>
                    <FiShare2 size={22} color="#3183ff"/>
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>

                {taskItem.public ? (
                  <Link href={`/task/${taskItem.id}`}>
                    <p>{taskItem.task}</p>
                  </Link>
                ) : (
                  <p>{taskItem.task}</p>
                )}

                <button className={styles.trashButton} onClick={() => handleDeleteTask(taskItem.id)}>
                  <FaTrash size={24} color="#ea3140"/>
                </button>
              </div>

            </article>
          ))}

        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({req});

  if(!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  return  {
    props: {
      user: {
        email: session?.user.email,
      }
    },
  }
}