import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mudra } from '@/data/mudras';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface MudraDetailModalProps {
  mudra: Mudra | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MudraDetailModal = ({ mudra, isOpen, onClose }: MudraDetailModalProps) => {
  if (!mudra) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {mudra.nameEnglish}
              </DialogTitle>
              <p className="text-lg text-muted-foreground font-medium">
                {mudra.nameSanskrit}
              </p>
            </DialogHeader>

            {/* Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted-foreground/10">
              {mudra.imageUrl ? (
                <img 
                  src={mudra.imageUrl} 
                  alt={mudra.nameEnglish}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🙏</div>
                    <p className="text-sm text-muted-foreground">
                      [Image: {mudra.nameEnglish}]
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Type and Category */}
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  {mudra.type === 'one-hand' ? 'One-Hand (Asamyuta)' : 'Two-Hand (Samyuta)'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium
                  ${mudra.category === 'basic' ? 'bg-accent/20 text-accent' : ''}
                  ${mudra.category === 'intermediate' ? 'bg-primary/20 text-primary' : ''}
                  ${mudra.category === 'advanced' ? 'bg-secondary/20 text-secondary' : ''}
                `}>
                  {mudra.category}
                </span>
              </div>

              <Separator />

              {/* Long Description */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground leading-relaxed">{mudra.longDescription}</p>
              </div>

              <Separator />

              {/* Meaning */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Meaning & Symbolism</h4>
                <p className="text-muted-foreground leading-relaxed">{mudra.meaning}</p>
              </div>

              <Separator />

              {/* Usage */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Usage in Bharatanatyam</h4>
                <p className="text-muted-foreground leading-relaxed">{mudra.usage}</p>
              </div>

              <Separator />

              {/* Hand Shape */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Hand Shape</h4>
                <p className="text-muted-foreground leading-relaxed">{mudra.handShape}</p>
              </div>

              <Separator />

              {/* Expression */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Facial Expression (Bhava)</h4>
                <p className="text-muted-foreground leading-relaxed">{mudra.expression}</p>
              </div>

              {/* Notes (if available) */}
              {mudra.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Additional Notes</h4>
                    <p className="text-muted-foreground leading-relaxed italic">{mudra.notes}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
