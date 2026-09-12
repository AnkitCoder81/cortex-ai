import { getModel } from "../config/llmModels.js"

export const router = async (state) => {

          if (state.agent && state.agent !== "auto") {
                    return {
                              ...state,  // --> means state ko as it is return kr do
                              agent: state.agent
                    }
          }
          
          if(state.file){
             if(state.file.mimetype==="application/pdf"){
              return{
                 ...state,
                 agent:"pdfRag"
              }
          }
          if(state.file.mimetype.startsWith("image/")){
              return{
                 ...state,
                 agent:"imageAnalyzer"
              }
          }
          }

          const llm = getModel("router")
          const prompt = `You are an agent router.

Available agents:
- chat
- search
- coding
- pdf
- ppt
- vision

Rules:
chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

vision:
Generate image,
create image.

Return ONLY one word:

chat
search
coding
pdf
vision

User Query:
${state.prompt}
`
          const response = await llm.invoke(prompt)

          return {
                    ...state,  // --> means state ko as it is return kr do
                    agent: response.content
                              .trim()
                              .toLowerCase()
          }
}

