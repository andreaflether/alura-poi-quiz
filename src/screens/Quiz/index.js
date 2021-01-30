import React, { useState, useEffect } from 'react';

import AlternativesForm from '../../components/AlternativesForm';
import BackLinkArrow from '../../components/BackLinkArrow';
import Button from '../../components/Button';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import QuizLogo from '../../components/QuizLogo';
import Widget from '../../components/Widget';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>
      <Widget.Content>
        Favor aguardar.
      </Widget.Content>
    </Widget>
  );
}

function ResultsWidget({results}) {
  return (
    <Widget>
      <Widget.Header>
        Seus resultados
      </Widget.Header>
      <Widget.Content>
        <p>
          {` Você acertou ${results.filter((x) => x).length} perguntas! `}
        </p>
        <ul>
          {results.map((result, index) => (
            <li>
              <b>
                Pergunta #
                { index + 1 }
                :
                {' '}
              </b>
              { result === true
                ? 'ACERTO'
                : 'ERRO'
              }
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  totalQuestions,
  questionIndex,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '170px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          { question.title }
        </h2>
        <p>
          <i>
            {question.description}
          </i>
        </p>
        <AlternativesForm onSubmit={(e) => {
          e.preventDefault();
          setIsQuestionSubmitted(true);
          setTimeout(() => {
            addResult(isCorrect);
            onSubmit();
            setIsQuestionSubmitted(false);
            setSelectedAlternative(undefined);
          }, 3 * 1000);
        }}
        >
          { question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;

            return (
              <Widget.Topic
                data-selected={isSelected}
                data-status={isQuestionSubmitted && alternativeStatus}
                key={alternativeId}
                as="label"
                htmlFor={alternativeId}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                />
                { alternative }
              </Widget.Topic>
            )
          })}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          { isCorrect && isQuestionSubmitted && <p>Você acertou! </p>}
          { !isCorrect && isQuestionSubmitted && <p>Reposta incorreta!</p>} 
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage({externalQuestions, externalBg}) {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [results, setResults] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const totalQuestions = externalQuestions.length;

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }

  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  function handleSubmit() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={externalBg}>
      <QuizContainer>
        <QuizLogo />
        { screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            totalQuestions={totalQuestions}
            questionIndex={questionIndex}
            onSubmit={handleSubmit}
            addResult={addResult}
          />
        )}
        { screenState === screenStates.LOADING && <LoadingWidget /> }
        { screenState === screenStates.RESULT && <ResultsWidget results={results} /> }
      </QuizContainer>
    </QuizBackground>
  );
}
