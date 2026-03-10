import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  ai: router({
    chat: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        const systemPrompt = `You are the Homestead Hub AI Assistant — a knowledgeable, friendly, and practical guide for self-reliant living and homesteading. You help people with:

- Butchering and meat processing (livestock and wild game)
- Foraging wild edibles and medicinal plants
- Building structures, fences, barns, and off-grid shelters
- Food preservation: canning, smoking, fermenting, dehydrating, root cellaring
- Gardening: planting calendars, companion planting, soil health, seed saving
- Hunting and gaming: seasons, licensing, field dressing, ethical harvest
- Animal husbandry: chickens, goats, pigs, cattle — care, breeding, health
- Water systems: rainwater collection, well drilling, filtration, gray water
- Solar energy: small-scale solar setup, battery banks, off-grid power
- Land access: land trusts, conservation programs, agricultural land
- Barter and trade in resilient local economies
- Community building and connecting with other homesteaders

You give practical, no-nonsense advice grounded in real homesteading experience. You are encouraging, clear, and never condescending. When safety is important (like foraging or butchering), you always mention it. Keep answers focused and actionable. If someone is a beginner, start simple and build up. You speak like a trusted neighbor who has been homesteading for 20 years.`;

        const result = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...input.messages,
          ],
        });

        const content = result.choices[0]?.message?.content;
        const text = typeof content === "string" ? content : Array.isArray(content) ? content.map((c) => ("text" in c ? c.text : "")).join("") : "";

        return { reply: text };
      }),
  }),
});

export type AppRouter = typeof appRouter;
