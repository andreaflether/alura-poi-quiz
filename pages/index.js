import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import db from '../db.json';
import Button from '../src/components/Button';
import Footer from '../src/components/Footer';
import GithubCorner from '../src/components/GithubCorner';
import Input from '../src/components/Input';
import Link from '../src/components/Link';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import QuizLogo from '../src/components/QuizLogo';
import Widget from '../src/components/Widget';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>Alura Quiz - POI</title>
      </Head>
      <QuizContainer>
        <QuizLogo />
        <Widget
          as={motion.section}
          transition={{
            delay: 0,
            duration: 0.5,
          }}
          variants={{
            show: { opacity: 1, y: '0' },
            hidden: { opacity: 0, y: '100%' },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Header>
            <h1>Person of Interest</h1>
          </Widget.Header>
          <Widget.Content>
            <form onSubmit={(e) => {
              e.preventDefault();
              router.push(`/quiz?name=${name}`);
            }}
            >
              <Input
                name="userName"
                placeholder="Digite seu nome para jogar"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <Button
                type="submit"
                disabled={!name.length}
              >
                Jogar!
              </Button>
            </form>
          </Widget.Content>
        </Widget>
        <Widget
          as={motion.section}
          transition={{
            delay: 0.5,
            duration: 0.5,
          }}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          initial="hidden"
          animate="show"
        >
          <Widget.Content>
            <h1>Quizes da galera</h1>
            <ul>
              {db.external.map((externalLink) => {
                let [projectName, githubUser] = new URL(externalLink).host.split('.');
                return (
                  <li key={externalLink}>
                    <Widget.Topic
                      href={`/quiz/${projectName}___${githubUser}`}
                      as={Link}
                    >
                      { `${githubUser}/${projectName}` }
                    </Widget.Topic>
                  </li>
                );
              })}

            </ul>
          </Widget.Content>
        </Widget>
        <Footer
          as={motion.footer}
          transition={{
            delay: 1,
            duration: 0.5,
          }}
          variants={{
            show: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          initial="hidden"
          animate="show"
        />
      </QuizContainer>
      <GithubCorner projectUrl="http://github.com/andreaflether" />
    </QuizBackground>
  );
}
