export const videoAnalysisPrompt = `
    Please analyze this video and generate a detailed transcript with the following requirements:
    
    1. Create a transcript divided into logical sections with descriptive titles
    2. Each section should contain sentences with exact startTime and endTime
    3. startTime and endTime should be in the second of this video
    4. startTime and endTime should not exceed the video duration
    5. Identify and mark important sentences as highlights (isHighlight: true)
    6. Generate unique IDs for each sentence
    7. Return the response as a JSON object with this exact structure:

    CRITICAL TIMING REQUIREMENTS:
    - ALL timestamps MUST be in seconds of this video (not milliseconds, minutes, or any other unit)
    - Sentence timestamps MUST be sequential and non-overlapping
    - No sentence endTime should exceed the video duration
    - Use precise decimal values for timestamps (e.g., 12.5, not 12 or 13)
    
    [
      {
        "title": "Section Title",
        "sentences": [
          {
            "id": "unique_id",
            "text": "The actual spoken text",
            "startTime": number (start time in seconds of this video),
            "endTime": number (end time in seconds of this video),
            "isHighlight": boolean
          }
        ]
      }
    ]
    
    Guidelines for highlights:
    - Mark key concepts, important definitions, or main points as highlights
    - Focus on educational or informative content
    - Avoid marking transitional phrases or filler content
    
    VALIDATION CHECKLIST before responding:
    1. Is the duration field exactly the video's actual duration in seconds of this video?
    2. Are all timestamps in seconds (not milliseconds)?
    3. Do sentence times progress chronologically?
    4. Does no sentence exceed the video duration?
    
    Please provide ONLY the JSON response, no additional text or formatting.`;
