import styles from "@/styles/Home.module.css";
import ClientAppWrapper from "./ClientAppWrapper";

export default function Home() {
    return (
        <main className={styles.main}>
            <ClientAppWrapper />
        </main>
    );
}
