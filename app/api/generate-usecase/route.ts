import Groq from "groq-sdk";
import { NextResponse } from "next/server";

import { buildUserPrompt, SYSTEM_PROMPT } from "@/api/prompt";
import { type GenerateUseCaseRequest } from "@/lib/types";
import { generateUseCaseRequestSchema, useCaseInsightSchema } from "@/lib/validation";

export const runtime = "nodejs";

const model = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  let body: GenerateUseCaseRequest;

  try {
    body = (await request.json()) as GenerateUseCaseRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsedRequest = generateUseCaseRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    const message = parsedRequest.error.issues[0]?.message ?? "Invalid input.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(parsedRequest.data.businessProblem) }
      ]
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No response received from AI model." }, { status: 502 });
    }

    let parsedContent: unknown;
    try {
      const cleanContent = content
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      parsedContent = JSON.parse(cleanContent);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 502 });
    }

    const validatedInsight = useCaseInsightSchema.safeParse(parsedContent);
    if (!validatedInsight.success) {
      return NextResponse.json({ error: "AI response did not match expected structure." }, { status: 502 });
    }

    return NextResponse.json({ data: validatedInsight.data }, { status: 200 });
  } catch (error) {
    console.error("/api/generate-usecase error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown server error";
    const lowered = errorMessage.toLowerCase();

    if (lowered.includes("429") || lowered.includes("quota") || lowered.includes("too many requests")) {
      return NextResponse.json(
        {
          error: "Groq API quota exceeded or rate-limited. Please wait and retry or check your plan limits."
        },
        { status: 429 }
      );
    }

    if (lowered.includes("401") || lowered.includes("403") || lowered.includes("api key") || lowered.includes("permission")) {
      return NextResponse.json(
        {
          error: "Groq API key is invalid or lacks permissions for this model."
        },
        { status: 401 }
      );
    }

    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Unable to generate AI opportunities at this time. Please try again." },
      { status: 500 }
    );
  }
}
