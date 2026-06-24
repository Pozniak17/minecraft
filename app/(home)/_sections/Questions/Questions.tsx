import Link from 'next/link';
import { Container } from '@/app/_components/Container/Container';
import AccordionList from './AccordionList/AccordionList';
import styles from './Questions.module.css';

export type QuestionsCardProps = {
  question: string;
  answer: string;
};

export const HOME_FAQ: QuestionsCardProps[] = [
  {
    question: 'How do I start playing?',
    answer: 'Create an account, choose a server, and connect using the IP address.',
  },
  {
    question: 'Can I play on multiple servers?',
    answer:
      'Yes. One account works across LuckySurvival, MineWars, and CalmSky — switch anytime.',
  },
  {
    question: 'Do you support Java Edition?',
    answer: 'Yes. We support Java 1.20.4 and the latest Bedrock release.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'Use live chat, email, or Discord — our team replies in under 4 hours, around the clock.',
  },
  {
    question: 'Are events free to join?',
    answer:
      'Yes. Tournaments and seasonal events are free for all players — no extra purchase required.',
  },
];

export default function Questions() {
  return (
    <section className={styles.questionsSection}>
      <Container>
        <div className={styles.questionsContainer}>
          <div>
            <h2 className={styles.title}>Frequently Asked Questions</h2>
            <p className={styles.text}>
              Didn&apos;t find the answer to your question? Go to the FAQ page
            </p>

            <Link href="/faq" className={styles.button}>
              See More
            </Link>
          </div>
          <AccordionList items={HOME_FAQ} />
        </div>
      </Container>
    </section>
  );
}
