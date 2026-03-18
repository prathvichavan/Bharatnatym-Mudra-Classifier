import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, CheckCircle, AlertCircle, RotateCcw, X, Wifi, WifiOff, Zap, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { classifyOneHandMudra, classifyTwoHandMudra, ClassificationResult, warmUpApi, testApiConnection, wakeUpApi, WakeUpResult } from '@/utils/modelHandlers';
import { getMudraById } from '@/data/mudras';
import { saveClassification } from '@/utils/historyApi';
import ClassificationHistory from '@/components/ClassificationHistory';

export default function Classify() {
  const [apiStatus, setApiStatus] = useState<'unknown' | 'sleeping' | 'waking' | 'active'>('unknown');
  const [historyRefresh, setHistoryRefresh] = useState(0);
  
  useEffect(() => {
    // Auto-warm up the API when the page loads
    const initializeAPI = async () => {
      setApiStatus('waking');
      try {
        const success = await warmUpApi();
        setApiStatus(success ? 'active' : 'sleeping');
      } catch (error) {
        console.warn('Auto warm-up failed:', error);
        setApiStatus('sleeping');
      }
    };
    
    initializeAPI();
  }, []);

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Upload & Classify Mudra
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Upload an image of a Bharatanatyam mudra and let our Deep Learning models identify it 
            with detailed information about its meaning, usage, and context.
          </p>
          
          {/* API Status Indicator */}
          <div className="flex justify-center mt-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              apiStatus === 'active' ? 'bg-green-500/20 text-green-600 border border-green-500/30' :
              apiStatus === 'waking' ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30' :
              apiStatus === 'sleeping' ? 'bg-red-500/20 text-red-600 border border-red-500/30' :
              'bg-muted/50 text-muted-foreground border border-border/50'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'active' ? 'bg-green-500 animate-pulse' :
                apiStatus === 'waking' ? 'bg-amber-500 animate-pulse' :
                apiStatus === 'sleeping' ? 'bg-red-500' :
                'bg-muted-foreground'
              }`} />
              <span>
                AI Service: {
                  apiStatus === 'active' ? 'Ready' :
                  apiStatus === 'waking' ? 'Starting...' :
                  apiStatus === 'sleeping' ? 'Sleeping' :
                  'Checking...'
                }
              </span>
            </div>
          </div>
        </motion.div>

        {/* AI Service Status & Wake Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="p-6 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-border/50 rounded-2xl max-w-4xl mx-auto mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-foreground mb-1">AI Service Status</h3>
              <p className="text-sm text-muted-foreground">
                If classification is slow or fails, the AI model may be sleeping. Click wake to activate it.
              </p>
            </div>
            <WakeServiceButton onStatusChange={setApiStatus} />
          </div>
        </motion.div>

        {/* Classification Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          <ClassificationCard
            type="one-hand"
            title="Classify One-Hand Mudra"
            disabled={false}
            onClassified={() => setHistoryRefresh(prev => prev + 1)}
          />
          
          <ClassificationCard
            type="two-hand"
            title="Classify Two-Hand Mudra"
            disabled={false}
            comingSoon={false}
            onClassified={() => setHistoryRefresh(prev => prev + 1)}
          />
        </div>

        {/* Classification History Section */}
        <ClassificationHistory refreshTrigger={historyRefresh} />

        {/* Technical Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl max-w-4xl mx-auto mt-12"
        >
          <h3 className="text-lg font-semibold text-foreground mb-3">About the Models</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>One-Hand Model:</strong> Trained on thousands of Bharatanatyam Asamyuta Hasta images 
              to recognize 28 different one-hand mudras with high accuracy using PyTorch.
            </p>
            <p>
              <strong>Two-Hand Model:</strong> Ready to recognize 21 Samyuta Hasta mudras using 
              deep learning algorithms trained on traditional Bharatanatyam hand gestures.
            </p>
            <p className="italic">
              Both models are built using PyTorch and will be deployed for inference in the browser using API or similar technology.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface ClassificationCardProps {
  type: 'one-hand' | 'two-hand';
  title: string;
  disabled?: boolean;
  comingSoon?: boolean;
  onClassified?: () => void;
}

function ClassificationCard({ type, title, disabled = false, comingSoon = false, onClassified }: ClassificationCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPG, PNG, WEBP)',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 50MB',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFileSelect(file || null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    handleFileSelect(file || null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClassify = async () => {
    if (!selectedFile) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image first',
        variant: 'destructive',
      });
      return;
    }

    setIsClassifying(true);
    setResult(null);

    try {
      const classificationResult = type === 'one-hand' 
        ? await classifyOneHandMudra(selectedFile)
        : await classifyTwoHandMudra(selectedFile);

      setResult(classificationResult);

      // Save classification to backend history
      if (selectedFile) {
        saveClassification(
          selectedFile,
          type,
          classificationResult.predictedMudra,
          parseFloat((classificationResult.confidence * 100).toFixed(1))
        ).then(() => {
          onClassified?.();
        }).catch((err) => console.warn('History save failed:', err));
      }

      toast({
        title: 'Classification complete',
        description: `Detected: ${classificationResult.predictedMudra}`,
      });
    } catch (error) {
      console.error('Classification error:', error);
      toast({
        title: 'Classification failed',
        description: 'An error occurred during classification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsClassifying(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setConnectionStatus(null);
    toast({
      title: 'Reset complete',
      description: 'Ready for a new classification',
    });
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionStatus(null);
    
    try {
      const result = await testApiConnection();
      setConnectionStatus(result);
      
      toast({
        title: result.connected ? 'API Connected' : 'Connection Failed',
        description: result.message,
        variant: result.connected ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus({ 
        connected: false, 
        message: 'Connection test failed' 
      });
      toast({
        title: 'Connection test failed',
        description: 'Unable to test API connection',
        variant: 'destructive',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const mudraDetails = result ? getMudraById(result.mudraId) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full"
    >
      <Card className={`h-full ${disabled ? 'opacity-75' : ''} bg-card/50 backdrop-blur-sm border-border/50`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title}
            </CardTitle>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              type === 'one-hand' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-secondary/20 text-secondary'
            }`}>
              {type === 'one-hand' ? '28 Mudras' : '23 Mudras'}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                disabled 
                  ? 'border-muted bg-muted/20 cursor-not-allowed' 
                  : isDragging
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-border hover:border-primary bg-muted/30 cursor-pointer'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                disabled={disabled}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              />
              
              <div className="text-center pointer-events-none">
                {preview ? (
                  <div className="space-y-4">
                    <img 
                      src={preview} 
                      alt="Selected mudra" 
                      className="max-h-64 mx-auto rounded-lg shadow-md object-contain"
                    />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedFile && `${(selectedFile.size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="text-lg font-medium text-foreground mb-2">
                      {isDragging ? 'Drop image here' : 'Drop image here or click to browse'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, WEBP (max 50MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Connection Status Banner */}
            {connectionStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  connectionStatus.connected 
                    ? 'bg-accent/20 text-accent' 
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {connectionStatus.connected ? (
                  <Wifi className="h-4 w-4" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{connectionStatus.message}</span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleTestConnection}
                disabled={isTestingConnection || disabled}
                variant="outline"
                size="lg"
                className="border-border hover:bg-muted"
                title="Test API connection before classifying"
              >
                {isTestingConnection ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : connectionStatus?.connected ? (
                  <Wifi className="h-4 w-4 text-accent" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                onClick={handleClassify}
                disabled={!selectedFile || isClassifying || disabled}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                {isClassifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Classifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Classify Mudra
                  </>
                )}
              </Button>
              
              {(selectedFile || result) && (
                <Button
                  onClick={handleReset}
                  disabled={isClassifying}
                  variant="outline"
                  size="lg"
                  className="border-border hover:bg-muted"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 p-6 bg-gradient-to-br from-muted/50 to-card rounded-2xl border border-border/50 relative overflow-hidden"
            >
              {/* Success/Warning Indicator */}
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-10">
                {result.confidence > 0.7 ? (
                  <CheckCircle className="w-full h-full text-accent" />
                ) : (
                  <AlertCircle className="w-full h-full text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    result.confidence > 0.7 
                      ? 'bg-accent/20' 
                      : 'bg-muted'
                  }`}>
                    {result.confidence > 0.7 ? (
                      <CheckCircle className="h-6 w-6 text-accent" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Prediction Result</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    result.confidence > 0.9 
                      ? 'bg-accent' 
                      : result.confidence > 0.7 
                      ? 'bg-primary' 
                      : 'bg-muted-foreground'
                  }`} />
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    result.confidence > 0.9 
                      ? 'bg-accent/20 text-accent' 
                      : result.confidence > 0.7 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {(result.confidence * 100).toFixed(1)}% confident
                  </span>
                </div>
              </div>

              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {result.predictedMudra}
                </p>
                {mudraDetails && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {mudraDetails.nameSanskrit}
                  </p>
                )}
              </div>

              {mudraDetails ? (
                <div className="space-y-3 pt-4 border-t border-border/30">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <span className="text-primary">•</span> Meaning
                    </h4>
                    <p className="text-sm text-muted-foreground">{mudraDetails.meaning}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <span className="text-primary">•</span> Usage
                    </h4>
                    <p className="text-sm text-muted-foreground">{mudraDetails.usage}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <span className="text-primary">•</span> Hand Shape
                    </h4>
                    <p className="text-sm text-muted-foreground">{mudraDetails.handShape}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <span className="text-primary">•</span> Expression
                    </h4>
                    <p className="text-sm text-muted-foreground">{mudraDetails.expression}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">Mudra details not found in database</p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Wake Service Button Component
function WakeServiceButton({ onStatusChange }: { onStatusChange: (status: 'unknown' | 'sleeping' | 'waking' | 'active') => void }) {
  const [isWaking, setIsWaking] = useState(false);
  const [wakeResult, setWakeResult] = useState<WakeUpResult | null>(null);
  const [lastWakeTime, setLastWakeTime] = useState<number>(0);
  const { toast } = useToast();

  const handleWakeService = async () => {
    // Rate limiting: don't allow wake attempts more than once every 30 seconds
    const now = Date.now();
    if (now - lastWakeTime < 30000) {
      const remaining = Math.ceil((30000 - (now - lastWakeTime)) / 1000);
      toast({
        title: 'Please wait',
        description: `You can wake the service again in ${remaining} seconds`,
        variant: 'default',
      });
      return;
    }

    setIsWaking(true);
    setWakeResult(null);
    setLastWakeTime(now);
    onStatusChange('waking');
    
    try {
      const result = await wakeUpApi();
      setWakeResult(result);
      onStatusChange(result.success ? 'active' : 'sleeping');
      
      toast({
        title: result.success ? 'AI Model Activated' : 'Wake Request Sent',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Wake service error:', error);
      const failureResult: WakeUpResult = {
        success: false,
        message: 'Failed to communicate with AI service'
      };
      setWakeResult(failureResult);
      onStatusChange('sleeping');
      
      toast({
        title: 'Wake failed',
        description: 'Unable to wake AI service. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsWaking(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        onClick={handleWakeService}
        disabled={isWaking}
        size="lg"
        className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-lg hover:shadow-xl transition-all"
      >
        {isWaking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Waking AI Model...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            Wake AI Model
          </>
        )}
      </Button>
      
      {/* Status Display */}
      {wakeResult && !isWaking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            wakeResult.success 
              ? 'bg-accent/20 text-accent border border-accent/30' 
              : 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
          }`}
        >
          {wakeResult.success ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <Clock className="h-3 w-3" />
          )}
          <span>
            {wakeResult.success 
              ? `Ready ${wakeResult.responseTime ? `(${Math.round(wakeResult.responseTime / 1000)}s)` : ''}`
              : 'Service starting...'
            }
          </span>
        </motion.div>
      )}
      
      {/* Auto-clear result after 10 seconds */}
      {wakeResult && !isWaking && (
        <div className="hidden">
          {setTimeout(() => setWakeResult(null), 10000)}
        </div>
      )}
    </div>
  );
}
