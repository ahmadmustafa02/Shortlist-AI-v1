// AI analysis: scores resume vs JD via Google Gemini generateContent (JSON mode).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TIME_BUDGET_VALUES = [
  "lt_1_week",
  "1_2_weeks",
  "lt_1_month",
  "1_3_months",
  "3_6_months",
  "6_plus_months",
] as const;

type TimeBudget = (typeof TIME_BUDGET_VALUES)[number];

const TIME_BUDGET_LABEL: Record<TimeBudget, string> = {
  lt_1_week: "less than 1 week",
  "1_2_weeks": "1 to 2 weeks",
  lt_1_month: "less than 1 month",
  "1_3_months": "1 to 3 months",
  "3_6_months": "3 to 6 months",
  "6_plus_months": "6+ months",
};

const reportTool = {
  type: "function",
  function: {
    name: "submit_application_report",
    description:
      "Submit the full structured analysis comparing the candidate's resume to the target job description.",
    parameters: {
      type: "object",
      properties: {
        fit_score: {
          type: "integer",
          minimum: 0,
          maximum: 100,
          description: "Overall fit score 0-100 of how well the resume matches the JD.",
        },
        fit_summary: {
          type: "string",
          description: "1-2 sentence headline summary of the fit.",
        },
        ats_before: {
          type: "integer",
          minimum: 0,
          maximum: 100,
          description:
            "ATS keyword/format score for the current resume against this JD (0-100).",
        },
        ats_after: {
          type: "integer",
          minimum: 0,
          maximum: 100,
          description:
            "Projected ATS score after applying the tailoring tips and bullet rewrites (0-100).",
        },
        skill_gaps: {
          type: "object",
          properties: {
            missing_hard_skills: {
              type: "array",
              items: { type: "string" },
              description: "Hard skills required by the JD that are absent from the resume.",
            },
            missing_keywords: {
              type: "array",
              items: { type: "string" },
              description: "ATS keywords from the JD missing in the resume.",
            },
            missing_experience_signals: {
              type: "array",
              items: { type: "string" },
              description: "Experience patterns the JD asks for that the resume doesn't show.",
            },
          },
          required: [
            "missing_hard_skills",
            "missing_keywords",
            "missing_experience_signals",
          ],
          additionalProperties: false,
        },
        tailoring_tips: {
          type: "array",
          description: "Specific edits the candidate should make to the resume right now.",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              detail: { type: "string" },
              priority: { type: "string", enum: ["high", "medium", "low"] },
            },
            required: ["title", "detail", "priority"],
            additionalProperties: false,
          },
        },
        prep_roadmap: {
          type: "object",
          description:
            "Time-aware preparation plan, scaled to the candidate's available time budget.",
          properties: {
            overview: {
              type: "string",
              description: "1-2 sentence framing of the plan given the time budget.",
            },
            phases: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Phase name with timing, e.g. 'Week 1' or 'Days 1-3'.",
                  },
                  focus: { type: "string" },
                  actions: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["name", "focus", "actions"],
                additionalProperties: false,
              },
            },
          },
          required: ["overview", "phases"],
          additionalProperties: false,
        },
        bullet_rewrites: {
          type: "array",
          description:
            "Most impactful resume bullet rewrites. Pick 3-6 of the weakest/most relevant bullets.",
          items: {
            type: "object",
            properties: {
              before: { type: "string" },
              after: { type: "string" },
              why: { type: "string" },
            },
            required: ["before", "after", "why"],
            additionalProperties: false,
          },
        },
        interview_questions: {
          type: "object",
          properties: {
            technical: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  hint: {
                    type: "string",
                    description: "What the interviewer is really probing for.",
                  },
                },
                required: ["question", "hint"],
                additionalProperties: false,
              },
            },
            behavioral: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  hint: { type: "string" },
                },
                required: ["question", "hint"],
                additionalProperties: false,
              },
            },
          },
          required: ["technical", "behavioral"],
          additionalProperties: false,
        },
      },
      required: [
        "fit_score",
        "fit_summary",
        "ats_before",
        "ats_after",
        "skill_gaps",
        "tailoring_tips",
        "prep_roadmap",
        "bullet_rewrites",
        "interview_questions",
      ],
      additionalProperties: false,
    },
  },
};

function buildSystemPrompt(timeBudget: TimeBudget) {
  return `You are ShortlistAI, an expert technical recruiter and career coach.
Analyze how well a candidate's resume fits a specific job description, then produce a tailored, honest, and actionable report.

Rules:
- Be specific and concrete. No generic fluff. Quote phrasing from the JD when calling out missing keywords.
- Fit score: 90+ only if the candidate clearly meets nearly all "must-haves". 70-89 strong fit. 50-69 stretch. <50 significant gap.
- ATS score reflects keyword coverage, role-relevant phrasing, structure, and quantification. ats_after must be >= ats_before.
- The candidate has ${TIME_BUDGET_LABEL[timeBudget]} to prepare. The prep roadmap MUST fit that window — do not suggest 6 months of learning if they have 1 week. For very short windows, focus on positioning, mock interviews, and high-leverage review. For longer windows, include real projects and portfolio depth.
- Bullet rewrites: pick the candidate's actual weakest/most-relevant bullets (paraphrase if needed), then rewrite them in the format Action verb + impact + metric, aligned with the JD.
- Interview questions: 5-7 technical and 4-6 behavioral, each with a 1-line "what they're really asking" hint.
- Output a single JSON object only. It must satisfy the JSON Schema provided after this block. No markdown, no prose outside JSON.`;
}

function buildUserPrompt(args: {
  jobTitle: string;
  company?: string;
  jdText: string;
  resumeText: string;
}) {
  return `# Target role
Title: ${args.jobTitle}
${args.company ? `Company: ${args.company}\n` : ""}
# Job description
${args.jdText}

# Candidate resume
${args.resumeText}`;
}

function buildGeminiUserPrompt(timeBudget: TimeBudget, jobTitle: string, company: string, jdText: string, resumeText: string) {
  const schema = JSON.stringify(reportTool.function.parameters);
  return [
    buildSystemPrompt(timeBudget),
    "",
    "JSON Schema for your response (conform exactly; include every required property):",
    schema,
    "",
    buildUserPrompt({ jobTitle, company, jdText, resumeText }),
  ].join("\n");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth: require a logged-in user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnon = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Validate JWT in-code (verify_jwt is disabled at the platform layer because
    // the new signing-keys system uses ES256 which the gateway verifier rejects).
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const userClient = createClient(supabaseUrl, supabaseAnon);
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims?.sub) {
      console.error("getClaims failed", claimsErr);
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    // Validate body
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const jobTitle = String(body.jobTitle ?? "").trim();
    const company = body.company ? String(body.company).trim() : "";
    const jdText = String(body.jdText ?? "").trim();
    const resumeText = String(body.resumeText ?? "").trim();
    const timeBudget = String(body.timeBudget ?? "") as TimeBudget;

    const errors: Record<string, string> = {};
    if (jobTitle.length < 2 || jobTitle.length > 120) errors.jobTitle = "Invalid job title";
    if (company.length > 120) errors.company = "Company too long";
    if (jdText.length < 80 || jdText.length > 20000) errors.jdText = "JD must be 80–20,000 chars";
    if (resumeText.length < 200 || resumeText.length > 30000) {
      errors.resumeText = "Resume must be 200–30,000 chars";
    }
    if (!TIME_BUDGET_VALUES.includes(timeBudget)) errors.timeBudget = "Invalid time budget";
    if (Object.keys(errors).length) {
      return new Response(JSON.stringify({ error: "Validation failed", fields: errors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const yourPrompt = buildGeminiUserPrompt(timeBudget, jobTitle, company, jdText, resumeText);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: yourPrompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({
          error: "AI provider quota or billing issue. Check your API account and billing settings.",
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("Gemini API error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    if (data?.error) {
      console.error("Gemini error payload", data.error);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text || typeof text !== "string") {
      console.error("No Gemini text", JSON.stringify(data).slice(0, 1000));
      return new Response(JSON.stringify({ error: "AI did not return a structured report" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let report: Record<string, unknown>;
    try {
      report = JSON.parse(text);
    } catch (e) {
      console.error("Bad JSON from AI", e);
      return new Response(JSON.stringify({ error: "Invalid AI response format" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Persist with service role (RLS-safe: we set user_id explicitly)
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: inserted, error: insertErr } = await adminClient
      .from("analyses")
      .insert({
        user_id: userId,
        job_title: jobTitle,
        company: company || null,
        time_budget: timeBudget,
        resume_text: resumeText,
        jd_text: jdText,
        fit_score: report.fit_score ?? null,
        ats_before: report.ats_before ?? null,
        ats_after: report.ats_after ?? null,
        result_json: report,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("Insert error", insertErr);
      return new Response(JSON.stringify({ error: "Failed to save analysis" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ id: inserted.id, report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("analyze-application crash", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
