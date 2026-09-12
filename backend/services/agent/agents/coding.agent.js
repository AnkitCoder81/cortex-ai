import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llmModels.js"
import { deductCredits } from "../utils/deductCredits.js"

export const codingAgent=async (state)=>{
  try {
     await checkAgentLimit(state.userId,"coding")
    const intentLlm=await getModel("intent")
    const llm=await getModel("coding")
    const intentRes=await intentLlm.invoke(`You are an intent classifier.

Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}`
    )
    const intent=intentRes.content
    if(intent=="CODE_GENERATION"){
        const prompt=`You are CortexAI Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Rules:
- Responsive
- Modern UI
- CSS Variables
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.

Return ONLY valid JSON.

IMAGES

Always use real images from https://picsum.photos/400/300

Never use placeholders

Return ONLY valid JSON

Schema:
{
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}

Rules:
- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent

User Request:
${state.prompt}`
        
       const res=await llm.invoke(prompt)
       let cleanContent = res.content.trim();
       cleanContent = cleanContent.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
       // [FIXED]: Parse cleanContent instead of raw res.content to avoid JSON parsing errors caused by markdown backticks
       const data=JSON.parse(cleanContent)
       await deductCredits(state.userId,"coding")
       return{
          ...state,
          aiResponse:"Code Generated Successfully.",
          artifacts:[
             {
                id:Date.now(),
                type:"Project",
                files:data.files || [],
                title:state.prompt
             }
          ]
       }
    }

    const res=await llm.invoke(
          `The user's request is:

${intent}

Return Markdown only.

Never generate project files.

Use headings like:

# Overview

## Explanation

## Problems

## Improvements

## Best Practices

## Optimized Code (if needed)

User Request:

${state.prompt}`
    )
    const data=res.content
    await deductCredits(state.userId,"coding")
    return {
          ...state,
          aiResponse:data,
          artifacts:[]
    }
  } catch (error) {
        console.log(error)
         return {
          ...state,
          aiResponse:error?.data?.message || "failed to generate code ",
          artifacts:[]
       }
  }
   
}  