import fs,{stat} from "fs"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import  {PDFParse}  from "pdf-parse";
import { vectorStore } from "../config/vectorDb.js";
import { getModel } from "../config/llmModels.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { deductCredits } from "../utils/deductCredits.js";
import { checkAgentLimit } from "../config/agentLimit.js";
export const pdfRag=async (state)=>{
    try {
        await checkAgentLimit(state.userId,"pdf")
        const buffer=fs.readFileSync(state.file.path)
        const pdf=new PDFParse({
          data:buffer
        })

        const result = await pdf.getText()
        const text = result.text;

        const splitter=new RecursiveCharacterTextSplitter({
           chunkSize:1000,
           chunkOverlap:200
        })
        const docs=await splitter.createDocuments([text])
        const collectionName=`pdf-${Date.now()}`;

        const store=await vectorStore(docs,collectionName)

        const revelantDocs=await store.similaritySearch(state.prompt,5)

        const context=revelantDocs.map(d=>d.pageContent).join("\n\n");
        const llm=await getModel("pdf-rag")
        const messages=[
          new SystemMessage(`You are CortexAI PDF Assistant.

                              Rules:

                              - Answer ONLY from the uploaded PDF.
                              - Never make up information.
                              - If the answer is not present in the PDF, reply:
                              "I couldn't find this information in the uploaded PDF."
                              - Use Markdown formatting.
                              `),
            new HumanMessage(`
                  Context:
                  ${context}
                  
                  Question:
                  ${state.prompt}
          `)
          ]
        const response=await llm.invoke(messages)
        await deductCredits(state.userId,"pdf")
        return {
          ...state,
          aiResponse:response.content
        }

    } catch (error) {
          console.log(error)
         return {
          ...state,
          aiResponse:error?.data?.message || "failed to analyze pdf "
       }
    }finally{
          fs.unlinkSync(state.file.path)
    }
}



// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// import fs from "fs";
// import { vectorStore } from "../config/vectorDb.js";
// import { getModel } from "../config/llmModels.js";
// import { HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { deductCredits } from "../utils/deductCredits.js";

// export const pdfRag = async (state) => {
//     try {
//         const buffer = fs.readFileSync(state.file.path);
        
//         // FINAL FIX: Dynamic import bypasses Node 22 top-level strictness completely
//         const pdfParsePkg = await import("pdf-parse");
//         const pdfParse = pdfParsePkg.default || pdfParsePkg;
        
//         const res = await pdfParse(buffer);
//         const text = res.text;

//         const splitter = new RecursiveCharacterTextSplitter({
//            chunkSize: 1000,
//            chunkOverlap: 200
//         });
//         const docs = await splitter.createDocuments([text]);
//         const collectionName = `pdf-${Date.now()}`;

//         const store = await vectorStore(docs, collectionName);

//         const revelantDocs = await store.similaritySearch(state.prompt, 5);

//         const context = revelantDocs.map(d => d.pageContent).join("\n\n");
//         const llm = await getModel("pdf-rag");
        
//         const messages = [
//           new SystemMessage(`You are CortexAI PDF Assistant.

//                               Rules:

//                               - Answer ONLY from the uploaded PDF.
//                               - Never make up information.
//                               - If the answer is not present in the PDF, reply:
//                               "I couldn't find this information in the uploaded PDF."
//                               - Use Markdown formatting.
//                               `),
//             new HumanMessage(`
//                   Context:
//                   ${context}
                  
//                   Question:
//                   ${state.prompt}
//           `)
//         ];
        
//         const response = await llm.invoke(messages);
//         await deductCredits(state.userId, "pdf");
        
//         return {
//           ...state,
//           aiResponse: response.content
//         };

//     } catch (error) {
//           console.log("PDF Error Details:", error);
//           return {
//           ...state,
//           aiResponse: "Failed to Analyze pdf"
//         };  
//     } finally {
//           fs.unlinkSync(state.file.path);
//     }
// }