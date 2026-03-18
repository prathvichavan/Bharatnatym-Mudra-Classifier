import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Target,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Brain,
  Trophy,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';

export default function MyProgress() {
  const { progress, resetProgress } = useProgress();

  const levelInfo = {
    Beginner: { color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '🌱', next: 30 },
    Intermediate: { color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '🌿', next: 100 },
    Advanced: { color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '🌳', next: null },
  };

  const currentLevelInfo = levelInfo[progress.level];
  const progressToNextLevel = currentLevelInfo.next
    ? Math.min((progress.correctPredictions / currentLevelInfo.next) * 100, 100)
    : 100;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Calculate accuracy trend from quiz results
  const getAccuracyTrend = () => {
    if (progress.quizResults.length < 2) return null;
    const recent = progress.quizResults.slice(0, 3);
    const avgRecent = recent.reduce((sum, q) => sum + q.accuracy, 0) / recent.length;
    const older = progress.quizResults.slice(3, 6);
    if (older.length === 0) return null;
    const avgOlder = older.reduce((sum, q) => sum + q.accuracy, 0) / older.length;
    return avgRecent - avgOlder;
  };

  const accuracyTrend = getAccuracyTrend();

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <div className="container mx-auto max-w-5xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              📊 My Progress
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            Track your learning journey and mudra recognition improvement over time.
          </p>
        </motion.div>

        {/* Level & Streak Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-card/50 to-secondary/10 backdrop-blur-sm border-border/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Level Info */}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full ${currentLevelInfo.bg} ${currentLevelInfo.border} border-2 flex items-center justify-center text-3xl`}>
                  {currentLevelInfo.icon}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                  <p className={`text-2xl font-bold ${currentLevelInfo.color}`}>{progress.level}</p>
                  {currentLevelInfo.next && (
                    <div className="mt-2 w-32">
                      <Progress value={progressToNextLevel} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {progress.correctPredictions} / {currentLevelInfo.next} to next level
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 border-2 border-orange-500/20 flex items-center justify-center">
                  <Flame className="h-8 w-8 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Streak</p>
                  <p className="text-2xl font-bold text-orange-600">{progress.streak} days</p>
                </div>
              </div>

              {/* Quick Action */}
              <Link to="/mudra-challenge">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground">
                    <Brain className="mr-2 h-4 w-4" />
                    Take Quiz
                  </Button>
                </motion.div>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{progress.totalAttempts}</p>
            <p className="text-xs text-muted-foreground">Total Attempts</p>
          </Card>

          <Card className="p-4 bg-green-500/10 border-green-500/20 text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-600">{progress.correctPredictions}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </Card>

          <Card className="p-4 bg-red-500/10 border-red-500/20 text-center">
            <XCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <p className="text-2xl font-bold text-red-600">{progress.incorrectPredictions}</p>
            <p className="text-xs text-muted-foreground">Incorrect</p>
          </Card>

          <Card className="p-4 bg-primary/10 border-primary/20 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-primary">{progress.accuracy}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </Card>

          <Card className="p-4 bg-secondary/10 border-secondary/20 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold text-secondary">{progress.quizzesCompleted}</p>
            <p className="text-xs text-muted-foreground">Quizzes Done</p>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Quiz History Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Quiz Performance</h3>
                {accuracyTrend !== null && (
                  <span
                    className={`text-sm font-medium ${
                      accuracyTrend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {accuracyTrend >= 0 ? '↑' : '↓'} {Math.abs(Math.round(accuracyTrend))}%
                  </span>
                )}
              </div>

              {progress.quizResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Trophy className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground mb-4">No quizzes completed yet</p>
                  <Link to="/mudra-challenge">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start First Quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {progress.quizResults.slice(0, 5).map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">
                            Quiz #{progress.quizResults.length - index}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {result.correctAnswers}/{result.totalQuestions}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.accuracy}%` }}
                            transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                            className={`h-full rounded-full ${
                              result.accuracy >= 80
                                ? 'bg-green-500'
                                : result.accuracy >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                          />
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          result.accuracy >= 80
                            ? 'text-green-600'
                            : result.accuracy >= 50
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {result.accuracy}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-accent to-primary rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
              </div>

              {progress.activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No activity yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Complete quizzes or classify mudras to see activity here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {progress.activities.slice(0, 10).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        activity.correct ? 'bg-green-500/10' : 'bg-red-500/10'
                      }`}
                    >
                      {activity.correct ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.type === 'quiz' ? 'Quiz Answer' : 'Recognized'}: {activity.mudraName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          activity.correct ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {activity.correct ? 'Correct' : 'Incorrect'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Achievements</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* First Quiz */}
              <div
                className={`p-4 rounded-xl text-center border-2 ${
                  progress.quizzesCompleted >= 1
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-muted/30 border-border/50 opacity-50'
                }`}
              >
                <span className="text-3xl">{progress.quizzesCompleted >= 1 ? '🎯' : '🔒'}</span>
                <p className="text-sm font-medium mt-2">First Quiz</p>
                <p className="text-xs text-muted-foreground">Complete 1 quiz</p>
              </div>

              {/* Quiz Master */}
              <div
                className={`p-4 rounded-xl text-center border-2 ${
                  progress.quizzesCompleted >= 10
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-muted/30 border-border/50 opacity-50'
                }`}
              >
                <span className="text-3xl">{progress.quizzesCompleted >= 10 ? '🏆' : '🔒'}</span>
                <p className="text-sm font-medium mt-2">Quiz Master</p>
                <p className="text-xs text-muted-foreground">Complete 10 quizzes</p>
              </div>

              {/* Perfect Score */}
              <div
                className={`p-4 rounded-xl text-center border-2 ${
                  progress.quizResults.some((q) => q.accuracy === 100)
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-muted/30 border-border/50 opacity-50'
                }`}
              >
                <span className="text-3xl">
                  {progress.quizResults.some((q) => q.accuracy === 100) ? '💯' : '🔒'}
                </span>
                <p className="text-sm font-medium mt-2">Perfect Score</p>
                <p className="text-xs text-muted-foreground">Get 100% on a quiz</p>
              </div>

              {/* Streak Champion */}
              <div
                className={`p-4 rounded-xl text-center border-2 ${
                  progress.streak >= 7
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-muted/30 border-border/50 opacity-50'
                }`}
              >
                <span className="text-3xl">{progress.streak >= 7 ? '🔥' : '🔒'}</span>
                <p className="text-sm font-medium mt-2">Week Streak</p>
                <p className="text-xs text-muted-foreground">7 day streak</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Motivational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="p-6 bg-gradient-to-r from-primary/10 via-card/50 to-secondary/10 backdrop-blur-sm border-border/50 text-center">
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Consistent practice strengthens both recognition accuracy
              and understanding of Bharatanatyam mudras.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link to="/mudra-challenge">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-6">
                    <Brain className="mr-2 h-4 w-4" />
                    Continue Learning
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  className="border-muted-foreground/30 text-muted-foreground hover:bg-muted"
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all progress?')) {
                      resetProgress();
                    }
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Progress
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
