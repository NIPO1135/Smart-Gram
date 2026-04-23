const express = require('express');

const router = express.Router();

function normalizeAiJson(raw) {
  const text = String(raw || '').trim();
  const stripped = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '');
  const parsed = JSON.parse(stripped);
  return {
    diseaseName: typeof parsed?.diseaseName === 'string' ? parsed.diseaseName.trim() : '',
    symptoms: typeof parsed?.symptoms === 'string' ? parsed.symptoms.trim() : '',
    solution: typeof parsed?.solution === 'string' ? parsed.solution.trim() : '',
  };
}

router.post('/plant-diagnosis', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'AI service key missing' });
    }

    const imageData = typeof req.body?.imageData === 'string' ? req.body.imageData : '';
    const language = req.body?.language === 'bn' ? 'bn' : 'en';
    if (!imageData.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image payload' });
    }

    const [mimePrefix, dataPart] = imageData.split(',');
    const mimeMatch = mimePrefix.match(/^data:(.*?);base64$/);
    const mimeType = mimeMatch?.[1] || 'image/jpeg';
    if (!dataPart) {
      return res.status(400).json({ message: 'Invalid base64 image data' });
    }

    const prompt =
      language === 'bn'
        ? 'এই পাতার ছবিটি দেখে রোগ শনাক্ত করুন। গাছ সুস্থ হলে diseaseName এ "Healthy Plant" লিখুন। শুধু JSON দিন: {"diseaseName":"","symptoms":"","solution":""}'
        : 'Analyze this leaf image and identify disease. If healthy, set diseaseName to "Healthy Plant". Return JSON only: {"diseaseName":"","symptoms":"","solution":""}';

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
          contents: [
            {
              parts: [
                { inline_data: { mime_type: mimeType, data: dataPart } },
                { text: prompt },
              ],
            },
          ],
        }),
      },
    );

    const geminiData = await geminiRes.json();
    if (!geminiRes.ok) {
      console.error('Gemini API Error:', geminiData);
      return res.status(502).json({ message: 'AI upstream error' });
    }

    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      geminiData?.candidates?.[0]?.content?.parts?.find((p) => typeof p?.text === 'string')?.text ||
      '';

    if (!rawText) {
      return res.status(502).json({ message: 'Empty AI response' });
    }

    const parsed = normalizeAiJson(rawText);
    return res.status(200).json({
      result: {
        diseaseName: parsed.diseaseName || (language === 'bn' ? 'পর্যাপ্ত তথ্য পাওয়া যায়নি' : 'Not enough information'),
        symptoms: parsed.symptoms || (language === 'bn' ? 'লক্ষণ নির্ধারণ করা যায়নি।' : 'Symptoms could not be identified.'),
        solution: parsed.solution || (language === 'bn' ? 'স্থানীয় কৃষি কর্মকর্তার পরামর্শ নিন।' : 'Please consult a local agriculture expert.'),
      },
    });
  } catch (error) {
    console.error('Plant Diagnosis Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/tutor-chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'AI service key missing' });
    }

    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    if (messages.length === 0) {
      return res.status(400).json({ message: 'No chat history provided' });
    }

    const systemPrompt = "তুমি হলে Smart Gram Youth-এর একজন অত্যন্ত সহায়ক AI Tutor. তোমার কাজ হলো ইউজারদের ডিজিটাল মার্কেটিং, ফ্রিল্যান্সিং, এবং অন্যান্য স্কিল শিখতে সাহায্য করা। তুমি সহজ ও সাবলীল বাংলায় কথা বলবে। তোমার উত্তরগুলো হবে টু-দ্য-পয়েন্ট, স্টেপ-বাই-স্টেপ, এবং খুব বন্ধুসুলভ। খুব বেশি লম্বা উত্তর দেবে না, যাতে ইউজারের বুঝতে সুবিধা হয়।";

    // Format messages for Gemini
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Inject system instructions if supported or just prepend
    // Current Gemini 1.5 format allows system_instruction natively
    const payload = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: contents,
      generationConfig: { temperature: 0.7 }
    };

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const geminiData = await geminiRes.json();
    if (!geminiRes.ok) {
      console.error('Gemini API Error:', geminiData);
      return res.status(502).json({ message: 'AI upstream error' });
    }

    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      geminiData?.candidates?.[0]?.content?.parts?.find((p) => typeof p?.text === 'string')?.text ||
      'দুঃখিত, আমি ঠিক বুঝতে পারিনি। আপনি কি আরেকটু স্পষ্ট করে বলবেন?';

    return res.status(200).json({
      result: {
        text: rawText
      }
    });

  } catch (error) {
    console.error('Tutor Chat Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
