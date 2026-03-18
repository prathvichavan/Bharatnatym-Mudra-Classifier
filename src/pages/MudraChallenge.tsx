import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import {
  Brain,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Target,
  Sparkles,
  BarChart3,
  Timer,
  Hand,
  BookOpen,
  Link as LinkIcon,
  Eye,
  Cpu,
  Clock,
} from 'lucide-react';
import { useProgress, QuizTypeId } from '@/hooks/useProgress';
import {
  QuizType,
  quizTypes,
  QuizHistoryManager,
  generateIdentifyQuestions,
  generateMatchQuestion,
  generateSpotWrongQuestion,
  generateMeaningQuestions,
  generateSingleDoubleQuestions,
  generateConfidenceQuestions,
  IdentifyQuestion,
  MatchQuestion,
  SpotWrongQuestion,
  MeaningQuestion,
  SingleDoubleQuestion,
  ConfidenceQuestion,
} from '@/utils/quizData';

type QuizState = 'hub' | 'intro' | 'playing' | 'answered' | 'complete';

const iconMap: Record<string, React.ReactNode> = {
  '🎯': <Target className="h-6 w-6" />,
  '🔗': <LinkIcon className="h-6 w-6" />,
  '👁️': <Eye className="h-6 w-6" />,
  '📖': <BookOpen className="h-6 w-6" />,
  '✋': <Hand className="h-6 w-6" />,
  '🤖': <Cpu className="h-6 w-6" />,
  '⏱️': <Clock className="h-6 w-6" />,
};

export default function MudraChallenge() {
  const [quizState, setQuizState] = useState<QuizState>('hub');
  const [selectedQuizType, setSelectedQuizType] = useState<QuizType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const historyManager = useRef(new QuizHistoryManager(10));

  // Quiz-specific state
  const [identifyQuestions, setIdentifyQuestions] = useState<IdentifyQuestion[]>([]);
  const [matchQuestion, setMatchQuestion] = useState<MatchQuestion | null>(null);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const [matchCompleted, setMatchCompleted] = useState(false);
  const [spotWrongQuestions, setSpotWrongQuestions] = useState<SpotWrongQuestion[]>([]);
  const [meaningQuestions, setMeaningQuestions] = useState<MeaningQuestion[]>([]);
  const [singleDoubleQuestions, setSingleDoubleQuestions] = useState<SingleDoubleQuestion[]>([]);
  const [confidenceQuestions, setConfidenceQuestions] = useState<ConfidenceQuestion[]>([]);
  const [timedQuestions, setTimedQuestions] = useState<IdentifyQuestion[]>([]);

  const { recordActivity, recordQuizComplete } = useProgress();

  const currentQuizInfo = quizTypes.find(q => q.id === selectedQuizType);
  const questionsCount = currentQuizInfo?.questionsPerRound || 10;

  // Timer effect for timed quiz
  useEffect(() => {
    if (selectedQuizType === 'timed' && quizState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (selectedQuizType === 'timed' && quizState === 'playing' && timeLeft === 0) {
      handleTimedTimeout();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, quizState, selectedQuizType]);

  const handleTimedTimeout = () => {
    const currentQ = timedQuestions[currentQuestionIndex];
    if (currentQ) {
      recordActivity('quiz', currentQ.mudra.name, false, 'timed');
      setSelectedAnswer('timeout');
      setQuizState('answered');
    }
  };

  const startQuiz = (quizType: QuizType) => {
    setSelectedQuizType(quizType);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    historyManager.current.reset();

    const info = quizTypes.find(q => q.id === quizType);
    const count = info?.questionsPerRound || 10;

    switch (quizType) {
      case 'identify':
        setIdentifyQuestions(generateIdentifyQuestions(count, historyManager.current));
        break;
      case 'match':
        setMatchQuestion(generateMatchQuestion(historyManager.current));
        setMatchAnswers({});
        setMatchCompleted(false);
        break;
      case 'spot-wrong':
        const spotQuestions: SpotWrongQuestion[] = [];
        for (let i = 0; i < count; i++) {
          spotQuestions.push(generateSpotWrongQuestion(historyManager.current));
        }
        setSpotWrongQuestions(spotQuestions);
        break;
      case 'meaning':
        setMeaningQuestions(generateMeaningQuestions(count, historyManager.current));
        break;
      case 'single-double':
        setSingleDoubleQuestions(generateSingleDoubleQuestions(count, historyManager.current));
        break;
      case 'confidence':
        setConfidenceQuestions(generateConfidenceQuestions(count, historyManager.current));
        break;
      case 'timed':
        setTimedQuestions(generateIdentifyQuestions(count, historyManager.current));
        setTimeLeft(7);
        setTotalTime(0);
        break;
    }

    setQuizState('intro');
  };

  const beginQuiz = () => {
    setQuizState('playing');
    if (selectedQuizType === 'timed') {
      setTimeLeft(7);
    }
  };

  const handleAnswerSelect = (answer: string, isCorrect: boolean, mudraName: string) => {
    if (quizState !== 'playing') return;
    
    setSelectedAnswer(answer);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    recordActivity('quiz', mudraName, isCorrect, selectedQuizType as QuizTypeId);
    setQuizState('answered');
  };

  const handleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (currentQuestionIndex < questionsCount - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuizState('playing');
      if (selectedQuizType === 'timed') {
        setTimeLeft(7);
        setTotalTime(prev => prev + (7 - timeLeft));
      }
    } else {
      if (selectedQuizType === 'timed') {
        setTotalTime(prev => prev + (7 - timeLeft));
      }
      recordQuizComplete(selectedQuizType as QuizTypeId, questionsCount, score);
      setQuizState('complete');
    }
  };

  const handleMatchSelect = (imageName: string, selectedName: string) => {
    setMatchAnswers(prev => ({
      ...prev,
      [imageName]: selectedName,
    }));
  };

  const handleMatchSubmit = () => {
    if (!matchQuestion) return;
    
    let correctCount = 0;
    matchQuestion.mudras.forEach(mudra => {
      const isCorrect = matchAnswers[mudra.name] === mudra.name;
      if (isCorrect) correctCount++;
      recordActivity('quiz', mudra.name, isCorrect, 'match');
    });
    
    setScore(correctCount);
    setMatchCompleted(true);
    recordQuizComplete('match', 4, correctCount);
    setQuizState('complete');
  };

  const backToHub = () => {
    setQuizState('hub');
    setSelectedQuizType(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const getEncouragingMessage = () => {
    const accuracy = (score / questionsCount) * 100;
    if (accuracy >= 90) return 'Excellent! You are a Mudra Master!';
    if (accuracy >= 70) return 'Great job! Keep practicing Bharatanatyam mudras.';
    if (accuracy >= 50) return 'Good effort! Continue your mudra learning journey.';
    return 'Keep practicing! Every step brings you closer to mastery.';
  };

  const progressPercent = ((currentQuestionIndex + 1) / questionsCount) * 100;

  // Render Quiz Hub
  const renderHub = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground italic">
          New questions are generated every time you play
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizTypes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="p-6 cursor-pointer bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-lg transition-all h-full"
              onClick={() => startQuiz(quiz.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg text-primary">
                  {iconMap[quiz.icon] || <Target className="h-6 w-6" />}
                </div>
                <span className="text-2xl">{quiz.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{quiz.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {quiz.questionsPerRound} questions
                </span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="/progress">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <BarChart3 className="mr-2 h-4 w-4" />
            View My Progress
          </Button>
        </Link>
      </div>
    </motion.div>
  );

  // Render Quiz Intro
  const renderIntro = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 text-center max-w-lg mx-auto">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">{currentQuizInfo?.icon}</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{currentQuizInfo?.title}</h2>
          <p className="text-muted-foreground">{currentQuizInfo?.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-primary">{questionsCount}</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </div>
          {selectedQuizType === 'timed' && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-secondary">7s</p>
              <p className="text-sm text-muted-foreground">Per Question</p>
            </div>
          )}
          {selectedQuizType !== 'timed' && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-2xl font-bold text-secondary">Instant</p>
              <p className="text-sm text-muted-foreground">Feedback</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={backToHub}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={beginQuiz}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Quiz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );

  // Render Identify Quiz
  const renderIdentifyQuiz = () => {
    const currentQ = identifyQuestions[currentQuestionIndex];
    if (!currentQ) return null;

    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    return (
      <motion.div
        key={`identify-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
      >
        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50">
          {/* Mudra Type Badge */}
          <div className="flex justify-center mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentQ.mudra.type === 'single'
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary/20 text-secondary'
            }`}>
              {currentQ.mudra.type === 'single' ? 'Single-Hand Mudra' : 'Double-Hand Mudra'}
            </span>
          </div>

          {/* Mudra Image */}
          <div className="flex justify-center mb-6">
            <img
              src={currentQ.mudra.image}
              alt="Identify this mudra"
              className="w-56 h-56 md:w-72 md:h-72 object-cover rounded-2xl shadow-lg border-2 border-border/50"
            />
          </div>

          {/* Question */}
          <h3 className="text-xl font-bold text-center text-foreground mb-6">
            Identify the correct Bharatanatyam Mudra
          </h3>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {currentQ.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentQ.correctAnswer;
              const showResult = quizState === 'answered';

              let buttonClass = 'bg-muted/50 hover:bg-muted border-border/50 text-foreground';
              if (showResult) {
                if (isCorrectOption) {
                  buttonClass = 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-400';
                } else if (isSelected && !isCorrectOption) {
                  buttonClass = 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-400';
                }
              } else if (isSelected) {
                buttonClass = 'bg-primary/20 border-primary text-primary';
              }

              return (
                <motion.button
                  key={option}
                  whileHover={quizState === 'playing' ? { scale: 1.02 } : {}}
                  whileTap={quizState === 'playing' ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(option, option === currentQ.correctAnswer, currentQ.mudra.name)}
                  disabled={quizState === 'answered'}
                  className={`p-4 rounded-xl border-2 font-medium transition-all ${buttonClass} ${
                    quizState === 'answered' ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {showResult && isCorrectOption && <CheckCircle2 className="h-5 w-5" />}
                    {showResult && isSelected && !isCorrectOption && <XCircle className="h-5 w-5" />}
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          {quizState === 'answered' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-xl text-center ${
                isCorrect
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <span className={`font-bold ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isCorrect
                    ? `This mudra is ${currentQ.correctAnswer}. ${currentQ.mudra.meaning}`
                    : `The correct mudra is ${currentQ.correctAnswer}. ${currentQ.mudra.meaning}`}
                </p>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleNext} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8">
                  {currentQuestionIndex < questionsCount - 1 ? 'Next Question' : 'See Results'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  };

  // Render Match Quiz
  const renderMatchQuiz = () => {
    if (!matchQuestion) return null;

    const availableNames = matchQuestion.shuffledNames.filter(
      name => !Object.values(matchAnswers).includes(name)
    );

    const allMatched = Object.keys(matchAnswers).length === 4;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-xl font-bold text-center text-foreground mb-6">
            Match each mudra image with its correct name
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Images Column */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-center mb-2">Mudra Images</h4>
              {matchQuestion.mudras.map((mudra, index) => {
                const matchedName = matchAnswers[mudra.name];
                const isCorrect = matchedName === mudra.name;
                const showResult = matchCompleted;

                return (
                  <div
                    key={mudra.name}
                    className={`flex items-center gap-4 p-3 rounded-xl border-2 ${
                      showResult
                        ? isCorrect
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-red-500 bg-red-500/10'
                        : matchedName
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 bg-muted/30'
                    }`}
                  >
                    <img
                      src={mudra.image}
                      alt={`Mudra ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      {matchedName ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{matchedName}</span>
                          {showResult && (isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          ))}
                          {!showResult && (
                            <button
                              onClick={() => setMatchAnswers(prev => {
                                const newAnswers = { ...prev };
                                delete newAnswers[mudra.name];
                                return newAnswers;
                              })}
                              className="text-xs text-muted-foreground hover:text-primary"
                            >
                              (remove)
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Click a name below</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Names Column */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-center mb-2">Mudra Names</h4>
              {!matchCompleted && (
                <div className="space-y-2">
                  {availableNames.map((name) => (
                    <motion.button
                      key={name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Find first unmatched image
                        const unmatchedMudra = matchQuestion.mudras.find(
                          m => !matchAnswers[m.name]
                        );
                        if (unmatchedMudra) {
                          handleMatchSelect(unmatchedMudra.name, name);
                        }
                      }}
                      className="w-full p-3 rounded-xl border-2 border-border/50 bg-muted/30 hover:border-primary hover:bg-primary/10 font-medium transition-all"
                    >
                      {name}
                    </motion.button>
                  ))}
                </div>
              )}
              {matchCompleted && (
                <div className="p-4 bg-muted/30 rounded-xl text-center">
                  <p className="text-muted-foreground">
                    See results on the left
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          {!matchCompleted && allMatched && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleMatchSubmit}
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8"
              >
                Submit Answers
                <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {matchCompleted && (
            <div className="mt-6 text-center">
              <p className="text-lg font-bold text-foreground mb-4">
                You got {score} out of 4 correct!
              </p>
              <Button
                onClick={backToHub}
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8"
              >
                Back to Quiz Hub
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  // Render Spot Wrong Quiz
  const renderSpotWrongQuiz = () => {
    const currentQ = spotWrongQuestions[currentQuestionIndex];
    if (!currentQ) return null;

    const selectedIndex = selectedAnswer ? parseInt(selectedAnswer) : -1;
    const correctIndex = currentQ.images.findIndex(img => img.isWrong);

    return (
      <motion.div
        key={`spot-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-xl font-bold text-center text-foreground mb-2">
            Spot the Wrong Mudra
          </h3>
          <p className="text-center text-muted-foreground mb-6">
            Three images show <strong>{currentQ.correctMudraName}</strong>. Find the different one!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentQ.images.map((img, index) => {
              const isSelected = selectedIndex === index;
              const isCorrectChoice = img.isWrong;
              const showResult = quizState === 'answered';

              let borderClass = 'border-border/50';
              if (showResult) {
                if (isCorrectChoice) {
                  borderClass = 'border-green-500 border-4';
                } else if (isSelected) {
                  borderClass = 'border-red-500 border-4';
                }
              } else if (isSelected) {
                borderClass = 'border-primary border-4';
              }

              return (
                <motion.button
                  key={index}
                  whileHover={quizState === 'playing' ? { scale: 1.02 } : {}}
                  whileTap={quizState === 'playing' ? { scale: 0.98 } : {}}
                  onClick={() => {
                    if (quizState === 'playing') {
                      const isCorrect = img.isWrong;
                      handleAnswerSelect(index.toString(), isCorrect, currentQ.wrongMudraName);
                    }
                  }}
                  disabled={quizState === 'answered'}
                  className={`relative rounded-xl overflow-hidden border-2 ${borderClass} transition-all ${
                    quizState === 'answered' ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <img
                    src={img.image}
                    alt={`Option ${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  {showResult && isCorrectChoice && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                  )}
                  {showResult && isSelected && !isCorrectChoice && (
                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                      <XCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {quizState === 'answered' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-xl text-center ${
                selectedIndex === correctIndex
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <p className="text-sm text-muted-foreground">
                  The different mudra was <strong>{currentQ.wrongMudraName}</strong>
                </p>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleNext} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8">
                  {currentQuestionIndex < questionsCount - 1 ? 'Next Question' : 'See Results'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  };

  // Render Meaning Quiz
  const renderMeaningQuiz = () => {
    const currentQ = meaningQuestions[currentQuestionIndex];
    if (!currentQ) return null;

    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    return (
      <motion.div
        key={`meaning-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex justify-center mb-4">
            <img
              src={currentQ.mudra.image}
              alt={currentQ.mudra.name}
              className="w-48 h-48 object-cover rounded-2xl shadow-lg border-2 border-border/50"
            />
          </div>

          <h3 className="text-xl font-bold text-center text-foreground mb-2">
            {currentQ.mudra.name}
          </h3>
          <p className="text-center text-muted-foreground mb-6">
            What does this mudra represent?
          </p>

          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentQ.correctAnswer;
              const showResult = quizState === 'answered';

              let buttonClass = 'bg-muted/50 hover:bg-muted border-border/50 text-foreground';
              if (showResult) {
                if (isCorrectOption) {
                  buttonClass = 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-400';
                } else if (isSelected && !isCorrectOption) {
                  buttonClass = 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-400';
                }
              } else if (isSelected) {
                buttonClass = 'bg-primary/20 border-primary text-primary';
              }

              return (
                <motion.button
                  key={index}
                  whileHover={quizState === 'playing' ? { scale: 1.01 } : {}}
                  whileTap={quizState === 'playing' ? { scale: 0.99 } : {}}
                  onClick={() => handleAnswerSelect(option, option === currentQ.correctAnswer, currentQ.mudra.name)}
                  disabled={quizState === 'answered'}
                  className={`w-full p-4 rounded-xl border-2 text-left text-sm transition-all ${buttonClass} ${
                    quizState === 'answered' ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {showResult && isCorrectOption && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
                    {showResult && isSelected && !isCorrectOption && <XCircle className="h-4 w-4 flex-shrink-0" />}
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {quizState === 'answered' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Button onClick={handleNext} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8">
                {currentQuestionIndex < questionsCount - 1 ? 'Next Question' : 'See Results'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  };

  // Render Single/Double Quiz
  const renderSingleDoubleQuiz = () => {
    const currentQ = singleDoubleQuestions[currentQuestionIndex];
    if (!currentQ) return null;

    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    return (
      <motion.div
        key={`singledouble-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex justify-center mb-6">
            <img
              src={currentQ.mudra.image}
              alt="Classify this mudra"
              className="w-56 h-56 md:w-72 md:h-72 object-cover rounded-2xl shadow-lg border-2 border-border/50"
            />
          </div>

          <h3 className="text-xl font-bold text-center text-foreground mb-6">
            Is this a single-hand or double-hand mudra?
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {(['single', 'double'] as const).map((type) => {
              const isSelected = selectedAnswer === type;
              const isCorrectOption = type === currentQ.correctAnswer;
              const showResult = quizState === 'answered';

              let buttonClass = 'bg-muted/50 hover:bg-muted border-border/50';
              if (showResult) {
                if (isCorrectOption) {
                  buttonClass = 'bg-green-500/20 border-green-500';
                } else if (isSelected) {
                  buttonClass = 'bg-red-500/20 border-red-500';
                }
              } else if (isSelected) {
                buttonClass = 'bg-primary/20 border-primary';
              }

              return (
                <motion.button
                  key={type}
                  whileHover={quizState === 'playing' ? { scale: 1.02 } : {}}
                  whileTap={quizState === 'playing' ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(type, type === currentQ.correctAnswer, currentQ.mudra.name)}
                  disabled={quizState === 'answered'}
                  className={`p-6 rounded-xl border-2 transition-all ${buttonClass} ${
                    quizState === 'answered' ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="text-center">
                    <Hand className={`h-8 w-8 mx-auto mb-2 ${type === 'single' ? 'text-primary' : 'text-secondary'}`} />
                    <p className="font-bold text-foreground">
                      {type === 'single' ? 'Single-Hand' : 'Double-Hand'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {type === 'single' ? 'Asamyuta Hasta' : 'Samyuta Hasta'}
                    </p>
                    {showResult && isCorrectOption && (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mt-2" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <XCircle className="h-5 w-5 text-red-600 mx-auto mt-2" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {quizState === 'answered' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
              <Button onClick={handleNext} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8">
                {currentQuestionIndex < questionsCount - 1 ? 'Next Question' : 'See Results'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  };

  // Render Confidence Quiz
  const renderConfidenceQuiz = () => {
    const currentQ = confidenceQuestions[currentQuestionIndex];
    if (!currentQ) return null;

    const userPredictedCorrect = selectedAnswer === 'yes';
    const isUserCorrect = userPredictedCorrect === currentQ.aiCorrect;

    return (
      <motion.div
        key={`confidence-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex justify-center mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentQ.mudra.type === 'single'
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary/20 text-secondary'
            }`}>
              {currentQ.mudra.type === 'single' ? 'Single-Hand' : 'Double-Hand'}
            </span>
          </div>

          <div className="flex justify-center mb-6">
            <img
              src={currentQ.mudra.image}
              alt="Predict AI accuracy"
              className="w-56 h-56 md:w-64 md:h-64 object-cover rounded-2xl shadow-lg border-2 border-border/50"
            />
          </div>

          <h3 className="text-xl font-bold text-center text-foreground mb-2">
            Confidence Challenge
          </h3>
          <p className="text-center text-muted-foreground mb-6">
            Will our AI correctly identify this mudra as <strong>{currentQ.mudra.name}</strong>?
          </p>

          {quizState === 'playing' && (
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect('yes', currentQ.aiCorrect === true, currentQ.mudra.name)}
                className="p-4 rounded-xl border-2 border-green-500/50 bg-green-500/10 hover:bg-green-500/20 transition-all"
              >
                <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-bold text-green-700 dark:text-green-400">Yes</p>
                <p className="text-xs text-muted-foreground">AI will get it right</p>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect('no', currentQ.aiCorrect === false, currentQ.mudra.name)}
                className="p-4 rounded-xl border-2 border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition-all"
              >
                <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="font-bold text-red-700 dark:text-red-400">No</p>
                <p className="text-xs text-muted-foreground">AI will get it wrong</p>
              </motion.button>
            </div>
          )}

          {quizState === 'answered' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* AI Result Card */}
              <div className="p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">AI Prediction:</span>
                  <span className={`font-bold ${currentQ.aiCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {currentQ.aiCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Confidence:</span>
                  <span className="font-bold text-primary">{currentQ.aiConfidence}%</span>
                </div>
              </div>

              {/* User Result */}
              <div className={`p-4 rounded-xl text-center ${
                isUserCorrect
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <p className={`font-bold ${isUserCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isUserCorrect ? 'You predicted correctly!' : 'Your prediction was wrong'}
                </p>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleNext} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-8">
                  {currentQuestionIndex < questionsCount - 1 ? 'Next Question' : 'See Results'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  };

  // Render Timed Quiz
  const renderTimedQuiz = () => {
    const currentQ = timedQuestions[currentQuestionIndex];
    if (!currentQ) return null;

    const isCorrect = selectedAnswer === currentQ.correctAnswer;
    const isTimeout = selectedAnswer === 'timeout';

    return (
      <motion.div
        key={`timed-${currentQuestionIndex}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border/50">
          {/* Timer */}
          {quizState === 'playing' && (
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className={`h-5 w-5 ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                <span className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-red-500' : 'text-foreground'}`}>
                  {timeLeft}s
                </span>
              </div>
              <Progress value={(timeLeft / 7) * 100} className="h-2" />
            </div>
          )}

          <div className="flex justify-center mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentQ.mudra.type === 'single'
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary/20 text-secondary'
            }`}>
              {currentQ.mudra.type === 'single' ? 'Single-Hand' : 'Double-Hand'}
            </span>
          </div>

          <div className="flex justify-center mb-4">
            <img
              src={currentQ.mudra.image}
              alt="Identify quickly!"
              className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl shadow-lg border-2 border-border/50"
            />
          </div>

          <h3 className="text-lg font-bold text-center text-foreground mb-4">
            Quick! Identify this mudra
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {currentQ.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentQ.correctAnswer;
              const showResult = quizState === 'answered';

              let buttonClass = 'bg-muted/50 hover:bg-muted border-border/50 text-foreground';
              if (showResult) {
                if (isCorrectOption) {
                  buttonClass = 'bg-green-500/20 border-green-500 text-green-700 dark:text-green-400';
                } else if ((isSelected || isTimeout) && !isCorrectOption && isSelected) {
                  buttonClass = 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-400';
                }
              } else if (isSelected) {
                buttonClass = 'bg-primary/20 border-primary text-primary';
              }

              return (
                <motion.button
                  key={option}
                  whileHover={quizState === 'playing' ? { scale: 1.02 } : {}}
                  whileTap={quizState === 'playing' ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(option, option === currentQ.correctAnswer, currentQ.mudra.name)}
                  disabled={quizState === 'answered'}
                  className={`p-3 rounded-xl border-2 font-medium text-sm transition-all ${buttonClass}`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          {quizState === 'answered' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {isTimeout && (
                <div className="p-3 rounded-xl text-center bg-amber-500/10 border border-amber-500/30">
                  <p className="font-bold text-amber-600">Time's up!</p>
                  <p className="text-sm text-muted-foreground">The answer was {currentQ.correctAnswer}</p>
                </div>
              )}
              {!isTimeout && (
                <div className={`p-3 rounded-xl text-center ${
                  isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                }`}>
                  <p className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? 'Correct!' : `Wrong! It was ${currentQ.correctAnswer}`}
                  </p>
                </div>
              )}
              <div className="flex justify-center">
                <Button onClick={handleNext} className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6">
                  {currentQuestionIndex < questionsCount - 1 ? 'Next' : 'Results'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  };

  // Render Complete Screen
  const renderComplete = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="p-8 bg-gradient-to-br from-primary/10 via-card/50 to-secondary/10 backdrop-blur-sm border-border/50 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6"
        >
          <Trophy className="h-12 w-12 text-primary-foreground" />
        </motion.div>

        <h2 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h2>
        <p className="text-lg text-muted-foreground mb-8">{getEncouragingMessage()}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-muted/30 rounded-xl">
            <p className="text-3xl font-bold text-foreground">{questionsCount}</p>
            <p className="text-sm text-muted-foreground">Questions</p>
          </div>
          <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-3xl font-bold text-green-600">{score}</p>
            <p className="text-sm text-muted-foreground">Correct</p>
          </div>
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
            <p className="text-3xl font-bold text-primary">{Math.round((score / questionsCount) * 100)}%</p>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </div>
        </div>

        {selectedQuizType === 'timed' && (
          <div className="p-4 bg-muted/30 rounded-xl mb-6">
            <p className="text-sm text-muted-foreground">Total Time</p>
            <p className="text-2xl font-bold text-foreground">{totalTime}s</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => startQuiz(selectedQuizType!)}
            className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={backToHub}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quiz Hub
          </Button>
          <Link to="/progress">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <BarChart3 className="mr-2 h-4 w-4" />
              Progress
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );

  // Render current quiz type
  const renderQuiz = () => {
    switch (selectedQuizType) {
      case 'identify':
        return renderIdentifyQuiz();
      case 'match':
        return renderMatchQuiz();
      case 'spot-wrong':
        return renderSpotWrongQuiz();
      case 'meaning':
        return renderMeaningQuiz();
      case 'single-double':
        return renderSingleDoubleQuiz();
      case 'confidence':
        return renderConfidenceQuiz();
      case 'timed':
        return renderTimedQuiz();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              🧠 Mudra Challenge
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            Learn, recognize, and master Bharatanatyam mudras through interactive challenges.
          </p>
        </motion.div>

        {/* Progress Bar (when playing) */}
        {(quizState === 'playing' || quizState === 'answered') && selectedQuizType !== 'match' && (
          <div className="mb-6 max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-2">
              <Button variant="ghost" size="sm" onClick={backToHub}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Exit
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questionsCount}
              </span>
              <span className="text-sm font-bold text-primary">
                Score: {score}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {quizState === 'hub' && renderHub()}
          {quizState === 'intro' && renderIntro()}
          {(quizState === 'playing' || quizState === 'answered') && renderQuiz()}
          {quizState === 'complete' && renderComplete()}
        </AnimatePresence>
      </div>
    </div>
  );
}
