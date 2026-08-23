const fs = require('fs');
const readline = require('readline');

const inputPath = "c:\\Users\\Prasanna\\AppData\\Roaming\\Code\\User\\workspaceStorage\\98dd3786615e7f17082c78ee0392a2a8\\GitHub.copilot-chat\\transcripts\\0ffe8474-007e-4688-9554-91034093c99a.jsonl";
const outputPath = "c:\\Users\\Prasanna\\OneDrive\\Desktop\\career-ai\\career-ai\\transcript_messages_extracted.json";

if (!fs.existsSync(inputPath)) {
  console.error('Input transcript not found:', inputPath);
  process.exit(1);
}

const rl = readline.createInterface({ input: fs.createReadStream(inputPath), crlfDelay: Infinity });
const messages = [];
let lineNo = 0;

rl.on('line', (line) => {
  lineNo++;
  line = line.trim();
  if (!line) return;
  try {
    const obj = JSON.parse(line);
    const ts = obj.timestamp || obj.data?.timestamp || null;
    const id = obj.id || obj.data?.messageId || null;
    let role = obj.type || (obj.data && obj.data.role) || null;
    let content = null;

    // assistant.message and user.message use data.content
    if (obj.data && typeof obj.data.content === 'string') {
      content = obj.data.content;
    } else if (obj.data && obj.data.message && typeof obj.data.message.content === 'string') {
      content = obj.data.message.content;
    } else if (obj.content && typeof obj.content === 'string') {
      content = obj.content;
    } else if (typeof obj === 'string') {
      content = obj;
    }

    if (role && content) {
      messages.push({ line: lineNo, id, timestamp: ts, role, content });
    } else if (obj.type && (obj.type.includes('assistant') || obj.type.includes('user')) && content) {
      messages.push({ line: lineNo, id, timestamp: ts, role: obj.type, content });
    }
  } catch (e) {
    // ignore parse errors but log occasionally
    if (lineNo % 500 === 0) console.warn('parse error at line', lineNo);
  }
});

rl.on('close', () => {
  try {
    fs.writeFileSync(outputPath, JSON.stringify({ extracted_at: new Date().toISOString(), count: messages.length, messages }, null, 2), 'utf8');
    console.log('Extracted', messages.length, 'messages to', outputPath);
  } catch (e) {
    console.error('Failed to write output:', e);
    process.exit(1);
  }
});
