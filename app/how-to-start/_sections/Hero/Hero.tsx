import { Container } from '@/app/_components/Container/Container';
import StepperAuthLink from './StepperAuthLink';
import styles from './Hero.module.css';
import Image from 'next/image';
import Link from 'next/link';
// import step2Illustration from '@/public/how-to-start/stepper-1.webp';
import img1 from '@/public/how-to-start/1.webp';
import img2 from '@/public/how-to-start/2.webp';
import img3 from '@/public/how-to-start/3.webp';
import img4 from '@/public/how-to-start/4.webp';
import img5 from '@/public/how-to-start/5.webp';
import img6 from '@/public/how-to-start/6.webp';

export default function Hero({ isAuthed = false }: { isAuthed?: boolean }) {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className={styles.title}>How to Start</h1>
        </Container>
      </section>

      <Container>
        <div className={styles.stepper}>
          <ul className={styles.stepperList}>
            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                1
              </span>

              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>
                  Install Minecraft
                  <span className={styles.stepperVersion}>
                    <Image
                      src="/how-to-start/icons/game.svg"
                      alt="Minecraft version"
                      width={24}
                      height={24}
                    />
                    1.12–1.19
                  </span>
                </h3>
                <p className={styles.stepperDescription}>
                  a licensed version of Minecraft is required to play
                </p>
                <a
                  href="https://www.minecraft.net/en-us/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.stepperButton}
                >
                  Download now
                </a>
              </div>
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                2
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Create an Account</h3>
                <p className={styles.stepperDescription}>
                  To get started, you need to register on our project website. This account is
                  essential for accessing your personal dashboard, making purchases in our store,
                  and syncing with the server.
                </p>
                <Link href="/register" className={styles.stepperButton}>
                  Sign Up
                </Link>
              </div>
              <Image src={img1} alt="" className={styles.stepperImage} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                3
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Log in to Dashboard</h3>
                <p className={styles.stepperDescription}>
                  In Step 2, you&apos;ll log into your user dashboard. This area offers various
                  features, including the ability to make purchases, view your order history, and
                  manage your account settings.
                </p>
                <Link href={isAuthed ? '/dashboard' : '/login'} className={styles.stepperButton}>
                  Go to Dashboard
                </Link>
              </div>
              <Image src={img2} alt="" className={styles.stepperImage} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                4
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Choose a Server</h3>
                <p className={styles.stepperDescription}>
                  Welcome to Step 2! Here’s how it works: Our project features three unique servers,
                  each with its own rules and gameplay style. You can explore them through the
                  following links: <br /> <br /> - LuckySurvival <br /> - MineWars <br /> - CalmSky
                  <br /> <br /> Dive in and choose the server that suits your gaming style!
                </p>
              </div>
              <Image src={img3} alt="" className={styles.stepperImage} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                5
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Connect to the Server</h3>
                <p className={styles.stepperDescription}>
                  To begin, launch Minecraft and navigate to the Multiplayer section. Here, you can
                  add the server&apos;s IP address, which you can find on the server&apos;s page.
                  This will allow you to connect and start playing with others!
                </p>
                <Link href="/servers" className={styles.stepperButton}>
                  View server details
                </Link>
              </div>
              <Image src={img4} alt="" className={styles.stepperImage} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                6
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Start Playing</h3>
                <p className={styles.stepperDescription}>
                  Now that you&apos;re ready to play, it&apos;s time to register on our project
                  website. This account will grant you access to your personal dashboard, allow you
                  to make purchases in our store, and keep everything synced with the server. Get
                  ready for an engaging experience with development, economy, and player
                  interactions!
                </p>
                <StepperAuthLink
                  isAuthed={isAuthed}
                  intent="play"
                  className={styles.stepperButton}
                >
                  Start playing now
                </StepperAuthLink>
              </div>
              <Image src={img5} alt="" className={styles.stepperImage} />
            </li>

            <li className={styles.stepperItem}>
              <span className={styles.stepperNumber} aria-hidden="true">
                7
              </span>
              <div className={styles.stepperContent}>
                <h3 className={styles.stepperTitle}>Upgrade Your Experience </h3>
                <p className={styles.stepperDescription}>
                  Once you&apos;re registered on our project website, you&apos;ll unlock access to
                  your personal dashboard. This account allows you to shop in our store anytime and
                  enjoy permanent privileges with your purchases.
                </p>
                <StepperAuthLink
                  isAuthed={isAuthed}
                  intent="store"
                  className={styles.stepperButton}
                >
                  Open Store
                </StepperAuthLink>
              </div>
              <Image src={img6} alt="" className={styles.stepperImage} />
            </li>
          </ul>
        </div>
      </Container>
    </>
  );
}
