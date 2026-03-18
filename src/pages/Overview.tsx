import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Hand, Sparkles, Theater, Heart, Globe } from 'lucide-react';

export default function Overview() {
  return (
    <div className="min-h-screen py-20 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Bharatanatyam Mudras: A Detailed Overview
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Understanding the sacred art of hand gestures in Indian classical dance
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-primary to-primary/70 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">What is Bharatanatyam?</h2>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Bharatanatyam is one of the oldest and most celebrated classical dance forms of India, 
                  originating from the temples of Tamil Nadu. With a history spanning over 2,000 years, 
                  this dance form is a perfect amalgamation of Bhava (expression), Raga (melody), Tala (rhythm), 
                  and Natya (drama).
                </p>
                <p>
                  The name "Bharatanatyam" is derived from the sage Bharata, who wrote the Natya Shastra, 
                  an ancient treatise on performing arts. The dance form is characterized by its fixed upper 
                  torso, bent legs, and sophisticated footwork combined with a rich vocabulary of sign language 
                  based on gestures of hands, eyes, and face muscles.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Mudras Explained */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-secondary to-secondary/70 rounded-lg">
                  <Hand className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Understanding Mudras (Hastas)</h2>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Mudras, also called Hastas, are hand gestures that form the vocabulary of Bharatanatyam. 
                  The word "Hasta" means hand in Sanskrit, and these gestures are the primary means of 
                  communication in classical Indian dance. Each mudra conveys specific meanings, emotions, 
                  objects, or concepts.
                </p>
                <p>
                  According to the Natya Shastra and Abhinaya Darpana (ancient texts on performing arts), 
                  there are two main categories of mudras:
                </p>
                <div className="pl-6 space-y-2">
                  <div>
                    <strong className="text-foreground">1. Asamyuta Hastas (Single-Hand Mudras):</strong> These are 
                    performed using one hand. Traditionally, there are 28 Asamyuta Hastas, each with multiple 
                    meanings depending on the context. These form the foundation of the mudra vocabulary.
                  </div>
                  <div>
                    <strong className="text-foreground">2. Samyuta Hastas (Two-Hand Mudras):</strong> These require 
                    both hands working together. There are traditionally 21 to 24 Samyuta Hastas, used to depict 
                    more complex concepts, deities, and actions.
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Significance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-accent to-accent/70 rounded-lg">
                  <Sparkles className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Significance of Mudras</h2>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Mudras are not just decorative elements; they are the very language of classical dance. 
                  Their significance extends across multiple dimensions:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">🎭 Storytelling</h3>
                    <p className="text-sm">
                      Mudras enable dancers to narrate complex stories from Hindu mythology, epics like 
                      Ramayana and Mahabharata, without using words.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">🙏 Spiritual Expression</h3>
                    <p className="text-sm">
                      Many mudras have spiritual significance and are used in depicting deities, divine 
                      attributes, and sacred symbols.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">🌍 Universal Language</h3>
                    <p className="text-sm">
                      The mudra system creates a universal sign language that transcends linguistic barriers, 
                      making the art form accessible globally.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">📚 Cultural Heritage</h3>
                    <p className="text-sm">
                      Mudras preserve ancient knowledge and cultural wisdom passed down through generations 
                      of gurus and disciples.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Performance Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg">
                  <Theater className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Mudras in Performance</h2>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  In a Bharatanatyam performance, mudras work in conjunction with other elements:
                </p>
                <ul className="space-y-2 pl-6">
                  <li>
                    <strong className="text-foreground">Nritta (Pure Dance):</strong> Mudras are used decoratively 
                    with intricate footwork and rhythmic patterns, focusing on beauty and geometry of movements.
                  </li>
                  <li>
                    <strong className="text-foreground">Nritya (Expressive Dance):</strong> Mudras convey specific 
                    meanings, combined with facial expressions (abhinaya) to tell stories and express emotions.
                  </li>
                  <li>
                    <strong className="text-foreground">Natya (Dramatic Element):</strong> Mudras help in character 
                    portrayal and dramatic storytelling, often depicting dialogues and interactions between characters.
                  </li>
                </ul>
                <Separator className="my-4" />
                <p>
                  The same mudra can have multiple meanings depending on the context, song lyrics, facial expressions, 
                  and body posture. For example, the Pataka mudra can represent a flag, cloud, forest, night, river, 
                  or even the act of walking, depending on how it's used in the performance.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Learning Journey */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-accent to-primary rounded-lg">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Learning Mudras</h2>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Mastering mudras is a journey that requires dedication, practice, and guidance:
                </p>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <strong className="text-foreground">Foundational Training:</strong> Students begin with basic 
                      mudras like Pataka, Tripataka, and Mushti, learning the precise hand positions and finger placements.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <strong className="text-foreground">Meaning Association:</strong> Each mudra is learned with 
                      its various meanings, requiring memorization of traditional associations from ancient texts.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <strong className="text-foreground">Fluid Transitions:</strong> Advanced students learn to 
                      transition smoothly between mudras while maintaining grace and precision.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div>
                      <strong className="text-foreground">Contextual Application:</strong> The highest level involves 
                      understanding when and how to use each mudra effectively in storytelling and expression.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Modern Relevance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-secondary to-accent rounded-lg">
                  <Globe className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Mudras in the Modern World</h2>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Today, Bharatanatyam mudras continue to evolve while maintaining their traditional essence:
                </p>
                <ul className="space-y-2 pl-6">
                  <li>
                    <strong className="text-foreground">Global Recognition:</strong> Bharatanatyam is performed 
                    worldwide, with mudras serving as a cultural bridge connecting diverse audiences.
                  </li>
                  <li>
                    <strong className="text-foreground">Digital Preservation:</strong> Projects like ours use 
                    technology to document and preserve the knowledge of mudras for future generations.
                  </li>
                  <li>
                    <strong className="text-foreground">Educational Tools:</strong> AI and computer vision help 
                    students learn mudras more effectively by providing instant feedback and recognition.
                  </li>
                  <li>
                    <strong className="text-foreground">Contemporary Interpretations:</strong> Modern choreographers 
                    use traditional mudras in innovative ways while respecting their classical roots.
                  </li>
                </ul>
                <Separator className="my-4" />
                <p className="italic">
                  Our Deep Learning project aims to make this ancient art form more accessible by creating an 
                  automated system to recognize and classify mudras, helping both learners and researchers in 
                  preserving this invaluable cultural heritage.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
