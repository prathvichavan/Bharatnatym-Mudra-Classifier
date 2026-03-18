import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import {
  FolderOpen,
  Hand,
  Brain,
  BarChart3,
  TrendingUp,
  FileText,
  ExternalLink,
  Sparkles,
  ArrowRight,
  BookOpen,
  Database,
  Target,
  Award,
  Layers,
  FlaskConical,
} from 'lucide-react';
import { ModelArchitectureDiagram } from '@/components/ModelArchitectureDiagram';

export default function ModelResearch() {
  return (
    <div className="min-h-screen py-20 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Model & Research Overview
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium mb-4">
            Technical insights into the deep learning framework for Bharatanatyam mudra recognition
          </p>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            This section summarizes the dataset, model architecture, training process,
            and performance evaluation of our AI-based Bharatanatyam mudra recognition system.
          </p>
        </motion.div>

        {/* Abstract & Results Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mx-auto max-w-[900px] mb-16"
        >
          {/* Research Abstract Card */}
          <Card className="p-8 md:p-10 bg-card/60 backdrop-blur-sm border-border/50 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Research Abstract</h2>
            </div>
            <div className="pl-1 border-l-4 border-primary/30 ml-1">
              <p className="text-muted-foreground leading-relaxed text-[15px] md:text-base pl-5 text-justify">
                Bharatanatyam is an ancient classical dance form of India that depicts mudras as a systemic language representing emotions, storytelling, and spiritual expression. Modern learners find it challenging to interpret these correctly due to their visual complexity and minute variations of the hands forming different mudras. We propose a deep-learning-based single-hand and double-hand Bharatanatyam mudra recognition framework using a dataset collected for the purpose. We adopt EfficientNetB0 for feature extraction and classification purposes and implement the deep network using PyTorch. Further, the system is deployed with a modern FastAPI backend and React + TypeScript + Tailwind CSS frontend. Our dataset consists of 51 mudras (28 single-hand, 23 double-hand) with 300 images in each class, which our team has fully collected and annotated. The model obtains an accuracy of 99.71% and 99.89% for single- and double-hand mudra recognitions, respectively, which is exceptionally good. This work represents one of the pioneering attempts to develop an automated recognition framework of Bharatanatyam mudras using deep learning, hence contributing to the preservation of culture, digital learning, and performing-arts education.
              </p>
            </div>

            <Separator className="my-8" />

            {/* Key Results */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-accent to-primary rounded-lg">
                <Award className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Key Results</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Single-Hand Classes */}
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-shadow"
              >
                <Layers className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Single-Hand Mudra Classes</p>
                <p className="text-3xl font-bold text-primary">28</p>
              </motion.div>

              {/* Double-Hand Classes */}
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group p-5 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 hover:shadow-lg hover:shadow-secondary/10 transition-shadow"
              >
                <Layers className="h-5 w-5 text-secondary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Double-Hand Mudra Classes</p>
                <p className="text-3xl font-bold text-secondary">23</p>
              </motion.div>

              {/* Total Mudras */}
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:shadow-lg hover:shadow-accent/10 transition-shadow"
              >
                <Database className="h-5 w-5 text-accent-foreground mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Mudras Recognized</p>
                <p className="text-3xl font-bold text-accent-foreground">51</p>
              </motion.div>

              {/* Images per Class */}
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group p-5 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-shadow"
              >
                <FlaskConical className="h-5 w-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Images per Class</p>
                <p className="text-3xl font-bold text-primary">300</p>
              </motion.div>

              {/* Single-Hand Accuracy */}
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 hover:shadow-lg hover:shadow-green-500/10 transition-shadow"
              >
                <Target className="h-5 w-5 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Single-Hand Accuracy</p>
                <p className="text-3xl font-bold text-green-500">99.71%</p>
              </motion.div>

              {/* Double-Hand Accuracy */}
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10 transition-shadow"
              >
                <Target className="h-5 w-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Double-Hand Accuracy</p>
                <p className="text-3xl font-bold text-emerald-500">99.89%</p>
              </motion.div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-muted/20 rounded-lg border border-border/30 text-center">
              <p className="text-sm text-muted-foreground italic">
                This page presents a summarized demonstration of the research results. The full paper is available through the official publisher.
              </p>
            </div>
          </Card>
        </motion.section>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Dataset Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary to-primary/70 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">📂 Dataset Details</h2>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-1">Total Mudras</h3>
                    <p className="text-2xl font-bold text-primary">51</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-1">Single-Hand Mudras</h3>
                    <p className="text-lg font-bold text-primary">28 classes</p>
                    <p className="text-sm text-muted-foreground">8,400 images</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-1">Double-Hand Mudras</h3>
                    <p className="text-lg font-bold text-primary">23 classes</p>
                    <p className="text-sm text-muted-foreground">~6,700 images</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-1">Images per Class</h3>
                    <p className="text-lg font-bold text-primary">~300</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-1">Image Type</h3>
                    <p className="text-lg font-bold text-primary">RGB</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-1">Image Size</h3>
                    <p className="text-lg font-bold text-primary">224 × 224</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Preprocessing</h3>
                  <p className="text-muted-foreground">Resizing, normalization, data augmentation</p>
                </div>
                <Separator className="my-4" />
                <p className="text-muted-foreground leading-relaxed">
                  The dataset was self-curated under controlled conditions to capture fine-grained
                  hand gesture variations while maintaining uniform lighting and background,
                  ensuring robust model generalization.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Single vs Double Hand Strategy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-secondary to-secondary/70 rounded-lg">
                  <Hand className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">👐 Mudra Classification Strategy</h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-muted/30 rounded-lg border-l-4 border-primary">
                  <h3 className="text-lg font-bold text-foreground mb-3">Single-Hand Mudras (Asamyuta Hasta)</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      One-hand gesture structure
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Lower spatial complexity
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Independent classification model
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-muted/30 rounded-lg border-l-4 border-secondary">
                  <h3 className="text-lg font-bold text-foreground mb-3">Double-Hand Mudras (Samyuta Hasta)</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      Two-hand coordination
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      Higher spatial dependency
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      Independent classification model
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Single-hand and double-hand mudras are treated as separate recognition tasks
                to reduce inter-class confusion and improve overall classification accuracy.
              </p>
            </Card>
          </motion.div>

          {/* Model Architecture Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-accent to-accent/70 rounded-lg">
                  <Brain className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">🧠 Model Architecture</h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-1">Base Architecture</h3>
                  <p className="text-lg font-bold text-primary">EfficientNet-B0</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-1">Framework</h3>
                  <p className="text-lg font-bold text-primary">PyTorch</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-1">Transfer Learning</h3>
                  <p className="text-lg font-bold text-primary">Enabled</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-1">Pooling</h3>
                  <p className="text-lg font-bold text-primary">Global Average Pooling</p>
                </div>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg mb-6">
                <h3 className="font-semibold text-foreground mb-1">Classification Layer</h3>
                <p className="text-muted-foreground">Custom fully connected classification layer</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                EfficientNet-B0 is used as a feature extractor due to its balance between
                computational efficiency and representational power. Transfer learning enables
                faster convergence and high accuracy even with limited data.
              </p>
              {/* Model Architecture Diagram */}
              <ModelArchitectureDiagram />
            </Card>
          </motion.div>

          {/* Performance Metrics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-lg">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">📊 Model Performance</h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-1">Single-Hand Accuracy</h3>
                  <p className="text-3xl font-bold text-primary">99.71%</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20">
                  <h3 className="font-semibold text-foreground mb-1">Double-Hand Accuracy</h3>
                  <p className="text-3xl font-bold text-secondary">99.89%</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                  <h3 className="font-semibold text-foreground mb-1">Average Precision</h3>
                  <p className="text-3xl font-bold text-accent-foreground">&gt; 0.99</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                  <h3 className="font-semibold text-foreground mb-1">Average Recall</h3>
                  <p className="text-3xl font-bold text-accent-foreground">&gt; 0.99</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-1">F1-Score</h3>
                  <p className="text-3xl font-bold text-primary">&gt; 0.99</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The consistently high evaluation metrics indicate reliable and stable performance
                across all Bharatanatyam mudra classes.
              </p>
            </Card>
          </motion.div>

          {/* Training vs Validation Analysis Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-accent to-primary rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">📈 Training & Validation Analysis</h2>
                </div>
              </div>
              
              {/* 2x2 Grid: Top Row - Accuracy, Bottom Row - Loss */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Top Left: Single-Hand Accuracy */}
                <div className="p-4 bg-muted/20 rounded-xl border border-border/50 shadow-sm">
                  <h3 className="text-sm md:text-base font-semibold text-foreground text-center mb-4">
                    Training vs Validation Accuracy (Single-Hand Model)
                  </h3>
                  <div className="flex justify-center">
                    <img
                      src="/accuracy singal hand .jpeg"
                      alt="Training vs Validation Accuracy - Single-Hand Model"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                </div>

                {/* Top Right: Double-Hand Accuracy */}
                <div className="p-4 bg-muted/20 rounded-xl border border-border/50 shadow-sm">
                  <h3 className="text-sm md:text-base font-semibold text-foreground text-center mb-4">
                    Training vs Validation Accuracy (Double-Hand Model)
                  </h3>
                  <div className="flex justify-center">
                    <img
                      src="/accuract doubal hand.jpeg"
                      alt="Training vs Validation Accuracy - Double-Hand Model"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                </div>

                {/* Bottom Left: Single-Hand Loss */}
                <div className="p-4 bg-muted/20 rounded-xl border border-border/50 shadow-sm">
                  <h3 className="text-sm md:text-base font-semibold text-foreground text-center mb-4">
                    Training vs Validation Loss (Single-Hand Model)
                  </h3>
                  <div className="flex justify-center">
                    <img
                      src="/loss singal hand .jpeg"
                      alt="Training vs Validation Loss - Single-Hand Model"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                </div>

                {/* Bottom Right: Double-Hand Loss */}
                <div className="p-4 bg-muted/20 rounded-xl border border-border/50 shadow-sm">
                  <h3 className="text-sm md:text-base font-semibold text-foreground text-center mb-4">
                    Training vs Validation Loss (Double-Hand Model)
                  </h3>
                  <div className="flex justify-center">
                    <img
                      src="/loss doubal hand.jpeg"
                      alt="Training vs Validation Loss - Double-Hand Model"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Analysis Text */}
              <div className="p-4 md:p-6 bg-muted/30 rounded-xl border border-border/30 mb-4">
                <p className="text-muted-foreground leading-relaxed italic text-center">
                  "As observed in the graphs, the training and validation curves
                  for both single-hand and double-hand models closely overlap,
                  indicating that the models do not suffer from overfitting and
                  generalize well on unseen data."
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed text-center">
                The smooth convergence of accuracy and loss curves reflects
                stable learning behavior and effective model optimization.
              </p>
            </Card>
          </motion.div>

          {/* Research Paper Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-secondary to-accent rounded-lg">
                  <FileText className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">📄 Research Publication</h2>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  This project has been documented in a peer-reviewed academic paper.
                  Due to publisher copyright policies, the final published PDF is not hosted on this website.
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Paper on Publisher Website
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Read Abstract & Results Summary
                    </Button>
                  </motion.div>
                </div>
                <Separator className="my-4" />
                <p className="text-sm text-muted-foreground italic">
                  <strong>Disclaimer:</strong> The published paper is available through the official academic publisher.
                </p>
                <p className="text-sm text-muted-foreground">
                  The website presents a summarized and demonstrative version of the research,
                  while the complete paper is available through the official publisher.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Footer Callout Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Card className="p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm border-border/50 text-center">
              <div className="mb-6">
                <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
                <p className="text-lg text-foreground leading-relaxed max-w-3xl mx-auto">
                  This research demonstrates how deep learning can support cultural preservation
                  and digital learning in Indian classical dance.
                </p>
              </div>
              <Link to="/classify">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                  >
                    Try Live Mudra Classification
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
