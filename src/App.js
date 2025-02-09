  import logo from './logo.svg';
  import './App.css';
  import React, {useState, useEffect} from 'react';

  const API = "/Uw5CrX";

  function App() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [correctAnswer, setCorrectAnswer] = useState(null);

    useEffect(() => {
      fetch(API)
      .then(
        res =>{if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        } 
        return res.json()})
      .then(data => {
        setLoading(false);
        setQuestions(data);
      })
      .catch(err => console.log(`Error Fetching data: ${err}`))
    }, [])

    useEffect(()=>{
      if (questions.questions && questions.questions.length > 0){
        const correctOption = questions.questions[currentIndex].options.find((option)=> option.is_correct);
        setCorrectAnswer(correctOption.description);
      }
    }, [currentIndex, questions]);


    const handleAnswer = (event) => {
      if (selectedOption != null){
        selectedOption.classList.toggle("selectClass")
      }
      setSelectedOption(event.target)
    }

    useEffect(() => {
      if (selectedOption){
        selectedOption.classList.toggle("selectClass");
      }
    },[selectedOption]);

    const submit = () => {
      const alert = document.getElementById("alert");
      if (selectedOption === null){
        alert.textContent = "Select an option to continue";
      }
      else{
        if (correctAnswer === selectedOption.textContent){
          setScore(prevScore => prevScore+ parseInt(questions.correct_answer_marks));
        }
        else{
          setScore(prevScore => prevScore-parseInt(questions.negative_marks));
        }
        const nextIndex = currentIndex + 1;
        if (nextIndex < (questions.questions).length){
          setCurrentIndex(nextIndex);
          setSelectedOption(null);
        }
        else{
          setShowResult(true);
        }
        alert.textContent = "";
      }
    }

    const reset = () =>{
      const answers = document.getElementById("answers");
      answers.textContent = "";
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setShowResult(false);
    }

    const showResults = () =>{
      const answers = document.getElementById("answers");
      answers.textContent = "";
      questions.questions.map((obj, index )=> {
        const answer = document.createElement("div");
        answer.classList.add("solutions");
        const h2 = document.createElement("h2");
        h2.classList.add("question");
        h2.textContent = `${index+1}. ${obj.description}`;
        const correctOption = obj.options.find(option => option.is_correct);
        const p = document.createElement("p");
        p.textContent = `Ans. ${correctOption.description}`;
        p.classList.add("answer")
        answer.appendChild(h2);
        answer.appendChild(p);

        answers.appendChild(answer);
      })
    }

    return (
      <div className="App">
        {(!loading) && (showResult ? (
          <div>
            <h1 className='title'>{questions.title}</h1>
            <div className='completed'>
              <h2 className='quiz-completed'>Quiz Completed</h2>
              <p className='scoreBoard'>Score: {score} / {questions.questions.length * questions.correct_answer_marks}</p>
              <div className="buttons">
                <button className="reset" onClick={()=>reset()}>Reset</button>
                <button className='sols' onClick={()=>showResults()}>Show Answers</button>
              </div>
              <div className="answers" id="answers">
                
              </div>
            </div>
          </div>
        ):(
            <div>
              {((questions.questions).length > 0) && 
              (<div>
                <h1 className='title'>{questions.title}</h1>
                <div className='content'>
                <h2>{currentIndex+1}. {questions.questions[currentIndex].description}</h2>
                <div className='options'>
                {questions.questions[currentIndex].options.map((option, index) => {
                  return (
                    <>
                    <button className="optionButtons" key={`option-${currentIndex}-${index}`} id={`option-${currentIndex}-${index}`} onClick={(event)=>handleAnswer(event)}>{option.description}</button>
                    <br />
                    </>
                  )
                })}
                </div>
                <div className='btn-cntr'>
                  <button className="submit-btn" id="submit" onClick={()=>submit()}>Submit</button>
                </div>
                  <p id="alert" className='alert'></p>
                </div>
              </div>)
              }
            </div>
        ))}
      </div>
    );
  }

  export default App;
