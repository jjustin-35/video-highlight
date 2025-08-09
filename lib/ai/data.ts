export const videoAnalysisPrompt = `
    Please analyze this video and generate a detailed transcript with the following requirements:
    
    1. Create a transcript divided into logical sections with descriptive titles
    2. Each section should contain sentences with exact start/end timestamps in seconds
    3. Identify and mark important sentences as highlights (isHighlight: true)
    4. Generate unique IDs for each sentence
    5. Return the response as a JSON object with this exact structure:
    
    {
      "sections": [
        {
          "title": "Section Title",
          "sentences": [
            {
              "id": "unique_id",
              "text": "The actual spoken text",
              "startTime": 0,
              "endTime": 5,
              "isHighlight": false
            }
          ]
        }
      ],
      "duration": total_video_duration_in_seconds
    }
    
    Guidelines for highlights:
    - Mark key concepts, important definitions, or main points as highlights
    - Typically 20-30% of sentences should be highlights
    - Focus on educational or informative content
    - Avoid marking transitional phrases or filler content
    
    Please provide ONLY the JSON response, no additional text or formatting.`;
