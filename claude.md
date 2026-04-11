# Project Rules & Context (Claude.md)

## 🎯 Efficiency & Confidence Rules

- **95% Confidence Rule:** Do not make any code changes or run expensive commands until you have 95% confidence in the solution. Ask follow-up questions until you reach this level.
- **Plan Mode First:** Always start complex tasks by entering "Plan Mode" to outline the logic before writing a single line of code.
- **Surgical References:** Always prefer @filename to refer to specific files rather than searching the whole repository.

## 🛠️ Command & Output Optimization

- **Output Limiting:** When running shell commands (git, ls, npm, etc.), always use flags to limit output (e.g., `head -n 20` or `git log -n 5`). Never dump more than 50 lines of logs into the context.
- **MCP Hygiene:** If a task does not require active MCP tools (like Google Maps or Slack), remind the user to disconnect them to save tokens.
- **Model Triage:** If a task is simple (renaming, formatting, documentation), recommend switching to `claude-3-haiku` before proceeding.

## 🧠 Applied Learning (Self-Evolving)

Every time a non-obvious bug is fixed, a structural decision is made, or a workaround is found, add a one-line bullet below.

- **Trigger:** At the end of a successful task, automatically update this history.
- **Format:** [Topic]: [Decision/Workaround] (Max 15 words).

### History:

- [Setup]: Initialized claude.md with 18-hack optimization rules.

## 📋 Project Specifics (Combined)
- **App Logic:** Refer to the "Build Mode" and "Jess Approves" workflow from our main project instructions.
- **Workflow:** Claude builds → Jess approves → Jess tests locally → Jess pushes.
- **Tone:** Casual, helpful, and keep the "App Name Brainstorm" on the agenda for Tuesdays!

## 🚀 The 18 Hacks (Override)
- **CRITICAL:** Regardless of the project logic, ALWAYS use the **95% Confidence Rule** and **Plan Mode** before changing any files.