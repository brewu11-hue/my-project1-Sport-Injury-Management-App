'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Camera, Loader2, Wand2 } from 'lucide-react';
import { scanInjury, ScanInjuryOutput } from './actions';

export default function InjuryScanPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScanInjuryOutput | null>(null);
  
  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };
    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        }
      };
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUri);
      setAnalysisResult(null);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
  }

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setIsLoading(true);
    setAnalysisResult(null);
    try {
        const result = await scanInjury(capturedImage);
        setAnalysisResult(result);
    } catch(err) {
        toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: "Could not analyze the image. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">AI Injury Scanner</CardTitle>
          <CardDescription>
            Use your camera to take a picture of an injury for an AI-powered visual assessment. This tool provides insights, not medical advice. Always consult a healthcare professional.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
             {!capturedImage ? (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
             ) : (
                <img src={capturedImage} alt="Captured injury" className="w-full h-full object-contain" />
             )}
          </div>
          {hasCameraPermission === false && (
             <Alert variant="destructive" className="mt-4">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                   Please allow camera access in your browser settings to use this feature.
                </AlertDescription>
             </Alert>
           )}
           <canvas ref={canvasRef} className="hidden" />
        </CardContent>
        <CardContent>
            <div className="flex justify-center gap-4">
                {!capturedImage ? (
                    <Button onClick={handleCapture} disabled={!hasCameraPermission}>
                        <Camera className="mr-2 h-4 w-4" />
                        Capture Image
                    </Button>
                ) : (
                    <>
                        <Button onClick={handleRetake} variant="outline">Retake Photo</Button>
                        <Button onClick={handleAnalyze} disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                            ) : (
                                <><Wand2 className="mr-2 h-4 w-4" /> Analyze Injury</>
                            )}
                        </Button>
                    </>
                )}
            </div>
        </CardContent>
      </Card>
      
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <h3 className="font-semibold">Potential Injury</h3>
                <p>{analysisResult.potentialInjury}</p>
             </div>
             <div>
                <h3 className="font-semibold">Observations</h3>
                <p className="whitespace-pre-wrap">{analysisResult.observations}</p>
             </div>
             <div>
                <h3 className="font-semibold">Disclaimer</h3>
                <p className="text-sm text-muted-foreground">{analysisResult.disclaimer}</p>
             </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
