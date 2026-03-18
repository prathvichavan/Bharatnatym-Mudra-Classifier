import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { oneHandMudras, twoHandMudras, Mudra } from '@/data/mudras';
import { MudraDetailModal } from '@/components/MudraDetailModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export default function MudraGallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMudra, setSelectedMudra] = useState<Mudra | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'one-hand' | 'two-hand'>('one-hand');

  const categories = ['all', 'basic', 'intermediate', 'advanced'];

  const currentMudras = activeTab === 'one-hand' ? oneHandMudras : twoHandMudras;

  const filteredMudras = currentMudras.filter(mudra => {
    const matchesSearch =
      mudra.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mudra.nameSanskrit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mudra.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || mudra.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (mudra: Mudra) => {
    setSelectedMudra(mudra);
    setIsModalOpen(true);
  };

  const renderGrid = () => {
    if (filteredMudras.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No mudras found matching your search criteria.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredMudras.map((mudra) => (
          <Card
            key={mudra.id}
            className="overflow-hidden border border-border shadow-sm bg-card"
          >
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
              {mudra.imageUrl ? (
                <img
                  src={mudra.imageUrl}
                  alt={mudra.nameEnglish}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                  <div>
                    <div className="text-5xl mb-1">🙏</div>
                    <p className="text-xs text-muted-foreground">
                      [Image: {mudra.nameEnglish}]
                    </p>
                  </div>
                </div>
              )}
              <span
                className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${mudra.category === 'basic' ? 'bg-accent/90 text-accent-foreground' : ''}
                  ${mudra.category === 'intermediate' ? 'bg-primary/90 text-primary-foreground' : ''}
                  ${mudra.category === 'advanced' ? 'bg-secondary/90 text-secondary-foreground' : ''}
                `}
              >
                {mudra.category}
              </span>
            </div>
            <CardContent className="p-4 space-y-2">
              <h3 className="text-base font-bold text-foreground leading-tight">
                {mudra.nameEnglish}
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                {mudra.nameSanskrit}
              </p>
              <Button
                onClick={() => handleViewDetails(mudra)}
                variant="outline"
                size="sm"
                className="w-full border-primary/50"
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen py-20 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Mudra Gallery
              </span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-primary via-secondary to-accent rounded-full mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our complete collection of Bharatanatyam mudras. Discover 28 one-hand and 23 two-hand
              gestures with detailed meanings, usage, and cultural significance.
            </p>
          </div>

          {/* Tabs for One-Hand and Two-Hand */}
          <Tabs
            defaultValue="one-hand"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as 'one-hand' | 'two-hand');
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-auto p-1 bg-card/50">
              <TabsTrigger
                value="one-hand"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/80 data-[state=active]:text-primary-foreground py-3 text-sm md:text-base font-medium"
              >
                One-Hand (28)
              </TabsTrigger>
              <TabsTrigger
                value="two-hand"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary/80 data-[state=active]:text-secondary-foreground py-3 text-sm md:text-base font-medium"
              >
                Two-Hand (23)
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search mudras by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 bg-card/50 border-border/50"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm'
                        : 'bg-card/50 text-muted-foreground border border-border/50'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Count Display */}
              <p className="text-center text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredMudras.length}</span> of{' '}
                <span className="font-semibold text-foreground">{currentMudras.length}</span> mudras
              </p>
            </div>

            {/* One-Hand Gallery */}
            <TabsContent value="one-hand" className="mt-6">
              {renderGrid()}
            </TabsContent>

            {/* Two-Hand Gallery */}
            <TabsContent value="two-hand" className="mt-6">
              {renderGrid()}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Detail Modal */}
      <MudraDetailModal
        mudra={selectedMudra}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
