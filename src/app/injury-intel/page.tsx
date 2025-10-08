'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchState, searchInjuryInfo } from './actions';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Info } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching...
        </>
      ) : (
        'Search'
      )}
    </Button>
  );
}

function InjuryInfoResult({ data }: { data: SearchState['data'] }) {
    if (!data) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="whitespace-pre-wrap">{data.description}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-2">Common Causes</h3>
                    <p className="whitespace-pre-wrap">{data.commonCauses}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-2">General Treatment Advice</h3>
                    <p className="whitespace-pre-wrap">{data.generalTreatment}</p>
                </div>
                 <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Disclaimer</AlertTitle>
                    <AlertDescription>{data.disclaimer}</AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}


function InjuryIntelContent() {
  const searchParams = useSearchParams();
  const injuryQuery = searchParams.get('injury');
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: SearchState = {
    data: null,
    input: { injuryName: injuryQuery || '' },
  };

  const [state, formAction, isPending] = useActionState(searchInjuryInfo, initialState);

  useEffect(() => {
    // When a query param is present, submit the form automatically on initial load.
    if (injuryQuery && formRef.current) {
        // We only want this to run once on the initial load with a query param.
        // The check for `state.input.injuryName` ensures it doesn't re-submit.
        if (state.input.injuryName === injuryQuery && state.data === null && state.error === undefined && !isPending) {
            formRef.current.requestSubmit();
        }
    }
    // We only want this to run when the component mounts with a query param.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injuryQuery]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Injury Intel</CardTitle>
          <CardDescription>
            Use our AI-powered search to get information about sports injuries. This tool provides educational content, not medical advice.
          </CardDescription>
        </CardHeader>
      </Card>

      <form action={formAction} ref={formRef}>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="injury-name">Injury Name</Label>
              <Input
                id="injury-name"
                name="injuryName"
                placeholder="e.g., Plantar Fasciitis"
                defaultValue={state.input.injuryName}
              />
            </div>
            {state.error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      
      {isPending && (
        <Card>
            <CardContent className="pt-6 flex justify-center items-center">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <span className="text-lg">Loading AI insights...</span>
            </CardContent>
        </Card>
      )}

      {state.data && <InjuryInfoResult data={state.data} />}

    </div>
  );
}

export default function InjuryIntelPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InjuryIntelContent />
        </Suspense>
    )
}
