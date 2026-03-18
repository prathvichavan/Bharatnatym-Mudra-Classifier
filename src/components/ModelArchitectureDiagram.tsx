import { motion } from 'framer-motion';

interface ArchitectureBlockProps {
  title: string;
  subtitle?: string;
  delay: number;
  isPrimary?: boolean;
  isAccent?: boolean;
  isSecondary?: boolean;
}

const ArchitectureBlock = ({ title, subtitle, delay, isPrimary, isAccent, isSecondary }: ArchitectureBlockProps) => {
  let bgClass = 'bg-gradient-to-r from-muted/60 to-muted/40 border-border/60';
  let textClass = 'text-foreground';
  
  if (isPrimary) {
    bgClass = 'bg-gradient-to-r from-primary/15 to-primary/10 border-primary/30';
    textClass = 'text-primary';
  } else if (isSecondary) {
    bgClass = 'bg-gradient-to-r from-secondary/15 to-secondary/10 border-secondary/30';
    textClass = 'text-secondary';
  } else if (isAccent) {
    bgClass = 'bg-gradient-to-r from-accent/15 to-accent/10 border-accent/30';
    textClass = 'text-accent-foreground';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className={`px-4 py-3 md:px-6 md:py-4 rounded-xl border ${bgClass} shadow-sm text-center w-full max-w-xs mx-auto`}
    >
      <p className={`font-semibold text-sm md:text-base ${textClass}`}>{title}</p>
      {subtitle && (
        <p className="text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </motion.div>
  );
};

const ArrowDown = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scaleY: 0 }}
    animate={{ opacity: 1, scaleY: 1 }}
    transition={{ delay: delay * 0.1, duration: 0.3 }}
    className="flex justify-center py-2"
  >
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" className="text-primary">
      <path
        d="M12 0L12 28M12 28L4 20M12 28L20 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </motion.div>
);

export function ModelArchitectureDiagram() {
  return (
    <div className="w-full">
      {/* Diagram Title */}
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-lg md:text-xl font-bold text-center mb-8 text-foreground"
      >
        Model Architecture – EfficientNet-B0 Based Mudra Recognition
      </motion.h3>

      {/* Architecture Flow */}
      <div className="flex flex-col items-center py-6 px-4 bg-gradient-to-b from-muted/20 via-background to-muted/20 rounded-2xl border border-border/30 shadow-lg">
        {/* Input Image */}
        <ArchitectureBlock
          title="Input Image"
          subtitle="Single-Hand / Double-Hand Mudra"
          delay={1}
          isPrimary
        />
        <ArrowDown delay={1.5} />

        {/* Image Preprocessing */}
        <ArchitectureBlock
          title="Image Preprocessing"
          subtitle="Resize 224×224, RGB, Normalization"
          delay={2}
        />
        <ArrowDown delay={2.5} />

        {/* EfficientNet-B0 Backbone */}
        <ArchitectureBlock
          title="EfficientNet-B0 Backbone"
          subtitle="Pre-trained on ImageNet"
          delay={3}
          isSecondary
        />
        <ArrowDown delay={3.5} />

        {/* Feature Extraction */}
        <ArchitectureBlock
          title="Feature Extraction"
          subtitle="Depthwise Separable Convolutions"
          delay={4}
          isSecondary
        />
        <ArrowDown delay={4.5} />

        {/* Global Average Pooling */}
        <ArchitectureBlock
          title="Global Average Pooling (GAP)"
          delay={5}
        />
        <ArrowDown delay={5.5} />

        {/* Fully Connected Layer */}
        <ArchitectureBlock
          title="Fully Connected Layer"
          subtitle="Custom Mudra Classes"
          delay={6}
        />
        <ArrowDown delay={6.5} />

        {/* Softmax Activation */}
        <ArchitectureBlock
          title="Softmax Activation"
          delay={7}
          isAccent
        />
        <ArrowDown delay={7.5} />

        {/* Predicted Mudra Label */}
        <ArchitectureBlock
          title="Predicted Mudra Label"
          subtitle="+ Confidence Score"
          delay={8}
          isPrimary
        />
      </div>

      {/* Description Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-8 p-4 md:p-6 bg-muted/30 rounded-xl border border-border/30"
      >
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center">
          The proposed system uses an EfficientNet-B0 based deep learning architecture
          for Bharatanatyam mudra recognition. Input images are preprocessed and passed
          through the EfficientNet-B0 backbone for feature extraction. Global Average
          Pooling reduces overfitting, and a fully connected layer with Softmax produces
          the final mudra classification.
        </p>
      </motion.div>
    </div>
  );
}
