'use client';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {getQuote, type GetQuoteOutput} from '@/ai/flows/quote-flow';
import {Loader} from 'lucide-react';
import {useToast} from '@/hooks/use-toast';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [quote, setQuote] = useState<GetQuoteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  async function handleGetQuote() {
    setIsLoading(true);
    const result = await getQuote(topic);
    if (!result) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Could not retrieve quote. Please check your Gemini API key.',
      });
      setQuote(null);
      setIsLoading(false);
      return;
    }
    setQuote(result);
    setIsLoading(false);
  }

  return (
    <div className="container flex flex-col gap-4 p-4">
      <div className="text-2xl font-bold">QuoteVid</div>
      <div className="flex flex-col gap-2">
        <Label>Topic</Label>
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
        <Button onClick={handleGetQuote} disabled={isLoading}>
          {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Get Quote
        </Button>
      </div>

      {quote && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Quote</Label>
            <Textarea
              className="min-h-32"
              value={`${quote.quote} - ${quote.author}`}
              readOnly
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Video</Label>
            {quote.videoUrl ? (
              <video src={quote.videoUrl} controls />
            ) : (
              'No video available for this quote'
            )}
          </div>
        </div>
      )}
    </div>
  );
}
