import type { VideoData, TranscriptSection } from "@/types/video"

export async function mockAIProcess(): Promise<VideoData> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock transcript data based on video content
  const mockSections: TranscriptSection[] = [
    {
      title: "Introduction",
      sentences: [
        {
          id: "s1",
          text: "Welcome to our comprehensive guide on modern web development.",
          startTime: 0,
          endTime: 4,
          isHighlight: true,
        },
        {
          id: "s2",
          text: "In this video, we'll explore the latest trends and technologies that are shaping the industry.",
          startTime: 4,
          endTime: 9,
          isHighlight: false,
        },
        {
          id: "s3",
          text: "From React and Next.js to AI integration, we'll cover everything you need to know.",
          startTime: 9,
          endTime: 15,
          isHighlight: true,
        },
      ],
    },
    {
      title: "Core Technologies",
      sentences: [
        {
          id: "s4",
          text: "Let's start with React, the foundation of modern frontend development.",
          startTime: 15,
          endTime: 20,
          isHighlight: false,
        },
        {
          id: "s5",
          text: "React's component-based architecture makes it incredibly powerful for building user interfaces.",
          startTime: 20,
          endTime: 26,
          isHighlight: true,
        },
        {
          id: "s6",
          text: "Next.js takes React to the next level with server-side rendering and static site generation.",
          startTime: 26,
          endTime: 32,
          isHighlight: true,
        },
        {
          id: "s7",
          text: "These features provide better performance and SEO optimization out of the box.",
          startTime: 32,
          endTime: 37,
          isHighlight: false,
        },
      ],
    },
    {
      title: "AI Integration",
      sentences: [
        {
          id: "s8",
          text: "Artificial Intelligence is revolutionizing how we build applications.",
          startTime: 37,
          endTime: 42,
          isHighlight: true,
        },
        {
          id: "s9",
          text: "With tools like the Vercel AI SDK, integrating AI features has never been easier.",
          startTime: 42,
          endTime: 48,
          isHighlight: true,
        },
        {
          id: "s10",
          text: "You can add chatbots, content generation, and intelligent features with just a few lines of code.",
          startTime: 48,
          endTime: 55,
          isHighlight: false,
        },
      ],
    },
    {
      title: "Best Practices",
      sentences: [
        {
          id: "s11",
          text: "When building modern applications, performance should always be a top priority.",
          startTime: 55,
          endTime: 61,
          isHighlight: true,
        },
        {
          id: "s12",
          text: "Use code splitting, lazy loading, and optimize your images for the best user experience.",
          startTime: 61,
          endTime: 67,
          isHighlight: false,
        },
        {
          id: "s13",
          text: "Don't forget about accessibility - make your applications usable for everyone.",
          startTime: 67,
          endTime: 73,
          isHighlight: true,
        },
      ],
    },
    {
      title: "Conclusion",
      sentences: [
        {
          id: "s14",
          text: "The web development landscape is constantly evolving.",
          startTime: 73,
          endTime: 77,
          isHighlight: false,
        },
        {
          id: "s15",
          text: "By staying up to date with these technologies, you'll be well-equipped for the future.",
          startTime: 77,
          endTime: 83,
          isHighlight: true,
        },
        {
          id: "s16",
          text: "Thank you for watching, and happy coding!",
          startTime: 83,
          endTime: 87,
          isHighlight: true,
        },
      ],
    },
  ]

  return {
    fullTranscript: mockSections.flatMap((section) => section.sentences.map((s) => s.text)).join(" "),
    sections: mockSections,
    duration: 87,
    suggestedHighlights: mockSections.flatMap((section) =>
      section.sentences.filter((s) => s.isHighlight).map((s) => s.id),
    ),
  }
}
