import { GoogleGenAI, Type, Chat } from "@google/genai";

const getAiClient = () => {
    // The API key is injected from the environment
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const createChatSession = (): Chat => {
    const ai = getAiClient();
    return ai.chats.create({
        model: "gemini-3-pro-preview",
        config: {
            systemInstruction: "You are a helpful AI assistant for InvoiceFlow, a billing application for Ugandan businesses. Your goal is to assist users with creating invoices, understanding business insights, and answering general questions about the app features. Currency is UGX (Ugandan Shillings). Keep responses concise and helpful.",
        }
    });
};

export const generateInvoiceDataFromText = async (text: string) => {
    const ai = getAiClient();
    
    const prompt = `
      Extract invoice details from the following text description.
      The context is typically Ugandan business.
      Return a JSON object with 'customer' (name, email, address) and 'items' (array of description, quantity, unitPrice).
      Also estimate the 'date' if mentioned, otherwise use today's date (YYYY-MM-DD).
      If currency is not specified, assume amounts are in UGX (Ugandan Shillings).
      
      Text: "${text}"
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                customer: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        email: { type: Type.STRING },
                        address: { type: Type.STRING }
                    },
                    required: ["name"]
                },
                items: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING },
                            quantity: { type: Type.NUMBER },
                            unitPrice: { type: Type.NUMBER }
                        },
                        required: ["description", "quantity", "unitPrice"]
                    }
                },
                date: { type: Type.STRING }
            }
          }
        }
      });
      
      return response.text ? JSON.parse(response.text) : null;
    } catch (error) {
      console.error("Gemini Parse Error:", error);
      throw new Error("Failed to parse invoice data from text.");
    }
  };
  
  export const getBusinessInsights = async (invoices: any[]) => {
    const ai = getAiClient();
    const dataStr = JSON.stringify(invoices.map(inv => ({
        amount: inv.total,
        status: inv.status,
        date: inv.date,
        customer: inv.customer.name
    })));

    const prompt = `
        Analyze the following invoice data for a Ugandan business and provide a brief executive summary.
        Amounts are in UGX.
        Include 3 key insights about revenue trends, payment status, or customer concentration.
        Keep it professional and concise.
        
        Data: ${dataStr}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini Insight Error:", error);
        return "Unable to generate insights at this time.";
    }
};