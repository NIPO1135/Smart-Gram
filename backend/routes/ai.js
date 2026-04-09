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

module.exports = router;
