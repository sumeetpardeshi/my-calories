import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import sharp from 'sharp';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const ResponseEvent = z.object({
    calorie_estimation : z.array(z.object({ item: z.string(), calories: z.number() })),
    total_calories: z.number(),
    suggested_meal: z.string(),
    modifications: z.object({ 
        lunch: z.object({snackType: z.string(), add: z.string(), remove: z.string()}),
        dinner: z.object({snackType: z.string(), add: z.string(), remove: z.string()})
    },
    ),
    tags: z.array(z.string()),
    potential_allergies: z.array(z.string())
  }); 

  export const config = {
    api: {
      bodyParser: {
        sizeLimit: '10mb'
      }
    }
  }
  
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { imageUrl } = req.body

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image URL is required' })
  }

  try {

       // Remove the data:image/jpeg;base64, part
       const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
       const imageBuffer = Buffer.from(base64Data, 'base64');
   
       // Resize and compress the image
       const resizedImageBuffer = await sharp(imageBuffer)
         .resize({ width: 500 }) // Adjust width as needed
         .jpeg({ quality: 20 }) // Adjust quality as needed
         .toBuffer();
   
       const resizedImageBase64 = resizedImageBuffer.toString('base64');
       const resizedImageUrl = `data:image/jpeg;base64,${resizedImageBase64}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // This is the current model for vision tasks
     // max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image of food. Provide a list of food items, their estimated calorie content, and any relevant tags (e.g., 'healthy', 'high-protein', etc.). Also, give a total calorie estimate and a brief health suggestion based on the meal." },
            { type: "image_url", image_url: { url: resizedImageUrl } },
          ],
        },
      ],
      response_format: zodResponseFormat(ResponseEvent, "response_extraction"),

    })

    const analysisText = response.choices[0].message.content
    console.log("response.choices[0].message", response.choices[0].message)
    console.log("analysisText", analysisText);
    // Parse the analysis text to extract structured data
    // const items = extractFoodItems(analysisText)
    // const totalCalories = calculateTotalCalories(items)
    // const suggestion = extractSuggestion(analysisText)

    return res.status(200).json(analysisText)
  } catch (error) {
    console.error('Error analyzing image:', error)
    return res.status(500).json({ message: 'Error analyzing image' })
  }
}

// ... rest of the functions (extractFoodItems, calculateTotalCalories, extractSuggestion) remain the same