# Qwable-9B-Claude-Fable-5: Integration Guide for A1 Homestead Hub
**Prepared by Manus AI | June 18, 2026**

---

## What This Model Actually Is

`empero-ai/Qwable-9B-Claude-Fable-5` is a **full-parameter fine-tune of Qwen3.5-9B**, trained on approximately 4,700 examples of Claude Fable 5 and GPT-5.5 agentic reasoning traces. In plain English: it is a **9-billion parameter model that reasons and codes like Claude Fable 5**, but runs locally on your own hardware — no API key, no per-token cost, no cloud dependency.

This is a **reasoning model**: every response begins with a `<think>...</think>` block where the model works through the problem before delivering its answer. For educational and agentic use cases, this is a significant advantage — the model shows its work.

---

## Why This Matters for A1 Homestead Hub

| Capability | A1 Hub Use Case |
| :--- | :--- |
| **Agentic coding & multi-step reasoning** | Power the AI Course Creator backend — generate full curriculum outlines, lesson plans, and quiz sequences autonomously |
| **Multi-modal (image + text input)** | Accept a photo of a student's garden and generate a personalized lesson or feedback response |
| **Long context (76,800 tokens)** | Process an entire homesteading manual or curriculum document in a single pass |
| **Apache 2.0 license** | Fully legal to deploy commercially on A1 Homestead Hub |
| **Local / self-hosted** | Zero API cost — run it on your own server or a rented GPU instance |

---

## How to Run It: Three Options

### Option 1: Docker Model Runner (Easiest — What You Shared)

This is the command you provided. It requires **Docker Desktop 4.40+** with the Docker Model Runner feature enabled:

```bash
docker model run hf.co/empero-ai/Qwable-9B-Claude-Fable-5
```

Once running, it exposes an **OpenAI-compatible API endpoint** at `http://localhost:12434/engines/v1`, meaning any code already written for OpenAI's API will work with this model with zero changes — just swap the base URL.

**Hardware requirement:** A modern GPU with at least 16GB VRAM (e.g., RTX 3090, RTX 4080) for smooth inference. CPU-only mode works but is slow.

### Option 2: vLLM Server (Best for Production)

```bash
pip install vllm
vllm serve "empero-ai/Qwable-9B-Claude-Fable-5"
```

This starts an OpenAI-compatible server on port 8000. Ideal for a persistent VM or cloud instance that the A1 Hub API calls.

### Option 3: HuggingFace Transformers (Python Integration)

```python
import torch
from transformers import AutoModelForImageTextToText, AutoTokenizer

model_id = "empero-ai/Qwable-9B-Claude-Fable-5"
tok = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForImageTextToText.from_pretrained(
    model_id, dtype="bfloat16", device_map="auto"
)

messages = [{"role": "user", "content": "Create a lesson plan for a 3rd grader learning about seed germination."}]
text = tok.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
inputs = tok(text, return_tensors="pt").to(model.device)

out = model.generate(
    **inputs, max_new_tokens=2048, do_sample=True,
    temperature=0.7, top_p=0.95, top_k=20, repetition_penalty=1.05,
)
print(tok.decode(out[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True))
```

---

## Integration Architecture for A1 Hub

```
User Request (Schoolhouse / Course Creator)
        ↓
A1 Hub Backend (Node.js / Python API)
        ↓
Qwable-9B Local Server (vLLM or Docker Model Runner)
        ↓
<think> block (internal reasoning — strip before displaying)
        ↓
Final Response → Lesson Plan / Quiz / Curriculum
        ↓
Miss Hazel TTS (F5-TTS or ElevenLabs) → Audio narration
        ↓
Stability AI / MIDJOURNEY Space → Course cover image
```

---

## Important Notes

1. **Strip the `<think>` block** before displaying output to students. The model reasons aloud before answering — this is useful for debugging but should not be shown to end users.
2. **The vision tower was frozen during fine-tuning.** Image understanding is inherited from the base Qwen3.5-9B model and was not specifically trained. Use it for image input with that caveat in mind.
3. **This is an early release.** Full benchmarks are still being published by Empero. It is strong on coding and agentic tasks; treat creative or open-ended outputs with normal editorial review.

---

## Recommended Next Step

The most practical path for the 30-day sprint is to **run this model via vLLM on a rented GPU instance** (e.g., RunPod, Vast.ai, or Lambda Labs — typically $0.30–$0.80/hour for an RTX 4090). This gives you a persistent, OpenAI-compatible endpoint that the A1 Hub can call for course generation without any per-token API cost. Once the sprint is complete and the GitHub Actions workflows are in place, the server can be paused and resumed on demand.
