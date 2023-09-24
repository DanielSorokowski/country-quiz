import { useEffect, useState } from "react";
import { getCountries } from "./api";
import './app.scss'

interface Country {
  name: {
    common: string,
  },
  capital: string,
  area: number,
  flags: {
    png: string,
  }
}


const App = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentCountry, setCurrentCountry] = useState<Country>()
  const [currentQuestion, setCurrentQuestion] = useState<string>()
  const [currentAnswer, setCurrentAnswer] = useState<string>()
  const [points, setPoints] = useState(0);
  const [currentStage, setCurrentStage] = useState(1)
  const [isGameOn, setIsGameOn] = useState(true);
  const [selectedButton, setSelectedButton] = useState<string | null>(null)
  const [a, setA] = useState<string>()
  const [b, setB] = useState<string>()
  const [c, setC] = useState<string>()
  const [d, setD] = useState<string>()
  
  const generateRandomCountry = () => {
    const random = Math.floor(Math.random() * 249);
    
    return countries[random]
  }

  const makeQuestion = (answers: (string | undefined)[]) => {
    setCurrentAnswer(String(answers[3]))
    const shuffledIndices: number[] = [];
    for (const key in answers) {
      if (answers.hasOwnProperty(key)) {
        shuffledIndices.push(parseInt(key));
      }
    }
    shuffledIndices.sort(() => Math.random() - 0.5);

    setA(String(answers[shuffledIndices[0]]))
    setB(String(answers[shuffledIndices[1]]))
    setC(String(answers[shuffledIndices[2]]))
    setD(String(answers[shuffledIndices[3]]))
  }

  const generateRandomQuestionType = () => {
    const random = Math.floor(Math.random() * 2);

    switch(random) {
      case 0: {
        setCurrentQuestion('What is capital of')
        const answers = [generateRandomCountry().capital, generateRandomCountry().capital, generateRandomCountry().capital, currentCountry?.capital]
        makeQuestion(answers)

        break;
      }
      case 1: {
        setCurrentQuestion('Which flag is')
        const answers = [generateRandomCountry().flags.png, generateRandomCountry().flags.png, generateRandomCountry().flags.png, currentCountry?.flags.png]
        makeQuestion(answers)

        break;
      }
    }

  }

  useEffect(() => {
    getCountries().then(res => {
      setCountries(res)
    })
  }, []) 

  useEffect(() => {
    if (countries.length > 0) {
      const randomCountry = generateRandomCountry();

      setCurrentCountry(randomCountry)
    }
    
  }, [countries, currentStage]);

  useEffect(() => {
    if (currentCountry) {
      generateRandomQuestionType();
    }
  }, [currentCountry]);

  const handleCheck = (answer: string) => {
    setSelectedButton(answer);
    if (answer === currentAnswer) {
      setPoints(points + 1);
    }
  };

  const handleNext = () => {
    setSelectedButton(null)
    if (currentStage < 5) {
      setCurrentStage(prevStage => prevStage + 1)
      generateRandomQuestionType()
    } else {
      setIsGameOn(false)
    }
  } 

  const handleReset = () => {
    generateRandomQuestionType()
    setSelectedButton(null)
    setCurrentStage(1)
    setIsGameOn(true)
    setPoints(0)
  }

  return (
    <div className="app">
      <div className="game">
        <h1 className="game__title">Country Quiz</h1>
        {isGameOn ? (
          <div className="game__form">
            <h2 className="game__question">{currentQuestion} {currentCountry?.name.common}</h2>

            <button
              onClick={() => handleCheck(String(a))}
              className={`game__button ${selectedButton === String(a) ? (a === currentAnswer ? 'green' : 'red') : (selectedButton && a === currentAnswer ? 'green' : '')}`}
              disabled={selectedButton ? true : false}
            >
              <span className="game__button-index">A</span> <span className="game__button-answer">{a && a.startsWith('https') ? <img src={a} className="game__button-image" /> : a}</span>
            </button>

            <button
              onClick={() => handleCheck(String(b))}
              className={`game__button ${selectedButton === String(b) ? (b === currentAnswer ? 'green' : 'red') : (selectedButton && b === currentAnswer ? 'green' : '')}`}
              disabled={selectedButton ? true : false}
            >
             <span className="game__button-index">B</span> <span className="game__button-answer">{b && b.startsWith('https') ? <img src={b} className="game__button-image" /> : b}</span>
            </button>

            <button
              onClick={() => handleCheck(String(c))}
              className={`game__button ${selectedButton === String(c) ? (c === currentAnswer ? 'green' : 'red') : (selectedButton && c === currentAnswer ? 'green' : '')}`}
              disabled={selectedButton ? true : false}
            >
              <span className="game__button-index">C</span> <span className="game__button-answer">{c && c.startsWith('https') ? <img src={c} className="game__button-image" /> : c}</span>
            </button>

            <button
              onClick={() => handleCheck(String(d))}
              className={`game__button ${selectedButton === String(d) ? (d === currentAnswer ? 'green' : 'red') : (selectedButton && d === currentAnswer ? 'green' : '')}`}
              disabled={selectedButton ? true : false}
            >
              <span className="game__button-index">D</span> <span className="game__button-answer">{d && d.startsWith('https') ? <img src={d} className="game__button-image" /> : d}</span>
            </button>

            {selectedButton && <button className="game__next" onClick={handleNext}>Next</button>}
          </div>
        ) : (
          <div className="game__score">
            <h2 className="game__question">Results</h2>
            <p className="game__solution">Your score is {points} / 5</p>

            <button className="game__next" onClick={handleReset}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );

}

export default App;
