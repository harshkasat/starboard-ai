import OpenAI from 'openai';
import { SECTION_EXTRACTORS } from './aiProcessor';

const openai = new OpenAI({
    apiKey: 'OPENAI_API_KEY',
    dangerouslyAllowBrowser:true
});

let assistantId: string | null = null;

export async function getOrCreateAssistant() {
  if (assistantId) {
    return assistantId;
  }

  const assistant = await openai.beta.assistants.create({
    name: "Real Estate Data Extractor",
    instructions: `You are a real estate data extraction expert. Your task is to analyze PDF documents and extract structured data according to specific sections:
    ${Object.entries(SECTION_EXTRACTORS)
      .map(([key, value]) => `\n\n${key}:\n${value.prompt}`)
      .join('\n')}`,
    model: "gpt-4-1106-preview"
  });

  assistantId = assistant.id;
  return assistantId;
}

export async function processFileWithAssistant(fileBuffer: ArrayBuffer, section: keyof typeof SECTION_EXTRACTORS) {
  try {
    // Convert ArrayBuffer to File object
    const file = new File([fileBuffer], 'document.pdf', { type: 'application/pdf' });

    // 1. Upload the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'assistants');

    // Use fetch to upload the file directly to OpenAI
    const uploadResponse = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer OPNEAI_API_KEY`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${await uploadResponse.text()}`);
    }

    const uploadData = await uploadResponse.json();
    const fileId = uploadData.id;

    // 2. Get or create assistant
    const assistantId = await getOrCreateAssistant();

    // 3. Create a thread
    const thread = await openai.beta.threads.create();

    // 4. Add message with the file to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Please analyze the PDF and extract ${section} information according to this schema: ${JSON.stringify(SECTION_EXTRACTORS[section].dataSchema)}`,
      file_ids: [fileId]
    } as OpenAI.Beta.Threads.Messages.MessageCreateParams);

    // 5. Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId
    });

    // 6. Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      if (runStatus.status === 'failed') {
        throw new Error(`Assistant run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // 7. Get the response
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    const messageContent = lastMessage.content[0];
    
    if ('text' in messageContent) {
      // 8. Clean up
      await fetch(`https://api.openai.com/v1/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });

      return {
        text: messageContent.text.value,
        confidence: 0.95,
        metadata: {
          fileId: fileId,
          threadId: thread.id,
          runId: run.id,
          model: 'gpt-4-1106-preview'
        }
      };
    } else {
      throw new Error('Unexpected response format from assistant');
    }
  } catch (error) {
    console.error('Error processing file with assistant:', error);
    throw error;
  }
}