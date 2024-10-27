'use client'

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { useState } from 'react';

export default function CodeSerializer() {

  const [codeInput, setCodeInput] = useState('');
  const [serializedCode, setSerializedCode] = useState('');

  // Function to serialize code
  const serializeCode = () => {
    if (!codeInput) {
      alert('Please enter some code to serialize.');
      return;
    }
    try {
      // Serialize the code (e.g., using Base64 encoding)
      const serialized = JSON.stringify(codeInput);
      setSerializedCode(serialized);
    } catch (error) {
      console.error('Serialization error:', error);
      alert('An error occurred during serialization.');
    }
  };

  // Function to deserialize code
  const deserializeCode = () => {
    if (!serializedCode) {
      alert('No serialized code available. Please serialize code first.');
      return;
    }
    try {
      const code = JSON.parse(serializedCode);
      setCodeInput(code);
    } catch (error) {
      console.error('Deserialization error:', error);
      alert('An error occurred during deserialization.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert('Content copied to clipboard!');
      },
      (err) => {
        console.error('Could not copy text: ', err);
        alert('Failed to copy content.');
      }
    );
  };

  return (
    <div className='flex flex-col gap-8 py-12 min-h-dvh'>
      <div className='flex flex-col md:flex-row gap-8 md:items-center md:justify-between flex-shrink'>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold">
            Code Block Serialiser & Deserialiser
          </h1>
          <p className="text-muted-foreground">
            Serialize your code blocks into a more compact for usage within a JSON object
          </p>
        </div>
        <div className='flex gap-4'>
          <Button variant={'secondary'} size={'sm'} onClick={deserializeCode}>
            Deserialize Code
          </Button>
          <Button size={'sm'} onClick={serializeCode}>Serialize Code</Button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 h-full flex-grow'>
        <div className='flex flex-col gap-2 relative h-full'>
          <Button variant={'outline'} className='absolute top-8 right-2' size={'icon'} onClick={() => copyToClipboard(codeInput)}>
            <Copy />
          </Button>
          <Label>Enter your code</Label>
          <Textarea
            className='h-full flex-grow bg-muted'
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Enter your code here..."
            style={{ width: '100%' }}
            value={codeInput}
            rows={12}
            cols={80}
          />
        </div>
        <div className='flex flex-col gap-2 relative h-full'>
          <Button variant={'outline'} className='absolute top-8 right-2' size={'icon'} onClick={() => void copyToClipboard(serializedCode)}>
            <Copy />
          </Button>
          <Label>Serialized Code</Label>
          <Textarea
            className='text-foreground h-full flex-grow bg-muted'
            value={serializedCode}
            placeholder='Serialized code here.'
            onChange={(e) => setSerializedCode(e.target.value)}
            rows={12}
            cols={80}
          />
        </div>
      </div>
    </div>
  );
}