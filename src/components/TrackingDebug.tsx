'use client';

import { useState, useEffect } from 'react';
import { useTracking } from '@/lib/tracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, RefreshCw, Download } from 'lucide-react';

interface TrackingDebugProps {
  className?: string;
}

export default function TrackingDebug({ className }: TrackingDebugProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { getDebugInfo } = useTracking();

  const refreshDebugInfo = () => {
    const info = getDebugInfo();
    setDebugInfo(info);
  };

  useEffect(() => {
    if (isVisible) {
      refreshDebugInfo();
    }
  }, [isVisible]);

  // Só mostra em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Button
        onClick={() => setIsVisible(!isVisible)}
        variant="outline"
        size="sm"
        className="mb-2"
      >
        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        Tracking Debug
      </Button>

      {isVisible && (
        <Card className="w-96 max-h-96 overflow-y-auto">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Tracking Debug</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={refreshDebugInfo}
                  variant="ghost"
                  size="sm"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button
                  onClick={() => {
                    const data = JSON.stringify(debugInfo, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'tracking-debug.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <CardDescription className="text-xs">
              Informações de debug do tracking
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {debugInfo ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Status:</span>
                    <Badge variant={debugInfo.isInitialized ? 'default' : 'destructive'}>
                      {debugInfo.isInitialized ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">GTM ID:</span>
                      <span className="text-xs text-muted-foreground">{debugInfo.gtmId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">GA4 ID:</span>
                      <span className="text-xs text-muted-foreground">{debugInfo.ga4Id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Meta Pixel:</span>
                      <span className="text-xs text-muted-foreground">{debugInfo.metaPixelId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Google Ads:</span>
                      <span className="text-xs text-muted-foreground">{debugInfo.googleAdsId}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1">
                    <span className="text-xs font-medium">DataLayer Events:</span>
                    <div className="max-h-32 overflow-y-auto">
                      {debugInfo.dataLayer && debugInfo.dataLayer.length > 0 ? (
                        debugInfo.dataLayer.map((event: any, index: number) => (
                          <div key={index} className="text-xs text-muted-foreground p-1 bg-muted rounded">
                            {JSON.stringify(event, null, 2)}
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Nenhum evento</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-xs text-muted-foreground">
                Clique em refresh para carregar informações
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
