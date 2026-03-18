import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Mudra } from '@/data/mudras';

interface MudraCardProps {
  mudra: Mudra;
  onViewDetails: (mudra: Mudra) => void;
  index: number;
}

export const MudraCard = ({ mudra, onViewDetails, index }: MudraCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
        {/* Image Placeholder */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-muted-foreground/10 overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center">
            {mudra.imageUrl ? (
              <img 
                src={mudra.imageUrl} 
                alt={mudra.nameEnglish}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="text-center p-4">
                <div className="text-6xl mb-2">🙏</div>
                <p className="text-xs text-muted-foreground">
                  [Image: {mudra.nameEnglish}]
                </p>
              </div>
            )}
          </div>
          
          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm
              ${mudra.category === 'basic' ? 'bg-accent/90 text-accent-foreground' : ''}
              ${mudra.category === 'intermediate' ? 'bg-primary/90 text-primary-foreground' : ''}
              ${mudra.category === 'advanced' ? 'bg-secondary/90 text-secondary-foreground' : ''}
            `}>
              {mudra.category}
            </span>
          </div>
        </div>

        <CardContent className="p-5 space-y-3">
          {/* Mudra names */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              {mudra.nameEnglish}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {mudra.nameSanskrit}
            </p>
          </div>

          {/* Short description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {mudra.shortDescription}
          </p>

          {/* View Details Button */}
          <Button
            onClick={() => onViewDetails(mudra)}
            variant="outline"
            className="w-full group border-primary/50 hover:bg-primary hover:text-primary-foreground"
          >
            <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
