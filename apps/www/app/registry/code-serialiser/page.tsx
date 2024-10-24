'use client'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

  return (
    <div className='flex flex-col gap-8 py-12 min-h-dvh'>
      <div className='flex flex-row gap-8 items-center justify-between'>
        <h1 className='text-xl font-bold'>Serialize and deserialize file</h1>
        <div className='flex gap-4'>
          <Button variant={'secondary'} size={'sm'} onClick={deserializeCode}>
            Deserialize Code
          </Button>
          <Button size={'sm'} onClick={serializeCode}>Serialize Code</Button>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col gap-2'>
          <Label>Enter your code</Label>
          <Textarea
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Enter your code here..."
            style={{ width: '100%' }}
            value={codeInput}
            rows={12}
            cols={80}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label>Serialized Code</Label>
          <Textarea
            value={serializedCode}
            className='text-foreground'
            readOnly
            rows={12}
            cols={80}
          />
        </div>
      </div>
    </div>
  );
}